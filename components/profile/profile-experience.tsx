"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, PencilLine } from "lucide-react";

interface ProfileExperienceProps {
  isOwnProfile?: boolean;
}

export function ProfileExperience({ isOwnProfile }: ProfileExperienceProps) {
  const experiences = [
    {
      position: "Senior Software Engineer",
      company: "Tech Corp",
      logo: "https://images.unsplash.com/photo-1496200186974-4293800e2c20",
      startDate: "Jan 2023",
      endDate: "Present",
      description:
        "Leading the development of web applications using React and Node.js. Managing a team of 5 developers.",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Experience</CardTitle>
        {isOwnProfile && (
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {experiences.map((experience, index) => (
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
                src={experience.logo}
                alt={experience.company}
                className="h-12 w-12 rounded object-cover"
              />
              <div>
                <h3 className="font-semibold">{experience.position}</h3>
                <p className="text-muted-foreground">{experience.company}</p>
                <p className="text-sm text-muted-foreground">
                  {experience.startDate} - {experience.endDate}
                </p>
                <p className="mt-2">{experience.description}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
