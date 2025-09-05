"use client";

import React, { useState } from "react";
import { profileAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, X } from "lucide-react";

interface ProfileInterestsEditProps {
  profile: any;
  onUpdate: () => void;
  onCancel: () => void;
}

export function ProfileInterestsEdit({
  profile,
  onUpdate,
  onCancel,
}: ProfileInterestsEditProps) {
  const [interests, setInterests] = useState(
    (profile.profile.interests || []).join(", ")
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const interestArray = interests
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i);
      await profileAPI.updateInterests(interestArray);
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
      <div>
        <Label htmlFor="interests">Interests (comma-separated)</Label>
        <Input
          id="interests"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="Photography, Travel, Technology, Sports"
        />
      </div>
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
