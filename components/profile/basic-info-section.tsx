"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Edit2,
  Plus,
  Save,
  X,
  MapPin,
  Globe,
  Phone,
  Eye,
  EyeOff,
  Lock,
  Users,
} from "lucide-react";
import { profileAPI } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface BasicInfoSectionProps {
  profile: any;
  isOwnProfile: boolean;
  onUpdate: () => void;
}

export default function BasicInfoSection({
  profile,
  isOwnProfile,
  onUpdate,
}: BasicInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    bio: profile?.bio || "",
    location: profile?.location || "",
    website: profile?.website || "",
    phone: profile?.phone || "",
  });
  const [privacy, setPrivacy] = useState({
    location: profile?.privacy?.location || "public",
    website: profile?.privacy?.website || "public",
    phone: profile?.privacy?.phone || "private",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await profileAPI.updateBasicInfo(formData);

      toast({
        title: "Profile updated",
        description: "Your basic information has been updated successfully.",
      });

      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Failed to update basic info:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
      website: profile?.website || "",
      phone: profile?.phone || "",
    });
    setIsEditing(false);
  };

  const isEmpty =
    !profile?.full_name &&
    !profile?.bio &&
    !profile?.location &&
    !profile?.website;

  if (!isOwnProfile && isEmpty) {
    return null;
  }

  const PrivacyToggle = ({
    field,
    value,
    onChange,
  }: {
    field: string;
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant={value === "public" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("public")}
        className="h-6 px-2 text-xs"
      >
        <Users className="w-3 h-3 mr-1" />
        Public
      </Button>
      <Button
        type="button"
        variant={value === "private" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("private")}
        className="h-6 px-2 text-xs"
      >
        <Lock className="w-3 h-3 mr-1" />
        Private
      </Button>
    </div>
  );

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">About</CardTitle>
        {isOwnProfile && (
          <Button
            variant={isEditing ? "ghost" : "outline"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            {isEditing ? (
              <X className="w-4 h-4" />
            ) : (
              <Edit2 className="w-4 h-4" />
            )}
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {isEmpty && !isEditing ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Edit2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tell others about yourself
            </h3>
            <p className="text-gray-500 mb-4 max-w-sm">
              Add your bio, location, and contact information to help others
              learn more about you.
            </p>
            {isOwnProfile && (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Info
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Write a brief bio about yourself..."
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <PrivacyToggle
                      field="location"
                      value={privacy.location}
                      onChange={(value) =>
                        setPrivacy({ ...privacy, location: value })
                      }
                    />
                  </div>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Website
                    </label>
                    <PrivacyToggle
                      field="website"
                      value={privacy.website}
                      onChange={(value) =>
                        setPrivacy({ ...privacy, website: value })
                      }
                    />
                  </div>
                  <Input
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <PrivacyToggle
                      field="phone"
                      value={privacy.phone}
                      onChange={(value) =>
                        setPrivacy({ ...privacy, phone: value })
                      }
                    />
                  </div>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                {profile?.bio && (
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-4">
                  {profile?.location &&
                    (privacy.location === "public" || isOwnProfile) && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                        {privacy.location === "private" && isOwnProfile && (
                          <Lock className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                    )}

                  {profile?.website &&
                    (privacy.website === "public" || isOwnProfile) && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="w-4 h-4" />
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {profile.website.replace(/^https?:\/\//, "")}
                        </a>
                        {privacy.website === "private" && isOwnProfile && (
                          <Lock className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                    )}

                  {profile?.phone &&
                    (privacy.phone === "public" || isOwnProfile) && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{profile.phone}</span>
                        {privacy.phone === "private" && isOwnProfile && (
                          <Lock className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                    )}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
