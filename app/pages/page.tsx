"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Settings,
  BarChart3,
  Calendar,
  Globe,
  Lock,
  Bookmark,
  TrendingUp,
  Award,
  Image as ImageIcon,
  FileText,
  Palette,
  Layout,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isAuthenticated, getCurrentUser, type User } from "@/lib/api";

// Mock data for pages
const userPages = [
  {
    id: 1,
    title: "TechCorp UAE Official",
    description: "Leading technology company in the Middle East",
    category: "Business",
    followers: 12500,
    posts: 256,
    isPublic: true,
    isPinned: true,
    cover: "/api/placeholder/400/200",
    avatar: "/api/placeholder/80/80",
    lastUpdated: "2 hours ago",
    insights: {
      views: 15420,
      engagement: 8.5,
      growth: "+12%",
    },
    status: "published",
  },
  {
    id: 2,
    title: "Gulf Developers Community",
    description: "A community for developers in the Gulf region",
    category: "Community",
    followers: 8900,
    posts: 189,
    isPublic: true,
    isPinned: false,
    cover: "/api/placeholder/400/200",
    avatar: "/api/placeholder/80/80",
    lastUpdated: "1 day ago",
    insights: {
      views: 9876,
      engagement: 12.3,
      growth: "+5%",
    },
    status: "published",
  },
  {
    id: 3,
    title: "My Personal Portfolio",
    description: "Showcasing my work and achievements",
    category: "Personal",
    followers: 456,
    posts: 45,
    isPublic: false,
    isPinned: false,
    cover: "/api/placeholder/400/200",
    avatar: "/api/placeholder/80/80",
    lastUpdated: "3 days ago",
    insights: {
      views: 1234,
      engagement: 15.7,
      growth: "+8%",
    },
    status: "draft",
  },
];

const pageTemplates = [
  {
    id: 1,
    name: "Business Professional",
    description: "Perfect for companies and professional services",
    preview: "/api/placeholder/300/200",
    category: "Business",
    features: ["Contact Form", "Service Showcase", "Team Section"],
    popular: true,
  },
  {
    id: 2,
    name: "Creative Portfolio",
    description: "Showcase your creative work and projects",
    preview: "/api/placeholder/300/200",
    category: "Creative",
    features: ["Gallery", "Project Timeline", "Skills Display"],
    popular: false,
  },
  {
    id: 3,
    name: "Community Hub",
    description: "Build and engage with your community",
    preview: "/api/placeholder/300/200",
    category: "Community",
    features: ["Discussion Board", "Events", "Member Directory"],
    popular: true,
  },
  {
    id: 4,
    name: "Personal Brand",
    description: "Express your personality and achievements",
    preview: "/api/placeholder/300/200",
    category: "Personal",
    features: ["Bio Section", "Achievement Wall", "Blog"],
    popular: false,
  },
];

const pageCategories = [
  { name: "All", count: 24, icon: Globe },
  { name: "Business", count: 12, icon: TrendingUp },
  { name: "Creative", count: 8, icon: Palette },
  { name: "Community", count: 15, icon: Users },
  { name: "Personal", count: 18, icon: Award },
];

