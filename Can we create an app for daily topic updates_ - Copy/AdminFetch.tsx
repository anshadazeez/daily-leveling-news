import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminFetch() {
  const { user } = useAuth();
  const [fetchResult, setFetchResult] = useState<any>(null);

  const fetchNewsMutation = trpc.admin.fetchNews.useMutation({
    onSuccess: (data) => {
      setFetchResult(data);
      toast.success("News fetching completed!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to fetch news");
      setFetchResult({ error: error.message });
    },
  });

  // Check admin access
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-slate-600 mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-slate-500">
              Admin access is required.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Manual News Fetch
          </h1>
          <p className="text-slate-600">
            Trigger the news fetching and AI summarization pipeline
          </p>
        </div>

        {/* Fetch Button */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Fetch & Process News</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Click the button below to manually trigger the news fetching
              process. This will:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-1">
              <li>Fetch articles from all active RSS sources</li>
              <li>Parse and store new articles in the database</li>
              <li>Generate AI-powered summaries for each article</li>
              <li>Update the dashboard with fresh content</li>
            </ul>
            <Button
              onClick={() => fetchNewsMutation.mutate()}
              disabled={fetchNewsMutation.isPending}
              size="lg"
              className="w-full"
            >
              {fetchNewsMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fetching News...
                </>
              ) : (
                "Start Fetch Process"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {fetchResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {fetchResult.success ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Fetch Completed Successfully
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    Fetch Failed
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {fetchResult.success ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Feeds Fetched:</span>
                      <span className="font-semibold">
                        {fetchResult.feedsFetched}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Feeds Failed:</span>
                      <span className="font-semibold text-red-600">
                        {fetchResult.feedsFailed}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Articles Added:</span>
                      <span className="font-semibold">
                        {fetchResult.articlesAdded}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Articles Summarized:</span>
                      <span className="font-semibold">
                        {fetchResult.articlesSummarized}
                      </span>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-red-600 font-semibold">Error:</p>
                    <p className="text-slate-600">{fetchResult.error}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
