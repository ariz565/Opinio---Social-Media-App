"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Edit2,
  Plus,
  Save,
  X,
  Globe,
  Trash2,
  Lock,
  ExternalLink,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
} from "lucide-react";
import { profileAPI } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface SocialLink {
  platform: string;
  url: string;
  username?: string;
}

interface SocialLinksSectionProps {
  profile: any;
  isOwnProfile: boolean;
  onUpdate: () => void;
}

const SOCIAL_PLATFORMS = [
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    placeholder: "https://linkedin.com/in/username",
  },
  {
    id: "github",
    name: "GitHub",
    icon: Github,
    placeholder: "https://github.com/username",
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: Twitter,
    placeholder: "https://twitter.com/username",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    placeholder: "https://instagram.com/username",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    placeholder: "https://facebook.com/username",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    placeholder: "https://youtube.com/@username",
  },
  {
    id: "discord",
    name: "Discord",
    icon: MessageCircle,
    placeholder: "https://discord.gg/username",
  },
  {
    id: "website",
    name: "Personal Website",
    icon: Globe,
    placeholder: "https://yourwebsite.com",
  },
];

export default function SocialLinksSection({
  profile,
  isOwnProfile,
  onUpdate,
}: SocialLinksSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Transform social_links from object to array format
  const transformSocialLinks = (social_links: any): SocialLink[] => {
    if (!social_links) return [];
    if (Array.isArray(social_links)) return social_links;

    // Convert object to array format
    return Object.entries(social_links).map(([platform, url]) => ({
      platform,
      url: url as string,
    }));
  };

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    transformSocialLinks(profile?.profile?.social_links)
  );
  const [isPrivate, setIsPrivate] = useState(
    profile?.profile?.privacy?.social_links === "private"
  );

  const handleSaveSocialLinks = async () => {
    setLoading(true);
    try {
      await profileAPI.updateSocialLinks({
        social_links: socialLinks,
        privacy: isPrivate ? "private" : "public",
      });

      toast({
        title: "Social links updated",
        description: "Your social links have been updated successfully.",
      });

      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Failed to update social links:", error);
      toast({
        title: "Error",
        description: "Failed to update social links. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLink = (platform: string, url: string) => {
    if (!url.trim()) {
      // Remove link if URL is empty
      setSocialLinks(socialLinks.filter((link) => link.platform !== platform));
      return;
    }

    const existingLinkIndex = socialLinks.findIndex(
      (link) => link.platform === platform
    );
    const username = extractUsername(platform, url);

    const newLink: SocialLink = {
      platform,
      url: url.trim(),
      username,
    };

    if (existingLinkIndex >= 0) {
      // Update existing link
      const updatedLinks = [...socialLinks];
      updatedLinks[existingLinkIndex] = newLink;
      setSocialLinks(updatedLinks);
    } else {
      // Add new link
      setSocialLinks([...socialLinks, newLink]);
    }
  };

  const extractUsername = (platform: string, url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;

      switch (platform) {
        case "linkedin":
          const linkedinMatch = pathname.match(/\/in\/([^\/]+)/);
          return linkedinMatch ? linkedinMatch[1] : "";
        case "github":
          const githubMatch = pathname.match(/\/([^\/]+)$/);
          return githubMatch ? githubMatch[1] : "";
        case "twitter":
          const twitterMatch = pathname.match(/\/([^\/]+)$/);
          return twitterMatch ? twitterMatch[1] : "";
        case "instagram":
          const instagramMatch = pathname.match(/\/([^\/]+)$/);
          return instagramMatch ? instagramMatch[1] : "";
        case "youtube":
          const youtubeMatch = pathname.match(/\/@([^\/]+)/);
          return youtubeMatch ? youtubeMatch[1] : "";
        default:
          return "";
      }
    } catch {
      return "";
    }
  };

  const getLinkByPlatform = (platform: string): SocialLink | undefined => {
    return socialLinks.find((link) => link.platform === platform);
  };

  const getPlatformIcon = (platform: string) => {
    const platformData = SOCIAL_PLATFORMS.find((p) => p.id === platform);
    return platformData?.icon || Globe;
  };

  const getPlatformName = (platform: string) => {
    const platformData = SOCIAL_PLATFORMS.find((p) => p.id === platform);
    return platformData?.name || platform;
  };

  const isEmpty = !socialLinks || socialLinks.length === 0;
  const isHidden = !isOwnProfile && isPrivate;

  if (isHidden) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Social Links
          {isPrivate && <Lock className="w-4 h-4 text-gray-500" />}
        </CardTitle>
        {isOwnProfile && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <div className="space-y-6">
            {/* Privacy Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {isPrivate ? (
                  <Lock className="w-4 h-4 text-gray-500" />
                ) : (
                  <Globe className="w-4 h-4 text-green-500" />
                )}
                <span className="text-sm font-medium">
                  {isPrivate
                    ? "Private - Only you can see this"
                    : "Public - Visible to everyone"}
                </span>
              </div>
              <Switch
                checked={!isPrivate}
                onCheckedChange={(checked) => setIsPrivate(!checked)}
              />
            </div>

            {/* Social Platform Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">
                Add your social media profiles
              </h3>
              {SOCIAL_PLATFORMS.map((platform) => {
                const Icon = platform.icon;
                const existingLink = getLinkByPlatform(platform.id);

                return (
                  <div key={platform.id} className="flex items-center gap-3">
                    <div className="flex items-center gap-2 w-32">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {platform.name}
                      </span>
                    </div>
                    <div className="flex-1">
                      <Input
                        value={existingLink?.url || ""}
                        onChange={(e) =>
                          handleUpdateLink(platform.id, e.target.value)
                        }
                        placeholder={platform.placeholder}
                        className="w-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Save Button */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveSocialLinks} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Social Links"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setSocialLinks(
                    transformSocialLinks(profile?.profile?.social_links)
                  );
                  setIsPrivate(
                    profile?.profile?.privacy?.social_links === "private"
                  );
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No social links added
            </h3>
            <p className="text-gray-500 mb-4 max-w-sm">
              Connect with others by adding your social media profiles and
              websites.
            </p>
            {isOwnProfile && (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Social Links
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socialLinks.map((link, index) => {
                const Icon = getPlatformIcon(link.platform);
                const platformName = getPlatformName(link.platform);

                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <Icon className="w-5 h-5 text-gray-600" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm">
                        {platformName}
                      </div>
                      {link.username && (
                        <div className="text-xs text-gray-500 truncate">
                          @{link.username}
                        </div>
                      )}
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </a>
                );
              })}
            </div>

            {isOwnProfile && (
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Social Links
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
