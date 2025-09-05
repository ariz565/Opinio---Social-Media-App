"use client";

import React, { useState } from "react";
import { profileAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, X } from "lucide-react";

interface ProfileBasicInfoEditProps {
  profile: any;
  onUpdate: () => void;
  onCancel: () => void;
}

export function ProfileBasicInfoEdit({
  profile,
  onUpdate,
  onCancel,
}: ProfileBasicInfoEditProps) {
  const [formData, setFormData] = useState({
    full_name: profile.full_name || "",
    bio: profile.bio || "",
    location: profile.location || "",
    website: profile.website || "",
    phone: profile.phone || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await profileAPI.updateBasicInfo(formData);
      onUpdate();
      onCancel();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell people about yourself..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="City, Country"
        />
      </div>

      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          name="website"
          type="url"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://yourwebsite.com"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
