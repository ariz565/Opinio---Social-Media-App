"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, PencilLine } from "lucide-react";

interface ProfileLanguagesProps {
  isOwnProfile?: boolean;
}

export function ProfileLanguages({ isOwnProfile }: ProfileLanguagesProps) {
  const languages = [
    {
      language: "English",
      proficiency: "Native or bilingual",
    },
    {
      language: "Spanish",
      proficiency: "Professional working proficiency",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Languages</CardTitle>
        {isOwnProfile && (
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {languages.map((lang, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{lang.language}</h3>
              <p className="text-sm text-muted-foreground">
                {lang.proficiency}
              </p>
            </div>
            {isOwnProfile && (
              <Button variant="ghost" size="icon">
                <PencilLine className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
