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

// ─── User identity (localStorage only) ───────────────────────────────────────

const USER_KEY = "lx_forum_user";

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

// ─── API helpers ──────────────────────────────────────────────────────────────

async function get<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

// ─── Spaces ───────────────────────────────────────────────────────────────────

export const fetchSpaces = (): Promise<ForumSpace[]> =>
  get<ForumSpace[]>("/api/forum/spaces");

export const createSpace = (
  data: Pick<ForumSpace, "name" | "description" | "emoji" | "category">,
  author: ForumUser
): Promise<ForumSpace> =>
  post<ForumSpace>("/api/forum/spaces", {
    ...data,
    authorId: author.id,
    authorName: author.name,
  });

export const toggleMember = (spaceId: string, userId: string): Promise<{ joined: boolean }> =>
  post<{ joined: boolean }>(`/api/forum/spaces/${spaceId}/join`, { userId });

// ─── Posts ────────────────────────────────────────────────────────────────────

export const fetchPosts = (spaceId: string): Promise<ForumPost[]> =>
  get<ForumPost[]>(`/api/forum/spaces/${spaceId}/posts`);

export const fetchPost = (postId: string): Promise<ForumPost> =>
  get<ForumPost>(`/api/forum/posts/${postId}`);

export const createPost = (
  data: { spaceId: string; title: string; body: string },
  author: ForumUser
): Promise<ForumPost> =>
  post<ForumPost>("/api/forum/posts", {
    ...data,
    authorId: author.id,
    authorName: author.name,
  });

export const togglePostLike = (postId: string, userId: string): Promise<{ liked: boolean }> =>
  post<{ liked: boolean }>(`/api/forum/posts/${postId}/like`, { userId });

// ─── Comments ─────────────────────────────────────────────────────────────────

export const fetchComments = (postId: string): Promise<ForumComment[]> =>
  get<ForumComment[]>(`/api/forum/posts/${postId}/comments`);

export const createComment = (
  data: { postId: string; body: string },
  author: ForumUser
): Promise<ForumComment> =>
  post<ForumComment>("/api/forum/comments", {
    ...data,
    authorId: author.id,
    authorName: author.name,
  });

export const toggleCommentLike = (commentId: string, userId: string): Promise<{ liked: boolean }> =>
  post<{ liked: boolean }>(`/api/forum/comments/${commentId}/like`, { userId });

// ─── Formatting ───────────────────────────────────────────────────────────────

export function relTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `il y a ${Math.floor(diff / 86400)} j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
