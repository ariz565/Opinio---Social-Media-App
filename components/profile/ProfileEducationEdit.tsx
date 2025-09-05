"use client";

import React, { useState } from "react";
import { profileAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Save, X, Plus, Trash2 } from "lucide-react";

interface ProfileEducationEditProps {
  profile: any;
  onUpdate: () => void;
  onCancel: () => void;
}

export function ProfileEducationEdit({
  profile,
  onUpdate,
  onCancel,
}: ProfileEducationEditProps) {
  const [education, setEducation] = useState(profile.profile.education || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addNewEducation = () => {
    const newEdu = {
      id: `temp_${Date.now()}`,
      school: "",
      degree: "",
      field: "",
      location: "",
      start_date: "",
      end_date: "",
      gpa: "",
      achievements: [],
    };
    setEducation([...education, newEdu]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_: any, i: number) => i !== index));
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const updated = education.map((edu: any, i: number) =>
      i === index ? { ...edu, [field]: value } : edu
    );
    setEducation(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await profileAPI.updateEducation(education);
      onUpdate();
      onCancel();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update education");
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
        {education.map((edu: any, index: number) => (
          <Card key={edu.id || index} className="p-4">
            <CardContent className="space-y-4 p-0">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Education #{index + 1}</h4>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeEducation(index)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`school_${index}`}>School</Label>
                  <Input
                    id={`school_${index}`}
                    value={edu.school}
                    onChange={(e) =>
                      updateEducation(index, "school", e.target.value)
                    }
                    placeholder="University Name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`degree_${index}`}>Degree</Label>
                  <Input
                    id={`degree_${index}`}
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(index, "degree", e.target.value)
                    }
                    placeholder="Bachelor of Science"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`field_${index}`}>Field of Study</Label>
                  <Input
                    id={`field_${index}`}
                    value={edu.field}
                    onChange={(e) =>
                      updateEducation(index, "field", e.target.value)
                    }
                    placeholder="Computer Science"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`location_${index}`}>Location</Label>
                  <Input
                    id={`location_${index}`}
                    value={edu.location}
                    onChange={(e) =>
                      updateEducation(index, "location", e.target.value)
                    }
                    placeholder="City, Country"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`start_date_${index}`}>Start Date</Label>
                  <Input
                    id={`start_date_${index}`}
                    type="month"
                    value={edu.start_date}
                    onChange={(e) =>
                      updateEducation(index, "start_date", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`end_date_${index}`}>End Date</Label>
                  <Input
                    id={`end_date_${index}`}
                    type="month"
                    value={edu.end_date}
                    onChange={(e) =>
                      updateEducation(index, "end_date", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`gpa_${index}`}>GPA (Optional)</Label>
                  <Input
                    id={`gpa_${index}`}
                    value={edu.gpa}
                    onChange={(e) =>
                      updateEducation(index, "gpa", e.target.value)
                    }
                    placeholder="3.8/4.0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addNewEducation}
        className="w-full flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Education
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
