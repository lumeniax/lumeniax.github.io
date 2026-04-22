// ─────────────────────────────────────────────────────────────────────────────
// useForum — 100% LOCAL (localStorage). No Supabase, no API, no backend.
//
// Toutes les fonctions conservent leur signature historique (Promise<T>) afin
// que les pages existantes (AcademyCommunaute, ForumSpace, ForumPost) continuent
// de fonctionner sans modification.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ForumUser {
  id: string;
  name: string;
}

export interface ForumSpace {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: "echange" | "club" | "reseau";
  created_at: string;
  author_id?: string;
  author_name?: string;
  member_count: number;
  post_count: number;
  members: string[];
}

export interface ForumPost {
  id: string;
  space_id: string;
  title: string;
  body: string;
  author_id: string;
  author_name: string;
  created_at: string;
  like_count: number;
  comment_count: number;
  likes: string[];
}

export interface ForumComment {
  id: string;
  post_id: string;
  body: string;
  author_id: string;
  author_name: string;
  created_at: string;
  like_count: number;
  likes: string[];
}

export interface ForumReply {
  id: string;
  comment_id: string;
  body: string;
  author_id: string;
  author_name: string;
  created_at: string;
  like_count: number;
  likes: string[];
}

// ─── localStorage helpers ────────────────────────────────────────────────────

const USER_KEY = "lx_forum_user";
const FAVORITES_KEY = "lx_forum_favorites";
const SPACES_KEY = "lx_forum_spaces";
const POSTS_KEY = "lx_forum_posts";
const COMMENTS_KEY = "lx_forum_comments";
const REPLIES_KEY = "lx_forum_replies";

function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* localStorage may be blocked (iframe, private mode) — ignore */
  }
}

function read<T>(key: string, fallback: T): T {
  const raw = safeGet(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  safeSet(key, JSON.stringify(value));
}

// ─── User identity ───────────────────────────────────────────────────────────

let _user: ForumUser | null = null;
let _favorites: string[] | null = null;

export function getForumUser(): ForumUser | null {
  if (_user) return _user;
  const raw = safeGet(USER_KEY);
  if (raw) {
    try {
      _user = JSON.parse(raw) as ForumUser;
      return _user;
    } catch {
      /* fallthrough */
    }
  }
  return null;
}

export function setForumUser(name: string): ForumUser {
  const trimmed = name.trim() || "Anonyme";
  const user: ForumUser = { id: uid(), name: trimmed };
  _user = user;
  safeSet(USER_KEY, JSON.stringify(user));
  return user;
}

export function getFavoriteSpaces(): string[] {
  if (_favorites) return _favorites;
  const raw = safeGet(FAVORITES_KEY);
  if (raw) {
    try {
      _favorites = JSON.parse(raw) as string[];
      return _favorites;
    } catch {
      /* fallthrough */
    }
  }
  _favorites = [];
  return _favorites;
}

export function toggleFavoriteSpace(spaceId: string): boolean {
  const favs = getFavoriteSpaces();
  const next = favs.includes(spaceId)
    ? favs.filter((id) => id !== spaceId)
    : [...favs, spaceId];
  _favorites = next;
  safeSet(FAVORITES_KEY, JSON.stringify(next));
  return next.includes(spaceId);
}

// ─── Internal stores (synchronous reads from localStorage) ───────────────────

function loadSpaces(): ForumSpace[] {
  return read<ForumSpace[]>(SPACES_KEY, []);
}
function saveSpaces(list: ForumSpace[]) {
  write(SPACES_KEY, list);
}
function loadPosts(): ForumPost[] {
  return read<ForumPost[]>(POSTS_KEY, []);
}
function savePosts(list: ForumPost[]) {
  write(POSTS_KEY, list);
}
function loadComments(): ForumComment[] {
  return read<ForumComment[]>(COMMENTS_KEY, []);
}
function saveComments(list: ForumComment[]) {
  write(COMMENTS_KEY, list);
}
function loadReplies(): ForumReply[] {
  return read<ForumReply[]>(REPLIES_KEY, []);
}
function saveReplies(list: ForumReply[]) {
  write(REPLIES_KEY, list);
}

// ─── Spaces : CRUD complet exposé ────────────────────────────────────────────

export function getSpaces(): ForumSpace[] {
  return loadSpaces();
}

export function deleteSpace(id: string): void {
  console.log("[useForum] deleteSpace", id);
  saveSpaces(loadSpaces().filter((s) => s.id !== id));
  // Cascade : supprimer posts, commentaires et réponses liés
  const remainingPosts = loadPosts().filter((p) => p.space_id !== id);
  const removedPostIds = new Set(
    loadPosts().filter((p) => p.space_id === id).map((p) => p.id)
  );
  savePosts(remainingPosts);
  const remainingComments = loadComments().filter(
    (c) => !removedPostIds.has(c.post_id)
  );
  const removedCommentIds = new Set(
    loadComments()
      .filter((c) => removedPostIds.has(c.post_id))
      .map((c) => c.id)
  );
  saveComments(remainingComments);
  saveReplies(
    loadReplies().filter((r) => !removedCommentIds.has(r.comment_id))
  );
}

export function updateSpace(
  id: string,
  data: Partial<Pick<ForumSpace, "name" | "description" | "emoji" | "category">>
): ForumSpace | null {
  console.log("[useForum] updateSpace", id, data);
  const list = loadSpaces();
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...data };
  saveSpaces(list);
  return list[idx];
}

