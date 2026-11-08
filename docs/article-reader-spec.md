# Spec: Premium Article Reader

## Status

Draft for review. No further reader changes should be made from this specification until it is approved.

## Objective

Refine the existing Daily Insight article reader without replacing the app architecture, dashboard, or live-news flow. The reader should make it comfortable to understand an article before opening the publisher page, with an editorial presentation comparable in feel to Medium, Apple News, Bloomberg, Notion, and Readwise Reader.

The reader serves a person who has selected one article from the current dashboard. It must present the publisher information, retrieved article content, and only article-grounded derived information. A successful reader is readable on mobile and desktop, has stable scrolling, and gives the user a clear route to the publisher's original article.

## Assumptions

1. This is the existing Vite + React + TypeScript application in this repository; the `Dashboard` opens `ReadViewModal`.
2. The live RSS sources generally provide an article excerpt, while arXiv provides an abstract. The application must describe those as retrieved source text, not as a complete publisher article.
3. Article-derived information is deterministic extraction from the currently opened article's title and retrieved text. It must not call an AI provider or make claims not supported by that text.
4. Saving an article may remain local to the browser until the existing project gains a user backend.
5. No new dependencies, database schema changes, or external APIs are required for this scope.

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 4
- Framer Motion
- Lucide React

## Commands

```powershell
# Start the local application
npm run dev

# Type-check and generate a production build
npm run build
```

## Project Structure

```text
Dashboard.tsx          Dashboard, category filtering, and reader entry point
ReadViewModal.tsx      Article-reading surface and reader interactions
article-insights.ts    Article-scoped extraction for summaries and fact panels
news-api.ts            Browser client for the local articles endpoint
server/news-api.ts     Vite development/preview news aggregation endpoint
mockData.ts            Shared PremiumArticle types and offline fallback data
docs/                  Project specifications and decisions
```

## Reader Requirements

### Header and navigation

- Use a sticky header inside the reader scroll container.
- Provide Back, Save, Share, Close, and Read Original Article actions.
- The original article action opens the publisher URL in a new tab with `noopener noreferrer`.
- Show a reading-progress indicator driven by the reader's scroll position.

### Article presentation

- Show category, publisher name, publication date/time, reading time, title, and description.
- Show a hero image only when `article.imageUrl` is available, with a fixed aspect ratio to prevent layout shift.
- Keep reading content constrained to a comfortable maximum width.
- Render retrieved source text as spaced paragraphs with readable line height.
- Use a clear label such as "Source text / abstract" when the app has only an excerpt or abstract.

### Article-grounded summary

Display derived information in this order:

1. Executive Summary: three to five sentences, using only source text.
2. Key Takeaways: five to ten individual factual points when that much source content is available; otherwise show only the number of distinct supported points that exist.
3. Key Facts: source-supported facts and key sentences.
4. People, companies, countries, and places: only terms safely identified in the current text.
5. Numbers, statistics, and dates: values explicitly present in the current text.
6. Timeline: chronological events only if the article contains date-linked events.

The UI must state that it summarizes only the retrieved source text. It must not add opinions, predictions, global context, or unrelated information.

### Summary interactions

- Use a premium card treatment with legible section titles, icons, spacing, and responsive card layout.
- Allow executive-summary expand/collapse for longer content.
- Provide Copy Summary and Share Summary actions.
- Use native sharing when available; otherwise Copy Summary is the fallback.

### Performance and accessibility

- Keep one scroll container for the reader and update progress only from that element.
- Use fixed header height and fixed image aspect ratio to avoid visual jumps.
- Do not render hidden duplicate article text.
- Support keyboard Escape to close; provide labels for icon-only controls.
- Keep controls usable on mobile and avoid horizontal overflow.
- Respect reduced motion where the existing motion system supports it; no animation may block reading.

## Code Style

Use typed, local helpers and simple state. Keep derivation pure and separate from rendering.

```ts
const insights = useMemo(
  () => (article ? deriveArticleInsights(article) : null),
  [article]
);

const sourceText = article.fullContent || article.description;
```

- Use `PascalCase` for React components and `camelCase` for helpers and values.
- Keep source-text extraction in `article-insights.ts`; keep visual state in `ReadViewModal.tsx`.
- Do not use `any`, unsafe HTML injection, or untrusted remote HTML in the reader.

## Testing Strategy

The project currently has no configured frontend test runner. Until one is added with approval:

1. Run `npm run build` after reader changes.
2. Manually verify desktop and narrow mobile-width layouts in the local app.
3. Verify all reader controls: Back/Close, Save, Share, Copy, Summary collapse, progress indicator, and original source link.
4. Verify an RSS article and an arXiv article, including articles with no image, no dates in source text, and no extracted numbers.

Future automated tests should cover `deriveArticleInsights` with fixture articles to ensure it never returns content outside its given source text.

## Boundaries

### Always

- Preserve the current project architecture and dashboard behavior.
- Keep every generated insight grounded in the currently opened article's retrieved text.
- Run `npm run build` after code changes.
- Preserve the publisher URL and the original article action.

### Ask first

- Adding an AI provider, API key, dependency, or server-side content scraping.
- Changing database schemas, authentication, CI, or deployment configuration.
- Persisting saved articles outside browser-local storage.

### Never

- Rebuild the app from scratch or replace its architecture for this feature.
- Present RSS excerpts as full publisher articles.
- Add opinions, speculation, predictions, or unrelated analysis to summaries.
- Commit or expose API keys, tokens, or secrets.

## Success Criteria

- Opening an article shows premium, readable typography on desktop and mobile without horizontal overflow.
- The header remains visible while reading and the progress indicator reaches 100% at the end of the reader content.
- The reader shows publisher, category, date/time, reading time, hero image when available, and an original-source link.
- All derived sections use only the selected article's text; no generic, cross-article, or speculative content is displayed.
- Long summaries can collapse and expand; Copy and Share Summary work or degrade gracefully.
- Missing source details result in a clear empty state rather than invented information.
- `npm run build` passes.

## Open Questions

1. Should future full-text extraction be licensed or restricted to publishers that explicitly permit it? The current app should continue using only RSS excerpts and arXiv abstracts.
2. When authenticated users are introduced, should saved articles migrate from `localStorage` into their account?
3. Should a future AI provider be allowed only for summarization after the app has legally obtained full article text?
