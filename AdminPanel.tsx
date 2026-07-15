import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminPanel() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    categoryId: "",
    sourceType: "rss",
  });

  // Fetch categories
  const { data: categories } = trpc.categories.list.useQuery();

  // Fetch news sources
  const { data: sources, refetch: refetchSources } =
    trpc.sources.list.useQuery();

  // Mutations
  const addSourceMutation = trpc.sources.add.useMutation({
    onSuccess: () => {
      toast.success("News source added successfully!");
      setFormData({ name: "", url: "", categoryId: "", sourceType: "rss" });
      setIsOpen(false);
      refetchSources();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add source");
    },
  });

  const deleteSourceMutation = trpc.sources.delete.useMutation({
    onSuccess: () => {
      toast.success("News source deleted");
      refetchSources();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete source");
    },
  });

  const toggleSourceMutation = trpc.sources.update.useMutation({
    onSuccess: () => {
      toast.success("Source status updated");
      refetchSources();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update source");
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
              Admin access is required to manage news sources.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddSource = async () => {
    if (!formData.name || !formData.url || !formData.categoryId) {
      toast.error("Please fill in all fields");
      return;
    }

    addSourceMutation.mutate({
      name: formData.name,
      url: formData.url,
      categoryId: parseInt(formData.categoryId),
      sourceType: formData.sourceType as "rss" | "api",
    });
  };

  const handleDeleteSource = (id: number) => {
    if (confirm("Are you sure you want to delete this source?")) {
      deleteSourceMutation.mutate({ id });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Admin Panel
          </h1>
          <p className="text-slate-600">Manage news sources and categories</p>
        </div>

        {/* Add Source Dialog */}
        <div className="mb-6">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add News Source
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New News Source</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Source Name
                  </label>
                  <Input
                    placeholder="e.g., MIT News"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    RSS Feed URL
                  </label>
                  <Input
                    placeholder="https://example.com/feed.xml"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, categoryId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Source Type
                  </label>
                  <Select
                    value={formData.sourceType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, sourceType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rss">RSS Feed</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleAddSource}
                  disabled={addSourceMutation.isPending}
                  className="w-full"
                >
                  {addSourceMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Source"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sources List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">News Sources</h2>

          {sources && sources.length > 0 ? (
            <div className="grid gap-4">
              {sources.map((source) => {
                const category = categories?.find(
                  (c) => c.id === source.categoryId
                );
                return (
                  <Card key={source.id}>
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle>{source.name}</CardTitle>
                        <p className="text-sm text-slate-600 mt-1">
                          {source.url}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSource(source.id)}
                        disabled={deleteSourceMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 items-center justify-between">
                        <div className="flex gap-2">
                          <Badge variant="secondary">
                            {category?.name || "Unknown"}
                          </Badge>
                          <Badge variant="outline">
                            {source.sourceType.toUpperCase()}
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toggleSourceMutation.mutate({
                              id: source.id,
                              isActive:
                                source.isActive === "true" ? "false" : "true",
                            })
                          }
                          disabled={toggleSourceMutation.isPending}
                        >
                          {source.isActive === "true" ? "Disable" : "Enable"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-600">No news sources configured yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
