"use client";

import React, { useState } from "react";
import { profileAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface ProfileSkillsEditProps {
  profile: any;
  onUpdate: () => void;
  onCancel: () => void;
}

export function ProfileSkillsEdit({
  profile,
  onUpdate,
  onCancel,
}: ProfileSkillsEditProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await profileAPI.updateSkills([]);
      onUpdate();
      onCancel();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-gray-600">Skills editing coming soon...</p>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
