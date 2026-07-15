import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, ExternalLink, Clock } from "lucide-react";
import { useState } from "react";

interface ArticleCardProps {
  id: number;
  title: string;
  description: string;
  source: string;
  publishedAt: Date;
  imageUrl?: string;
  category: string;
  url: string;
  readingTimeMinutes?: number;
  onBookmark?: (articleId: number) => void;
  isBookmarked?: boolean;
}

export default function ArticleCard({
  id,
  title,
  description,
  source,
  publishedAt,
  imageUrl,
  category,
  url,
  readingTimeMinutes = 5,
  onBookmark,
  isBookmarked = false,
}: ArticleCardProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    onBookmark?.(id);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, { bg: string; text: string; badge: string }> = {
      "Science": { bg: "from-cyan-500/20 to-blue-500/20", text: "text-cyan-300", badge: "bg-cyan-500/30 text-cyan-200" },
      "Technology": { bg: "from-purple-500/20 to-pink-500/20", text: "text-purple-300", badge: "bg-purple-500/30 text-purple-200" },
      "Finance": { bg: "from-green-500/20 to-emerald-500/20", text: "text-green-300", badge: "bg-green-500/30 text-green-200" },
      "Economics": { bg: "from-orange-500/20 to-red-500/20", text: "text-orange-300", badge: "bg-orange-500/30 text-orange-200" },
      "Research": { bg: "from-indigo-500/20 to-purple-500/20", text: "text-indigo-300", badge: "bg-indigo-500/30 text-indigo-200" },
    };
    return colors[cat] || { bg: "from-slate-500/20 to-slate-500/20", text: "text-slate-300", badge: "bg-slate-500/30 text-slate-200" };
  };

  const colors = getCategoryColor(category);

  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors.bg} border border-white/10 hover:border-white/30 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105 flex flex-col h-full`}>
      {/* Animated gradient overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      </div>

      {/* Image Section */}
      {imageUrl && (
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Category Badge on Image */}
          <div className="absolute top-4 right-4">
            <Badge className={`${colors.badge} border-0 font-semibold`}>
              {category}
            </Badge>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="flex-1 p-6 flex flex-col relative z-10">
        {/* Source & Time */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">
            {source}
          </span>
          <span className={`text-xs font-medium flex items-center gap-1 ${colors.text}`}>
            <Clock className="w-3 h-3" />
            {readingTimeMinutes} min
          </span>
        </div>

        {/* Title */}
        <h3 className={`text-lg font-bold mb-3 line-clamp-3 ${colors.text} group-hover:text-white transition-colors duration-200`}>
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-300 line-clamp-2 mb-4 flex-1">
          {description}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-4 border-b border-white/10">
          <span>{formatDate(publishedAt)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-lg font-semibold">
              Read More
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </a>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            className={`rounded-lg transition-all ${
              bookmarked
                ? "bg-yellow-500/30 text-yellow-300 hover:bg-yellow-500/40"
                : "bg-white/10 text-slate-400 hover:text-yellow-300 hover:bg-yellow-500/20"
            }`}
          >
            <Bookmark className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title,
                  text: description,
                  url,
                });
              }
            }}
            className="rounded-lg bg-white/10 text-slate-400 hover:text-green-300 hover:bg-green-500/20"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
