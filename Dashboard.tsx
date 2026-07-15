import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Atom,
  Banknote,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  GraduationCap,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ArticleCard from "./ArticleCard";
import ReadViewModal from "./ReadViewModal";
import { mockArticles, type ArticleCategory, type PremiumArticle } from "./mockData";
import { getLiveArticles } from "./news-api";

const CATEGORIES: Array<{
  name: ArticleCategory;
  icon: LucideIcon;
  color: string;
  accent: string;
}> = [
  {
    name: "Technology",
    icon: BrainCircuit,
    color: "from-cyan-300 to-blue-500",
    accent: "text-cyan-200",
  },
  {
    name: "Science",
    icon: Atom,
    color: "from-emerald-300 to-cyan-500",
    accent: "text-emerald-200",
  },
  {
    name: "Research",
    icon: BookOpenCheck,
    color: "from-violet-300 to-fuchsia-500",
    accent: "text-violet-200",
  },
  {
    name: "Finance",
    icon: Banknote,
    color: "from-lime-300 to-emerald-500",
    accent: "text-lime-200",
  },
  {
    name: "Economics",
    icon: BarChart3,
    color: "from-amber-300 to-rose-500",
    accent: "text-amber-200",
  },
  {
    name: "IAS Prep",
    icon: GraduationCap,
    color: "from-sky-300 to-indigo-500",
    accent: "text-sky-200",
  },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ArticleCategory>("Technology");
  const [selectedArticle, setSelectedArticle] = useState<PremiumArticle | null>(null);
  const [liveArticles, setLiveArticles] = useState<PremiumArticle[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    getLiveArticles(controller.signal)
      .then((nextArticles) => setLiveArticles(nextArticles))
      .catch((error: unknown) => console.warn("[news] Falling back to prepared articles:", error));
    return () => controller.abort();
  }, []);

  const articles = useMemo(() => {
    const source = liveArticles.length ? liveArticles : mockArticles;
    return [...source].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [liveArticles]);

  const filteredArticles = articles
    .filter((article) => article.category === activeCategory)
    .filter((article) => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;

      return [article.title, article.description, article.fullContent, article.source, ...article.tags]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });

  const currentCategory = CATEGORIES.find((category) => category.name === activeCategory)!;
  const CurrentIcon = currentCategory.icon;

  return (
    <div className="min-h-screen overflow-hidden bg-[#05070d] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(244,63,94,0.13),transparent_34%),linear-gradient(135deg,#05070d_0%,#0f172a_54%,#111827_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/55 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex min-w-0 items-center gap-3 text-left"
            aria-label="Back to top"
          >
            <div className="grid h-11 w-11 flex-none place-items-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 shadow-lg shadow-cyan-500/10">
              <Sparkles className="h-5 w-5 text-cyan-200" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-black tracking-normal text-white">
                Daily Insight
              </h1>
              <p className="truncate text-xs font-medium text-slate-400">
                Free-source news, research, markets, and exam-ready context
              </p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveCategory("IAS Prep")}
              className="rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              aria-label="Open IAS prep lane"
            >
              <Settings className="h-5 w-5" />
            </Button>

            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 sm:flex">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-300 to-emerald-300" />
              <span className="text-sm font-semibold text-slate-100">Daily Reader</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">
              <Zap className="h-4 w-4" />
              arXiv, NewsAPI, and Alpha Vantage ready
            </div>
            <h2 className="max-w-4xl text-4xl font-black leading-tight text-white sm:text-6xl">
              Premium daily intelligence for tech, economics, science, and policy.
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Open any article to read the full source text, switch into a clean summary, or
              study 3 to 5 key takeaways without leaving the dashboard.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
              Today&apos;s coverage
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div>
                <p className="text-3xl font-black text-white">{articles.length}</p>
                <p className="text-xs text-slate-400">items</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">{CATEGORIES.length}</p>
                <p className="text-xs text-slate-400">lanes</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">3</p>
                <p className="text-xs text-slate-400">free APIs</p>
              </div>
            </div>
          </div>
        </section>

        <section className="sticky top-[77px] z-30 mt-8 space-y-4 border-y border-white/10 bg-slate-950/70 py-4 backdrop-blur-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search AI, inflation, markets, governance, research..."
              className="h-12 rounded-2xl border-white/15 bg-white/10 pl-12 text-white placeholder:text-slate-500 focus:border-cyan-300"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.name;

              return (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`flex min-w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all ${
                    isActive
                      ? `border-transparent bg-gradient-to-r ${category.color} text-slate-950 shadow-lg`
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </section>

        <section className="py-10">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className={`mb-2 flex items-center gap-2 ${currentCategory.accent}`}>
                <CurrentIcon className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-[0.2em]">
                  {activeCategory}
                </span>
              </div>
              <h3 className="text-3xl font-black text-white">Curated Updates</h3>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">
              Each card uses a full-content field, a verified summary field, and structured
              bullet points so future AI summarization can stay grounded in source text.
            </p>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] py-16 text-center backdrop-blur-xl">
              <Zap className="mx-auto mb-4 h-12 w-12 text-slate-500" />
              <p className="text-lg text-slate-300">
                No articles found. Try another search or category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredArticles.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  id={index}
                  title={article.title}
                  description={article.description}
                  source={article.source}
                  publishedAt={new Date(article.publishedAt)}
                  imageUrl={article.imageUrl}
                  category={article.category}
                  url={article.url}
                  readingTimeMinutes={article.readingTimeMinutes}
                  onOpen={() => setSelectedArticle(article)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="border-t border-white/10 py-10">
          <div className="mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-cyan-200" />
            <h3 className="text-2xl font-black text-white">High-Signal Queue</h3>
          </div>
          <div className="grid gap-3">
            {articles.slice(0, 5).map((article, index) => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-left backdrop-blur-xl transition-all hover:border-cyan-300/40 hover:bg-white/[0.08]"
              >
                <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-cyan-300/10 text-sm font-black text-cyan-100">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 font-bold text-white group-hover:text-cyan-100">
                    {article.title}
                  </span>
                  <span className="mt-1 block text-sm text-slate-400">
                    {article.category} / {article.sourceHook.provider}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>

      <ReadViewModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
}
