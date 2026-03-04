import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, ChevronLeft, Pen, BookMarked, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useJournalEntries } from "@/hooks/use-journal";
import type { PinItem } from "@/hooks/use-journal";

const REFLECTION_TAGS: Record<string, { label: string; icon: any; color: string }> = {
  journal: { label: "Journal", icon: BookMarked, color: "bg-[hsl(270,25%,92%)] text-[hsl(270,20%,40%)]" },
  note: { label: "Note", icon: Pen, color: "bg-[hsl(38,25%,91%)] text-[hsl(30,18%,40%)]" },
  random: { label: "Random", icon: Sparkles, color: "bg-[hsl(320,25%,92%)] text-[hsl(320,20%,40%)]" },
};

// Decorative flowing lines SVG for reflections
const ReflectionsDeco = () => (
  <svg className="absolute right-0 top-0 h-full w-1/3 opacity-[0.06] pointer-events-none" viewBox="0 0 200 300" fill="none" stroke="hsl(270,30%,40%)" strokeWidth="1.2">
    <path d="M180 0 C140 50, 60 80, 100 150 S180 220, 120 300" />
    <path d="M200 20 C160 70, 80 100, 120 170 S200 240, 140 300" />
    <path d="M160 0 C120 60, 40 90, 80 160 S160 230, 100 300" />
    <circle cx="100" cy="150" r="30" strokeDasharray="4 6" />
    <circle cx="140" cy="80" r="15" strokeDasharray="3 5" />
  </svg>
);

const Reflections = () => {
  const { pins } = useJournalEntries();
  const [expandedTag, setExpandedTag] = useState<string | null>(null);
  const [expandedPinId, setExpandedPinId] = useState<string | null>(null);

  const reflectionTags = ["journal", "note", "random"];
  const reflectionPins = pins.filter(p => !p.archived && p.tags.some(t => reflectionTags.includes(t)));

  const grouped: Record<string, PinItem[]> = {};
  reflectionPins.forEach(p => {
    const tag = p.tags.find(t => reflectionTags.includes(t)) || "note";
    if (!grouped[tag]) grouped[tag] = [];
    grouped[tag].push(p);
  });

  const expandedPin = expandedPinId ? pins.find(p => p.id === expandedPinId) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Expanded pin overlay */}
      <AnimatePresence>
        {expandedPin && (
          <motion.div key="pin-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background overflow-y-auto">
            <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md px-5 py-4 flex items-center border-b border-[hsl(270,20%,85%)]">
              <button onClick={() => setExpandedPinId(null)} className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft size={18} /> Back
              </button>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-2xl mx-auto px-6 py-8">
              {expandedPin.tags[0] && REFLECTION_TAGS[expandedPin.tags[0]] && (
                <div className="flex items-center gap-2 mb-4">
                  {(() => { const Icon = REFLECTION_TAGS[expandedPin.tags[0]]?.icon; return Icon ? <Icon size={16} className="text-[hsl(270,30%,55%)]" /> : null; })()}
                  <span className="font-body text-xs tracking-[0.2em] text-[hsl(270,30%,55%)] uppercase">{REFLECTION_TAGS[expandedPin.tags[0]]?.label}</span>
                </div>
              )}
              <p className="font-body text-xs text-muted-foreground/40 mb-6">
                {new Date(expandedPin.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
              {(() => {
                const lines = expandedPin.content.split("\n");
                const title = lines[0];
                const body = lines.slice(1).join("\n").trim();
                return (
                  <>
                    <h2 className="font-display italic text-3xl text-foreground mb-6 leading-snug">{title}</h2>
                    {body && <p className="font-body text-lg text-foreground/70 leading-relaxed whitespace-pre-wrap">{body}</p>}
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[hsl(270,25%,96%)] via-[hsl(280,20%,97%)] to-background border-b border-[hsl(270,20%,88%)]">
        <ReflectionsDeco />
        <div className="max-w-3xl mx-auto px-6 pt-8 pb-10 relative z-10">
          <Link to="/home" className="inline-flex items-center gap-2 font-body text-sm text-[hsl(270,20%,55%)] hover:text-foreground transition-colors mb-8">
            <ChevronLeft size={16} /> Back to home
          </Link>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[hsl(270,25%,90%)] flex items-center justify-center border border-[hsl(270,20%,85%)]">
                <BookOpen size={22} className="text-[hsl(270,30%,45%)]" />
              </div>
              <div className="w-px h-8 bg-[hsl(270,20%,85%)]" />
              <p className="font-mono text-[10px] tracking-[0.25em] text-[hsl(270,20%,55%)] uppercase">Thoughts & Reflections</p>
            </div>
            <h1 className="font-display italic text-4xl md:text-5xl text-foreground leading-tight mb-3">
              Reflections & Thoughts
            </h1>
            <p className="font-body text-base text-muted-foreground max-w-md">
              On leaving finance, building startups, and figuring out life in your 20s.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <span className="font-mono text-xs text-[hsl(270,20%,55%)]">{reflectionPins.length} entries</span>
              <div className="w-12 h-px bg-[hsl(270,20%,80%)]" />
              <span className="font-mono text-xs text-muted-foreground/40">{Object.keys(grouped).length} categories</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {reflectionPins.length === 0 ? (
          <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <BookOpen size={28} className="text-[hsl(270,20%,80%)] mx-auto mb-3" />
            <p className="font-display italic text-muted-foreground text-lg">no reflections yet</p>
            <p className="font-body text-sm text-muted-foreground/40 mt-1">start writing from the home page</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {Object.entries(grouped).map(([tagKey, tagPins], groupIdx) => {
              const config = REFLECTION_TAGS[tagKey];
              const Icon = config?.icon;
              const isOpen = expandedTag === tagKey;
              return (
                <motion.div
                  key={tagKey}
                  className="rounded-2xl border border-[hsl(270,18%,88%)] bg-card overflow-hidden"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIdx * 0.08 }}
                  layout
                >
                  <button
                    onClick={() => setExpandedTag(isOpen ? null : tagKey)}
                    className="w-full flex items-center gap-3 p-5 hover:bg-[hsl(270,20%,97%)] transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${config?.color || "bg-muted"}`}>
                      {Icon && <Icon size={15} />}
                    </div>
                    <span className="font-body text-sm font-medium text-foreground flex-1 text-left">{config?.label || tagKey}</span>
                    <span className="font-mono text-[10px] text-[hsl(270,20%,60%)] mr-2">{tagPins.length}</span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={14} className="text-[hsl(270,20%,65%)]" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-[hsl(270,18%,90%)]"
                      >
                        <div className="p-3 space-y-1">
                          {tagPins.map(pin => (
                            <div key={pin.id} onClick={() => setExpandedPinId(pin.id)}
                              className="flex items-center justify-between py-3 px-4 rounded-xl cursor-pointer hover:bg-[hsl(270,20%,96%)] transition-colors group">
                              <div className="flex-1 min-w-0">
                                <p className="font-body text-sm text-foreground truncate">{pin.content.split("\n")[0]}</p>
                                <p className="font-body text-xs text-muted-foreground/50 mt-0.5">
                                  {new Date(pin.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                </p>
                              </div>
                              <ChevronLeft size={14} className="text-muted-foreground/20 rotate-180 group-hover:text-[hsl(270,25%,55%)] transition-colors shrink-0 ml-2" />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reflections;
