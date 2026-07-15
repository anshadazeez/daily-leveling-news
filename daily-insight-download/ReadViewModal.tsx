import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  ListChecks,
  Sparkles,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PremiumArticle } from "./mockData";

type ReadMode = "full" | "summary" | "bullets";

interface ReadViewModalProps {
  article: PremiumArticle | null;
  onClose: () => void;
}

const modeCopy: Record<ReadMode, { label: string; icon: LucideIcon }> = {
  full: { label: "Full Text", icon: FileText },
  summary: { label: "Summarize", icon: Sparkles },
  bullets: { label: "Bullet Points", icon: ListChecks },
};

export default function ReadViewModal({ article, onClose }: ReadViewModalProps) {
  const [mode, setMode] = useState<ReadMode>("full");

  useEffect(() => {
    setMode("full");
  }, [article?.id]);

  useEffect(() => {
    if (!article) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [article, onClose]);

  return (
    <AnimatePresence>
      {article && (
      <motion.div
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 p-4 text-white backdrop-blur-2xl sm:p-6 lg:p-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.24 }}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/3 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        </motion.div>

        <motion.article
          className="relative mx-auto min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-2xl border border-white/15 bg-slate-950/70 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:min-h-[calc(100vh-3rem)]"
          initial={{ y: 36, scale: 0.98, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 24, scale: 0.98, opacity: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 24 }}
        >
          <div className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 px-5 py-4 backdrop-blur-2xl sm:px-7">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-10 w-10 flex-none place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
                  <BookOpen className="h-5 w-5 text-cyan-200" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                    {article.sourceHook.provider}
                  </p>
                  <p className="truncate text-sm text-slate-400">
                    {article.source} / {new Date(article.publishedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                    aria-label="Open source"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  aria-label="Close read view"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-8 px-5 py-7 sm:px-7 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-10 lg:py-10">
            <main className="min-w-0">
              <div className="mb-5 flex flex-wrap gap-2">
                <Badge className="border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                  {article.category}
                </Badge>
                <Badge className="border border-emerald-300/20 bg-emerald-300/10 text-emerald-100">
                  {article.relevance}
                </Badge>
                <Badge className="border border-white/10 bg-white/5 text-slate-200">
                  {article.readingTimeMinutes} min read
                </Badge>
              </div>

              <motion.h1
                className="max-w-4xl text-3xl font-black leading-tight text-white sm:text-5xl"
                layoutId={`article-title-${article.id}`}
              >
                {article.title}
              </motion.h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                {article.description}
              </p>

              <div className="my-7 grid grid-cols-2 gap-3 sm:flex">
                {(["summary", "bullets"] as ReadMode[]).map((nextMode) => {
                  const Icon = modeCopy[nextMode].icon;
                  const isActive = mode === nextMode;

                  return (
                    <Button
                      key={nextMode}
                      onClick={() => setMode(nextMode)}
                      className={`h-12 rounded-xl border px-5 font-bold shadow-lg transition-all ${
                        isActive
                          ? "border-cyan-300/40 bg-cyan-300 text-slate-950 shadow-cyan-500/20 hover:bg-cyan-200"
                          : "border-white/10 bg-white/10 text-white hover:border-white/20 hover:bg-white/15"
                      }`}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {modeCopy[nextMode].label}
                    </Button>
                  );
                })}
                <Button
                  onClick={() => setMode("full")}
                  className={`col-span-2 h-12 rounded-xl border px-5 font-bold sm:col-span-1 ${
                    mode === "full"
                      ? "border-white/30 bg-white text-slate-950 hover:bg-slate-100"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Full Text
                </Button>
              </div>

              <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7">
                <AnimatePresence mode="wait">
                  {mode === "full" && (
                    <motion.div
                      key="full"
                      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
                      transition={{ duration: 0.28 }}
                    >
                      <p className="text-lg font-semibold text-white">Original text / abstract</p>
                      <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-200">
                        {article.fullContent}
                      </p>
                    </motion.div>
                  )}

                  {mode === "summary" && (
                    <motion.div
                      key="summary"
                      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
                      transition={{ duration: 0.28 }}
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-cyan-200" />
                        <p className="text-lg font-semibold text-white">Comprehensive summary</p>
                      </div>
                      <p className="mt-4 text-base leading-8 text-slate-100">
                        {article.summaryText}
                      </p>
                    </motion.div>
                  )}

                  {mode === "bullets" && (
                    <motion.div
                      key="bullets"
                      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
                      transition={{ duration: 0.28 }}
                    >
                      <div className="flex items-center gap-3">
                        <ListChecks className="h-5 w-5 text-emerald-200" />
                        <p className="text-lg font-semibold text-white">Key takeaways</p>
                      </div>
                      <ul className="mt-5 space-y-4">
                        {article.bulletPoints.map((point) => (
                          <motion.li
                            key={point}
                            className="flex gap-3 rounded-xl border border-white/10 bg-slate-950/40 p-4 text-slate-100"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-300" />
                            <span className="leading-7">{point}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </main>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                  Free Source Hook
                </p>
                <p className="mt-3 text-sm font-semibold text-white">
                  {article.sourceHook.provider}
                </p>
                <p className="mt-2 break-words text-xs leading-6 text-slate-400">
                  {article.sourceHook.endpoint}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Raw field: <span className="text-cyan-200">{article.sourceHook.rawTextField}</span>
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {article.sourceHook.notes}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                  Tags
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </motion.article>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
