"use client";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Briefcase,
  School,
  Plus,
} from "lucide-react";

interface ProfileAboutProps {
  isOwnProfile?: boolean;
  details: {
    location?: string;
    website?: string;
    joinDate: string;
    work?: {
      position: string;
      company: string;
      current: boolean;
    }[];
    education?: {
      school: string;
      degree: string;
      graduationYear: string;
    }[];
  };
}

export function ProfileAbout({ isOwnProfile, details }: ProfileAboutProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>About</CardTitle>
        {isOwnProfile && (
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Details
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {details.work && details.work.length > 0 && (
          <div className="flex gap-2">
            <Briefcase className="h-4 w-4 mt-1 text-muted-foreground" />
            <div className="space-y-2">
              {details.work.map((job, i) => (
                <div key={i}>
                  <div className="font-medium">{job.position}</div>
                  <div className="text-sm text-muted-foreground">
                    {job.company} • {job.current ? "Present" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {details.education && details.education.length > 0 && (
          <div className="flex gap-2">
            <School className="h-4 w-4 mt-1 text-muted-foreground" />
            <div className="space-y-2">
              {details.education.map((edu, i) => (
                <div key={i}>
                  <div className="font-medium">{edu.school}</div>
                  <div className="text-sm text-muted-foreground">
                    {edu.degree} • {edu.graduationYear}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {details.location && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{details.location}</span>
          </div>
        )}

        {details.website && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <LinkIcon className="h-4 w-4" />
            <a href={details.website} className="text-primary hover:underline">
              {details.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}

        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Joined {details.joinDate}</span>
        </div>
      </CardContent>
    </Card>
  );
}
