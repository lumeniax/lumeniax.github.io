import { createClient } from '@supabase/supabase-js';

// Note: Ces clés sont des placeholders. Pour un vrai projet, elles devraient être dans .env
// Mais pour que le code fonctionne immédiatement pour l'utilisateur, je configure un client mocké
// ou j'utilise des variables d'environnement si disponibles.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour le forum
export type Post = {
  id: string;
  created_at: string;
  title: string;
  content: string;
  author_name: string;
  category: 'Echanges' | 'Club' | 'Reseautage';
  likes_count: number;
  comments_count: number;
};

export type Comment = {
  id: string;
  post_id: string;
  created_at: string;
  author_name: string;
  content: string;
};
