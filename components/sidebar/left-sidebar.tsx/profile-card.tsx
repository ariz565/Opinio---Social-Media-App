"use client";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { MapPin, Link as LinkIcon, Calendar, Briefcase } from "lucide-react"; // Added Briefcase icon
import { QuickEditProfile } from "../../profile/quick-edit-profile";
import Link from "next/link";

export function ProfileCard() {
  const [profileData, setProfileData] = useState({
    name: "Demo Test",
    bio: "Full-stack developer passionate about creating beautiful and functional web applications.",
    location: "San Francisco, CA",
    website: "demotest.dev",
    title: "Software Engineer",
  });

  const handleSave = (updatedData: any) => {
    setProfileData(updatedData);
  };

  return (
    <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="relative h-48">
        <img
          src="https://images.unsplash.com/photo-1506102383123-c8ef1e872756"
          alt="Cover"
          className="absolute inset-0 h-full w-full object-cover rounded-t-lg"
        />
        <Avatar className="absolute -bottom-16 left-6 h-28 w-28 border-4 border-background shadow-lg">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="pt-20 px-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-foreground hover:text-primary transition-colors duration-200">
              <Link
                href={`/profile/${profileData.name
                  .toLowerCase()
                  .replace(" ", "")}`}
              >
                {profileData.name}
              </Link>
            </h2>
            <p className="text-muted-foreground text-sm">
              @{profileData.name.toLowerCase().replace(" ", "")}
            </p>
            {/* <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-5 w-5 text-primary" />
              <span>{profileData.title}</span>
            </div> */}
          </div>
          <QuickEditProfile initialData={profileData} onSave={handleSave} />
        </div>
        {/* <div className="flex items-center gap-2 text-muted-foreground">
          <Briefcase className="h-4 w-4 text-primary" />
          <span>{profileData.title}</span>
        </div> */}
        <p className="mt-4 text-foreground/90">{profileData.bio}</p>
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-5 w-5 text-primary" />
            <span>{profileData.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <LinkIcon className="h-5 w-5 text-primary" />
            <a
              href={`https://${profileData.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {profileData.website}
            </a>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Joined January 2025</span>
          </div>
        </div>
        <div className="mt-6 flex gap-6">
          <div className="hover:text-primary transition-colors duration-200">
            <span className="font-bold">1,234</span>{" "}
            <span className="text-muted-foreground">Following</span>
          </div>
          <div className="hover:text-primary transition-colors duration-200">
            <span className="font-bold">5,678</span>{" "}
            <span className="text-muted-foreground">Followers</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
