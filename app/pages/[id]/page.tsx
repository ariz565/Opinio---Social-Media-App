"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Share,
  Heart,
  MessageCircle,
  Bookmark,
  Eye,
  Users,
  Calendar,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Star,
  ChevronDown,
  ChevronUp,
  Send,
  Plus,
  Settings,
  BarChart3,
  Edit,
  FileText,
  ThumbsUp,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { isAuthenticated, getCurrentUser, type User } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Mock page data
const pageData = {
  id: 1,
  title: "TechCorp UAE Official",
  description:
    "Leading technology company in the Middle East, specializing in digital transformation solutions for enterprises across the Gulf region.",
  category: "Business",
  followers: 12500,
  following: 0,
  posts: 256,
  isPublic: true,
  verified: true,
  cover: "/api/placeholder/1200/400",
  avatar: "/api/placeholder/200/200",
  createdAt: "2023-01-15",
  owner: {
    id: 1,
    name: "TechCorp Admin",
    username: "techcorp_admin",
    avatar: "/api/placeholder/40/40",
  },
  tags: ["Technology", "Innovation", "UAE", "Digital Transformation"],
  socialLinks: {
    website: "https://techcorp.ae",
    twitter: "@TechCorpUAE",
    linkedin: "company/techcorp-uae",
    instagram: "@techcorp.uae",
  },
  contactInfo: {
    email: "info@techcorp.ae",
    phone: "+971 4 123 4567",
    address: "Dubai Internet City, Dubai, UAE",
  },
  insights: {
    views: 15420,
    engagement: 8.5,
    growth: "+12%",
    topCountries: ["UAE", "Saudi Arabia", "Qatar"],
  },
  sections: [
    {
      id: "hero",
      type: "hero",
      title: "Welcome to TechCorp UAE",
      content: {
        headline: "Transforming the Future of Technology",
        subtitle:
          "We deliver cutting-edge solutions that drive digital transformation across the Middle East",
        ctaText: "Get Started",
        ctaLink: "/contact",
      },
      visible: true,
    },
    {
      id: "about",
      type: "about",
      title: "About Us",
      content: {
        text: "TechCorp UAE has been at the forefront of technological innovation in the Middle East for over a decade. Our team of experts delivers world-class solutions that help businesses transform and thrive in the digital age.",
        stats: [
          { label: "Projects Completed", value: "500+" },
          { label: "Happy Clients", value: "200+" },
          { label: "Years of Experience", value: "10+" },
          { label: "Team Members", value: "150+" },
        ],
      },
      visible: true,
    },
    {
      id: "services",
      type: "services",
      title: "Our Services",
      content: {
        services: [
          {
            title: "Cloud Solutions",
            description: "Scalable cloud infrastructure and migration services",
            icon: "cloud",
          },
          {
            title: "Digital Transformation",
            description: "End-to-end digital transformation consulting",
            icon: "transform",
          },
          {
            title: "AI & Machine Learning",
            description: "Advanced AI solutions for business automation",
            icon: "ai",
          },
          {
            title: "Cybersecurity",
            description: "Comprehensive security solutions and consulting",
            icon: "security",
          },
        ],
      },
      visible: true,
    },
    {
      id: "team",
      type: "team",
      title: "Our Team",
      content: {
        members: [
          {
            name: "Ahmed Al-Mansouri",
            role: "CEO & Founder",
            image: "/api/placeholder/150/150",
            bio: "Visionary leader with 15+ years in tech industry",
          },
          {
            name: "Sarah Johnson",
            role: "CTO",
            image: "/api/placeholder/150/150",
            bio: "Technology expert specializing in cloud solutions",
          },
          {
            name: "Mohammed Hassan",
            role: "Head of Operations",
            image: "/api/placeholder/150/150",
            bio: "Operations specialist with regional expertise",
          },
        ],
      },
      visible: true,
    },
    {
      id: "contact",
      type: "contact",
      title: "Contact Us",
      content: {
        formEnabled: true,
        showMap: true,
        officeHours: "Sunday - Thursday: 9:00 AM - 6:00 PM",
      },
      visible: true,
    },
  ],
};

