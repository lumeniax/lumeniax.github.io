import { supabase } from "@/lib/supabaseClient";

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

export const fetchSpaces = async (): Promise<ForumSpace[]> => {
  const { data, error } = await supabase
    .from("spaces")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as ForumSpace[];
};

export const createSpace = async (
  data: Pick<ForumSpace, "name" | "description" | "emoji" | "category">,
  author: ForumUser
): Promise<ForumSpace> => {
  const { data: space, error } = await supabase
    .from("spaces")
    .insert([
      {
        ...data,
        author_id: author.id,
        author_name: author.name,
        members: [author.id],
        member_count: 1,
        post_count: 0,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return space as ForumSpace;
};

export const toggleMember = async (
  spaceId: string,
  userId: string
): Promise<{ joined: boolean }> => {
  const { data: space, error: fetchError } = await supabase
    .from("spaces")
    .select("members")
    .eq("id", spaceId)
    .single();

  if (fetchError) throw fetchError;

  const members = space.members || [];
  const isMember = members.includes(userId);
  const newMembers = isMember
    ? members.filter((id: string) => id !== userId)
    : [...members, userId];

  const { error: updateError } = await supabase
    .from("spaces")
    .update({
      members: newMembers,
      member_count: newMembers.length,
    })
    .eq("id", spaceId);

  if (updateError) throw updateError;
  return { joined: !isMember };
};

// ─── Posts ────────────────────────────────────────────────────────────────────

export const fetchPosts = async (spaceId: string): Promise<ForumPost[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as ForumPost[];
};

export const fetchPost = async (postId: string): Promise<ForumPost> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (error) throw error;
  return data as ForumPost;
};

export const createPost = async (
  data: { spaceId: string; title: string; body: string },
  author: ForumUser
): Promise<ForumPost> => {
  const { data: post, error } = await supabase
    .from("posts")
    .insert([
      {
        space_id: data.spaceId,
        title: data.title,
        body: data.body,
        author_id: author.id,
        author_name: author.name,
        likes: [],
        like_count: 0,
        comment_count: 0,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Increment post_count in space
  await supabase.rpc("increment_post_count", { space_row_id: data.spaceId });

  return post as ForumPost;
};

export const updatePost = async (
  postId: string,
  data: { title: string; body: string },
  user: ForumUser
): Promise<void> => {
  const { error } = await supabase
    .from("posts")
    .update({ title: data.title, body: data.body })
    .eq("id", postId)
    .eq("author_id", user.id);

  if (error) throw error;
};

export const deletePost = async (postId: string, user: ForumUser): Promise<void> => {
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("author_id", user.id);

  if (error) throw error;
};

export const togglePostLike = async (
  postId: string,
  userId: string
): Promise<{ liked: boolean }> => {
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("likes")
    .eq("id", postId)
    .single();

  if (fetchError) throw fetchError;

  const likes = post.likes || [];
  const isLiked = likes.includes(userId);
  const newLikes = isLiked
    ? likes.filter((id: string) => id !== userId)
    : [...likes, userId];

  const { error: updateError } = await supabase
    .from("posts")
    .update({
      likes: newLikes,
      like_count: newLikes.length,
    })
    .eq("id", postId);

  if (updateError) throw updateError;
  return { liked: !isLiked };
};

// ─── Comments ─────────────────────────────────────────────────────────────────

export const fetchComments = async (postId: string): Promise<ForumComment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []) as ForumComment[];
};

export const createComment = async (
  data: { postId: string; body: string },
  author: ForumUser
): Promise<ForumComment> => {
  const { data: comment, error } = await supabase
    .from("comments")
    .insert([
      {
        post_id: data.postId,
        body: data.body,
        author_id: author.id,
        author_name: author.name,
        likes: [],
        like_count: 0,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Increment comment_count in post
  await supabase.rpc("increment_comment_count", { post_row_id: data.postId });

  return comment as ForumComment;
};

export const updateComment = async (
  commentId: string,
  body: string,
  user: ForumUser
): Promise<void> => {
  const { error } = await supabase
    .from("comments")
    .update({ body })
    .eq("id", commentId)
    .eq("author_id", user.id);

  if (error) throw error;
};

export const deleteComment = async (
  commentId: string,
  user: ForumUser
): Promise<void> => {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("author_id", user.id);

  if (error) throw error;
};

export const toggleCommentLike = async (
  commentId: string,
  userId: string
): Promise<{ liked: boolean }> => {
  const { data: comment, error: fetchError } = await supabase
    .from("comments")
    .select("likes")
    .eq("id", commentId)
    .single();

  if (fetchError) throw fetchError;

  const likes = comment.likes || [];
  const isLiked = likes.includes(userId);
  const newLikes = isLiked
    ? likes.filter((id: string) => id !== userId)
    : [...likes, userId];

  const { error: updateError } = await supabase
    .from("comments")
    .update({
      likes: newLikes,
      like_count: newLikes.length,
    })
    .eq("id", commentId);

  if (updateError) throw updateError;
  return { liked: !isLiked };
};

// ─── Replies ──────────────────────────────────────────────────────────────────

export const fetchReplies = async (postId: string): Promise<ForumReply[]> => {
  const { data, error } = await supabase
    .from("replies")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []) as ForumReply[];
};

export const createReply = async (
  data: { commentId: string; body: string },
  author: ForumUser
): Promise<ForumReply> => {
  const { data: reply, error } = await supabase
    .from("replies")
    .insert([
      {
        comment_id: data.commentId,
        body: data.body,
        author_id: author.id,
        author_name: author.name,
        likes: [],
        like_count: 0,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return reply as ForumReply;
};

export const deleteReply = async (replyId: string, user: ForumUser): Promise<void> => {
  const { error } = await supabase
    .from("replies")
    .delete()
    .eq("id", replyId)
    .eq("author_id", user.id);

  if (error) throw error;
};

export const toggleReplyLike = async (
  replyId: string,
  userId: string
): Promise<{ liked: boolean }> => {
  const { data: reply, error: fetchError } = await supabase
    .from("replies")
    .select("likes")
    .eq("id", replyId)
    .single();

  if (fetchError) throw fetchError;

  const likes = reply.likes || [];
  const isLiked = likes.includes(userId);
  const newLikes = isLiked
    ? likes.filter((id: string) => id !== userId)
    : [...likes, userId];

  const { error: updateError } = await supabase
    .from("replies")
    .update({
      likes: newLikes,
      like_count: newLikes.length,
    })
    .eq("id", replyId);

  if (updateError) throw updateError;
  return { liked: !isLiked };
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
