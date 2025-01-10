"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, ThumbsUp } from "lucide-react";

interface ProfileSkillsProps {
  isOwnProfile?: boolean;
}

export function ProfileSkills({ isOwnProfile }: ProfileSkillsProps) {
  const skills = [
    {
      name: "React.js",
      endorsements: 42,
      endorsed: false,
    },
    {
      name: "Node.js",
      endorsements: 38,
      endorsed: true,
    },
    {
      name: "TypeScript",
      endorsements: 35,
      endorsed: false,
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Skills</CardTitle>
        {isOwnProfile && (
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{skill.name}</h3>
              <p className="text-sm text-muted-foreground">
                {skill.endorsements} endorsements
              </p>
            </div>
            {!isOwnProfile && (
              <Button
                variant={skill.endorsed ? "secondary" : "outline"}
                size="sm"
                className="gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                {skill.endorsed ? "Endorsed" : "Endorse"}
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