const recentPosts = [
  {
    id: 1,
    content: "Excited to announce our new AI-powered analytics platform! 🚀",
    timestamp: "2 hours ago",
    likes: 45,
    comments: 12,
    shares: 8,
  },
  {
    id: 2,
    content:
      "Just completed another successful digital transformation project for a major client in Saudi Arabia.",
    timestamp: "1 day ago",
    likes: 78,
    comments: 23,
    shares: 15,
  },
  {
    id: 3,
    content:
      "Our team is growing! We're hiring talented developers and consultants. Check out our careers page.",
    timestamp: "3 days ago",
    likes: 34,
    comments: 8,
    shares: 22,
  },
];

export default function PageView() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [newComment, setNewComment] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);
    if (authenticated) {
      setCurrentUser(getCurrentUser());
    }
  }, []);

  const handleFollow = () => {
    if (!isAuth) {
      toast({
        title: "Login Required",
        description: "Please login to follow pages",
        variant: "destructive",
      });
      return;
    }
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: `You ${isFollowing ? "unfollowed" : "are now following"} ${
        pageData.title
      }`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pageData.title,
        text: pageData.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Page link copied to clipboard",
      });
    }
  };

  const submitContactForm = () => {
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you soon!",
    });
    setContactForm({ name: "", email: "", message: "" });
  };

  const SectionRenderer = ({
    section,
  }: {
    section: (typeof pageData.sections)[0];
  }) => {
    if (!section.visible) return null;

    switch (section.type) {
      case "hero":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-64 bg-gradient-to-r from-teal-600 to-blue-700 rounded-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 h-full flex items-center justify-center text-center text-white p-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {section.content.headline}
                </h2>
                <p className="text-lg mb-4 opacity-90">
                  {section.content.subtitle}
                </p>
                <Button className="bg-white text-teal-600 hover:bg-gray-100">
                  {section.content.ctaText}
                </Button>
              </div>
            </div>
          </motion.div>
        );

      case "about":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
                  {section.content.text}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {section.content.stats.map((stat: any, index: number) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-slate-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                        {stat.value}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case "services":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.content.services.map(
                    (service: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 border border-slate-200 dark:border-gray-700 rounded-lg"
                      >
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                          {service.title}
                        </h3>
                        <p className="text-slate-600 dark:text-gray-400">
                          {service.description}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case "team":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {section.content.members.map((member: any, index: number) => (
                    <div key={index} className="text-center">
                      <Avatar className="h-24 w-24 mx-auto mb-4">
                        <AvatarImage src={member.image} alt={member.name} />
                        <AvatarFallback className="text-xl">
                          {member.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {member.name}
                      </h3>
                      <p className="text-teal-600 dark:text-teal-400 font-medium mb-2">
                        {member.role}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-gray-400">
                        {member.bio}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case "contact":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Get in Touch
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        <span className="text-slate-700 dark:text-gray-300">
                          {pageData.contactInfo.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        <span className="text-slate-700 dark:text-gray-300">
                          {pageData.contactInfo.phone}
                        </span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-teal-600 dark:text-teal-400 mt-0.5" />
                        <span className="text-slate-700 dark:text-gray-300">
                          {pageData.contactInfo.address}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm text-slate-600 dark:text-gray-400">
                        <strong>Office Hours:</strong>{" "}
                        {section.content.officeHours}
                      </p>
                    </div>
                  </div>

                  {section.content.formEnabled && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Send us a Message
                      </h3>
                      <div className="space-y-3">
                        <Input
                          placeholder="Your Name"
                          value={contactForm.name}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                        <Input
                          type="email"
                          placeholder="Your Email"
                          value={contactForm.email}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                        />
                        <Textarea
                          placeholder="Your Message"
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) =>
                            setContactForm((prev) => ({
                              ...prev,
                              message: e.target.value,
                            }))
                          }
                        />
                        <Button
                          onClick={submitContactForm}
                          className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 pt-16">
      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-teal-600 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-4 left-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="ghost"
            onClick={handleShare}
            className="text-white hover:bg-white/20"
          >
            <Share className="h-4 w-4" />
          </Button>
          {isAuth && pageData.owner.id === currentUser?.id && (
            <>
              <Button
                variant="ghost"
                onClick={() => router.push(`/pages/${pageData.id}/edit`)}
                className="text-white hover:bg-white/20"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push(`/pages/${pageData.id}/analytics`)}
                className="text-white hover:bg-white/20"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        {/* Page Header */}
        <Card className="mb-8 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
              <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-900 shadow-lg mb-4 md:mb-0">
                <AvatarImage src={pageData.avatar} alt={pageData.title} />
                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white text-2xl font-bold">
                  {pageData.title.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {pageData.title}
                      </h1>
                      {pageData.verified && (
                        <Badge className="bg-blue-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Badge variant="secondary">{pageData.category}</Badge>
                    </div>
                    <p className="text-slate-600 dark:text-gray-400 mb-3 max-w-2xl">
                      {pageData.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pageData.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-slate-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {pageData.followers.toLocaleString()} followers
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{pageData.posts} posts</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Created{" "}
                          {new Date(pageData.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={handleFollow}
                      className={`${
                        isFollowing
                          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          : "bg-teal-600 hover:bg-teal-700 text-white"
                      }`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button variant="outline">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Page Sections */}
            <Tabs value={activeSection} onValueChange={setActiveSection}>
              <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              {pageData.sections.map((section) => (
                <TabsContent
                  key={section.id}
                  value={section.id}
                  className="mt-6"
                >
                  <SectionRenderer section={section} />
                </TabsContent>
              ))}

              <TabsContent value="posts" className="mt-6 space-y-4">
                {recentPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={pageData.avatar}
                            alt={pageData.title}
                          />
                          <AvatarFallback>
                            {pageData.title.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {pageData.title}
                            </span>
                            <span className="text-sm text-slate-500 dark:text-gray-500">
                              {post.timestamp}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-gray-300 mb-4">
                            {post.content}
                          </p>
                          <div className="flex items-center space-x-6 text-sm text-slate-600 dark:text-gray-400">
                            <button className="flex items-center space-x-1 hover:text-red-500">
                              <Heart className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-blue-500">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post.comments}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-green-500">
                              <Share className="h-4 w-4" />
                              <span>{post.shares}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Links */}
            <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">
                  Connect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(pageData.socialLinks).map(
                  ([platform, link]) => {
                    if (!link) return null;
                    return (
                      <a
                        key={platform}
                        href={
                          link.startsWith("http") ? link : `https://${link}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                        <span className="text-slate-700 dark:text-gray-300 capitalize">
                          {platform}
                        </span>
                      </a>
                    );
                  }
                )}
              </CardContent>
            </Card>

            {/* Page Stats */}
            <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">
                  Page Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                      {pageData.insights.views.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-gray-500">
                      Total Views
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {pageData.insights.engagement}%
                    </div>
                    <div className="text-xs text-slate-500 dark:text-gray-500">
                      Engagement
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                    Top Countries
                  </p>
                  {pageData.insights.topCountries.map((country, index) => (
                    <div
                      key={country}
                      className="flex justify-between items-center py-1"
                    >
                      <span className="text-sm text-slate-600 dark:text-gray-400">
                        {country}
                      </span>
                      <div className="w-12 h-2 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500"
                          style={{ width: `${100 - index * 20}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Similar Pages */}
            <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">
                  Similar Pages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    name: "InnovateLab",
                    followers: "8.9K",
                    category: "Technology",
                  },
                  {
                    name: "Gulf Developers",
                    followers: "12.3K",
                    category: "Community",
                  },
                  {
                    name: "Digital UAE",
                    followers: "15.7K",
                    category: "Business",
                  },
                ].map((page, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{page.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {page.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-gray-500">
                          {page.followers} followers
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Follow
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
