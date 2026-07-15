import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  ExternalLink,
  FileText,
  ListChecks,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deriveArticleInsights } from "./article-insights";
import type { PremiumArticle } from "./mockData";

interface ReadViewModalProps {
  article: PremiumArticle | null;
  onClose: () => void;
}

function sourceParagraphs(text: string) {
  const sentences = text.replace(/\s+/g, " ").match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [text];
  const paragraphs: string[] = [];
  for (let index = 0; index < sentences.length; index += 3) {
    paragraphs.push(sentences.slice(index, index + 3).join(" ").trim());
  }
  return paragraphs.filter(Boolean);
}

function formatSummary(article: PremiumArticle, summary: string, points: string[]) {
  return `${article.title}\n\nExecutive Summary\n${summary}\n\nKey Takeaways\n${points.map((point) => `• ${point}`).join("\n")}\n\nSource: ${article.source}`;
}

export default function ReadViewModal({ article, onClose }: ReadViewModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [saved, setSaved] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const insights = useMemo(() => article ? deriveArticleInsights(article) : null, [article]);
  const paragraphs = useMemo(() => article ? sourceParagraphs(article.fullContent || article.description) : [], [article]);

  const updateProgress = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    const available = element.scrollHeight - element.clientHeight;
    setProgress(available > 0 ? Math.min(100, Math.round((element.scrollTop / available) * 100)) : 0);
  }, []);

  useEffect(() => {
    if (!article) return;
    const savedArticles = new Set(JSON.parse(localStorage.getItem("daily-insight-saved") ?? "[]") as string[]);
    setSaved(savedArticles.has(article.id));
    setProgress(0);
    setSummaryExpanded(true);

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

  if (!article || !insights) return null;

  const summaryText = formatSummary(article, insights.executiveSummary, insights.bulletSummary);
  const toggleSaved = () => {
    const savedArticles = new Set(JSON.parse(localStorage.getItem("daily-insight-saved") ?? "[]") as string[]);
    if (saved) savedArticles.delete(article.id); else savedArticles.add(article.id);
    localStorage.setItem("daily-insight-saved", JSON.stringify([...savedArticles]));
    setSaved(!saved);
  };
  const copySummary = async () => {
    await navigator.clipboard?.writeText(summaryText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  const shareSummary = async () => {
    if (navigator.share) {
      await navigator.share({ title: article.title, text: summaryText, url: article.url });
    } else {
      await copySummary();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={scrollRef}
        onScroll={updateProgress}
        className="fixed inset-0 z-50 overflow-y-auto bg-[#070b14] text-white [scrollbar-gutter:stable]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      >
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
            <Button variant="ghost" onClick={onClose} className="gap-2 rounded-lg px-3 text-slate-200 hover:text-white" aria-label="Back to articles">
              <ArrowLeft className="h-4 w-4" /><span className="hidden sm:inline">Back</span>
            </Button>
            <p className="min-w-0 flex-1 truncate text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{article.source}</p>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={toggleSaved} className={saved ? "text-amber-300" : "text-slate-300"} aria-label={saved ? "Remove saved article" : "Save article"}>
                <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
              </Button>
              <Button variant="ghost" size="icon" onClick={shareSummary} className="text-slate-300" aria-label="Share summary"><Share2 className="h-4 w-4" /></Button>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="hidden sm:block">
                <Button className="h-9 rounded-lg px-3 text-xs">Read Original <ExternalLink className="ml-1.5 h-3.5 w-3.5" /></Button>
              </a>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-300" aria-label="Close reader"><X className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="h-0.5 bg-white/5"><div className="h-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 transition-[width] duration-150" style={{ width: `${progress}%` }} /></div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
          <article className="mx-auto max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Badge className="border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">{article.category}</Badge>
              <span className="flex items-center gap-2 text-sm text-slate-400"><span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-[10px] font-black text-cyan-100">{article.source.slice(0, 2).toUpperCase()}</span>{article.source}</span>
            </div>
            <h1 className="text-balance text-3xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">{article.title}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-300 sm:text-xl">{article.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-white/10 py-4 text-sm text-slate-400">
              <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-cyan-200" />{new Date(article.publishedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</span>
              <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-cyan-200" />{article.readingTimeMinutes} min read</span>
              <span>{progress}% read</span>
            </div>
            {article.imageUrl && <img src={article.imageUrl} alt="" className="mt-8 aspect-[16/9] w-full rounded-2xl border border-white/10 object-cover shadow-2xl shadow-black/30" />}

            <section className="mt-10 overflow-hidden rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/[0.12] via-slate-900 to-violet-500/[0.10] shadow-xl shadow-cyan-950/20">
              <div className="p-5 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200"><Sparkles className="h-4 w-4" />Article brief</p><h2 className="mt-2 text-2xl font-black text-white">Executive Summary</h2></div>
                  <div className="flex gap-1"><Button variant="ghost" size="icon" onClick={copySummary} className="h-9 w-9 text-slate-300" aria-label="Copy summary">{copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}</Button><Button variant="ghost" size="icon" onClick={shareSummary} className="h-9 w-9 text-slate-300" aria-label="Share summary"><Share2 className="h-4 w-4" /></Button></div>
                </div>
                <div className={summaryExpanded ? "" : "line-clamp-3"}><p className="mt-5 text-base leading-8 text-slate-100">{insights.executiveSummary}</p></div>
                <button onClick={() => setSummaryExpanded(!summaryExpanded)} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-cyan-200 hover:text-cyan-100">{summaryExpanded ? "Collapse" : "Read more"}<ChevronDown className={`h-4 w-4 transition-transform ${summaryExpanded ? "rotate-180" : ""}`} /></button>
              </div>
              <div className="border-t border-white/10 bg-black/10 p-5 sm:p-7"><h2 className="flex items-center gap-2 text-lg font-black text-white"><ListChecks className="h-5 w-5 text-emerald-300" />Key Takeaways</h2><ul className="mt-4 grid gap-3 sm:grid-cols-2">{insights.bulletSummary.map((point, index) => <li key={`${index}-${point}`} className="flex gap-3 rounded-xl border border-white/10 bg-slate-950/40 p-3 text-sm leading-6 text-slate-100"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-300" />{point}</li>)}</ul></div>
            </section>

            <section className="mt-8 grid gap-4 sm:grid-cols-2">
              <InsightCard title="Key Facts" icon={<FileText className="h-4 w-4" />} items={insights.keyFacts} empty="No additional facts are available in the retrieved text." />
              <InsightCard title="People, companies & places" icon={<Bookmark className="h-4 w-4" />} items={insights.namedTerms} empty="No named terms could be safely extracted from the retrieved text." />
              <InsightCard title="Numbers & statistics" icon={<Copy className="h-4 w-4" />} items={insights.numbers} empty="No specific numbers appear in the retrieved text." />
              <InsightCard title="Timeline" icon={<CalendarDays className="h-4 w-4" />} items={insights.timeline.map((item) => `${item.date} — ${item.event}`)} empty="No dated sequence of events is stated in the retrieved text." />
            </section>

            <section className="mt-12 border-t border-white/10 pt-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Source text</p>
              <div className="mt-5 space-y-6 text-[1.06rem] leading-8 text-slate-200 sm:text-lg sm:leading-9">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex"><Button className="h-12 rounded-xl px-5">Read Original Article <ExternalLink className="ml-2 h-4 w-4" /></Button></a>
              <p className="mt-4 text-xs leading-5 text-slate-500">This reader summarizes only the source text retrieved for this article. Open the publisher link for the full original article.</p>
            </section>
          </article>
        </main>
      </motion.div>
    </AnimatePresence>
  );
}

function InsightCard({ title, icon, items, empty }: { title: string; icon: ReactNode; items: string[]; empty: string }) {
  return <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5"><h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.15em] text-cyan-100">{icon}{title}</h2>{items.length ? <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-200">{items.map((item, index) => <li key={`${index}-${item}`} className="border-l-2 border-cyan-300/30 pl-3">{item}</li>)}</ul> : <p className="mt-4 text-sm leading-6 text-slate-500">{empty}</p>}</section>;
}
