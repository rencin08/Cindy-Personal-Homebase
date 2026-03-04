import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ChevronLeft, Target, Check, Square, CheckSquare, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useJournalEntries } from "@/hooks/use-journal";

// Architectural blueprint decoration for projects
const ProjectsDeco = () => (
  <svg className="absolute right-0 top-0 h-full w-2/5 opacity-[0.05] pointer-events-none" viewBox="0 0 300 300" fill="none" stroke="hsl(25,40%,40%)" strokeWidth="1">
    <rect x="160" y="40" width="100" height="70" rx="4" />
    <line x1="160" y1="65" x2="260" y2="65" strokeDasharray="4 3" />
    <line x1="200" y1="40" x2="200" y2="110" strokeDasharray="4 3" />
    <rect x="180" y="140" width="70" height="50" rx="3" strokeDasharray="6 4" />
    <rect x="170" y="220" width="90" height="40" rx="3" />
    <line x1="215" y1="190" x2="215" y2="220" />
    <circle cx="215" cy="190" r="2" fill="hsl(25,40%,40%)" />
    <circle cx="215" cy="220" r="2" fill="hsl(25,40%,40%)" />
    <path d="M160 260 L170 260 L170 270" />
    <path d="M260 260 L250 260 L250 270" />
    <line x1="160" y1="275" x2="260" y2="275" strokeDasharray="2 6" />
  </svg>
);

const Projects = () => {
  const { pins } = useJournalEntries();
  const [expandedPinId, setExpandedPinId] = useState<string | null>(null);

  const projectPins = pins.filter(p => !p.archived && p.tags.includes("goals"));
  const expandedPin = expandedPinId ? pins.find(p => p.id === expandedPinId) : null;

  const totalMilestones = projectPins.reduce((sum, p) => sum + (p.checklist?.length || 0), 0);
  const completedMilestones = projectPins.reduce((sum, p) => sum + (p.checklist?.filter(c => c.checked).length || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Expanded pin overlay */}
      <AnimatePresence>
        {expandedPin && (
          <motion.div key="pin-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background overflow-y-auto">
            <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md px-5 py-4 flex items-center border-b border-[hsl(25,25%,85%)]">
              <button onClick={() => setExpandedPinId(null)} className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft size={18} /> Back
              </button>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-2xl mx-auto px-6 py-8">
              <div className="flex items-center gap-2 mb-4">
                <Target size={16} className="text-[hsl(25,45%,45%)]" />
                <span className="font-body text-xs tracking-[0.2em] text-[hsl(25,45%,45%)] uppercase">Goal</span>
              </div>
              <p className="font-body text-xs text-muted-foreground/40 mb-6">
                {new Date(expandedPin.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
              {(() => {
                const lines = expandedPin.content.split("\n");
                const hasChecklist = expandedPin.checklist && expandedPin.checklist.length > 0;
                return (
                  <>
                    <h2 className="font-display italic text-3xl text-foreground mb-6 leading-snug">{lines[0]}</h2>
                    {hasChecklist ? (
                      <div className="space-y-3">
                        {expandedPin.checklist!.map((ci, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            {ci.checked ? <CheckSquare size={18} className="text-[hsl(25,45%,45%)] shrink-0" /> : <Square size={18} className="text-muted-foreground/40 shrink-0" />}
                            <span className={`font-body text-base ${ci.checked ? "line-through text-muted-foreground/40" : "text-foreground"}`}>{ci.text || "..."}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      lines.slice(1).join("\n").trim() && (
                        <p className="font-body text-lg text-foreground/70 leading-relaxed whitespace-pre-wrap">{lines.slice(1).join("\n").trim()}</p>
                      )
                    )}
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[hsl(25,25%,96%)] via-[hsl(30,20%,97%)] to-background border-b border-[hsl(25,20%,88%)]">
        <ProjectsDeco />
        <div className="max-w-3xl mx-auto px-6 pt-8 pb-10 relative z-10">
          <Link to="/home" className="inline-flex items-center gap-2 font-body text-sm text-[hsl(25,20%,50%)] hover:text-foreground transition-colors mb-8">
            <ChevronLeft size={16} /> Back to home
          </Link>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[hsl(25,25%,90%)] flex items-center justify-center border border-[hsl(25,20%,84%)]">
                <Briefcase size={22} className="text-[hsl(25,40%,40%)]" />
              </div>
              <div className="w-px h-8 bg-[hsl(25,20%,84%)]" />
              <p className="font-mono text-[10px] tracking-[0.25em] text-[hsl(25,20%,50%)] uppercase">Building & Shipping</p>
            </div>
            <h1 className="font-display italic text-4xl md:text-5xl text-foreground leading-tight mb-3">
              Projects
            </h1>
            <p className="font-body text-base text-muted-foreground max-w-md">
              What I'm building — goals, milestones, and progress tracked.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <span className="font-mono text-xs text-[hsl(25,20%,50%)]">{projectPins.length} projects</span>
              <div className="w-12 h-px bg-[hsl(25,20%,80%)]" />
              {totalMilestones > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-[hsl(25,15%,90%)] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-[hsl(25,45%,50%)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedMilestones / totalMilestones) * 100}%` }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground/50">{completedMilestones}/{totalMilestones}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {projectPins.length === 0 ? (
          <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Briefcase size={28} className="text-[hsl(25,20%,80%)] mx-auto mb-3" />
            <p className="font-display italic text-muted-foreground text-lg">no projects yet</p>
            <p className="font-body text-sm text-muted-foreground/40 mt-1">tag an entry with "goals" from the home page</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {projectPins.map((pin, idx) => {
              const hasChecklist = pin.checklist && pin.checklist.length > 0;
              const completed = pin.checklist?.filter(c => c.checked).length || 0;
              const total = pin.checklist?.length || 0;
              return (
                <motion.div
                  key={pin.id}
                  onClick={() => setExpandedPinId(pin.id)}
                  className="rounded-2xl border border-[hsl(25,18%,88%)] bg-card overflow-hidden cursor-pointer hover:border-[hsl(25,25%,78%)] transition-all group"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Target size={14} className="text-[hsl(25,35%,50%)] shrink-0" />
                          <p className="font-body text-sm font-medium text-foreground truncate">{pin.content.split("\n")[0]}</p>
                        </div>
                        <p className="font-mono text-[10px] text-muted-foreground/40">
                          {new Date(pin.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <ArrowUpRight size={14} className="text-muted-foreground/20 group-hover:text-[hsl(25,35%,45%)] transition-colors shrink-0 mt-1" />
                    </div>
                    {hasChecklist && (
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/30">
                        <div className="flex-1 h-1.5 rounded-full bg-[hsl(25,15%,92%)] overflow-hidden">
                          <div className="h-full rounded-full bg-[hsl(25,45%,50%)] transition-all" style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }} />
                        </div>
                        <span className="font-mono text-[10px] text-[hsl(25,20%,50%)]">{completed}/{total}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
