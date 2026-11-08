import {
  ArrowRight,
  Atom,
  Banknote,
  BookOpenCheck,
  BrainCircuit,
  GraduationCap,
  Menu,
  Search,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import ArticleCard from "./ArticleCard";
import ReadViewModal from "./ReadViewModal";
import { mockArticles, type ArticleCategory, type PremiumArticle } from "./mockData";
import { getLiveArticles } from "./news-api";

const CATEGORIES: Array<{ name: ArticleCategory; icon: LucideIcon }> = [
  { name: "Technology", icon: BrainCircuit },
  { name: "Science", icon: Atom },
  { name: "Research", icon: BookOpenCheck },
  { name: "Finance", icon: Banknote },
  { name: "Economics", icon: Banknote },
  { name: "IAS Prep", icon: GraduationCap },
];

function relativeUpdate(time: Date | null) {
  if (!time) return "Loading latest sources";
  const minutes = Math.max(0, Math.floor((Date.now() - time.getTime()) / 60_000));
  return minutes < 1 ? "Updated just now" : `Updated ${minutes} min ago`;
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ArticleCategory>("Technology");
  const [selectedArticle, setSelectedArticle] = useState<PremiumArticle | null>(null);
  const [liveArticles, setLiveArticles] = useState<PremiumArticle[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLiveError, setHasLiveError] = useState(false);

  const refreshArticles = useCallback(async () => {
    setIsLoading(true);
    setHasLiveError(false);
    try {
      const articles = await getLiveArticles();
      setLiveArticles(articles);
      setLastUpdated(new Date());
    } catch {
      setHasLiveError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshArticles();
  }, [refreshArticles]);

  const articles = useMemo(() => {
    const source = liveArticles.length ? liveArticles : mockArticles;
    return [...source].sort((first, second) => Date.parse(second.publishedAt) - Date.parse(first.publishedAt));
  }, [liveArticles]);

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return articles
      .filter((article) => article.category === activeCategory)
      .filter((article) => !query || [article.title, article.description, article.source, ...article.tags]
        .join(" ")
        .toLowerCase()
        .includes(query));
  }, [activeCategory, articles, searchQuery]);

  const leadArticle = filteredArticles[0];
  const remainingArticles = filteredArticles.slice(1);
  const liveLabel = liveArticles.length ? relativeUpdate(lastUpdated) : "Prepared briefing";

  return (
    <div className="min-h-[100dvh] bg-[#f4f2ed] text-slate-950">
      <header className="border-b border-slate-300 bg-[#f4f2ed]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3 text-left">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-white"><Sparkles className="h-4 w-4" /></span>
            <span>
              <span className="block font-serif text-xl font-black tracking-[-0.045em]">Daily Insight</span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">The daily briefing</span>
            </span>
          </button>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex" aria-label="Primary navigation">
            <a href="#briefing" className="hover:text-blue-700">Briefing</a>
            <a href="#stories" className="hover:text-blue-700">Stories</a>
            <a href="#sources" className="hover:text-blue-700">Sources</a>
          </nav>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-slate-300 text-slate-800 md:hidden" aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <section id="briefing" className="border-b border-slate-300 py-10 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
            <div>
              <p className="text-sm font-bold text-blue-700">{liveLabel}</p>
              <h1 className="mt-3 max-w-4xl text-balance font-serif text-5xl font-black leading-[0.94] tracking-[-0.055em] sm:text-7xl">
                Know what matters before the day gets loud.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                A source-aware briefing for technology, markets, science, economics, and policy.
              </p>
            </div>
            <div className="border-t border-slate-300 pt-5 text-sm leading-6 text-slate-600 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <p className="font-semibold text-slate-950">{articles.length} stories in today&apos;s collection.</p>
              <p className="mt-2">Every story links back to the original publisher. RSS coverage is shown as an excerpt, not a full article.</p>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-300 py-5" aria-label="Browse topics">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {CATEGORIES.map(({ name, icon: Icon }) => {
              const isActive = activeCategory === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setActiveCategory(name)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive ? "bg-slate-950 text-white" : "bg-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-950"
                  }`}
                  aria-pressed={isActive}
                >
                  <Icon className="h-4 w-4" />{name}
                </button>
              );
            })}
          </div>
        </section>

        <section className="py-7 sm:py-10">
          <label className="relative block max-w-xl">
            <span className="sr-only">Search today&apos;s stories</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search this briefing"
              className="h-12 w-full rounded-full border border-slate-300 bg-white py-2 pl-12 pr-4 text-slate-950 placeholder:text-slate-500 focus:border-blue-700 focus:outline-none"
            />
          </label>
          {hasLiveError && (
            <div role="status" className="mt-4 flex flex-wrap items-center justify-between gap-3 border-l-2 border-blue-700 bg-blue-50 px-4 py-3 text-sm text-blue-950">
              <span>Live sources are temporarily unavailable. You are reading the prepared briefing.</span>
              <button type="button" onClick={() => void refreshArticles()} className="font-bold underline underline-offset-4">Try again</button>
            </div>
          )}
        </section>

        {isLoading && !liveArticles.length ? <LoadingBriefing /> : leadArticle ? (
          <>
            <section className="grid gap-8 border-b border-slate-300 pb-10 lg:grid-cols-[1.45fr_0.55fr] lg:gap-12">
              <article>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">Lead story · {leadArticle.category}</p>
                <button type="button" onClick={() => setSelectedArticle(leadArticle)} className="mt-4 text-left">
                  <h2 className="text-balance font-serif text-4xl font-black leading-[0.98] tracking-[-0.045em] text-slate-950 transition-colors hover:text-blue-700 sm:text-6xl">{leadArticle.title}</h2>
                  <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{leadArticle.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-bold text-blue-700">Read the brief <ArrowRight className="h-4 w-4" /></span>
                </button>
              </article>
              <aside id="sources" className="border-t border-slate-300 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">How to read this</p>
                <p className="mt-4 font-serif text-2xl font-black leading-tight">Fast context. Clear sources.</p>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                  <li>Open a brief for the source excerpt and key points.</li>
                  <li>Use the publisher link for the complete original reporting.</li>
                  <li>Switch topics without losing your place in the briefing.</li>
                </ul>
              </aside>
            </section>

            <section id="stories" className="py-10">
              <div className="flex items-end justify-between gap-4 border-b border-slate-300 pb-4">
                <div>
                  <p className="text-sm font-bold text-blue-700">{activeCategory}</p>
                  <h2 className="mt-1 font-serif text-3xl font-black tracking-[-0.04em]">More to read</h2>
                </div>
                <p className="text-sm text-slate-500">{remainingArticles.length} stories</p>
              </div>
              <div className="mt-6 grid gap-x-8 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
                {remainingArticles.map((article, index) => (
                  <ArticleCard
                    key={article.id}
                    id={index}
                    title={article.title}
                    description={article.description}
                    source={article.source}
                    publishedAt={new Date(article.publishedAt)}
                    category={article.category}
                    url={article.url}
                    readingTimeMinutes={article.readingTimeMinutes}
                    onOpen={() => setSelectedArticle(article)}
                  />
                ))}
              </div>
            </section>
          </>
        ) : <EmptyBriefing category={activeCategory} query={searchQuery} />}
      </main>

      <ReadViewModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
}

function LoadingBriefing() {
  return <div className="animate-pulse border-y border-slate-300 py-10" aria-busy="true" aria-label="Loading latest stories"><div className="h-4 w-28 bg-slate-300" /><div className="mt-5 h-16 max-w-3xl bg-slate-300" /><div className="mt-8 grid gap-6 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-48 border-t border-slate-300 pt-5"><div className="h-5 w-20 bg-slate-300" /><div className="mt-4 h-20 bg-slate-200" /></div>)}</div></div>;
}

function EmptyBriefing({ category, query }: { category: string; query: string }) {
  return <section className="border-y border-slate-300 py-16 text-center"><p className="text-sm font-bold text-blue-700">No matching stories</p><h2 className="mt-2 font-serif text-3xl font-black">Try another topic or search.</h2><p className="mx-auto mt-4 max-w-md text-slate-600">There are no {category} stories matching “{query}” in this briefing.</p></section>;
}
