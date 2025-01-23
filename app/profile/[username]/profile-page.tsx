"use client";

import { useState } from "react";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { ProfileAbout } from "@/components/profile/profile-about";
import { ProfileConnections } from "@/components/profile/profile-connections";
import { PeopleYouMayKnow } from "@/components/sidebar/right-sidebar.tsx/people-you-may-know";
import { ProfileAnalytics } from "@/components/profile/profile-analytics";
import { ProfileResources } from "@/components/profile/profile-resources";
import { ProfileActivity } from "@/components/profile/profile-activity";
import { ProfileEducation } from "@/components/profile/profile-education";
import { ProfileExperience } from "@/components/profile/profile-experience";
import { ProfileSkills } from "@/components/profile/profile-skills";
import { ProfileLanguages } from "@/components/profile/profile-languages";
import { Button } from "@/components/ui/button";
import { PencilLine, Share2, Download } from "lucide-react";

interface ProfilePageProps {
  username: string;
  initialData: {
    name: string;
    username: string;
    bio: string;
    avatar: string;
    banner: string;
    followers: number;
    following: number;
    details: {
      location: string;
      website: string;
      joinDate: string;
      work: Array<{
        position: string;
        company: string;
        current: boolean;
      }>;
      education: Array<{
        school: string;
        degree: string;
        graduationYear: string;
      }>;
    };
  };
}

export function ProfilePage({ username, initialData }: ProfilePageProps) {
  const isOwnProfile = username === "johndoe"; // Replace with actual auth check
  const [showContactInfo, setShowContactInfo] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader user={initialData} isOwnProfile={isOwnProfile} />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {/* Main Content */}
          <div className="md:col-span-2 lg:col-span-3 space-y-6">
            {/* Quick Actions */}
            <div className="flex items-center justify-between bg-background p-4 rounded-lg border">
              <div className="space-y-1">
                <h2 className="font-semibold">Open to</h2>
                <p className="text-sm text-muted-foreground">
                  {isOwnProfile
                    ? "Showcase services you"
                    : "Contact for opportunities"}
                </p>
              </div>
              <Button variant="outline">
                <PencilLine className="h-4 w-4 mr-2" />
                {isOwnProfile ? "Add services" : "Contact"}
              </Button>
            </div>

            {/* Analytics Section */}
            <ProfileAnalytics isPrivate={!isOwnProfile} />

            {/* About Section */}
            <ProfileAbout
              isOwnProfile={isOwnProfile}
              details={initialData.details}
            />

            {/* Experience Section */}
            <ProfileExperience isOwnProfile={isOwnProfile} />

            {/* Education Section */}
            <ProfileEducation isOwnProfile={isOwnProfile} />

            {/* Skills & Endorsements */}
            <ProfileSkills isOwnProfile={isOwnProfile} />

            {/* Languages */}
            <ProfileLanguages isOwnProfile={isOwnProfile} />

            {/* Activity Section */}
            <ProfileActivity username={username} />

            {/* Posts & Articles */}
            <ProfileTabs posts={[]} media={[]} likes={[]} />
          </div>

          {/* Right Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Profile Actions */}
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share profile
              </Button>
              {isOwnProfile && (
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Save as PDF
                </Button>
              )}
            </div>

            {/* Resources Section */}
            <ProfileResources isOwnProfile={isOwnProfile} />

            {/* People You May Know */}
            <PeopleYouMayKnow />

            {/* Profile Connections */}
            <ProfileConnections connections={[]} />
          </div>
        </div>
      </div>
    </div>
  );
}
