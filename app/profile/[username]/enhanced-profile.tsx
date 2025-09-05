"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  isAuthenticated,
  getCurrentUser,
  type User,
  profileAPI,
  postsAPI,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ProfileRightSidebar from "@/components/profile/profile-right-sidebar";

// Import all profile section components
import BasicInfoSection from "@/components/profile/basic-info-section";
import ExperienceSection from "@/components/profile/experience-section";
import EducationSection from "@/components/profile/education-section";
import SkillsSection from "@/components/profile/skills-section";
import CertificationsSection from "@/components/profile/certifications-section";
import SocialLinksSection from "@/components/profile/social-links-section";
import PhotoUploadSection from "@/components/profile/photo-upload-section";

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
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("about");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [isUploading, setIsUploading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState<
    "profile" | "cover" | null
  >(null);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);
    if (authenticated) {
      setCurrentUser(getCurrentUser());
    } else {
      router.push("/auth");
    }
  }, [router]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuth || !username) return;

      try {
        setLoading(true);
        setError(null);
        const profileData = await profileAPI.getProfile(username);

        // Fetch user posts to get accurate count
        let postsCount = profileData.posts_count || 0;
        console.log("Profile posts_count from API:", profileData.posts_count);

        try {
          const postsResponse = await postsAPI.getUserPosts(
            profileData.user_id,
            1,
            1
          );
          postsCount = postsResponse.total || postsCount;
          console.log(
            "Posts count from getUserPosts API:",
            postsResponse.total
          );
          console.log("Final posts count used:", postsCount);
        } catch (error) {
          console.warn(
            "Could not fetch posts count, using profile data:",
            error
          );
        }

        // Transform API data to match UI structure - NO HARDCODED DATA
        const transformedData = {
          id: profileData.user_id,
          username: profileData.username,
          full_name: profileData.full_name || profileData.username,
          headline: profileData.headline || "",
          bio: profileData.bio || "",
          about: profileData.about || profileData.bio || "",
          location: profileData.location || "",
          website: profileData.website || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          joinDate: profileData.created_at
            ? new Date(profileData.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })
            : "Recently joined",
          isVerified: profileData.is_verified || false,
          isOnline: true, // Default to online for now
          profilePicture: profileData.profile_photo || null,
          coverPhoto: profileData.cover_photo || null,

          // Use API data - no fallbacks to mock data
          experience: profileData.experience || [],
          education: profileData.education || [],
          skills: profileData.skills || [],
          certifications: profileData.certifications || [],
          social_links: profileData.social_links || {},
          languages: profileData.languages || [],
          interests: profileData.interests || [],

          // Real stats from API
          stats: {
            posts: postsCount,
            followers: profileData.followers_count || 0,
            following: profileData.following_count || 0,
            connections: 0, // Will be calculated from follows
            profileViews: profileData.profile_views || 0,
            postImpressions: 0, // Will be calculated from posts
          },

          // Current position from experience or empty
          currentPosition:
            profileData.experience && profileData.experience.length > 0
              ? {
                  title: profileData.experience[0].title || "",
                  company: profileData.experience[0].company || "",
                  location: profileData.experience[0].location || "",
                  startDate: profileData.experience[0].start_date || "",
                  current: profileData.experience[0].current || false,
                  description: profileData.experience[0].description || "",
                }
              : {
                  title: "",
                  company: "",
                  location: "",
                  startDate: "",
                  current: false,
                  description: "",
                },

          // Recent activity - empty for now, will be populated from posts API
          recentActivity: [],
        };

        setUserData(transformedData);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.detail || "Failed to load profile");
        // Keep mock data as fallback for demonstration
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuth, username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-gray-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Profile Not Found
          </h2>
          <p className="text-slate-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <User2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No Profile Data
          </h2>
          <p className="text-slate-600 dark:text-gray-400">
            Unable to load profile information.
          </p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.username === userData.username;

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

  // Edit profile handlers
  const handleEditProfile = () => {
    setEditFormData({
      full_name: userData.full_name,
      headline: userData.headline,
      about: userData.about,
      location: userData.location,
      website: userData.website,
      phone: userData.phone,
    });
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditFormData({});
  };

  const handleSaveProfile = async () => {
    try {
      const updatedProfile = await profileAPI.updateBasicInfo(editFormData);

      // Refresh the profile data from API to get the latest state
      const refreshedProfile = await profileAPI.getProfile(username);

      // Update local state with fresh API data
      setUserData({
        ...userData,
        full_name: refreshedProfile.full_name || editFormData.full_name,
        headline: refreshedProfile.headline || editFormData.headline,
        about: refreshedProfile.about || editFormData.about,
        location: refreshedProfile.location || editFormData.location,
        website: refreshedProfile.website || editFormData.website,
        phone: refreshedProfile.phone || editFormData.phone,
      });

      setIsEditMode(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated!",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  // Image upload handler
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Create form data for upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "type",
        showImageUpload === "profile" ? "profile_photo" : "cover_photo"
      );

      // Call API to upload image (you'll need to implement this)
      // const response = await profileAPI.uploadPhoto(formData);

      // For now, create a local URL for preview
      const imageUrl = URL.createObjectURL(file);

      // Update local state
      if (showImageUpload === "profile") {
        setUserData({
          ...userData,
          profilePicture: imageUrl,
        });
      } else {
        setUserData({
          ...userData,
          coverPhoto: imageUrl,
        });
      }

      setShowImageUpload(null);
      toast({
        title: "Image uploaded",
        description: `${
          showImageUpload === "profile" ? "Profile" : "Cover"
        } photo updated successfully!`,
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isAuth || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-gray-400">
            {loading ? "Loading profile..." : "Authenticating..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Profile Not Found
          </h2>
          <p className="text-slate-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
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
                onClick={() => setShowImageUpload("cover")}
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
        <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-10">
          <Card className="bg-white dark:bg-gray-900 shadow-xl border border-slate-200 dark:border-gray-700">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-8">
                {/* Profile Picture */}
                <div className="relative -mt-8">
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
                      onClick={() => setShowImageUpload("profile")}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Profile Details */}
                <div className="flex-1 mt-6 lg:mt-0">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      {/* Name and Verification */}
                      <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                          {userData.full_name}
                        </h1>
                        {userData.isVerified && (
                          <CheckCircle className="h-6 w-6 text-blue-500" />
                        )}
                      </div>

                      {/* Username */}
                      <p className="text-slate-500 dark:text-slate-400 italic text-lg mb-4 font-medium">
                        @{userData.username}
                      </p>

                      {/* Headline */}
                      {userData.headline && (
                        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4 leading-snug">
                          {userData.headline}
                        </h2>
                      )}

                      {/* About */}
                      {userData.about && (
                        <p className="text-slate-600 dark:text-slate-400 text-base mb-6 max-w-3xl leading-relaxed">
                          {userData.about}
                        </p>
                      )}

                      {/* Profile Info */}
                      <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                        {userData.location && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span className="font-medium">
                              {userData.location}
                            </span>
                          </div>
                        )}
                        {userData.currentPosition.company && (
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-slate-400" />
                            <span className="font-medium">
                              {userData.currentPosition.company}
                            </span>
                          </div>
                        )}
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
                            onClick={handleEditProfile}
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
                      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {userData.stats.posts.toLocaleString()}
                      </div>
                      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Posts
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {userData.stats.followers.toLocaleString()}
                      </div>
                      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Followers
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {userData.stats.following.toLocaleString()}
                      </div>
                      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Following
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-1">
                        {userData.stats.profileViews > 0
                          ? userData.stats.profileViews.toLocaleString()
                          : "0"}
                      </div>
                      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Profile Views
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleCancelEdit}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                    Edit Profile
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={editFormData.full_name || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          full_name: e.target.value,
                        })
                      }
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Headline */}
                  <div className="space-y-2">
                    <Label htmlFor="headline">Headline</Label>
                    <Input
                      id="headline"
                      value={editFormData.headline || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          headline: e.target.value,
                        })
                      }
                      placeholder="e.g., Software Engineer, Team Lead, Product Manager"
                      maxLength={120}
                    />
                    <p className="text-xs text-slate-500">
                      Short professional title or role (max 120 characters)
                    </p>
                  </div>

                  {/* About */}
                  <div className="space-y-2">
                    <Label htmlFor="about">About</Label>
                    <Textarea
                      id="about"
                      value={editFormData.about || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          about: e.target.value,
                        })
                      }
                      placeholder="Tell us about yourself, your experience, interests, and what makes you unique..."
                      rows={6}
                      maxLength={2000}
                    />
                    <p className="text-xs text-slate-500">
                      Detailed description about yourself (200-300 words
                      recommended, max 2000 characters)
                    </p>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editFormData.location || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          location: e.target.value,
                        })
                      }
                      placeholder="City, Country"
                    />
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editFormData.website || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          website: e.target.value,
                        })
                      }
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editFormData.phone || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Upload Modal */}
      <AnimatePresence>
        {showImageUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImageUpload(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Upload {showImageUpload === "profile" ? "Profile" : "Cover"}{" "}
                    Photo
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowImageUpload(null)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-sm text-slate-600 dark:text-gray-400 mb-4">
                      Choose an image to upload
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <div className="inline-block">
                        <Button
                          type="button"
                          className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
                          disabled={isUploading}
                        >
                          {isUploading ? "Uploading..." : "Choose File"}
                        </Button>
                      </div>
                    </label>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-gray-400">
                    <p>• Maximum file size: 5MB</p>
                    <p>• Supported formats: JPG, PNG, GIF</p>
                    {showImageUpload === "cover" && (
                      <p>• Recommended size: 1200x400 pixels</p>
                    )}
                    {showImageUpload === "profile" && (
                      <p>• Recommended size: 400x400 pixels</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                {userData.email ? (
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
                ) : (
                  isOwnProfile && (
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-slate-300 dark:border-gray-600">
                      <Mail className="h-5 w-5 text-slate-400" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-600 dark:text-gray-400">
                          Email not added
                        </p>
                        <button className="text-teal-600 dark:text-teal-400 text-sm font-medium hover:underline">
                          Click to add email
                        </button>
                      </div>
                    </div>
                  )
                )}

                {userData.phone ? (
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
                ) : (
                  isOwnProfile && (
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-slate-300 dark:border-gray-600">
                      <Phone className="h-5 w-5 text-slate-400" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-600 dark:text-gray-400">
                          Phone not added
                        </p>
                        <button className="text-teal-600 dark:text-teal-400 text-sm font-medium hover:underline">
                          Click to add phone
                        </button>
                      </div>
                    </div>
                  )
                )}

                {userData.website ? (
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
                ) : (
                  isOwnProfile && (
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-slate-300 dark:border-gray-600">
                      <Globe className="h-5 w-5 text-slate-400" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-600 dark:text-gray-400">
                          Website not added
                        </p>
                        <button className="text-teal-600 dark:text-teal-400 text-sm font-medium hover:underline">
                          Click to add website
                        </button>
                      </div>
                    </div>
                  )
                )}

                {userData.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-gray-400">
                        Location
                      </p>
                      <p className="text-slate-900 dark:text-white font-medium">
                        {userData.location}
                      </p>
                    </div>
                  </div>
                )}
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
                {userData.skills && userData.skills.length > 0 ? (
                  <>
                    {userData.skills.slice(0, 6).map((skill) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {skill.name}
                          </span>
                          <span className="text-xs text-slate-600 dark:text-gray-400">
                            {skill.endorsements || 0} endorsements
                          </span>
                        </div>
                        <Progress value={skill.level || 0} className="h-2" />
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-4">
                      View all skills
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-gray-400 mb-4">
                      {isOwnProfile
                        ? "No skills added yet"
                        : "No skills to display"}
                    </p>
                    {isOwnProfile && (
                      <Button
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Skills
                      </Button>
                    )}
                  </div>
                )}
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
                {userData.languages && userData.languages.length > 0 ? (
                  userData.languages.map((language) => (
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
                        <Progress value={language.level || 0} className="h-2" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Languages className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-gray-400 mb-4">
                      {isOwnProfile
                        ? "No languages added yet"
                        : "No languages to display"}
                    </p>
                    {isOwnProfile && (
                      <Button
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Languages
                      </Button>
                    )}
                  </div>
                )}
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
                    {userData.about ? (
                      <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
                        {userData.about}
                      </p>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-gray-400 mb-4">
                          {isOwnProfile
                            ? "No about section added yet"
                            : "No about information available"}
                        </p>
                        {isOwnProfile && (
                          <Button
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-700"
                            onClick={handleEditProfile}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add About
                          </Button>
                        )}
                      </div>
                    )}
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
                    {userData.interests && userData.interests.length > 0 ? (
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
                    ) : (
                      <div className="text-center py-8">
                        <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-gray-400 mb-4">
                          {isOwnProfile
                            ? "No interests added yet"
                            : "No interests to display"}
                        </p>
                        {isOwnProfile && (
                          <Button
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Interests
                          </Button>
                        )}
                      </div>
                    )}
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
                    {userData.certifications &&
                    userData.certifications.length > 0 ? (
                      userData.certifications.map((cert) => (
                        <div
                          key={cert.name}
                          className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="relative w-12 h-12">
                            <Image
                              src={
                                cert.logo || "/assets/default-certification.png"
                              }
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
                            {cert.credentialId && (
                              <p className="text-xs text-slate-500 dark:text-gray-500">
                                Credential ID: {cert.credentialId}
                              </p>
                            )}
                          </div>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Award className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-gray-400 mb-4">
                          {isOwnProfile
                            ? "No certifications added yet"
                            : "No certifications to display"}
                        </p>
                        {isOwnProfile && (
                          <Button
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Certification
                          </Button>
                        )}
                      </div>
                    )}
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
                    {userData.experience && userData.experience.length > 0 ? (
                      userData.experience.map((exp) => (
                        <div
                          key={exp.id || exp.title}
                          className="border-l-2 border-teal-200 dark:border-teal-800 pl-6 relative"
                        >
                          <div className="absolute -left-2 top-0 w-4 h-4 bg-teal-600 dark:bg-teal-400 rounded-full"></div>
                          <div className="flex items-start space-x-4">
                            {exp.companyLogo && (
                              <div className="relative w-12 h-12">
                                <Image
                                  src={exp.companyLogo}
                                  alt={exp.company}
                                  fill
                                  className="rounded-lg object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {exp.title}
                              </h3>
                              <p className="text-teal-600 dark:text-teal-400 font-medium">
                                {exp.company}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-gray-400">
                                {exp.start_date || exp.startDate} -{" "}
                                {exp.current
                                  ? "Present"
                                  : exp.end_date || exp.endDate}
                                {exp.location && ` • ${exp.location}`}
                              </p>
                              {exp.description && (
                                <p className="text-slate-700 dark:text-gray-300 mt-2">
                                  {exp.description}
                                </p>
                              )}
                              {exp.skills && exp.skills.length > 0 && (
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
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Briefcase className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-gray-400 mb-4">
                          {isOwnProfile
                            ? "No work experience added yet"
                            : "No work experience to display"}
                        </p>
                        {isOwnProfile && (
                          <Button
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Experience
                          </Button>
                        )}
                      </div>
                    )}
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
                    {userData.education && userData.education.length > 0 ? (
                      userData.education.map((edu) => (
                        <div
                          key={edu.id || edu.school}
                          className="border-l-2 border-blue-200 dark:border-blue-800 pl-6 relative"
                        >
                          <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                          <div className="flex items-start space-x-4">
                            {edu.logo && (
                              <div className="relative w-12 h-12">
                                <Image
                                  src={edu.logo}
                                  alt={edu.school}
                                  fill
                                  className="rounded-lg object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {edu.degree}
                              </h3>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">
                                {edu.school}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-gray-400">
                                {edu.field && `${edu.field} • `}
                                {edu.start_date || edu.startDate} -{" "}
                                {edu.end_date || edu.endDate}
                                {edu.location && ` • ${edu.location}`}
                              </p>
                              {edu.gpa && (
                                <p className="text-sm text-slate-600 dark:text-gray-400">
                                  GPA: {edu.gpa}
                                </p>
                              )}
                              {edu.achievements &&
                                edu.achievements.length > 0 && (
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
                                )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <GraduationCap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-gray-400 mb-4">
                          {isOwnProfile
                            ? "No education added yet"
                            : "No education to display"}
                        </p>
                        {isOwnProfile && (
                          <Button
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Education
                          </Button>
                        )}
                      </div>
                    )}
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
                    {userData.recentActivity &&
                    userData.recentActivity.length > 0 ? (
                      userData.recentActivity.map((activity: any) => (
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
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-gray-400 mb-4">
                          {isOwnProfile
                            ? "No recent activity"
                            : "No activity to display"}
                        </p>
                        {isOwnProfile && (
                          <p className="text-sm text-slate-500 dark:text-gray-500">
                            Start posting, sharing, or engaging to see your
                            activity here
                          </p>
                        )}
                      </div>
                    )}
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
