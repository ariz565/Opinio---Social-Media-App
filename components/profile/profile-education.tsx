"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, PencilLine } from "lucide-react";

interface ProfileEducationProps {
  isOwnProfile?: boolean;
}

export function ProfileEducation({ isOwnProfile }: ProfileEducationProps) {
  const education = [
    {
      school: "University of Technology",
      degree: "Bachelor of Science in Computer Science",
      graduationYear: "2020",
      logo: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952",
      description:
        "Specialized in Software Engineering and Artificial Intelligence. Graduated with honors.",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Education</CardTitle>
        {isOwnProfile && (
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className="relative">
            {isOwnProfile && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
              >
                <PencilLine className="h-4 w-4" />
              </Button>
            )}
            <div className="flex gap-4">
              <img
                src={edu.logo}
                alt={edu.school}
                className="h-12 w-12 rounded object-cover"
              />
              <div>
                <h3 className="font-semibold">{edu.school}</h3>
                <p className="text-muted-foreground">{edu.degree}</p>
                <p className="text-sm text-muted-foreground">
                  Graduated {edu.graduationYear}
                </p>
                <p className="mt-2">{edu.description}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
