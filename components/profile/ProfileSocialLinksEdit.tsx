"use client";

import React, { useState } from "react";
import { profileAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, X } from "lucide-react";

interface ProfileSocialLinksEditProps {
  profile: any;
  onUpdate: () => void;
  onCancel: () => void;
}

export function ProfileSocialLinksEdit({
  profile,
  onUpdate,
  onCancel,
}: ProfileSocialLinksEditProps) {
  const [socialLinks, setSocialLinks] = useState(
    profile.profile.social_links || {}
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await profileAPI.updateSocialLinks(socialLinks);
      onUpdate();
      onCancel();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateLink = (platform: string, url: string) => {
    setSocialLinks((prev: any) => ({ ...prev, [platform]: url }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input
          id="linkedin"
          value={socialLinks.linkedin || ""}
          onChange={(e) => updateLink("linkedin", e.target.value)}
          placeholder="https://linkedin.com/in/username"
        />
      </div>

      <div>
        <Label htmlFor="github">GitHub</Label>
        <Input
          id="github"
          value={socialLinks.github || ""}
          onChange={(e) => updateLink("github", e.target.value)}
          placeholder="https://github.com/username"
        />
      </div>

      <div>
        <Label htmlFor="twitter">Twitter</Label>
        <Input
          id="twitter"
          value={socialLinks.twitter || ""}
          onChange={(e) => updateLink("twitter", e.target.value)}
          placeholder="https://twitter.com/username"
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
