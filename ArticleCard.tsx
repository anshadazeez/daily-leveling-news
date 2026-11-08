import { Bookmark, ExternalLink, Share2 } from "lucide-react";
import { useState } from "react";

interface ArticleCardProps {
  id: number;
  title: string;
  description: string;
  source: string;
  publishedAt: Date;
  category: string;
  url: string;
  readingTimeMinutes?: number;
  onBookmark?: (articleId: number) => void;
  isBookmarked?: boolean;
  onOpen?: () => void;
}

function formatDate(date: Date) {
  const difference = Date.now() - date.getTime();
  const hours = Math.floor(difference / 3_600_000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function ArticleCard({
  id,
  title,
  description,
  source,
  publishedAt,
  category,
  url,
  readingTimeMinutes = 3,
  onBookmark,
  isBookmarked = false,
  onOpen,
}: ArticleCardProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const saveArticle = () => {
    setBookmarked((current) => !current);
    onBookmark?.(id);
  };

  const shareArticle = async () => {
    const shareData = { title, text: description, url };
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    await navigator.clipboard?.writeText(url);
  };

  return (
    <article className="group flex h-full flex-col border-t border-slate-300 pt-5 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        <span>{category}</span>
        <span>{formatDate(publishedAt)}</span>
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="mt-3 text-left"
        aria-label={`Read ${title}`}
      >
        <h3 className="text-balance text-xl font-bold leading-tight tracking-[-0.025em] text-slate-950 transition-colors group-hover:text-blue-700 sm:text-2xl">
          {title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{description}</p>
      </button>

      <div className="mt-5 flex items-center justify-between gap-3 text-sm">
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-800">{source}</p>
          <p className="mt-0.5 text-slate-500">{readingTimeMinutes} min read</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={saveArticle}
            className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${
              bookmarked ? "bg-blue-700 text-white" : "text-slate-600 hover:bg-slate-200"
            }`}
            aria-label={bookmarked ? "Remove saved article" : "Save article"}
          >
            <Bookmark className="h-4 w-4" fill={bookmarked ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            onClick={shareArticle}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-600 transition-colors hover:bg-slate-200"
            aria-label={`Share ${title}`}
          >
            <Share2 className="h-4 w-4" />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="grid h-9 w-9 place-items-center rounded-full text-slate-600 transition-colors hover:bg-slate-200"
            aria-label={`Open ${title} at ${source}`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
