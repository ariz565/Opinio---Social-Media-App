"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Edit2,
  Plus,
  Save,
  X,
  GraduationCap,
  Trash2,
  Calendar,
  School,
} from "lucide-react";
import { profileAPI } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface Education {
  id?: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  grade?: string;
  activities?: string;
  description?: string;
}

interface EducationSectionProps {
  profile: any;
  isOwnProfile: boolean;
  onUpdate: () => void;
}

export default function EducationSection({
  profile,
  isOwnProfile,
  onUpdate,
}: EducationSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [educations, setEducations] = useState<Education[]>(
    profile?.profile?.education || []
  );
  const [editingEdu, setEditingEdu] = useState<Education>({
    institution: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    grade: "",
    activities: "",
    description: "",
  });
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleSaveEducation = async () => {
    if (
      !editingEdu.institution ||
      !editingEdu.degree ||
      !editingEdu.field_of_study ||
      !editingEdu.start_date
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (editingEdu.id) {
        // Update existing
        const updatedEducations = educations.map((edu) =>
          edu.id === editingEdu.id ? editingEdu : edu
        );
        await profileAPI.updateEducation(updatedEducations);
        setEducations(updatedEducations);
      } else {
        // Add new
        const result = await profileAPI.addEducation(editingEdu);
        setEducations([...educations, result.data]);
      }

      toast({
        title: "Education updated",
        description: "Your education has been updated successfully.",
      });

      setIsAddingNew(false);
      setEditingEdu({
        institution: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        grade: "",
        activities: "",
        description: "",
      });
      onUpdate();
    } catch (error) {
      console.error("Failed to update education:", error);
      toast({
        title: "Error",
        description: "Failed to update education. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEducation = async (eduId: string) => {
    if (!confirm("Are you sure you want to delete this education?")) {
      return;
    }

    setLoading(true);
    try {
      await profileAPI.deleteEducation(eduId);
      setEducations(educations.filter((edu) => edu.id !== eduId));

      toast({
        title: "Education deleted",
        description: "Your education has been deleted successfully.",
      });

      onUpdate();
    } catch (error) {
      console.error("Failed to delete education:", error);
      toast({
        title: "Error",
        description: "Failed to delete education. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const isEmpty = !educations || educations.length === 0;

  if (!isOwnProfile && isEmpty) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Education
        </CardTitle>
        {isOwnProfile && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Education
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {isEmpty && !isAddingNew ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No education added
            </h3>
            <p className="text-gray-500 mb-4 max-w-sm">
              Share your educational background to showcase your qualifications.
            </p>
            {isOwnProfile && (
              <Button
                onClick={() => setIsAddingNew(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Existing educations */}
            {educations.map((edu, index) => (
              <div
                key={edu.id || index}
                className="border-b last:border-b-0 pb-6 last:pb-0"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {edu.degree}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <School className="w-4 h-4" />
                      <span className="font-medium">{edu.institution}</span>
                    </div>
                    <p className="text-gray-600 mb-2">{edu.field_of_study}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(edu.start_date)} -{" "}
                          {edu.end_date ? formatDate(edu.end_date) : "Present"}
                        </span>
                      </div>
                      {edu.grade && (
                        <div>
                          <span className="font-medium">Grade: </span>
                          <span>{edu.grade}</span>
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
                          setEditingEdu(edu);
                          setIsAddingNew(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEducation(edu.id!)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {edu.activities && (
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Activities:{" "}
                    </span>
                    <span className="text-sm text-gray-600">
                      {edu.activities}
                    </span>
                  </div>
                )}

                {edu.description && (
                  <p className="text-gray-700">{edu.description}</p>
                )}
              </div>
            ))}

            {/* Add/Edit form */}
            {isAddingNew && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingEdu.id ? "Edit Education" : "Add Education"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution *
                    </label>
                    <Input
                      value={editingEdu.institution}
                      onChange={(e) =>
                        setEditingEdu({
                          ...editingEdu,
                          institution: e.target.value,
                        })
                      }
                      placeholder="Stanford University"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Degree *
                    </label>
                    <Input
                      value={editingEdu.degree}
                      onChange={(e) =>
                        setEditingEdu({ ...editingEdu, degree: e.target.value })
                      }
                      placeholder="Bachelor of Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Field of Study *
                    </label>
                    <Input
                      value={editingEdu.field_of_study}
                      onChange={(e) =>
                        setEditingEdu({
                          ...editingEdu,
                          field_of_study: e.target.value,
                        })
                      }
                      placeholder="Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <Input
                      type="month"
                      value={editingEdu.start_date}
                      onChange={(e) =>
                        setEditingEdu({
                          ...editingEdu,
                          start_date: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <Input
                      type="month"
                      value={editingEdu.end_date}
                      onChange={(e) =>
                        setEditingEdu({
                          ...editingEdu,
                          end_date: e.target.value,
                        })
                      }
                      placeholder="Leave empty if ongoing"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade
                    </label>
                    <Input
                      value={editingEdu.grade}
                      onChange={(e) =>
                        setEditingEdu({ ...editingEdu, grade: e.target.value })
                      }
                      placeholder="3.8 GPA, First Class, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activities
                    </label>
                    <Input
                      value={editingEdu.activities}
                      onChange={(e) =>
                        setEditingEdu({
                          ...editingEdu,
                          activities: e.target.value,
                        })
                      }
                      placeholder="Student Council, Chess Club, etc."
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={editingEdu.description}
                    onChange={(e) =>
                      setEditingEdu({
                        ...editingEdu,
                        description: e.target.value,
                      })
                    }
                    placeholder="Additional details about your education..."
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSaveEducation} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save Education"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingEdu({
                        institution: "",
                        degree: "",
                        field_of_study: "",
                        start_date: "",
                        end_date: "",
                        grade: "",
                        activities: "",
                        description: "",
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
