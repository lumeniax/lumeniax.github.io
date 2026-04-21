import { supabase } from "@/lib/supabaseClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ForumUser {
  id: string;
  name: string;
  isPremium?: boolean;
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
  author_id: string;
  author_name: string;
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

export function setForumUser(name: string, isPremium = true): ForumUser {
  const user: ForumUser = { id: uid(), name: name.trim(), isPremium };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

// ─── Spaces ───────────────────────────────────────────────────────────────────

export const fetchSpaces = async (): Promise<ForumSpace[]> => {
  const { data, error } = await supabase
    .from('spaces')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []) as ForumSpace[];
};

export const createSpace = async (
  data: Pick<ForumSpace, "name" | "description" | "emoji" | "category">,
  author: ForumUser
): Promise<ForumSpace> => {
  const { data: space, error } = await supabase
    .from('spaces')
    .insert([{
      ...data,
      author_id: author.id,
      author_name: author.name,
      members: [author.id],
      member_count: 1,
      post_count: 0
    }])
    .select()
    .single();

  if (error) throw error;
  return space as ForumSpace;
};

export const toggleMember = async (spaceId: string, userId: string): Promise<{ joined: boolean }> => {
  const { data: space, error: fetchError } = await supabase
    .from('spaces')
    .select('members')
    .eq('id', spaceId)
    .single();

  if (fetchError) throw fetchError;

  const members = space.members || [];
  const isMember = members.includes(userId);
  const newMembers = isMember 
    ? members.filter((id: string) => id !== userId)
    : [...members, userId];

  const { error: updateError } = await supabase
    .from('spaces')
    .update({ 
      members: newMembers,
      member_count: newMembers.length
    })
    .eq('id', spaceId);

  if (updateError) throw updateError;
  return { joined: !isMember };
};

// ─── Posts ────────────────────────────────────────────────────────────────────

export const fetchPosts = async (spaceId: string): Promise<ForumPost[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('space_id', spaceId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as ForumPost[];
};

export const fetchPost = async (postId: string): Promise<ForumPost> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (error) throw error;
  return data as ForumPost;
};

export const createPost = async (
  data: { spaceId: string; title: string; body: string },
  author: ForumUser
): Promise<ForumPost> => {
  const { data: post, error } = await supabase
    .from('posts')
    .insert([{
      space_id: data.spaceId,
      title: data.title,
      body: data.body,
      author_id: author.id,
      author_name: author.name,
      likes: [],
      like_count: 0,
      comment_count: 0
    }])
    .select()
    .single();

  if (error) throw error;

  // Increment post_count in space
  const { error: updateError } = await supabase
    .from('spaces')
    .update({ post_count: supabase.rpc('increment_post_count', { space_row_id: data.spaceId }) })
    .eq('id', data.spaceId);

  if (updateError) console.warn("Failed to increment post count:", updateError);

  return post as ForumPost;
};

export const togglePostLike = async (postId: string, userId: string): Promise<{ liked: boolean }> => {
  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('likes')
    .eq('id', postId)
    .single();

  if (fetchError) throw fetchError;

  const likes = post.likes || [];
  const isLiked = likes.includes(userId);
  const newLikes = isLiked 
    ? likes.filter((id: string) => id !== userId)
    : [...likes, userId];

  const { error: updateError } = await supabase
    .from('posts')
    .update({ 
      likes: newLikes,
      like_count: newLikes.length
    })
    .eq('id', postId);

  if (updateError) throw updateError;
  return { liked: !isLiked };
};

// ─── Comments ─────────────────────────────────────────────────────────────────

export const fetchComments = async (postId: string): Promise<ForumComment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as ForumComment[];
};

export const createComment = async (
  data: { postId: string; body: string },
  author: ForumUser
): Promise<ForumComment> => {
  const { data: comment, error } = await supabase
    .from('comments')
    .insert([{
      post_id: data.postId,
      body: data.body,
      author_id: author.id,
      author_name: author.name,
      likes: [],
      like_count: 0
    }])
    .select()
    .single();

  if (error) throw error;

  // Increment comment_count in post
  const { error: updateError } = await supabase
    .from('posts')
    .update({ comment_count: supabase.rpc('increment_comment_count', { post_row_id: data.postId }) })
    .eq('id', data.postId);

  if (updateError) console.warn("Failed to increment comment count:", updateError);

  return comment as ForumComment;
};

export const toggleCommentLike = async (commentId: string, userId: string): Promise<{ liked: boolean }> => {
  const { data: comment, error: fetchError } = await supabase
    .from('comments')
    .select('likes')
    .eq('id', commentId)
    .single();

  if (fetchError) throw fetchError;

  const likes = comment.likes || [];
  const isLiked = likes.includes(userId);
  const newLikes = isLiked 
    ? likes.filter((id: string) => id !== userId)
    : [...likes, userId];

  const { error: updateError } = await supabase
    .from('comments')
    .update({ 
      likes: newLikes,
      like_count: newLikes.length
    })
    .eq('id', commentId);

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
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
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
