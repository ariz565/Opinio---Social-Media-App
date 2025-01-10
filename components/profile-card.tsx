"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MapPin, Link as LinkIcon, Calendar } from "lucide-react";
import { QuickEditProfile } from "./profile/quick-edit-profile";

export function ProfileCard() {
  const [profileData, setProfileData] = useState({
    name: "Demo Test",
    bio: "Full-stack developer passionate about creating beautiful and functional web applications.",
    location: "San Francisco, CA",
    website: "demotest.dev",
  });

  const handleSave = (updatedData: any) => {
    setProfileData(updatedData);
  };

  return (
    <Card>
      <CardHeader className="relative h-32">
        <img
          src="https://images.unsplash.com/photo-1506102383123-c8ef1e872756"
          alt="Cover"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <Avatar className="absolute -bottom-16 left-4 h-24 w-24 border-4 border-background">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="pt-16">
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl font-bold">{profileData.name}</h2>
            <p className="text-muted-foreground">
              @{profileData.name.toLowerCase().replace(" ", "")}
            </p>
          </div>
          <QuickEditProfile initialData={profileData} onSave={handleSave} />
        </div>
        <p className="mt-4">{profileData.bio}</p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{profileData.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <LinkIcon className="h-4 w-4" />
            <a href="#" className="text-primary">
              {profileData.website}
            </a>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Joined November 2024</span>
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <div>
            <span className="font-bold">1,234</span>{" "}
            <span className="text-muted-foreground">Following</span>
          </div>
          <div>
            <span className="font-bold">5,678</span>{" "}
            <span className="text-muted-foreground">Followers</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
