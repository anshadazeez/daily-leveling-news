import type { Request, Response } from "express";
import { fetchAndProcessNews } from "../procedures/fetch-news";
import { sdk } from "../_core/sdk";

/**
 * Scheduled endpoint handler for daily news fetching
 * Called by the Manus platform at 9 AM UTC daily
 */
export async function scheduledFetchNewsHandler(req: Request, res: Response) {
  try {
    // Authenticate as cron request
    const user = await sdk.authenticateRequest(req);
    if (!user?.isCron) {
      return res.status(403).json({ error: "cron-only" });
    }

    console.log(`[Scheduled] Starting daily news fetch (taskUid: ${user.taskUid})`);

    // Run the news fetching and processing pipeline
    const result = await fetchAndProcessNews();

    console.log(`[Scheduled] News fetch completed:`, result);

    // Return success response
    return res.json({
      ok: true,
      timestamp: new Date().toISOString(),
      taskUid: user.taskUid,
      result,
    });
  } catch (error) {
    console.error("[Scheduled] Error during news fetch:", error);

    // Return error response with context for platform investigation
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        url: req.url,
        taskUid: (req as any).user?.taskUid,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
