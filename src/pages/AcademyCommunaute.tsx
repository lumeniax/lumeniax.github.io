import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { MessageSquare, Users, BookOpen, Heart, Send, Plus, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Mock Data pour simuler le comportement partagé sans backend réel immédiat
// Dans une version finale, on utiliserait Supabase pour fetch/subscribe
const INITIAL_POSTS = [
  {
    id: "1",
    title: "Comment gérez-vous le stress en période de rush ?",
    content: "Je cherche des techniques concrètes pour rester focus quand tout s'accélère. Des retours d'expérience ?",
    author: "Alexandre",
    category: "Echanges",
    likes: 12,
    comments: [
      { id: "c1", author: "Marie", text: "La méthode Pomodoro m'aide énormément !" },
      { id: "c2", author: "Jean", text: "Méditation 10min le matin, ça change tout." }
    ],
    date: "Il y a 2h"
  },
  {
    id: "2",
    title: "Club de lecture : 'Deep Work' de Cal Newport",
    content: "Qui l'a lu ? Je propose qu'on en discute jeudi soir en visio.",
    author: "Sarah",
    category: "Club",
    likes: 8,
    comments: [],
    date: "Il y a 5h"
  }
];

export default function AcademyCommunaute() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "Echanges" });
  const [activeCategory, setActiveCategory] = useState("Tous");

  // Simulation de persistance globale (dans un vrai cas, Supabase s'en charge)
  useEffect(() => {
    const savedPosts = localStorage.getItem("lumeniax_forum_posts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lumeniax_forum_posts", JSON.stringify(posts));
  }, [posts]);

  const handleAddPost = () => {
    if (!newPost.title || !newPost.content) return;
    
    const post = {
      id: Date.now().toString(),
      ...newPost,
      author: "Utilisateur",
      likes: 0,
      comments: [],
      date: "À l'instant"
    };
    
    setPosts([post, ...posts]);
    setNewPost({ title: "", content: "", category: "Echanges" });
    setIsNewPostModalOpen(false);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const filteredPosts = activeCategory === "Tous" 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  return (
    <div className="w-full pt-32 pb-20 bg-background min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <Users size={14} className="text-primary" />
            <span className="text-xs font-semibold tracking-widest text-primary uppercase">Forum Dynamique</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-serif font-bold mb-6 text-foreground">
            Le Cercle <span className="hero-gradient-text italic">Lumeniax</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Échangez, collaborez et partagez vos connaissances avec la communauté premium.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => setIsNewPostModalOpen(true)}
              className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
            >
              <Plus size={18} className="mr-2" /> Créer un post
            </Button>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <div className="flex justify-center gap-3 mb-12 overflow-x-auto pb-2">
          {["Tous", "Echanges", "Club", "Reseautage"].map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-6 transition-all ${activeCategory === cat ? 'bg-primary text-white' : 'border-primary/20 text-muted-foreground hover:border-primary/50'}`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Forum Feed */}
        <div className="max-w-3xl mx-auto space-y-8">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="card-premium group">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </div>
                    <CardTitle className="text-xl md:text-2xl group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {post.content}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-[10px] font-bold border border-primary/10">
                        {post.author[0]}
                      </div>
                      <span className="text-sm font-medium text-foreground/80">{post.author}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-border/50 flex gap-6">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors group/like"
                    >
                      <Heart size={18} className={`transition-all ${post.likes > 0 ? 'fill-accent text-accent' : 'group-hover/like:scale-110'}`} />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group/comment">
                      <MessageCircle size={18} className="group-hover/comment:scale-110 transition-transform" />
                      <span>{post.comments.length}</span>
                    </button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {isNewPostModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewPostModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-primary/30 rounded-2xl shadow-2xl p-8"
            >
              <button 
                onClick={() => setIsNewPostModalOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Nouveau Post</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground/80">Titre</label>
                  <Input 
                    placeholder="De quoi souhaitez-vous discuter ?" 
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    className="bg-background border-primary/20 focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground/80">Catégorie</label>
                  <select 
                    className="w-full bg-background border border-primary/20 rounded-md p-2 text-sm focus:border-primary outline-none"
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                  >
                    <option value="Echanges">Échanges</option>
                    <option value="Club">Club de lecture</option>
                    <option value="Reseautage">Réseautage</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground/80">Contenu</label>
                  <Textarea 
                    placeholder="Détaillez votre pensée..." 
                    rows={5}
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    className="bg-background border-primary/20 focus:border-primary"
                  />
                </div>
                
                <Button 
                  onClick={handleAddPost}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white"
                >
                  Publier dans le cercle
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
