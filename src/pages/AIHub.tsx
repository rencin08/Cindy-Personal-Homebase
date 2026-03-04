import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, Lightbulb, Zap } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useJournalEntries } from "@/hooks/use-journal";

// Geometric circuit-like decoration for AI
const AIHubDeco = () => (
  <svg className="absolute right-0 top-0 h-full w-2/5 opacity-[0.05] pointer-events-none" viewBox="0 0 300 300" fill="none" stroke="hsl(200,50%,40%)" strokeWidth="1">
    <rect x="180" y="30" width="60" height="60" rx="8" strokeDasharray="4 4" />
    <rect x="220" y="120" width="40" height="40" rx="6" />
    <rect x="150" y="180" width="80" height="50" rx="10" strokeDasharray="6 3" />
    <line x1="210" y1="90" x2="240" y2="120" />
    <line x1="240" y1="160" x2="190" y2="180" />
    <circle cx="210" cy="90" r="3" fill="hsl(200,50%,40%)" />
    <circle cx="240" cy="160" r="3" fill="hsl(200,50%,40%)" />
    <path d="M160 40 L180 30" />
    <path d="M150 230 Q200 260, 260 240" strokeDasharray="3 5" />
    <circle cx="260" cy="240" r="4" />
    <circle cx="170" cy="100" r="20" strokeDasharray="2 4" />
  </svg>
);

const AIHub = () => {
  const { pins } = useJournalEntries();
  const [expandedPinId, setExpandedPinId] = useState<string | null>(null);

  const aiPins = pins.filter(p => !p.archived && p.tags.includes("idea"));
  const expandedPin = expandedPinId ? pins.find(p => p.id === expandedPinId) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Expanded pin overlay */}
      <AnimatePresence>
        {expandedPin && (
          <motion.div key="pin-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background overflow-y-auto">
            <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md px-5 py-4 flex items-center border-b border-[hsl(200,30%,85%)]">
              <button onClick={() => setExpandedPinId(null)} className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft size={18} /> Back
              </button>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-2xl mx-auto px-6 py-8">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={16} className="text-[hsl(200,50%,45%)]" />
                <span className="font-body text-xs tracking-[0.2em] text-[hsl(200,50%,45%)] uppercase">Idea</span>
              </div>
              <p className="font-body text-xs text-muted-foreground/40 mb-6">
                {new Date(expandedPin.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
              {(() => {
                const lines = expandedPin.content.split("\n");
                return (
                  <>
                    <h2 className="font-display italic text-3xl text-foreground mb-6 leading-snug">{lines[0]}</h2>
                    {lines.slice(1).join("\n").trim() && (
                      <p className="font-body text-lg text-foreground/70 leading-relaxed whitespace-pre-wrap">{lines.slice(1).join("\n").trim()}</p>
                    )}
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[hsl(200,30%,96%)] via-[hsl(210,25%,97%)] to-background border-b border-[hsl(200,25%,88%)]">
        <AIHubDeco />
        <div className="max-w-3xl mx-auto px-6 pt-8 pb-10 relative z-10">
          <Link to="/home" className="inline-flex items-center gap-2 font-body text-sm text-[hsl(200,25%,50%)] hover:text-foreground transition-colors mb-8">
            <ChevronLeft size={16} /> Back to home
          </Link>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[hsl(200,30%,92%)] flex items-center justify-center border border-[hsl(200,25%,85%)]">
                <Sparkles size={22} className="text-[hsl(200,50%,45%)]" />
              </div>
              <div className="w-px h-8 bg-[hsl(200,25%,85%)]" />
              <div className="flex items-center gap-1.5">
                <Zap size={11} className="text-[hsl(200,50%,55%)]" />
                <p className="font-mono text-[10px] tracking-[0.25em] text-[hsl(200,25%,50%)] uppercase">Intelligence & Ideas</p>
              </div>
            </div>
            <h1 className="font-display italic text-4xl md:text-5xl text-foreground leading-tight mb-3">
              AI Hub
            </h1>
            <p className="font-body text-base text-muted-foreground max-w-md">
              Learning notes, ideas, and explorations into the world of artificial intelligence.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <span className="font-mono text-xs text-[hsl(200,25%,50%)]">{aiPins.length} ideas</span>
              <div className="w-12 h-px bg-[hsl(200,25%,80%)]" />
              <motion.div className="flex gap-1" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[hsl(200,50%,55%)]" />
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {aiPins.length === 0 ? (
          <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Sparkles size={28} className="text-[hsl(200,25%,80%)] mx-auto mb-3" />
            <p className="font-display italic text-muted-foreground text-lg">no ideas yet</p>
            <p className="font-body text-sm text-muted-foreground/40 mt-1">tag an entry with "idea" from the home page</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {aiPins.map((pin, idx) => (
              <motion.div
                key={pin.id}
                onClick={() => setExpandedPinId(pin.id)}
                className="rounded-2xl border border-[hsl(200,20%,88%)] bg-card p-5 cursor-pointer hover:bg-[hsl(200,25%,97%)] hover:border-[hsl(200,30%,78%)] transition-all group"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[hsl(200,30%,92%)] flex items-center justify-center shrink-0 mt-0.5">
                    <Lightbulb size={13} className="text-[hsl(200,50%,45%)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-foreground">{pin.content.split("\n")[0]}</p>
                    {pin.content.split("\n").length > 1 && (
                      <p className="font-body text-xs text-muted-foreground/60 mt-1 line-clamp-2">{pin.content.split("\n").slice(1).join(" ").trim()}</p>
                    )}
                    <p className="font-mono text-[10px] text-muted-foreground/40 mt-2">
                      {new Date(pin.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <ChevronLeft size={14} className="text-muted-foreground/20 rotate-180 group-hover:text-[hsl(200,40%,50%)] transition-colors shrink-0 mt-1" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIHub;
