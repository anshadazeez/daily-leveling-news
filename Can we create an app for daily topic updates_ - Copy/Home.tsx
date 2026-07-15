import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, BookOpen, DollarSign, Microscope } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    return null; // Redirect to dashboard in App.tsx
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center font-bold text-lg">
            📊
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Daily Insight
          </span>
        </div>
        <a href={getLoginUrl()}>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-full px-8 font-semibold">
            Sign In
          </Button>
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 md:px-12 py-20 md:py-32 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">AI-Powered News Curation</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-tight">
                Stay Ahead with{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Daily Insight
                </span>
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                Curated daily updates from the world's most reputable sources. Science, Technology, Finance, Economics, and Research - all in one stunning dashboard.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href={getLoginUrl()}>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-full px-8 py-6 text-lg font-semibold group">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg font-semibold">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-blue-400">30+</div>
                <p className="text-sm text-slate-400">Premium Sources</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">100K+</div>
                <p className="text-sm text-slate-400">Articles Daily</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-400">AI-Powered</div>
                <p className="text-sm text-slate-400">Summaries</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden md:block">
            <div className="relative w-full aspect-square">
              {/* Floating cards */}
              <div className="absolute top-0 right-0 w-72 h-96 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-3xl backdrop-blur-xl border border-white/10 p-6 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="font-semibold">Market Insights</span>
                </div>
                <p className="text-sm text-slate-300">Latest financial trends & analysis from top sources</p>
              </div>

              <div className="absolute bottom-0 left-0 w-72 h-96 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-3xl backdrop-blur-xl border border-white/10 p-6 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 delay-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Microscope className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="font-semibold">Research Papers</span>
                </div>
                <p className="text-sm text-slate-300">Latest academic discoveries from MIT, Anthropic & more</p>
              </div>

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-80 bg-gradient-to-br from-pink-500/30 to-blue-500/30 rounded-3xl backdrop-blur-xl border border-white/10 p-6 shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105 delay-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-pink-400" />
                  </div>
                  <span className="font-semibold">Curated News</span>
                </div>
                <p className="text-sm text-slate-300">Top stories from trusted news agencies worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Daily Insight?</h2>
          <p className="text-xl text-slate-400">Everything you need to stay informed</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "🎯",
              title: "Curated Daily",
              description: "Handpicked stories from 30+ premium sources updated daily",
            },
            {
              icon: "🧠",
              title: "AI Summaries",
              description: "Smart summaries that capture the essence of every story",
            },
            {
              icon: "⚡",
              title: "Real-Time Updates",
              description: "Get the latest news as it breaks from top institutions",
            },
            {
              icon: "🔍",
              title: "Advanced Search",
              description: "Find exactly what you're looking for with powerful filters",
            },
            {
              icon: "📱",
              title: "Fully Responsive",
              description: "Beautiful experience on desktop, tablet, and mobile",
            },
            {
              icon: "🎨",
              title: "Personalized",
              description: "Customize your preferences and follow your interests",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-blue-400/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-3xl p-12 md:p-16 backdrop-blur-sm text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Stay Ahead?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who use Daily Insight to stay informed about the latest developments in science, technology, finance, and economics.
          </p>
          <a href={getLoginUrl()}>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-full px-10 py-6 text-lg font-semibold">
              Start Free Today
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20 py-8 px-6 md:px-12 text-center text-slate-400">
        <p>© 2026 Daily Insight. All rights reserved.</p>
      </footer>
    </div>
  );
}
