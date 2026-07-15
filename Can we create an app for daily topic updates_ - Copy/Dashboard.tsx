import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Search, Settings, Bookmark, Share2, TrendingUp, Clock, ExternalLink, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import ArticleCard from "@/components/ArticleCard";

const CATEGORIES = [
  { name: "Technology", icon: "💻", color: "from-purple-500 to-pink-600" },
  { name: "Science", icon: "🔬", color: "from-cyan-500 to-blue-600" },
  { name: "Research", icon: "📚", color: "from-indigo-500 to-purple-600" },
  { name: "Finance", icon: "💰", color: "from-green-500 to-emerald-600" },
  { name: "Economics", icon: "📊", color: "from-orange-500 to-red-600" },
];

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Technology");

  // Fetch data from aggregation APIs
  const allDataQuery = trpc.data.all.useQuery();
  // Trending derived from all articles

  const isLoading = allDataQuery.isLoading;

  // Filter articles by category and search
  const filteredArticles = (allDataQuery.data || [])
    .filter((article) => article.category === activeCategory)
    .filter(
      (article) =>
        !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const currentCategory = CATEGORIES.find((c) => c.name === activeCategory);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 sticky top-0 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center font-bold">
              📊
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Daily Insight
              </h1>
              <p className="text-xs text-slate-400">Curated updates from top sources</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings")}
              className="hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <Settings className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full" />
              <span className="text-sm font-medium">{user?.name || "User"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search articles..."
              className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-32 z-40 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 min-w-max py-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat.name
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20"
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Category Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2">{activeCategory} Updates</h2>
          <p className="text-slate-400">Latest stories and research from top sources</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <Zap size={48} className="mx-auto text-slate-500 mb-4" />
            <p className="text-slate-400 text-lg">
              {searchQuery
                ? "No articles found. Try a different search."
                : "No articles available. Check back soon!"}
            </p>
          </div>
        ) : (
          <>
            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {filteredArticles.map((article, index) => (
                <ArticleCard
                  key={`${article.source}-${index}`}
                  id={index}
                  title={article.title}
                  description={article.description}
                  source={article.source}
                  publishedAt={new Date(article.publishedAt)}
                  imageUrl={article.imageUrl}
                  category={article.category}
                  url={article.url}
                  readingTimeMinutes={Math.ceil(
                    (article.description.length + (article.content?.length || 0)) / 200
                  )}
                />
              ))}
            </div>

            {/* Trending Section */}
            {filteredArticles.length > 0 && (
              <section className="mt-20 pt-20 border-t border-white/10">
                <div className="flex items-center gap-2 mb-8">
                  <TrendingUp className="w-6 h-6 text-pink-400" />
                  <h2 className="text-3xl font-bold">Trending Now</h2>
                </div>

                <div className="grid gap-4">
                  {filteredArticles.slice(0, 5).map((article: any, i: number) => (
                    <a
                      key={article.id}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-6 rounded-xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10 hover:border-pink-400/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 flex items-center gap-4"
                    >
                      <div className="text-2xl font-bold text-pink-400 min-w-fit">#{i + 1}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1 group-hover:text-pink-300 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-slate-400">{article.source}</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-pink-400 transition-colors flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
