import type { Connect, Plugin } from "vite";
import { loadArticles } from "./article-service";

export function newsApiPlugin(): Plugin {
  const addRoute = (middlewares: Connect.Server) => {
    middlewares.use("/api/articles", async (_req: Connect.IncomingMessage, res) => {
      try {
        const articles = await loadArticles();
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("Cache-Control", "no-store");
        res.end(JSON.stringify({ articles }));
      } catch (error) {
        console.error("[news-api]", error);
        res.statusCode = 502;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ error: "Unable to load news sources right now." }));
      }
    });
  };

  return {
    name: "daily-insight-news-api",
    configureServer(server) {
      addRoute(server.middlewares);
    },
    configurePreviewServer(server) {
      addRoute(server.middlewares);
    },
  };
}
