import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Target, MessageSquare, Share2, Copy, Check } from "lucide-react";
import { generateLumeniaxTrigger, type LumeniaxOutput } from "@/lib/lumeniax-triggers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function LumeniaxDemo() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<LumeniaxOutput | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!input.trim()) {
      toast({
        title: "Entrée vide",
        description: "Veuillez saisir du texte pour l'analyser.",
        variant: "destructive",
      });
      return;
    }
    const result = generateLumeniaxTrigger(input);
    setOutput(result);
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output.fullOutput);
      setCopied(true);
      toast({
        title: "Copié !",
        description: "Le contenu viral a été copié dans le presse-papiers.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container max-w-4xl py-12 space-y-8">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block p-3 rounded-2xl bg-primary/10 text-primary mb-4"
        >
          <Sparkles size={48} />
        </motion.div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Moteur de déclencheurs psychologiques <span className="text-primary">Lumeniax</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transformez n'importe quel contenu en une bombe virale grâce à l'analyse psychologique adaptative.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="text-primary" size={20} />
              Entrée brute
            </CardTitle>
            <CardDescription>
              Collez votre texte, article ou pensée ici.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Ex: La discipline est plus importante que la motivation..."
              className="min-h-[200px] resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button 
              onClick={handleGenerate} 
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 rounded-xl transition-all"
            >
              Générer l'impact viral
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {output ? (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-6"
            >
              <Card className="bg-accent/50 border-none shadow-inner">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {output.type.toUpperCase()}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Target size={12} />
                      Trigger: {output.trigger}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-background border border-border/50 font-mono text-sm whitespace-pre-wrap relative group">
                    {output.fullOutput}
                    <button
                      onClick={handleCopy}
                      className="absolute top-2 right-2 p-2 rounded-md bg-accent hover:bg-primary/20 transition-colors"
                    >
                      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-[10px] uppercase text-muted-foreground font-bold">Tension Mentale</p>
                      <p className="text-sm font-medium">{output.mentalTension}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-[10px] uppercase text-muted-foreground font-bold">Call to Action</p>
                      <p className="text-sm font-medium">{output.cta}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2" onClick={handleCopy}>
                  <Share2 size={18} /> Partager
                </Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={handleCopy}>
                  <MessageSquare size={18} /> Commenter
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-muted rounded-3xl opacity-50">
              <Sparkles size={48} className="mb-4 text-muted" />
              <p className="text-muted-foreground">L'analyse psychologique apparaîtra ici après génération.</p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-12 border-t border-border/50">
        <h2 className="text-2xl font-bold mb-6 text-center">Pourquoi Lumeniax ?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Analyse Adaptative", desc: "Détecte le ton et l'intention de votre texte pour choisir le meilleur levier." },
            { title: "Déclencheurs Émotionnels", desc: "Utilise la curiosité, l'ego et l'urgence pour maximiser le taux de clic." },
            { title: "Prêt à l'Emploi", desc: "Génère un format optimisé pour TikTok, WhatsApp et Facebook instantanément." }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-accent/30 border border-border/50">
              <h3 className="font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
