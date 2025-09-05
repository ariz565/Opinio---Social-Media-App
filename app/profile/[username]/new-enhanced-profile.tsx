"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  MoreHorizontal,
  UserPlus,
  UserCheck,
  MessageSquare,
  Bell,
  Share,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  isAuthenticated,
  getCurrentUser,
  type User,
  profileAPI,
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
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const profileData = await profileAPI.getProfile(username);
      setProfile(profileData);
    } catch (error: any) {
      console.error("Failed to fetch profile:", error);

      if (error.response?.status === 404) {
        toast({
          title: "User Not Found",
          description: `The user "${username}" does not exist. Please check the username and try again.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load profile. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [username, toast]);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);
    if (authenticated) {
      const user = getCurrentUser();
      setCurrentUser(user);

      // Debug: Log the current user to see what username they have
      console.log("🔍 Current logged-in user:", user);
      console.log("🔍 Trying to access profile for username:", username);

      if (user?.username) {
        console.log("🔍 Your actual username is:", user.username);
        console.log("🔍 You should visit: /profile/" + user.username);
      }
    } else {
      router.push("/auth");
    }
  }, [router, username]);

  useEffect(() => {
    if (isAuth) {
      fetchProfile();
    }
  }, [isAuth, username, fetchProfile]);

  const isOwnProfile = currentUser?.username === username;

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: `You ${isFollowing ? "unfollowed" : "are now following"} ${
        profile?.full_name || username
      }`,
    });
  };

  if (!isAuth || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            User Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The user <span className="font-semibold">{username}</span> could not
            be found.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Please check the username and try again, or the user may not have
            created an account yet.
          </p>
          {currentUser?.username && currentUser.username !== username && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                💡 Tip: You are logged in as{" "}
                <span className="font-semibold">{currentUser.username}</span>
              </p>
              <Button
                size="sm"
                onClick={() => router.push(`/profile/${currentUser.username}`)}
                className="mt-2"
              >
                View Your Profile
              </Button>
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push("/feed")}>Go to Feed</Button>
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const fullName = profile?.full_name || username;
  const bio = profile?.bio || "";
  const location = profile?.location || "";
  const profilePhoto = profile?.profile_picture;
  const coverPhoto = profile?.cover_photo;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo Section */}
      <div className="relative">
        {coverPhoto ? (
          <div className="h-64 w-full relative">
            <Image src={coverPhoto} alt="Cover" fill className="object-cover" />
          </div>
        ) : (
          <div className="h-64 w-full bg-gradient-to-r from-blue-600 to-purple-600" />
        )}

        {/* Profile Header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 pb-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Profile Picture */}
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src={profilePhoto} alt={fullName} />
                    <AvatarFallback className="text-2xl">
                      {fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {fullName}
                      </h1>
                      <p className="text-lg text-gray-600">@{username}</p>
                      {bio && (
                        <p className="text-gray-700 mt-2 max-w-2xl">{bio}</p>
                      )}
                      {location && (
                        <div className="flex items-center gap-2 mt-2 text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{location}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {!isOwnProfile && (
                      <div className="flex gap-3 mt-4 sm:mt-0">
                        <Button
                          onClick={handleFollow}
                          variant={isFollowing ? "outline" : "default"}
                        >
                          {isFollowing ? (
                            <>
                              <UserCheck className="w-4 h-4 mr-2" />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Follow
                            </>
                          )}
                        </Button>
                        <Button variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Share className="w-4 h-4 mr-2" />
                              Share Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Bell className="w-4 h-4 mr-2" />
                              Notifications
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 mt-6 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">
                        {profile?.stats?.followers || 0}
                      </div>
                      <div className="text-sm text-gray-500">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">
                        {profile?.stats?.following || 0}
                      </div>
                      <div className="text-sm text-gray-500">Following</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">
                        {profile?.stats?.posts || 0}
                      </div>
                      <div className="text-sm text-gray-500">Posts</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Upload Section - Only for own profile */}
            {isOwnProfile && (
              <PhotoUploadSection
                profile={profile}
                isOwnProfile={isOwnProfile}
                onUpdate={fetchProfile}
              />
            )}

            {/* Basic Info Section */}
            <BasicInfoSection
              profile={profile}
              isOwnProfile={isOwnProfile}
              onUpdate={fetchProfile}
            />

            {/* Experience Section */}
            <ExperienceSection
              profile={profile}
              isOwnProfile={isOwnProfile}
              onUpdate={fetchProfile}
            />

            {/* Education Section */}
            <EducationSection
              profile={profile}
              isOwnProfile={isOwnProfile}
              onUpdate={fetchProfile}
            />

            {/* Skills Section */}
            <SkillsSection
              profile={profile}
              isOwnProfile={isOwnProfile}
              onUpdate={fetchProfile}
            />

            {/* Certifications Section */}
            <CertificationsSection
              profile={profile}
              isOwnProfile={isOwnProfile}
              onUpdate={fetchProfile}
            />

            {/* Social Links Section */}
            <SocialLinksSection
              profile={profile}
              isOwnProfile={isOwnProfile}
              onUpdate={fetchProfile}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
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