// ─── Spaces : signatures historiques (Promise) ──────────────────────────────

export const fetchSpaces = async (): Promise<ForumSpace[]> => {
  const data = loadSpaces();
  console.log("[useForum] fetchSpaces →", data.length, "espaces");
  return data;
};

export const createSpace = async (
  data: Pick<ForumSpace, "name" | "description" | "emoji" | "category">,
  author: ForumUser
): Promise<ForumSpace> => {
  console.log("[useForum] createSpace", data, "par", author.name);
  const space: ForumSpace = {
    id: uid(),
    name: data.name,
    description: data.description,
    emoji: data.emoji,
    category: data.category,
    created_at: new Date().toISOString(),
    author_id: author.id,
    author_name: author.name,
    member_count: 1,
    post_count: 0,
    members: [author.id],
  };
  const list = loadSpaces();
  list.unshift(space);
  saveSpaces(list);
  console.log("[useForum] espace créé:", space.id);
  return space;
};

export const toggleMember = async (
  spaceId: string,
  userId: string
): Promise<{ joined: boolean }> => {
  const list = loadSpaces();
  const idx = list.findIndex((s) => s.id === spaceId);
  if (idx === -1) return { joined: false };
  const isMember = list[idx].members.includes(userId);
  const members = isMember
    ? list[idx].members.filter((id) => id !== userId)
    : [...list[idx].members, userId];
  list[idx] = {
    ...list[idx],
    members,
    member_count: members.length,
  };
  saveSpaces(list);
  return { joined: !isMember };
};

// ─── Posts ────────────────────────────────────────────────────────────────────

function recountSpacePosts(spaceId: string) {
  const posts = loadPosts().filter((p) => p.space_id === spaceId);
  const list = loadSpaces();
  const idx = list.findIndex((s) => s.id === spaceId);
  if (idx !== -1) {
    list[idx] = { ...list[idx], post_count: posts.length };
    saveSpaces(list);
  }
}

function recountPostComments(postId: string) {
  const count = loadComments().filter((c) => c.post_id === postId).length;
  const list = loadPosts();
  const idx = list.findIndex((p) => p.id === postId);
  if (idx !== -1) {
    list[idx] = { ...list[idx], comment_count: count };
    savePosts(list);
  }
}

export const fetchPosts = async (spaceId: string): Promise<ForumPost[]> => {
  const data = loadPosts()
    .filter((p) => p.space_id === spaceId)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  console.log("[useForum] fetchPosts(", spaceId, ") →", data.length);
  return data;
};

export const fetchPost = async (postId: string): Promise<ForumPost> => {
  const post = loadPosts().find((p) => p.id === postId);
  if (!post) throw new Error("Post introuvable");
  return post;
};

export const createPost = async (
  data: { spaceId: string; title: string; body: string },
  author: ForumUser
): Promise<ForumPost> => {
  console.log("[useForum] createPost", data);
  const post: ForumPost = {
    id: uid(),
    space_id: data.spaceId,
    title: data.title,
    body: data.body,
    author_id: author.id,
    author_name: author.name,
    created_at: new Date().toISOString(),
    like_count: 0,
    comment_count: 0,
    likes: [],
  };
  const list = loadPosts();
  list.unshift(post);
  savePosts(list);
  recountSpacePosts(data.spaceId);
  return post;
};

export const updatePost = async (
  postId: string,
  data: { title: string; body: string },
  user: ForumUser
): Promise<void> => {
  const list = loadPosts();
  const idx = list.findIndex((p) => p.id === postId);
  if (idx === -1) throw new Error("Post introuvable");
  if (list[idx].author_id !== user.id)
    throw new Error("Action non autorisée");
  list[idx] = { ...list[idx], title: data.title, body: data.body };
  savePosts(list);
};

export const deletePost = async (
  postId: string,
  user: ForumUser
): Promise<void> => {
  const list = loadPosts();
  const target = list.find((p) => p.id === postId);
  if (!target) return;
  if (target.author_id !== user.id) throw new Error("Action non autorisée");
  savePosts(list.filter((p) => p.id !== postId));
  // Cascade : supprimer commentaires + réponses
  const cmtIds = new Set(
    loadComments().filter((c) => c.post_id === postId).map((c) => c.id)
  );
  saveComments(loadComments().filter((c) => c.post_id !== postId));
  saveReplies(
    loadReplies().filter((r) => !cmtIds.has(r.comment_id))
  );
  recountSpacePosts(target.space_id);
};

