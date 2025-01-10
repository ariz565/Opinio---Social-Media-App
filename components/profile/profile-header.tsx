"use client";

import { useState } from "react";
import { Camera, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ImageUploader } from "./image-uploader";

interface ProfileHeaderProps {
  user: {
    name: string;
    username: string;
    bio: string;
    avatar: string;
    banner: string;
    followers: number;
    following: number;
  };
  isOwnProfile?: boolean;
}

export function ProfileHeader({
  user,
  isOwnProfile = false,
}: ProfileHeaderProps) {
  const [showAvatarUploader, setShowAvatarUploader] = useState(false);
  const [showBannerUploader, setShowBannerUploader] = useState(false);

  return (
    <div className="relative">
      {/* Banner */}
      <div className="relative h-48 md:h-64 bg-muted">
        {user.banner ? (
          <img
            src={user.banner}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-600" />
        )}
        {isOwnProfile && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-4 right-4"
            onClick={() => setShowBannerUploader(true)}
          >
            <Camera className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Avatar and Profile Info */}
      <div className="px-4">
        <div className="relative -mt-20 flex items-end justify-between">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <Button
                variant="secondary"
                size="icon"
                className="absolute bottom-0 right-0"
                onClick={() => setShowAvatarUploader(true)}
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </div>
          {isOwnProfile ? (
            <Button>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <Button>Follow</Button>
          )}
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
          <p className="mt-2">{user.bio}</p>

          <div className="flex gap-4 mt-4">
            <div>
              <span className="font-bold">{user.following}</span>{" "}
              <span className="text-muted-foreground">Following</span>
            </div>
            <div>
              <span className="font-bold">{user.followers}</span>{" "}
              <span className="text-muted-foreground">Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload Modals */}
      <ImageUploader
        open={showAvatarUploader}
        onClose={() => setShowAvatarUploader(false)}
        onUpload={(url) => console.log("Avatar uploaded:", url)}
        aspectRatio={1}
        title="Update profile picture"
      />
      <ImageUploader
        open={showBannerUploader}
        onClose={() => setShowBannerUploader(false)}
        onUpload={(url) => console.log("Banner uploaded:", url)}
        aspectRatio={3}
        title="Update banner image"
      />
    </div>
  );
}
