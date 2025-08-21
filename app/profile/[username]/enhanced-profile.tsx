"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Globe,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  Users,
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Plus,
  Edit,
  Camera,
  Link as LinkIcon,
  Star,
  Building,
  Clock,
  TrendingUp,
  BookOpen,
  Languages,
  Trophy,
  Target,
  CheckCircle,
  Eye,
  ArrowLeft,
  Settings,
  UserPlus,
  UserCheck,
  MessageSquare,
  Bell,
  Image as ImageIcon,
  Video,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  Zap,
  Coffee,
  User2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isAuthenticated, getCurrentUser, type User } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ProfileRightSidebar from "@/components/profile/profile-right-sidebar";

// Enhanced mock user data
const mockUserData = {
  id: 1,
  username: "ahmed_tech_lead",
  full_name: "Ahmed Al-Mansouri",
  bio: "Senior Software Engineer & Tech Lead at TechCorp UAE | Building the future of digital transformation in the Middle East | Passionate about AI, Cloud Architecture & Mentoring",
  location: "Dubai, UAE",
  website: "https://ahmed-almansouri.dev",
  email: "ahmed.almansouri@techcorp.ae",
  phone: "+971 50 123 4567",
  joinDate: "March 2021",
  isVerified: true,
  isOnline: true,
  profilePicture: "/api/placeholder/200/200",
  coverPhoto: "/api/placeholder/1200/400",

  stats: {
    posts: 247,
    followers: 12850,
    following: 1340,
    connections: 500,
    profileViews: 2543,
    postImpressions: 45200,
  },

  currentPosition: {
    title: "Senior Software Engineer & Tech Lead",
    company: "TechCorp UAE",
    companyLogo: "/api/placeholder/60/60",
    location: "Dubai, UAE",
    startDate: "Jan 2022",
    current: true,
    description:
      "Leading a team of 8 engineers in developing scalable cloud solutions for enterprise clients across the MENA region.",
  },

  experience: [
    {
      id: 1,
      title: "Senior Software Engineer & Tech Lead",
      company: "TechCorp UAE",
      companyLogo: "/api/placeholder/60/60",
      location: "Dubai, UAE",
      startDate: "Jan 2022",
      endDate: null,
      current: true,
      description:
        "Leading development of enterprise cloud solutions serving 500+ clients across MENA.",
      skills: ["React", "Node.js", "AWS", "Team Leadership"],
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "Digital Innovations Ltd",
      companyLogo: "/api/placeholder/60/60",
      location: "Abu Dhabi, UAE",
      startDate: "Jun 2020",
      endDate: "Dec 2021",
      current: false,
      description:
        "Developed and maintained 15+ web applications with 99.9% uptime.",
      skills: ["Vue.js", "Python", "PostgreSQL", "Docker"],
    },
    {
      id: 3,
      title: "Junior Developer",
      company: "StartupHub MENA",
      companyLogo: "/api/placeholder/60/60",
      location: "Dubai, UAE",
      startDate: "Mar 2019",
      endDate: "May 2020",
      current: false,
      description:
        "Built responsive web applications and mobile apps for 10+ startups.",
      skills: ["JavaScript", "React Native", "Firebase"],
    },
  ],

  education: [
    {
      id: 1,
      school: "American University of Sharjah",
      degree: "Master of Science in Computer Science",
      field: "Artificial Intelligence & Machine Learning",
      location: "Sharjah, UAE",
      startDate: "2017",
      endDate: "2019",
      gpa: "3.9/4.0",
      achievements: [
        "Dean's List",
        "Research Assistant",
        "AI Competition Winner",
      ],
      logo: "/api/placeholder/60/60",
    },
    {
      id: 2,
      school: "University of Dubai",
      degree: "Bachelor of Science in Software Engineering",
      field: "Software Engineering",
      location: "Dubai, UAE",
      startDate: "2013",
      endDate: "2017",
      gpa: "3.7/4.0",
      achievements: ["Magna Cum Laude", "Programming Club President"],
      logo: "/api/placeholder/60/60",
    },
  ],

  skills: [
    { name: "React.js", level: 95, endorsements: 45, category: "Frontend" },
    { name: "Node.js", level: 90, endorsements: 38, category: "Backend" },
    { name: "AWS", level: 85, endorsements: 42, category: "Cloud" },
    { name: "TypeScript", level: 88, endorsements: 35, category: "Languages" },
    { name: "Python", level: 82, endorsements: 29, category: "Languages" },
    {
      name: "Team Leadership",
      level: 90,
      endorsements: 52,
      category: "Management",
    },
    {
      name: "System Design",
      level: 87,
      endorsements: 31,
      category: "Architecture",
    },
    { name: "Docker", level: 80, endorsements: 28, category: "DevOps" },
  ],

  languages: [
    { name: "Arabic", proficiency: "Native", level: 100 },
    { name: "English", proficiency: "Fluent", level: 95 },
    { name: "French", proficiency: "Intermediate", level: 65 },
  ],

  certifications: [
    {
      name: "AWS Solutions Architect Professional",
      issuer: "Amazon Web Services",
      date: "2023",
      credentialId: "AWS-PSA-12345",
      logo: "/api/placeholder/40/40",
    },
    {
      name: "Google Cloud Professional Developer",
      issuer: "Google Cloud",
      date: "2022",
      credentialId: "GCP-PD-67890",
      logo: "/api/placeholder/40/40",
    },
  ],

  achievements: [
    {
      title: "Innovation Award 2023",
      description: "Best AI Implementation Project",
      date: "2023",
      icon: Trophy,
    },
    {
      title: "Top Performer Q4 2022",
      description: "Outstanding Technical Leadership",
      date: "2022",
      icon: Star,
    },
  ],

  interests: [
    "Artificial Intelligence",
    "Cloud Architecture",
    "Mentoring",
    "Open Source",
    "Photography",
    "Traveling",
    "Reading",
    "Gaming",
  ],

  socialLinks: {
    linkedin: "https://linkedin.com/in/ahmed-almansouri",
    twitter: "https://twitter.com/ahmed_tech_lead",
    github: "https://github.com/ahmed-almansouri",
    portfolio: "https://ahmed-almansouri.dev",
  },

  recentActivity: [
    {
      id: 1,
      type: "post",
      content:
        "Just launched our new AI-powered analytics dashboard! 🚀 Excited to see how it helps our clients make data-driven decisions.",
      timestamp: "2 hours ago",
      likes: 43,
      comments: 12,
      shares: 8,
    },
    {
      id: 2,
      type: "achievement",
      content: "Completed AWS Solutions Architect Professional certification!",
      timestamp: "1 week ago",
      likes: 89,
      comments: 25,
      shares: 15,
    },
  ],
};

