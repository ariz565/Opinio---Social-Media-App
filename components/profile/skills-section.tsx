"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Edit2, Plus, Save, X, Award, Trash2, Lock, Globe } from "lucide-react";
import { profileAPI } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface SkillsSectionProps {
  profile: any;
  isOwnProfile: boolean;
  onUpdate: () => void;
}

export default function SkillsSection({
  profile,
  isOwnProfile,
  onUpdate,
}: SkillsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>(
    profile?.profile?.skills || []
  );
  const [isPrivate, setIsPrivate] = useState(
    profile?.profile?.privacy?.skills === "private"
  );
  const [skillInput, setSkillInput] = useState("");

  const handleSaveSkills = async () => {
    setLoading(true);
    try {
      await profileAPI.updateSkills({
        skills,
        privacy: isPrivate ? "private" : "public",
      });

      toast({
        title: "Skills updated",
        description: "Your skills have been updated successfully.",
      });

      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Failed to update skills:", error);
      toast({
        title: "Error",
        description: "Failed to update skills. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const isEmpty = !skills || skills.length === 0;
  const isHidden = !isOwnProfile && isPrivate;

  if (isHidden) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Award className="w-5 h-5" />
          Skills
          {isPrivate && <Lock className="w-4 h-4 text-gray-500" />}
        </CardTitle>
        {isOwnProfile && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            {/* Privacy Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {isPrivate ? (
                  <Lock className="w-4 h-4 text-gray-500" />
                ) : (
                  <Globe className="w-4 h-4 text-green-500" />
                )}
                <span className="text-sm font-medium">
                  {isPrivate
                    ? "Private - Only you can see this"
                    : "Public - Visible to everyone"}
                </span>
              </div>
              <Switch
                checked={!isPrivate}
                onCheckedChange={(checked) => setIsPrivate(!checked)}
              />
            </div>

            {/* Add Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Skills
              </label>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., React, Python, Project Management"
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddSkill}>
                  Add
                </Button>
              </div>
            </div>

            {/* Skills List */}
            {skills.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100 transition-colors"
                    >
                      {skill}
                      <X
                        className="w-3 h-3 ml-1 hover:text-red-600"
                        onClick={() => handleRemoveSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveSkills} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Skills"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setSkills(profile?.profile?.skills || []);
                  setIsPrivate(profile?.profile?.privacy?.skills === "private");
                  setSkillInput("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No skills added
            </h3>
            <p className="text-gray-500 mb-4 max-w-sm">
              Showcase your expertise by adding your skills and competencies.
            </p>
            {isOwnProfile && (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Skills
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm py-1 px-3"
                >
                  {skill}
                </Badge>
              ))}
            </div>

            {isOwnProfile && (
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add More Skills
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