export const togglePostLike = async (
  postId: string,
  userId: string
): Promise<{ liked: boolean }> => {
  const list = loadPosts();
  const idx = list.findIndex((p) => p.id === postId);
  if (idx === -1) return { liked: false };
  const hasLiked = list[idx].likes.includes(userId);
  const likes = hasLiked
    ? list[idx].likes.filter((id) => id !== userId)
    : [...list[idx].likes, userId];
  list[idx] = { ...list[idx], likes, like_count: likes.length };
  savePosts(list);
  return { liked: !hasLiked };
};

// ─── Comments ─────────────────────────────────────────────────────────────────

export const fetchComments = async (
  postId: string
): Promise<ForumComment[]> => {
  return loadComments()
    .filter((c) => c.post_id === postId)
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
};

export const createComment = async (
  data: { postId: string; body: string },
  author: ForumUser
): Promise<ForumComment> => {
  const cmt: ForumComment = {
    id: uid(),
    post_id: data.postId,
    body: data.body,
    author_id: author.id,
    author_name: author.name,
    created_at: new Date().toISOString(),
    like_count: 0,
    likes: [],
  };
  const list = loadComments();
  list.push(cmt);
  saveComments(list);
  recountPostComments(data.postId);
  return cmt;
};

export const updateComment = async (
  commentId: string,
  body: string,
  user: ForumUser
): Promise<void> => {
  const list = loadComments();
  const idx = list.findIndex((c) => c.id === commentId);
  if (idx === -1) throw new Error("Commentaire introuvable");
  if (list[idx].author_id !== user.id)
    throw new Error("Action non autorisée");
  list[idx] = { ...list[idx], body };
  saveComments(list);
};

export const deleteComment = async (
  commentId: string,
  user: ForumUser
): Promise<void> => {
  const list = loadComments();
  const target = list.find((c) => c.id === commentId);
  if (!target) return;
  if (target.author_id !== user.id) throw new Error("Action non autorisée");
  saveComments(list.filter((c) => c.id !== commentId));
  saveReplies(loadReplies().filter((r) => r.comment_id !== commentId));
  recountPostComments(target.post_id);
};

export const toggleCommentLike = async (
  commentId: string,
  userId: string
): Promise<{ liked: boolean }> => {
  const list = loadComments();
  const idx = list.findIndex((c) => c.id === commentId);
  if (idx === -1) return { liked: false };
  const hasLiked = list[idx].likes.includes(userId);
  const likes = hasLiked
    ? list[idx].likes.filter((id) => id !== userId)
    : [...list[idx].likes, userId];
  list[idx] = { ...list[idx], likes, like_count: likes.length };
  saveComments(list);
  return { liked: !hasLiked };
};

// ─── Replies ──────────────────────────────────────────────────────────────────

export const fetchReplies = async (postId: string): Promise<ForumReply[]> => {
  const cmtIds = new Set(
    loadComments().filter((c) => c.post_id === postId).map((c) => c.id)
  );
  return loadReplies()
    .filter((r) => cmtIds.has(r.comment_id))
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
};

export const createReply = async (
  data: { commentId: string; body: string },
  author: ForumUser
): Promise<ForumReply> => {
  const reply: ForumReply = {
    id: uid(),
    comment_id: data.commentId,
    body: data.body,
    author_id: author.id,
    author_name: author.name,
    created_at: new Date().toISOString(),
    like_count: 0,
    likes: [],
  };
  const list = loadReplies();
  list.push(reply);
  saveReplies(list);
  return reply;
};

export const deleteReply = async (
  replyId: string,
  user: ForumUser
): Promise<void> => {
  const list = loadReplies();
  const target = list.find((r) => r.id === replyId);
  if (!target) return;
  if (target.author_id !== user.id) throw new Error("Action non autorisée");
  saveReplies(list.filter((r) => r.id !== replyId));
};

export const toggleReplyLike = async (
  replyId: string,
  userId: string
): Promise<{ liked: boolean }> => {
  const list = loadReplies();
  const idx = list.findIndex((r) => r.id === replyId);
  if (idx === -1) return { liked: false };
  const hasLiked = list[idx].likes.includes(userId);
  const likes = hasLiked
    ? list[idx].likes.filter((id) => id !== userId)
    : [...list[idx].likes, userId];
  list[idx] = { ...list[idx], likes, like_count: likes.length };
  saveReplies(list);
  return { liked: !hasLiked };
};

// ─── Formatting ───────────────────────────────────────────────────────────────

export function relTime(iso: string): string {
  if (!iso) return "";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `il y a ${Math.floor(diff / 86400)} j`;
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export function initials(name: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function avatarColor(name: string): string {
  const palette = [
    "bg-rose-500/15 text-rose-400",
    "bg-amber-500/15 text-amber-400",
    "bg-emerald-500/15 text-emerald-400",
    "bg-sky-500/15 text-sky-400",
    "bg-violet-500/15 text-violet-400",
    "bg-fuchsia-500/15 text-fuchsia-400",
    "bg-teal-500/15 text-teal-400",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return palette[Math.abs(h) % palette.length];
}
