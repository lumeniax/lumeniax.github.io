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

// ─── HTTP helper ─────────────────────────────────────────────────────────────

async function api<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      try {
        const j = await res.json();
        if (j?.error) msg = j.error;
      } catch {}
      throw new Error(msg);
    }
    return (await res.json()) as T;
  } catch (e: any) {
    // On GitHub Pages, /api/* will 404. We catch this to provide a clean "Coming Soon" state.
    if (e.message.includes("HTTP 404") || e.name === "TypeError") {
      throw new Error("COMMUNITY_UNAVAILABLE");
    }
    throw e;
  }
}

// ─── User identity (localStorage only) ───────────────────────────────────────

const USER_KEY = "lx_forum_user";
const FAVORITES_KEY = "lx_forum_favorites";

function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export function getForumUser(): ForumUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as ForumUser) : null;
  } catch {
    return null;
  }
}

export function setForumUser(name: string): ForumUser {
  const user: ForumUser = { id: uid(), name: name.trim() };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function getFavoriteSpaces(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteSpace(spaceId: string): boolean {
  const favs = getFavoriteSpaces();
  const next = favs.includes(spaceId)
    ? favs.filter((id) => id !== spaceId)
    : [...favs, spaceId];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  return next.includes(spaceId);
}

// ─── Spaces ───────────────────────────────────────────────────────────────────

export const fetchSpaces = (): Promise<ForumSpace[]> =>
  api<ForumSpace[]>("/api/forum/spaces");

export const createSpace = (
  data: Pick<ForumSpace, "name" | "description" | "emoji" | "category">,
  author: ForumUser
): Promise<ForumSpace> =>
  api<ForumSpace>("/api/forum/spaces", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      authorId: author.id,
      authorName: author.name,
    }),
  });

export const toggleMember = (
  spaceId: string,
  userId: string
): Promise<{ joined: boolean }> =>
  api<{ joined: boolean }>(`/api/forum/spaces/${spaceId}/join`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });

// ─── Posts ────────────────────────────────────────────────────────────────────

export const fetchPosts = (spaceId: string): Promise<ForumPost[]> =>
  api<ForumPost[]>(`/api/forum/spaces/${spaceId}/posts`);

export const fetchPost = (postId: string): Promise<ForumPost> =>
  api<ForumPost>(`/api/forum/posts/${postId}`);

export const createPost = (
  data: { spaceId: string; title: string; body: string },
  author: ForumUser
): Promise<ForumPost> =>
  api<ForumPost>("/api/forum/posts", {
    method: "POST",
    body: JSON.stringify({
      spaceId: data.spaceId,
      title: data.title,
      body: data.body,
      authorId: author.id,
      authorName: author.name,
    }),
  });

export const updatePost = (
  postId: string,
  data: { title: string; body: string },
  user: ForumUser
): Promise<void> =>
  api(`/api/forum/posts/${postId}`, {
    method: "PATCH",
    body: JSON.stringify({ ...data, userId: user.id }),
  });

export const deletePost = (postId: string, user: ForumUser): Promise<void> =>
  api(`/api/forum/posts/${postId}`, {
    method: "DELETE",
    body: JSON.stringify({ userId: user.id }),
  });

export const togglePostLike = (
  postId: string,
  userId: string
): Promise<{ liked: boolean }> =>
  api(`/api/forum/posts/${postId}/like`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });

// ─── Comments ─────────────────────────────────────────────────────────────────

export const fetchComments = (postId: string): Promise<ForumComment[]> =>
  api<ForumComment[]>(`/api/forum/posts/${postId}/comments`);

export const createComment = (
  data: { postId: string; body: string },
  author: ForumUser
): Promise<ForumComment> =>
  api<ForumComment>("/api/forum/comments", {
    method: "POST",
    body: JSON.stringify({
      postId: data.postId,
      body: data.body,
      authorId: author.id,
      authorName: author.name,
    }),
  });

export const updateComment = (
  commentId: string,
  body: string,
  user: ForumUser
): Promise<void> =>
  api(`/api/forum/comments/${commentId}`, {
    method: "PATCH",
    body: JSON.stringify({ body, userId: user.id }),
  });

export const deleteComment = (
  commentId: string,
  user: ForumUser
): Promise<void> =>
  api(`/api/forum/comments/${commentId}`, {
    method: "DELETE",
    body: JSON.stringify({ userId: user.id }),
  });

export const toggleCommentLike = (
  commentId: string,
  userId: string
): Promise<{ liked: boolean }> =>
  api(`/api/forum/comments/${commentId}/like`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });

// ─── Replies ──────────────────────────────────────────────────────────────────

export const fetchReplies = (postId: string): Promise<ForumReply[]> =>
  api<ForumReply[]>(`/api/forum/posts/${postId}/replies`);

export const createReply = (
  data: { commentId: string; body: string },
  author: ForumUser
): Promise<ForumReply> =>
  api<ForumReply>("/api/forum/replies", {
    method: "POST",
    body: JSON.stringify({
      commentId: data.commentId,
      body: data.body,
      authorId: author.id,
      authorName: author.name,
    }),
  });

export const deleteReply = (replyId: string, user: ForumUser): Promise<void> =>
  api(`/api/forum/replies/${replyId}`, {
    method: "DELETE",
    body: JSON.stringify({ userId: user.id }),
  });

export const toggleReplyLike = (
  replyId: string,
  userId: string
): Promise<{ liked: boolean }> =>
  api(`/api/forum/replies/${replyId}/like`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });

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
