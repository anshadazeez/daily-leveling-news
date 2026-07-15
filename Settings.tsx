import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Moon, Sun, Bell, Eye, Lock, Download } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Settings() {
  const { user } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("dark");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState<"instant" | "daily" | "weekly">("daily");

  const categoriesQuery = trpc.categories.list.useQuery();
  const [followedCategories, setFollowedCategories] = useState<number[]>([1, 2, 3]);

  const savePreferencesMutation = trpc.preferences.update.useMutation();

  const handleSavePreferences = async () => {
    try {
      await savePreferencesMutation.mutateAsync({
        followedCategories,
        theme,
        fontSize,
        emailNotifications,
        notificationFrequency,
      });
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1 w-full justify-start">
            <TabsTrigger value="preferences" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Preferences
            </TabsTrigger>
            <TabsTrigger value="display" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Display
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Privacy
            </TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Account
            </TabsTrigger>
          </TabsList>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="mt-8">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur p-8">
              <h2 className="text-2xl font-bold text-white mb-8">Category Preferences</h2>
              
              <p className="text-slate-300 mb-6">Select which categories you want to follow:</p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {categoriesQuery.data?.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-blue-500/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setFollowedCategories((prev) =>
                        prev.includes(category.id)
                          ? prev.filter((id) => id !== category.id)
                          : [...prev, category.id]
                      );
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={followedCategories.includes(category.id)}
                      onChange={() => {}}
                      className="w-5 h-5 rounded bg-slate-600 border-slate-500 text-blue-600 cursor-pointer"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-white">{category.name}</p>
                      <p className="text-sm text-slate-400">{category.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={handleSavePreferences} className="bg-blue-600 hover:bg-blue-700 w-full">
                Save Preferences
              </Button>
            </Card>
          </TabsContent>

          {/* Display Tab */}
          <TabsContent value="display" className="mt-8">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur p-8">
              <h2 className="text-2xl font-bold text-white mb-8">Display Settings</h2>

              {/* Theme */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Theme</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { value: "light" as const, label: "Light", icon: Sun },
                    { value: "dark" as const, label: "Dark", icon: Moon },
                    { value: "auto" as const, label: "Auto", icon: "🔄" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === option.value
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-slate-600/50 bg-slate-700/30 hover:border-slate-500"
                      }`}
                    >
                      <div className="text-2xl mb-2">
                        {typeof option.icon === "string" ? option.icon : <option.icon className="w-6 h-6 mx-auto text-slate-300" />}
                      </div>
                      <p className="text-white font-medium">{option.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Font Size</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { value: "small" as const, label: "Small", size: "text-sm" },
                    { value: "medium" as const, label: "Medium", size: "text-base" },
                    { value: "large" as const, label: "Large", size: "text-lg" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFontSize(option.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        fontSize === option.value
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-slate-600/50 bg-slate-700/30 hover:border-slate-500"
                      }`}
                    >
                      <p className={`${option.size} text-white font-medium`}>{option.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="font-semibold text-white">Show Article Images</p>
                      <p className="text-sm text-slate-400">Display images in article cards</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 text-blue-400">📋</div>
                    <div>
                      <p className="font-semibold text-white">Compact View</p>
                      <p className="text-sm text-slate-400">Show articles in a more compact layout</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>

              <Button onClick={handleSavePreferences} className="bg-blue-600 hover:bg-blue-700 w-full mt-8">
                Save Display Settings
              </Button>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-8">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur p-8">
              <h2 className="text-2xl font-bold text-white mb-8">Notification Settings</h2>

              <div className="space-y-6">
                {/* Email Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="font-semibold text-white">Email Notifications</p>
                      <p className="text-sm text-slate-400">Receive updates via email</p>
                    </div>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                {/* Notification Frequency */}
                {emailNotifications && (
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-slate-300 mb-3">Frequency</p>
                    <div className="grid md:grid-cols-3 gap-3">
                      {[
                        { value: "instant" as const, label: "Instant" },
                        { value: "daily" as const, label: "Daily" },
                        { value: "weekly" as const, label: "Weekly" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setNotificationFrequency(option.value)}
                          className={`p-3 rounded-lg border transition-all ${
                            notificationFrequency === option.value
                              ? "border-blue-500 bg-blue-500/10 text-white"
                              : "border-slate-600/50 bg-slate-700/30 text-slate-300 hover:border-slate-500"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div>
                    <p className="font-semibold text-white">Trending Articles</p>
                    <p className="text-sm text-slate-400">Notify when articles trend</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div>
                    <p className="font-semibold text-white">New Research Papers</p>
                    <p className="text-sm text-slate-400">Alert on new research publications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Button onClick={handleSavePreferences} className="bg-blue-600 hover:bg-blue-700 w-full mt-8">
                Save Notification Settings
              </Button>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="mt-8">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur p-8">
              <h2 className="text-2xl font-bold text-white mb-8">Privacy Settings</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="font-semibold text-white">Track Reading History</p>
                      <p className="text-sm text-slate-400">Help us improve recommendations</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div>
                    <p className="font-semibold text-white">Analytics</p>
                    <p className="text-sm text-slate-400">Allow usage analytics</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div>
                    <p className="font-semibold text-white">Data Export</p>
                    <p className="text-sm text-slate-400">Download your data as JSON</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="mt-8">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur p-8">
              <h2 className="text-2xl font-bold text-white mb-8">Account Information</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    disabled
                    className="w-full px-4 py-2 bg-slate-700/30 border border-slate-600/50 rounded-lg text-slate-300 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-2 bg-slate-700/30 border border-slate-600/50 rounded-lg text-slate-300 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                  <div className="flex items-center gap-2">
                    <Badge className={user?.role === "admin" ? "bg-red-600" : "bg-blue-600"}>
                      {user?.role === "admin" ? "Administrator" : "User"}
                    </Badge>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
