// ─────────────────────────────────────────────────────────────────────────────
// useForum — Firestore (Firebase) + temps réel via onSnapshot
//
// Toutes les données partagées (espaces, posts, commentaires, réponses) sont
// stockées et synchronisées via Firestore. Chaque page peut s'abonner avec
// `subscribe*` pour recevoir les mises à jour en temps réel.
//
// L'identité locale du visiteur (pseudo + favoris) reste dans sessionStorage —
// c'est une préférence purement personnelle au navigateur, sans contrepartie
// Firestore (pas d'authentification).
// ─────────────────────────────────────────────────────────────────────────────

import { db } from "@/firebase";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

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

// ─── Identity (sessionStorage, sans backend auth) ────────────────────────────

const USER_KEY = "lx_forum_user";
const FAVORITES_KEY = "lx_forum_favorites";

function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

function safeGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

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
      /* fall through */
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
      /* fall through */
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

// ─── Firestore helpers ───────────────────────────────────────────────────────

const SPACES = "spaces";
const POSTS = "posts";
const COMMENTS = "comments";
const REPLIES = "replies";

function tsToIso(value: unknown): string {
  if (!value) return new Date().toISOString();
  // Firestore Timestamp
  if (typeof value === "object" && value !== null && "toDate" in value) {
    try {
      return (value as { toDate: () => Date }).toDate().toISOString();
    } catch {
      return new Date().toISOString();
    }
  }
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  return new Date().toISOString();
}

function mapSpace(d: QueryDocumentSnapshot<DocumentData>): ForumSpace {
  const data = d.data();
  const members: string[] = Array.isArray(data.members) ? data.members : [];
  return {
    id: d.id,
    name: data.name ?? "",
    description: data.description ?? "",
    emoji: data.emoji ?? "💬",
    category: (data.category as ForumSpace["category"]) ?? "echange",
    created_at: tsToIso(data.created_at ?? data.createdAt),
    author_id: data.author_id,
    author_name: data.author_name,
    members,
    member_count:
      typeof data.member_count === "number" ? data.member_count : members.length,
    post_count: typeof data.post_count === "number" ? data.post_count : 0,
  };
}

function mapPost(d: QueryDocumentSnapshot<DocumentData>): ForumPost {
  const data = d.data();
  const likes: string[] = Array.isArray(data.likes) ? data.likes : [];
  return {
    id: d.id,
    space_id: data.space_id ?? "",
    title: data.title ?? "",
    body: data.body ?? "",
    author_id: data.author_id ?? "",
    author_name: data.author_name ?? "",
    created_at: tsToIso(data.created_at ?? data.createdAt),
    likes,
    like_count:
      typeof data.like_count === "number" ? data.like_count : likes.length,
    comment_count:
      typeof data.comment_count === "number" ? data.comment_count : 0,
  };
}

function mapComment(d: QueryDocumentSnapshot<DocumentData>): ForumComment {
  const data = d.data();
  const likes: string[] = Array.isArray(data.likes) ? data.likes : [];
  return {
    id: d.id,
    post_id: data.post_id ?? "",
    body: data.body ?? "",
    author_id: data.author_id ?? "",
    author_name: data.author_name ?? "",
    created_at: tsToIso(data.created_at ?? data.createdAt),
    likes,
    like_count:
      typeof data.like_count === "number" ? data.like_count : likes.length,
  };
}

function mapReply(d: QueryDocumentSnapshot<DocumentData>): ForumReply {
  const data = d.data();
  const likes: string[] = Array.isArray(data.likes) ? data.likes : [];
  return {
    id: d.id,
    comment_id: data.comment_id ?? "",
    body: data.body ?? "",
    author_id: data.author_id ?? "",
    author_name: data.author_name ?? "",
    created_at: tsToIso(data.created_at ?? data.createdAt),
    likes,
    like_count:
      typeof data.like_count === "number" ? data.like_count : likes.length,
  };
}

// ─── Spaces ───────────────────────────────────────────────────────────────────

export const fetchSpaces = async (): Promise<ForumSpace[]> => {
  try {
    const snap = await getDocs(
      query(collection(db, SPACES), orderBy("created_at", "desc"))
    );
    const list = snap.docs.map(mapSpace);
    console.log("[useForum] fetchSpaces →", list.length);
    return list;
  } catch (e) {
    console.error("[useForum] fetchSpaces ÉCHEC:", e);
    return [];
  }
};

