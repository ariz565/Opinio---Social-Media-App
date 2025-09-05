"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Edit2,
  Plus,
  Save,
  X,
  Briefcase,
  Trash2,
  MapPin,
  Calendar,
  Building,
} from "lucide-react";
import { profileAPI } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface WorkExperience {
  id?: string;
  title: string;
  company: string;
  company_logo?: string;
  location: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
  skills: string[];
}

interface ExperienceSectionProps {
  profile: any;
  isOwnProfile: boolean;
  onUpdate: () => void;
}

export default function ExperienceSection({
  profile,
  isOwnProfile,
  onUpdate,
}: ExperienceSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [experiences, setExperiences] = useState<WorkExperience[]>(
    profile?.profile?.experience || []
  );
  const [editingExp, setEditingExp] = useState<WorkExperience>({
    title: "",
    company: "",
    location: "",
    start_date: "",
    end_date: "",
    current: false,
    description: "",
    skills: [],
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const handleSaveExperience = async () => {
    if (!editingExp.title || !editingExp.company || !editingExp.start_date) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (editingExp.id) {
        // Update existing
        const updatedExperiences = experiences.map((exp) =>
          exp.id === editingExp.id ? editingExp : exp
        );
        await profileAPI.updateExperience(updatedExperiences);
        setExperiences(updatedExperiences);
      } else {
        // Add new
        const result = await profileAPI.addExperience(editingExp);
        setExperiences([...experiences, result.data]);
      }

      toast({
        title: "Experience updated",
        description: "Your work experience has been updated successfully.",
      });

      setIsAddingNew(false);
      setEditingExp({
        title: "",
        company: "",
        location: "",
        start_date: "",
        end_date: "",
        current: false,
        description: "",
        skills: [],
      });
      onUpdate();
    } catch (error) {
      console.error("Failed to update experience:", error);
      toast({
        title: "Error",
        description: "Failed to update experience. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExperience = async (expId: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) {
      return;
    }

    setLoading(true);
    try {
      await profileAPI.deleteExperience(expId);
      setExperiences(experiences.filter((exp) => exp.id !== expId));

      toast({
        title: "Experience deleted",
        description: "Your work experience has been deleted successfully.",
      });

      onUpdate();
    } catch (error) {
      console.error("Failed to delete experience:", error);
      toast({
        title: "Error",
        description: "Failed to delete experience. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !editingExp.skills.includes(skillInput.trim())) {
      setEditingExp({
        ...editingExp,
        skills: [...editingExp.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setEditingExp({
      ...editingExp,
      skills: editingExp.skills.filter((s) => s !== skill),
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const isEmpty = !experiences || experiences.length === 0;

  if (!isOwnProfile && isEmpty) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Experience
        </CardTitle>
        {isOwnProfile && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {isEmpty && !isAddingNew ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No work experience added
            </h3>
            <p className="text-gray-500 mb-4 max-w-sm">
              Showcase your professional journey by adding your work experience.
            </p>
            {isOwnProfile && (
              <Button
                onClick={() => setIsAddingNew(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Existing experiences */}
            {experiences.map((exp, index) => (
              <div
                key={exp.id || index}
                className="border-b last:border-b-0 pb-6 last:pb-0"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {exp.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Building className="w-4 h-4" />
                      <span className="font-medium">{exp.company}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(exp.start_date)} -{" "}
                          {exp.current
                            ? "Present"
                            : formatDate(exp.end_date || "")}
                        </span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {isOwnProfile && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingExp(exp);
                          setIsAddingNew(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExperience(exp.id!)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {exp.description && (
                  <p className="text-gray-700 mb-3">{exp.description}</p>
                )}

                {exp.skills && exp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Add/Edit form */}
            {isAddingNew && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingExp.id ? "Edit Experience" : "Add Experience"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <Input
                      value={editingExp.title}
                      onChange={(e) =>
                        setEditingExp({ ...editingExp, title: e.target.value })
                      }
                      placeholder="Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company *
                    </label>
                    <Input
                      value={editingExp.company}
                      onChange={(e) =>
                        setEditingExp({
                          ...editingExp,
                          company: e.target.value,
                        })
                      }
                      placeholder="Google"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <Input
                      value={editingExp.location}
                      onChange={(e) =>
                        setEditingExp({
                          ...editingExp,
                          location: e.target.value,
                        })
                      }
                      placeholder="San Francisco, CA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <Input
                      type="month"
                      value={editingExp.start_date}
                      onChange={(e) =>
                        setEditingExp({
                          ...editingExp,
                          start_date: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id="current"
                      checked={editingExp.current}
                      onCheckedChange={(checked) =>
                        setEditingExp({
                          ...editingExp,
                          current: checked as boolean,
                          end_date: checked ? "" : editingExp.end_date,
                        })
                      }
                    />
                    <label htmlFor="current" className="text-sm font-medium">
                      I currently work here
                    </label>
                  </div>

                  {!editingExp.current && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <Input
                        type="month"
                        value={editingExp.end_date}
                        onChange={(e) =>
                          setEditingExp({
                            ...editingExp,
                            end_date: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={editingExp.description}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe your responsibilities and achievements..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                    />
                    <Button type="button" onClick={handleAddSkill}>
                      Add
                    </Button>
                  </div>
                  {editingExp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {editingExp.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer"
                        >
                          {skill}
                          <X
                            className="w-3 h-3 ml-1"
                            onClick={() => handleRemoveSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSaveExperience} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save Experience"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingExp({
                        title: "",
                        company: "",
                        location: "",
                        start_date: "",
                        end_date: "",
                        current: false,
                        description: "",
                        skills: [],
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
