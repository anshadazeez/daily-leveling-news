import { ENV } from "../_core/env";

interface SummaryResult {
  gist: string;
  whyItMatters: string;
  keyTakeaway: string;
}

/**
 * Generates AI-powered summaries for an article
 */
export async function generateArticleSummary(
  title: string,
  description: string
): Promise<SummaryResult | null> {
  try {
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      console.warn("[AI] Built-in LLM not configured");
      return null;
    }

    const prompt = `You are a professional news summarizer. Analyze the following article and provide three concise summaries:

Article Title: ${title}
Article Description: ${description}

Please respond in JSON format with exactly these three fields:
{
  "gist": "A 2-sentence summary of the key discovery or event",
  "whyItMatters": "A 1-2 sentence explanation of the broader impact on the industry or society",
  "keyTakeaway": "A single actionable or educational point for the reader"
}

Make sure the summaries are informative, accessible to a general audience, and focused on the most important aspects.`;

    const response = await fetch(`${ENV.forgeApiUrl}/llm/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      console.error(`[AI] API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.warn("[AI] No content in response");
      return null;
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("[AI] Could not extract JSON from response");
      return null;
    }

    const summary = JSON.parse(jsonMatch[0]) as SummaryResult;
    return summary;
  } catch (error) {
    console.error("[AI] Summarization failed:", error);
    return null;
  }
}

/**
 * Batch summarize multiple articles
 */
export async function summarizeArticles(
  articles: Array<{ id: number; title: string; description: string }>
) {
  const results = [];

  for (const article of articles) {
    try {
      const summary = await generateArticleSummary(
        article.title,
        article.description
      );
      if (summary) {
        results.push({
          articleId: article.id,
          summary,
        });
      }
    } catch (error) {
      console.error(`[AI] Failed to summarize article ${article.id}:`, error);
    }
  }

  return results;
}
