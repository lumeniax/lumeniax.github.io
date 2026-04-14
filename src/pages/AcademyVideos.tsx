import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { PlayCircle } from "lucide-react";

export default function AcademyVideos() {
  const videos = [
    { title: "Le pouvoir des habitudes", duration: "12:45" },
    { title: "Stoïcisme pratique au quotidien", duration: "18:20" },
    { title: "Comprendre le flow", duration: "15:10" },
    { title: "L'art de l'attention", duration: "22:30" }
  ];

  return (
    <div className="w-full pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-20"
        >
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-serif font-medium mb-6">
            Nos <span className="italic text-primary">Vidéos</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-2xl">
            Du contenu visuel pour approfondir vos connaissances.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((vid, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="aspect-video bg-card border border-border/50 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center group-hover:border-primary/50 transition-colors">
                <PlayCircle className="w-12 h-12 text-primary/50 group-hover:text-primary group-hover:scale-110 transition-all" />
              </div>
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-xl">{vid.title}</h3>
                <span className="text-sm text-muted-foreground">{vid.duration}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}