export default function PagesManagement() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredPages, setFilteredPages] = useState(userPages);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);
    if (authenticated) {
      setCurrentUser(getCurrentUser());
    } else {
      // Redirect to auth if not authenticated
      router.push("/auth");
    }
  }, [router]);

  useEffect(() => {
    let filtered = userPages;

    if (searchQuery) {
      filtered = filtered.filter(
        (page) =>
          page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((page) => page.category === selectedCategory);
    }

    setFilteredPages(filtered);
  }, [searchQuery, selectedCategory]);

  const PageCard = ({ page }: { page: (typeof userPages)[0] }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="group cursor-pointer"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-32 bg-gradient-to-r from-teal-500 to-blue-600 overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-3 right-3 flex space-x-2">
            {page.isPinned && (
              <Badge className="bg-yellow-500 text-white border-0">
                <Star className="h-3 w-3 mr-1" />
                Pinned
              </Badge>
            )}
            <Badge
              className={`border-0 ${
                page.status === "published"
                  ? "bg-green-500 text-white"
                  : page.status === "draft"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              {page.status}
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center space-x-2 text-white">
              {page.isPublic ? (
                <Globe className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {page.isPublic ? "Public" : "Private"}
              </span>
            </div>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 border-2 border-slate-200 dark:border-gray-700 -mt-8 relative z-10 bg-white">
                <AvatarImage src={page.avatar} alt={page.title} />
                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white font-semibold">
                  {page.title.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                  {page.title}
                </CardTitle>
                <p className="text-sm font-medium text-slate-600 dark:text-gray-400 truncate leading-relaxed">
                  {page.description}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push(`/pages/${page.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Page
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(`/pages/${page.id}/edit`)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Page
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(`/pages/${page.id}/analytics`)}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <Badge
              variant="secondary"
              className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 font-medium px-3 py-1"
            >
              {page.category}
            </Badge>
            <span className="text-slate-500 dark:text-gray-500 font-medium">
              Updated {page.lastUpdated}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {page.followers.toLocaleString()}
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-gray-500">
                Followers
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {page.posts}
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-gray-500">
                Posts
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-teal-600 dark:text-teal-400">
                {page.insights.growth}
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-gray-500">
                Growth
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold"
              onClick={() => router.push(`/pages/${page.id}/edit`)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-slate-300 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-800"
              onClick={() => router.push(`/pages/${page.id}/analytics`)}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-slate-300 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-800"
              onClick={() => router.push(`/pages/${page.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const TemplateCard = ({
    template,
  }: {
    template: (typeof pageTemplates)[0];
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="group cursor-pointer"
      onClick={() => router.push(`/pages/create?template=${template.id}`)}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="relative">
          <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
            <Layout className="h-16 w-16 text-slate-400 dark:text-gray-500" />
          </div>
          {template.popular && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
              <Star className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          )}
        </div>

        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              {template.name}
            </h3>
            <p className="text-sm font-medium text-slate-600 dark:text-gray-400 mt-2 leading-relaxed">
              {template.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {template.features.slice(0, 2).map((feature) => (
              <Badge
                key={feature}
                variant="secondary"
                className="text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {feature}
              </Badge>
            ))}
            {template.features.length > 2 && (
              <Badge
                variant="secondary"
                className="text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                +{template.features.length - 2} more
              </Badge>
            )}
          </div>

          <Button className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold py-3">
            Use Template
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Don't render if not authenticated (will redirect in useEffect)
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-gray-400">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 pt-16">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="space-y-1">
              <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                Your Pages
              </h1>
              <p className="text-xl font-medium text-slate-600 dark:text-gray-400 mt-3">
                Create, manage, and grow your online presence with professional
                pages
              </p>
            </div>

            <Button
              onClick={() => router.push("/pages/create")}
              className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
            >
              <Plus className="h-6 w-6 mr-3" />
              Create New Page
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-6">
        <Tabs defaultValue="my-pages" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-2 shadow-sm">
            <TabsTrigger
              value="my-pages"
              className="rounded-lg font-semibold text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              <Globe className="h-4 w-4 mr-2" />
              My Pages
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="rounded-lg font-semibold text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              <Layout className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="rounded-lg font-semibold text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-pages" className="space-y-6">
            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search your pages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-50 dark:bg-gray-800 border-slate-200 dark:border-gray-700"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {pageCategories.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name} ({category.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex border border-slate-200 dark:border-gray-700 rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pages Grid/List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {filteredPages.length}{" "}
                  {filteredPages.length === 1 ? "Page" : "Pages"}
                </h2>
                <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-gray-400">
                  <span className="font-medium">Sort by:</span>
                  <Select defaultValue="updated">
                    <SelectTrigger className="w-36 h-9 font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="updated">Last Updated</SelectItem>
                      <SelectItem value="created">Date Created</SelectItem>
                      <SelectItem value="followers">Followers</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredPages.map((page) => (
                  <PageCard key={page.id} page={page} />
                ))}
              </div>

              {filteredPages.length === 0 && (
                <div className="text-center py-12">
                  <Globe className="h-16 w-16 text-slate-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    No pages found
                  </h3>
                  <p className="text-slate-600 dark:text-gray-400 mb-6">
                    {searchQuery
                      ? "Try adjusting your search terms"
                      : "Create your first page to get started"}
                  </p>
                  <Button
                    onClick={() => router.push("/pages/create")}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Page
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">
                Choose a Professional Template
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pageTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900 dark:to-blue-900 rounded-xl p-6 border border-teal-200 dark:border-teal-700">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    Need a Custom Design?
                  </h3>
                  <p className="text-slate-600 dark:text-gray-400 mb-4 leading-relaxed">
                    Our templates are fully customizable. You can modify colors,
                    layouts, and content to match your brand perfectly.
                  </p>
                  <Button
                    variant="outline"
                    className="border-teal-200 dark:border-teal-700 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900 font-semibold"
                  >
                    Learn More About Customization
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-gray-400">
                        Total Views
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        26.5K
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 dark:text-green-400">
                      +12.5%
                    </span>
                    <span className="text-slate-500 dark:text-gray-500 ml-2">
                      vs last month
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-gray-400">
                        Total Followers
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        21.9K
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 dark:text-green-400">
                      +8.2%
                    </span>
                    <span className="text-slate-500 dark:text-gray-500 ml-2">
                      vs last month
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-gray-400">
                        Avg. Engagement
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        12.8%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 dark:text-green-400">
                      +3.1%
                    </span>
                    <span className="text-slate-500 dark:text-gray-500 ml-2">
                      vs last month
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-gray-400">
                        Active Pages
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        3
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <Globe className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-slate-500 dark:text-gray-500">
                      2 published, 1 draft
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white">
                    Top Performing Pages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userPages.slice(0, 3).map((page, index) => (
                    <div
                      key={page.id}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {page.title}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-gray-500">
                            {page.insights.views.toLocaleString()} views
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                          {page.insights.growth}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-gray-500">
                          {page.insights.engagement}% engagement
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white">
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      action: "New follower on TechCorp UAE Official",
                      time: "2 hours ago",
                      icon: Users,
                    },
                    {
                      action: "Page view milestone reached",
                      time: "5 hours ago",
                      icon: TrendingUp,
                    },
                    {
                      action: "New comment on Gulf Developers Community",
                      time: "1 day ago",
                      icon: MessageCircle,
                    },
                    {
                      action: "Page shared 5 times",
                      time: "2 days ago",
                      icon: Share,
                    },
                  ].map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                          <Icon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {activity.action}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
