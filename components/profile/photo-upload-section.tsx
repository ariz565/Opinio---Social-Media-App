"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Camera,
  Upload,
  X,
  User,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { profileAPI } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface PhotoUploadSectionProps {
  profile: any;
  isOwnProfile: boolean;
  onUpdate: () => void;
}

export default function PhotoUploadSection({
  profile,
  isOwnProfile,
  onUpdate,
}: PhotoUploadSectionProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [dragActive, setDragActive] = useState<"profile" | "cover" | null>(
    null
  );

  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePhotoUpload = async (file: File) => {
    if (!file) return;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Profile photo must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or WebP image.",
        variant: "destructive",
      });
      return;
    }

    setUploadingProfile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await profileAPI.uploadProfilePhoto(formData);

      toast({
        title: "Profile photo updated",
        description: "Your profile photo has been updated successfully.",
      });

      onUpdate();
    } catch (error) {
      console.error("Failed to upload profile photo:", error);
      toast({
        title: "Error",
        description: "Failed to upload profile photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingProfile(false);
    }
  };

  const handleCoverPhotoUpload = async (file: File) => {
    if (!file) return;

    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Cover photo must be less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or WebP image.",
        variant: "destructive",
      });
      return;
    }

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await profileAPI.uploadCoverPhoto(formData);

      toast({
        title: "Cover photo updated",
        description: "Your cover photo has been updated successfully.",
      });

      onUpdate();
    } catch (error) {
      console.error("Failed to upload cover photo:", error);
      toast({
        title: "Error",
        description: "Failed to upload cover photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingCover(false);
    }
  };

  const handleDeleteProfilePhoto = async () => {
    if (!confirm("Are you sure you want to remove your profile photo?")) {
      return;
    }

    setLoading(true);
    try {
      await profileAPI.deleteProfilePhoto();

      toast({
        title: "Profile photo removed",
        description: "Your profile photo has been removed successfully.",
      });

      onUpdate();
    } catch (error) {
      console.error("Failed to delete profile photo:", error);
      toast({
        title: "Error",
        description: "Failed to remove profile photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoverPhoto = async () => {
    if (!confirm("Are you sure you want to remove your cover photo?")) {
      return;
    }

    setLoading(true);
    try {
      await profileAPI.deleteCoverPhoto();

      toast({
        title: "Cover photo removed",
        description: "Your cover photo has been removed successfully.",
      });

      onUpdate();
    } catch (error) {
      console.error("Failed to delete cover photo:", error);
      toast({
        title: "Error",
        description: "Failed to remove cover photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent, type: "profile" | "cover") => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(type);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  };

  const handleDrop = (e: React.DragEvent, type: "profile" | "cover") => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (type === "profile") {
        handleProfilePhotoUpload(file);
      } else {
        handleCoverPhotoUpload(file);
      }
    }
  };

  const profilePhoto = profile?.profile?.profile_photo;
  const coverPhoto = profile?.profile?.cover_photo;
  const fullName =
    profile?.profile?.basic_info?.full_name || profile?.username || "User";

  if (!isOwnProfile) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Photos
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Profile Photo Section */}
        <div>
          <h3 className="text-lg font-medium mb-4">Profile Photo</h3>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profilePhoto} alt={fullName} />
                <AvatarFallback className="text-lg">
                  {fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {profilePhoto && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                  onClick={handleDeleteProfilePhoto}
                  disabled={loading}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>

            <div className="flex-1">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive === "profile"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={(e) => handleDrag(e, "profile")}
                onDragLeave={(e) => handleDrag(e, "profile")}
                onDragOver={(e) => handleDrag(e, "profile")}
                onDrop={(e) => handleDrop(e, "profile")}
              >
                <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop or click to upload profile photo
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Recommended: Square image, at least 200x200px, max 5MB
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => profileFileInputRef.current?.click()}
                  disabled={uploadingProfile}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploadingProfile ? "Uploading..." : "Choose File"}
                </Button>
              </div>

              <input
                ref={profileFileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleProfilePhotoUpload(file);
                }}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Cover Photo Section */}
        <div>
          <h3 className="text-lg font-medium mb-4">Cover Photo</h3>
          <div>
            {coverPhoto ? (
              <div className="relative">
                <div
                  className="w-full h-48 rounded-lg bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${coverPhoto})` }}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => coverFileInputRef.current?.click()}
                    disabled={uploadingCover}
                    className="flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    {uploadingCover ? "Uploading..." : "Change"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteCoverPhoto}
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  dragActive === "cover"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={(e) => handleDrag(e, "cover")}
                onDragLeave={(e) => handleDrag(e, "cover")}
                onDragOver={(e) => handleDrag(e, "cover")}
                onDrop={(e) => handleDrop(e, "cover")}
              >
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600 mb-2">
                  Add a cover photo to personalize your profile
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Recommended: 1200x300px, max 10MB
                </p>
                <Button
                  variant="outline"
                  onClick={() => coverFileInputRef.current?.click()}
                  disabled={uploadingCover}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploadingCover ? "Uploading..." : "Upload Cover Photo"}
                </Button>
              </div>
            )}

            <input
              ref={coverFileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCoverPhotoUpload(file);
              }}
              className="hidden"
            />
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Photo Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use a clear, professional headshot for your profile photo</li>
            <li>• Cover photos should be 1200x300px for best results</li>
            <li>• Supported formats: JPEG, PNG, WebP</li>
            <li>• Keep file sizes under 5MB for profile and 10MB for cover</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
