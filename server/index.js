import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;
const app = express();
const PORT = 3001;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors());
app.use(express.json());

// ─── helpers ────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

// ─── Spaces ──────────────────────────────────────────────────────────────────

app.get("/api/forum/spaces", async (req, res) => {
  try {
    const { rows: spaces } = await pool.query(
      `SELECT s.*,
        (SELECT COUNT(*) FROM forum_members m WHERE m.space_id = s.id)::int AS member_count,
        (SELECT COUNT(*) FROM forum_posts p WHERE p.space_id = s.id)::int AS post_count,
        (SELECT json_agg(user_id) FROM forum_members m WHERE m.space_id = s.id) AS members
       FROM forum_spaces s
       ORDER BY s.created_at DESC`
    );
    res.json(spaces.map(s => ({ ...s, members: s.members || [] })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/forum/spaces", async (req, res) => {
  const { name, description, emoji, category, authorId, authorName } = req.body;
  if (!name?.trim() || !authorId) return res.status(400).json({ error: "Missing fields" });
  const id = uid();
  try {
    await pool.query(
      `INSERT INTO forum_spaces (id, name, description, emoji, category, created_by_id, created_by_name)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [id, name.trim(), description?.trim() || "", emoji || "💬", category || "echange", authorId, authorName || ""]
    );
    await pool.query(`INSERT INTO forum_members (space_id, user_id) VALUES ($1,$2)`, [id, authorId]);
    const { rows } = await pool.query(`SELECT * FROM forum_spaces WHERE id=$1`, [id]);
    res.json({ ...rows[0], members: [authorId], member_count: 1, post_count: 0 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/forum/spaces/:id/join", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });
  try {
    const { rows } = await pool.query(
      `SELECT 1 FROM forum_members WHERE space_id=$1 AND user_id=$2`, [id, userId]
    );
    if (rows.length > 0) {
      await pool.query(`DELETE FROM forum_members WHERE space_id=$1 AND user_id=$2`, [id, userId]);
      res.json({ joined: false });
    } else {
      await pool.query(`INSERT INTO forum_members (space_id, user_id) VALUES ($1,$2)`, [id, userId]);
      res.json({ joined: true });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Posts ───────────────────────────────────────────────────────────────────

app.get("/api/forum/spaces/:spaceId/posts", async (req, res) => {
  const { spaceId } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT p.*,
        (SELECT COUNT(*) FROM forum_post_likes l WHERE l.post_id = p.id)::int AS like_count,
        (SELECT COUNT(*) FROM forum_comments c WHERE c.post_id = p.id)::int AS comment_count,
        (SELECT json_agg(user_id) FROM forum_post_likes l WHERE l.post_id = p.id) AS likes
       FROM forum_posts p
       WHERE p.space_id=$1
       ORDER BY p.created_at DESC`,
      [spaceId]
    );
    res.json(rows.map(r => ({ ...r, likes: r.likes || [] })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/forum/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT p.*,
        (SELECT COUNT(*) FROM forum_post_likes l WHERE l.post_id = p.id)::int AS like_count,
        (SELECT json_agg(user_id) FROM forum_post_likes l WHERE l.post_id = p.id) AS likes
       FROM forum_posts p WHERE p.id=$1`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json({ ...rows[0], likes: rows[0].likes || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/forum/posts", async (req, res) => {
  const { spaceId, title, body, authorId, authorName } = req.body;
  if (!spaceId || !title?.trim() || !authorId) return res.status(400).json({ error: "Missing fields" });
  const id = uid();
  try {
    await pool.query(
      `INSERT INTO forum_posts (id, space_id, title, body, author_id, author_name)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [id, spaceId, title.trim(), body?.trim() || "", authorId, authorName || "Anonyme"]
    );
    const { rows } = await pool.query(`SELECT * FROM forum_posts WHERE id=$1`, [id]);
    res.json({ ...rows[0], likes: [], like_count: 0, comment_count: 0 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/forum/posts/:id/like", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });
  try {
    const { rows } = await pool.query(
      `SELECT 1 FROM forum_post_likes WHERE post_id=$1 AND user_id=$2`, [id, userId]
    );
    if (rows.length > 0) {
      await pool.query(`DELETE FROM forum_post_likes WHERE post_id=$1 AND user_id=$2`, [id, userId]);
      res.json({ liked: false });
    } else {
      await pool.query(`INSERT INTO forum_post_likes (post_id, user_id) VALUES ($1,$2)`, [id, userId]);
      res.json({ liked: true });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Comments ────────────────────────────────────────────────────────────────

app.get("/api/forum/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT c.*,
        (SELECT COUNT(*) FROM forum_comment_likes l WHERE l.comment_id = c.id)::int AS like_count,
        (SELECT json_agg(user_id) FROM forum_comment_likes l WHERE l.comment_id = c.id) AS likes
       FROM forum_comments c
       WHERE c.post_id=$1
       ORDER BY c.created_at ASC`,
      [postId]
    );
    res.json(rows.map(r => ({ ...r, likes: r.likes || [] })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/forum/comments", async (req, res) => {
  const { postId, body, authorId, authorName } = req.body;
  if (!postId || !body?.trim() || !authorId) return res.status(400).json({ error: "Missing fields" });
  const id = uid();
  try {
    await pool.query(
      `INSERT INTO forum_comments (id, post_id, body, author_id, author_name)
       VALUES ($1,$2,$3,$4,$5)`,
      [id, postId, body.trim(), authorId, authorName || "Anonyme"]
    );
    const { rows } = await pool.query(`SELECT * FROM forum_comments WHERE id=$1`, [id]);
    res.json({ ...rows[0], likes: [], like_count: 0 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/forum/comments/:id/like", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });
  try {
    const { rows } = await pool.query(
      `SELECT 1 FROM forum_comment_likes WHERE comment_id=$1 AND user_id=$2`, [id, userId]
    );
    if (rows.length > 0) {
      await pool.query(`DELETE FROM forum_comment_likes WHERE comment_id=$1 AND user_id=$2`, [id, userId]);
      res.json({ liked: false });
    } else {
      await pool.query(`INSERT INTO forum_comment_likes (comment_id, user_id) VALUES ($1,$2)`, [id, userId]);
      res.json({ liked: true });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Start ───────────────────────────────────────────────────────────────────

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Forum API running on http://127.0.0.1:${PORT}`);
});
