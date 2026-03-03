import avatar from "@/assets/avatar.png";
import cityscape from "@/assets/cityscape-sketch.png";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background cityscape */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${cityscape})` }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary/20"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-44 h-44 md:w-56 md:h-56 rounded-full border-2 border-border overflow-hidden bg-background/60 backdrop-blur-sm"
        >
          <img
            src={avatar}
            alt="Cindy's avatar"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-display italic text-3xl md:text-5xl tracking-wide text-foreground"
        >
          welcome to cindy's home
        </motion.h1>

        <motion.a
          href="#"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="font-body text-lg tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-2"
        >
          enter world <span className="text-xl">→</span>
        </motion.a>
      </div>
    </div>
  );
};

export default Index;
