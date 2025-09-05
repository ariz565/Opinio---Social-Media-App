"use client";

import React, { useState } from "react";
import { profileAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, X, Plus, Trash2 } from "lucide-react";

interface ProfileExperienceEditProps {
  profile: any;
  onUpdate: () => void;
  onCancel: () => void;
}

export function ProfileExperienceEdit({
  profile,
  onUpdate,
  onCancel,
}: ProfileExperienceEditProps) {
  const [experiences, setExperiences] = useState(
    profile.profile.experience || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addNewExperience = () => {
    const newExp = {
      id: `temp_${Date.now()}`,
      title: "",
      company: "",
      location: "",
      start_date: "",
      end_date: "",
      current: false,
      description: "",
      skills: [],
      company_logo: "",
    };
    setExperiences([...experiences, newExp]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_: any, i: number) => i !== index));
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = experiences.map((exp: any, i: number) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    setExperiences(updated);
  };

  const handleSkillsChange = (index: number, skillsString: string) => {
    const skills = skillsString
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    updateExperience(index, "skills", skills);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await profileAPI.updateExperience(experiences);
      onUpdate();
      onCancel();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {experiences.map((exp: any, index: number) => (
          <Card key={exp.id || index} className="p-4">
            <CardContent className="space-y-4 p-0">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Experience #{index + 1}</h4>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeExperience(index)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`title_${index}`}>Job Title</Label>
                  <Input
                    id={`title_${index}`}
                    value={exp.title}
                    onChange={(e) =>
                      updateExperience(index, "title", e.target.value)
                    }
                    placeholder="Software Engineer"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`company_${index}`}>Company</Label>
                  <Input
                    id={`company_${index}`}
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(index, "company", e.target.value)
                    }
                    placeholder="Company Name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`location_${index}`}>Location</Label>
                <Input
                  id={`location_${index}`}
                  value={exp.location}
                  onChange={(e) =>
                    updateExperience(index, "location", e.target.value)
                  }
                  placeholder="City, Country"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`start_date_${index}`}>Start Date</Label>
                  <Input
                    id={`start_date_${index}`}
                    type="month"
                    value={exp.start_date}
                    onChange={(e) =>
                      updateExperience(index, "start_date", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`end_date_${index}`}>End Date</Label>
                  <Input
                    id={`end_date_${index}`}
                    type="month"
                    value={exp.end_date}
                    onChange={(e) =>
                      updateExperience(index, "end_date", e.target.value)
                    }
                    disabled={exp.current}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`current_${index}`}
                  checked={exp.current}
                  onCheckedChange={(checked) => {
                    updateExperience(index, "current", checked);
                    if (checked) updateExperience(index, "end_date", "");
                  }}
                />
                <Label htmlFor={`current_${index}`}>
                  I currently work here
                </Label>
              </div>

              <div>
                <Label htmlFor={`description_${index}`}>Description</Label>
                <Textarea
                  id={`description_${index}`}
                  value={exp.description}
                  onChange={(e) =>
                    updateExperience(index, "description", e.target.value)
                  }
                  placeholder="Describe your role and achievements..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor={`skills_${index}`}>
                  Skills (comma-separated)
                </Label>
                <Input
                  id={`skills_${index}`}
                  value={exp.skills?.join(", ") || ""}
                  onChange={(e) => handleSkillsChange(index, e.target.value)}
                  placeholder="JavaScript, React, Node.js"
                />
                {exp.skills && exp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {exp.skills.map((skill: string, skillIndex: number) => (
                      <Badge
                        key={skillIndex}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addNewExperience}
        className="w-full flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Experience
      </Button>

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