interface ProfilePageProps {
  username: string;
}

interface EnhancedProfilePageProps {
  username: string;
}

export default function EnhancedProfilePage({
  username,
}: EnhancedProfilePageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState(mockUserData);
  const [activeTab, setActiveTab] = useState("about");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);
    if (authenticated) {
      setCurrentUser(getCurrentUser());
    } else {
      router.push("/auth");
    }
  }, [router]);

  const isOwnProfile = currentUser?.username === username;

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: `You ${isFollowing ? "unfollowed" : "are now following"} ${
        userData.full_name
      }`,
    });
  };

  const handleConnect = () => {
    setIsConnected(!isConnected);
    toast({
      title: isConnected ? "Connection Removed" : "Connection Request Sent",
      description: isConnected
        ? `You removed ${userData.full_name} from your connections`
        : `Connection request sent to ${userData.full_name}`,
    });
  };

  const handleMessage = () => {
    toast({
      title: "Message",
      description: "Opening chat with " + userData.full_name,
    });
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-gray-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 pt-16">
      {/* Cover Photo & Profile Section */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="relative h-80 bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 overflow-hidden">
          <Image
            src={userData.coverPhoto}
            alt="Cover photo"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />

          {/* Back Button */}
          <div className="absolute top-6 left-6">
            <Button
              variant="secondary"
              onClick={() => router.back()}
              className="bg-white/90 text-slate-900 hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-6 right-6 flex space-x-3">
            <Button
              variant="secondary"
              className="bg-white/90 text-slate-900 hover:bg-white"
            >
              <Share className="h-4 w-4" />
            </Button>
            {isOwnProfile && (
              <Button
                variant="secondary"
                className="bg-white/90 text-slate-900 hover:bg-white"
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="bg-white/90 text-slate-900 hover:bg-white"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View in new tab
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Save to PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Profile Info Card */}
        <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
          <Card className="bg-white dark:bg-gray-900 shadow-xl border border-slate-200 dark:border-gray-700">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-8">
                {/* Profile Picture */}
                <div className="relative">
                  <Avatar className="h-40 w-40 border-6 border-white dark:border-gray-900 shadow-lg">
                    <AvatarImage
                      src={userData.profilePicture}
                      alt={userData.full_name}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white text-4xl font-bold">
                      {userData.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {userData.isOnline && (
                    <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-white dark:border-gray-900 rounded-full"></div>
                  )}
                  {isOwnProfile && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-teal-600 hover:bg-teal-700"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Profile Details */}
                <div className="flex-1 mt-6 lg:mt-0">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-3">
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                          {userData.full_name}
                        </h1>
                        {userData.isVerified && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 font-medium"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <Badge
                          variant="secondary"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800 font-medium"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Pro
                        </Badge>
                      </div>

                      <h2 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-3 leading-snug">
                        {userData.currentPosition.title}
                      </h2>

                      <p className="text-slate-600 dark:text-slate-400 text-base mb-4 max-w-3xl leading-relaxed font-normal">
                        {userData.bio}
                      </p>

                      <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="font-medium">
                            {userData.location}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-slate-400" />
                          <span className="font-medium">
                            {userData.currentPosition.company}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>Joined {userData.joinDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4 text-slate-400" />
                          <span>
                            {userData.stats.profileViews.toLocaleString()}{" "}
                            profile views
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 mt-6 lg:mt-0">
                      {!isOwnProfile ? (
                        <>
                          <Button
                            onClick={handleConnect}
                            size="sm"
                            className={`${
                              isConnected
                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600"
                                : "bg-teal-600 hover:bg-teal-700 text-white"
                            } font-medium`}
                          >
                            {isConnected ? (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Connected
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Connect
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={handleFollow}
                            size="sm"
                            variant={isFollowing ? "outline" : "default"}
                            className={`font-medium ${
                              !isFollowing
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                            }`}
                          >
                            {isFollowing ? "Following" : "Follow"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleMessage}
                            className="font-medium border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() =>
                              router.push(`/profile/${userData.username}/edit`)
                            }
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-700 text-white font-medium"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="font-medium border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-8 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-center">
                      <div className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                        {userData.stats.connections}
                      </div>
                      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Connections
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                        {userData.stats.followers.toLocaleString()}
                      </div>
                      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Followers
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                        {userData.stats.posts}
                      </div>
                      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Posts
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold text-teal-600 dark:text-teal-400 mb-1">
                        {userData.stats.postImpressions.toLocaleString()}
                      </div>
                      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Impressions
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Contact Info */}
            <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-gray-400">
                      Email
                    </p>
                    <p className="text-slate-900 dark:text-white font-medium">
                      {userData.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-gray-400">
                      Phone
                    </p>
                    <p className="text-slate-900 dark:text-white font-medium">
                      {userData.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-gray-400">
                      Website
                    </p>
                    <a
                      href={userData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 dark:text-teal-400 hover:underline font-medium"
                    >
                      {userData.website}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">
                  Top Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.skills.slice(0, 6).map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {skill.name}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-gray-400">
                        {skill.endorsements} endorsements
                      </span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  View all skills
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.languages.map((language) => (
                  <div
                    key={language.name}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {language.name}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-gray-400">
                        {language.proficiency}
                      </p>
                    </div>
                    <div className="w-20">
                      <Progress value={language.level} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-1">
                <TabsTrigger value="about" className="font-medium">
                  <User2 className="h-4 w-4 mr-2" />
                  About
                </TabsTrigger>
                <TabsTrigger value="experience" className="font-medium">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Experience
                </TabsTrigger>
                <TabsTrigger value="education" className="font-medium">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Education
                </TabsTrigger>
                <TabsTrigger value="activity" className="font-medium">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Activity
                </TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-6">
                {/* About Section */}
                <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
                      {userData.bio}
                    </p>
                  </CardContent>
                </Card>

                {/* Interests */}
                <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">
                      Interests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {userData.interests.map((interest) => (
                        <Badge
                          key={interest}
                          variant="secondary"
                          className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Certifications */}
                <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {userData.certifications.map((cert) => (
                      <div
                        key={cert.name}
                        className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="relative w-12 h-12">
                          <Image
                            src={cert.logo}
                            alt={cert.issuer}
                            fill
                            className="rounded object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {cert.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-gray-400">
                            {cert.issuer} • {cert.date}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-gray-500">
                            Credential ID: {cert.credentialId}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience" className="space-y-6">
                <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">
                      Work Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {userData.experience.map((exp) => (
                      <div
                        key={exp.id}
                        className="border-l-2 border-teal-200 dark:border-teal-800 pl-6 relative"
                      >
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-teal-600 dark:bg-teal-400 rounded-full"></div>
                        <div className="flex items-start space-x-4">
                          <div className="relative w-12 h-12">
                            <Image
                              src={exp.companyLogo}
                              alt={exp.company}
                              fill
                              className="rounded-lg object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              {exp.title}
                            </h3>
                            <p className="text-teal-600 dark:text-teal-400 font-medium">
                              {exp.company}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-gray-400">
                              {exp.startDate} -{" "}
                              {exp.current ? "Present" : exp.endDate} •{" "}
                              {exp.location}
                            </p>
                            <p className="text-slate-700 dark:text-gray-300 mt-2 leading-relaxed">
                              {exp.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {exp.skills.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education" className="space-y-6">
                <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {userData.education.map((edu) => (
                      <div
                        key={edu.id}
                        className="border-l-2 border-blue-200 dark:border-blue-800 pl-6 relative"
                      >
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                        <div className="flex items-start space-x-4">
                          <div className="relative w-12 h-12">
                            <Image
                              src={edu.logo}
                              alt={edu.school}
                              fill
                              className="rounded-lg object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              {edu.degree}
                            </h3>
                            <p className="text-blue-600 dark:text-blue-400 font-medium">
                              {edu.school}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-gray-400">
                              {edu.field} • {edu.startDate} - {edu.endDate} •{" "}
                              {edu.location}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-gray-400">
                              GPA: {edu.gpa}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {edu.achievements.map((achievement) => (
                                <Badge
                                  key={achievement}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {achievement}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {userData.recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 p-4 bg-slate-50 dark:bg-gray-800 rounded-lg"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={userData.profilePicture}
                            alt={userData.full_name}
                          />
                          <AvatarFallback>
                            {userData.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {userData.full_name}
                            </span>
                            <span className="text-sm text-slate-500 dark:text-gray-500">
                              {activity.timestamp}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-gray-300 mb-4">
                            {activity.content}
                          </p>
                          <div className="flex items-center space-x-6 text-sm text-slate-600 dark:text-gray-400">
                            <button className="flex items-center space-x-1 hover:text-red-500">
                              <Heart className="h-4 w-4" />
                              <span>{activity.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-blue-500">
                              <MessageCircle className="h-4 w-4" />
                              <span>{activity.comments}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-green-500">
                              <Share className="h-4 w-4" />
                              <span>{activity.shares}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <ProfileRightSidebar
              isOwnProfile={isOwnProfile}
              username={username}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