export function subscribeSpaces(
  cb: (spaces: ForumSpace[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(collection(db, SPACES), orderBy("created_at", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map(mapSpace);
      console.log("[useForum] subscribeSpaces tick →", list.length);
      cb(list);
    },
    (err) => {
      console.error("[useForum] subscribeSpaces ÉCHEC:", err);
      onError?.(err);
    }
  );
}

export const createSpace = async (
  data: Pick<ForumSpace, "name" | "description" | "emoji" | "category">,
  author: ForumUser
): Promise<ForumSpace> => {
  console.log("[useForum] createSpace", data, "par", author.name);
  const payload = {
    name: data.name,
    description: data.description,
    emoji: data.emoji,
    category: data.category,
    created_at: serverTimestamp(),
    author_id: author.id,
    author_name: author.name,
    members: [author.id],
    member_count: 1,
    post_count: 0,
  };
  const ref = await addDoc(collection(db, SPACES), payload);
  console.log("[useForum] espace créé:", ref.id);
  return {
    id: ref.id,
    name: data.name,
    description: data.description,
    emoji: data.emoji,
    category: data.category,
    created_at: new Date().toISOString(),
    author_id: author.id,
    author_name: author.name,
    members: [author.id],
    member_count: 1,
    post_count: 0,
  };
};

export const updateSpace = async (
  id: string,
  data: Partial<Pick<ForumSpace, "name" | "description" | "emoji" | "category">>
): Promise<void> => {
  console.log("[useForum] updateSpace", id, data);
  await updateDoc(doc(db, SPACES, id), data as DocumentData);
};

export const deleteSpace = async (id: string): Promise<void> => {
  console.log("[useForum] deleteSpace", id);
  // Cascade : supprimer posts → commentaires → réponses liés
  const postsSnap = await getDocs(
    query(collection(db, POSTS), where("space_id", "==", id))
  );
  for (const p of postsSnap.docs) {
    const cmtsSnap = await getDocs(
      query(collection(db, COMMENTS), where("post_id", "==", p.id))
    );
    for (const c of cmtsSnap.docs) {
      const repsSnap = await getDocs(
        query(collection(db, REPLIES), where("comment_id", "==", c.id))
      );
      for (const r of repsSnap.docs) await deleteDoc(r.ref);
      await deleteDoc(c.ref);
    }
    await deleteDoc(p.ref);
  }
  await deleteDoc(doc(db, SPACES, id));
};

export const toggleMember = async (
  spaceId: string,
  userId: string
): Promise<{ joined: boolean }> => {
  const ref = doc(db, SPACES, spaceId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { joined: false };
  const data = snap.data();
  const members: string[] = Array.isArray(data.members) ? data.members : [];
  const isMember = members.includes(userId);
  if (isMember) {
    await updateDoc(ref, {
      members: arrayRemove(userId),
      member_count: increment(-1),
    });
  } else {
    await updateDoc(ref, {
      members: arrayUnion(userId),
      member_count: increment(1),
    });
  }
  return { joined: !isMember };
};

// ─── Posts ────────────────────────────────────────────────────────────────────

export const fetchPosts = async (spaceId: string): Promise<ForumPost[]> => {
  try {
    const snap = await getDocs(
      query(collection(db, POSTS), where("space_id", "==", spaceId))
    );
    const list = snap.docs.map(mapPost).sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return list;
  } catch (e) {
    console.error("[useForum] fetchPosts ÉCHEC:", e);
    return [];
  }
};

export function subscribePosts(
  spaceId: string,
  cb: (posts: ForumPost[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(collection(db, POSTS), where("space_id", "==", spaceId));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map(mapPost).sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      cb(list);
    },
    (err) => {
      console.error("[useForum] subscribePosts ÉCHEC:", err);
      onError?.(err);
    }
  );
}

export const fetchPost = async (postId: string): Promise<ForumPost> => {
  const snap = await getDoc(doc(db, POSTS, postId));
  if (!snap.exists()) throw new Error("Post introuvable");
  return mapPost(snap as unknown as QueryDocumentSnapshot<DocumentData>);
};

export function subscribePost(
  postId: string,
  cb: (post: ForumPost | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, POSTS, postId),
    (snap) => {
      if (!snap.exists()) return cb(null);
      cb(mapPost(snap as unknown as QueryDocumentSnapshot<DocumentData>));
    },
    (err) => {
      console.error("[useForum] subscribePost ÉCHEC:", err);
      onError?.(err);
    }
  );
}

export const createPost = async (
  data: { spaceId: string; title: string; body: string },
  author: ForumUser
): Promise<ForumPost> => {
  console.log("[useForum] createPost", data);
  const payload = {
    space_id: data.spaceId,
    title: data.title,
    body: data.body,
    author_id: author.id,
    author_name: author.name,
    created_at: serverTimestamp(),
    likes: [] as string[],
    like_count: 0,
    comment_count: 0,
  };
  const ref = await addDoc(collection(db, POSTS), payload);
  // Compteur dénormalisé sur l'espace
  await updateDoc(doc(db, SPACES, data.spaceId), {
    post_count: increment(1),
  }).catch((e) =>
    console.error("[useForum] increment post_count ÉCHEC:", e)
  );
  return {
    id: ref.id,
    space_id: data.spaceId,
    title: data.title,
    body: data.body,
    author_id: author.id,
    author_name: author.name,
    created_at: new Date().toISOString(),
    likes: [],
    like_count: 0,
    comment_count: 0,
  };
};

export const updatePost = async (
  postId: string,
  data: { title: string; body: string },
  user: ForumUser
): Promise<void> => {
  const ref = doc(db, POSTS, postId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Post introuvable");
  if (snap.data().author_id !== user.id)
    throw new Error("Action non autorisée");
  await updateDoc(ref, { title: data.title, body: data.body });
};

export const deletePost = async (
  postId: string,
  user: ForumUser
): Promise<void> => {
  const ref = doc(db, POSTS, postId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data();
  if (data.author_id !== user.id) throw new Error("Action non autorisée");
  // Cascade : commentaires + réponses
  const cmtsSnap = await getDocs(
    query(collection(db, COMMENTS), where("post_id", "==", postId))
  );
  for (const c of cmtsSnap.docs) {
    const repsSnap = await getDocs(
      query(collection(db, REPLIES), where("comment_id", "==", c.id))
    );
    for (const r of repsSnap.docs) await deleteDoc(r.ref);
    await deleteDoc(c.ref);
  }
  await deleteDoc(ref);
  if (data.space_id) {
    await updateDoc(doc(db, SPACES, data.space_id), {
      post_count: increment(-1),
    }).catch(() => {});
  }
};

export const togglePostLike = async (
  postId: string,
  userId: string
): Promise<{ liked: boolean }> => {
  const ref = doc(db, POSTS, postId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { liked: false };
  const likes: string[] = Array.isArray(snap.data().likes) ? snap.data().likes : [];
  const hasLiked = likes.includes(userId);
  await updateDoc(ref, {
    likes: hasLiked ? arrayRemove(userId) : arrayUnion(userId),
    like_count: increment(hasLiked ? -1 : 1),
  });
  return { liked: !hasLiked };
};

// ─── Comments ─────────────────────────────────────────────────────────────────

export const fetchComments = async (
  postId: string
): Promise<ForumComment[]> => {
  try {
    const snap = await getDocs(
      query(collection(db, COMMENTS), where("post_id", "==", postId))
    );
    return snap.docs.map(mapComment).sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  } catch (e) {
    console.error("[useForum] fetchComments ÉCHEC:", e);
    return [];
  }
};

export function subscribeComments(
  postId: string,
  cb: (comments: ForumComment[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(collection(db, COMMENTS), where("post_id", "==", postId));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map(mapComment).sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      cb(list);
    },
    (err) => {
      console.error("[useForum] subscribeComments ÉCHEC:", err);
      onError?.(err);
    }
  );
}

export const createComment = async (
  data: { postId: string; body: string },
  author: ForumUser
): Promise<ForumComment> => {
  const payload = {
    post_id: data.postId,
    body: data.body,
    author_id: author.id,
    author_name: author.name,
    created_at: serverTimestamp(),
    likes: [] as string[],
    like_count: 0,
  };
  const ref = await addDoc(collection(db, COMMENTS), payload);
  await updateDoc(doc(db, POSTS, data.postId), {
    comment_count: increment(1),
  }).catch(() => {});
  return {
    id: ref.id,
    post_id: data.postId,
    body: data.body,
    author_id: author.id,
    author_name: author.name,
    created_at: new Date().toISOString(),
    likes: [],
    like_count: 0,
  };
};

export const updateComment = async (
  commentId: string,
  body: string,
  user: ForumUser
): Promise<void> => {
  const ref = doc(db, COMMENTS, commentId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Commentaire introuvable");
  if (snap.data().author_id !== user.id)
    throw new Error("Action non autorisée");
  await updateDoc(ref, { body });
};

export const deleteComment = async (
  commentId: string,
  user: ForumUser
): Promise<void> => {
  const ref = doc(db, COMMENTS, commentId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data();
  if (data.author_id !== user.id) throw new Error("Action non autorisée");
  const repsSnap = await getDocs(
    query(collection(db, REPLIES), where("comment_id", "==", commentId))
  );
  for (const r of repsSnap.docs) await deleteDoc(r.ref);
  await deleteDoc(ref);
  if (data.post_id) {
    await updateDoc(doc(db, POSTS, data.post_id), {
      comment_count: increment(-1),
    }).catch(() => {});
  }
};

export const toggleCommentLike = async (
  commentId: string,
  userId: string
): Promise<{ liked: boolean }> => {
  const ref = doc(db, COMMENTS, commentId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { liked: false };
  const likes: string[] = Array.isArray(snap.data().likes) ? snap.data().likes : [];
  const hasLiked = likes.includes(userId);
  await updateDoc(ref, {
    likes: hasLiked ? arrayRemove(userId) : arrayUnion(userId),
    like_count: increment(hasLiked ? -1 : 1),
  });
  return { liked: !hasLiked };
};

// ─── Replies ──────────────────────────────────────────────────────────────────

export const fetchReplies = async (postId: string): Promise<ForumReply[]> => {
  try {
    const cmtsSnap = await getDocs(
      query(collection(db, COMMENTS), where("post_id", "==", postId))
    );
    const cmtIds = cmtsSnap.docs.map((d) => d.id);
    if (cmtIds.length === 0) return [];
    // Firestore "in" supporte 30 valeurs max ; on chunke par sécurité
    const chunks: string[][] = [];
    for (let i = 0; i < cmtIds.length; i += 30) chunks.push(cmtIds.slice(i, i + 30));
    const all: ForumReply[] = [];
    for (const ch of chunks) {
      const snap = await getDocs(
        query(collection(db, REPLIES), where("comment_id", "in", ch))
      );
      all.push(...snap.docs.map(mapReply));
    }
    return all.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  } catch (e) {
    console.error("[useForum] fetchReplies ÉCHEC:", e);
    return [];
  }
};

export function subscribeReplies(
  postId: string,
  cb: (replies: ForumReply[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  // On s'abonne à la liste des commentaires, puis à toutes leurs réponses.
  let inner: Unsubscribe | null = null;
  const outer = onSnapshot(
    query(collection(db, COMMENTS), where("post_id", "==", postId)),
    (cmtSnap) => {
      if (inner) {
        inner();
        inner = null;
      }
      const cmtIds = cmtSnap.docs.map((d) => d.id);
      if (cmtIds.length === 0) {
        cb([]);
        return;
      }
      // Pour rester simple : 30 ids max ; pour plus, on retombe sur une lecture ponctuelle.
      if (cmtIds.length <= 30) {
        inner = onSnapshot(
          query(collection(db, REPLIES), where("comment_id", "in", cmtIds)),
          (rSnap) => {
            const list = rSnap.docs.map(mapReply).sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            );
            cb(list);
          },
          (err) => {
            console.error("[useForum] subscribeReplies (inner) ÉCHEC:", err);
            onError?.(err);
          }
        );
      } else {
        fetchReplies(postId).then(cb);
      }
    },
    (err) => {
      console.error("[useForum] subscribeReplies (outer) ÉCHEC:", err);
      onError?.(err);
    }
  );
  return () => {
    if (inner) inner();
    outer();
  };
}

export const createReply = async (
  data: { commentId: string; body: string },
  author: ForumUser
): Promise<ForumReply> => {
  const payload = {
    comment_id: data.commentId,
    body: data.body,
    author_id: author.id,
    author_name: author.name,
    created_at: serverTimestamp(),
    likes: [] as string[],
    like_count: 0,
  };
  const ref = await addDoc(collection(db, REPLIES), payload);
  return {
    id: ref.id,
    comment_id: data.commentId,
    body: data.body,
    author_id: author.id,
    author_name: author.name,
    created_at: new Date().toISOString(),
    likes: [],
    like_count: 0,
  };
};

export const deleteReply = async (
  replyId: string,
  user: ForumUser
): Promise<void> => {
  const ref = doc(db, REPLIES, replyId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  if (snap.data().author_id !== user.id)
    throw new Error("Action non autorisée");
  await deleteDoc(ref);
};

export const toggleReplyLike = async (
  replyId: string,
  userId: string
): Promise<{ liked: boolean }> => {
  const ref = doc(db, REPLIES, replyId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { liked: false };
  const likes: string[] = Array.isArray(snap.data().likes) ? snap.data().likes : [];
  const hasLiked = likes.includes(userId);
  await updateDoc(ref, {
    likes: hasLiked ? arrayRemove(userId) : arrayUnion(userId),
    like_count: increment(hasLiked ? -1 : 1),
  });
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
