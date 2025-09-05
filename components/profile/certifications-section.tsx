"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Edit2,
  Plus,
  Save,
  X,
  Award,
  Trash2,
  Lock,
  Globe,
  ExternalLink,
  Calendar,
  Building,
} from "lucide-react";
import { profileAPI } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface Certification {
  id?: string;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiration_date?: string;
  credential_id?: string;
  credential_url?: string;
  description?: string;
  never_expires: boolean;
}

interface CertificationsSectionProps {
  profile: any;
  isOwnProfile: boolean;
  onUpdate: () => void;
}

export default function CertificationsSection({
  profile,
  isOwnProfile,
  onUpdate,
}: CertificationsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>(
    profile?.profile?.certifications || []
  );
  const [isPrivate, setIsPrivate] = useState(
    profile?.profile?.privacy?.certifications === "private"
  );
  const [editingCert, setEditingCert] = useState<Certification>({
    name: "",
    issuing_organization: "",
    issue_date: "",
    expiration_date: "",
    credential_id: "",
    credential_url: "",
    description: "",
    never_expires: false,
  });
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleSaveCertifications = async () => {
    setLoading(true);
    try {
      await profileAPI.updateCertifications({
        certifications,
        privacy: isPrivate ? "private" : "public",
      });

      toast({
        title: "Certifications updated",
        description: "Your certifications have been updated successfully.",
      });

      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Failed to update certifications:", error);
      toast({
        title: "Error",
        description: "Failed to update certifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCertification = async () => {
    if (
      !editingCert.name ||
      !editingCert.issuing_organization ||
      !editingCert.issue_date
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
      if (editingCert.id) {
        // Update existing
        const updatedCertifications = certifications.map((cert) =>
          cert.id === editingCert.id ? editingCert : cert
        );
        setCertifications(updatedCertifications);
      } else {
        // Add new
        const newCert = { ...editingCert, id: Date.now().toString() };
        setCertifications([...certifications, newCert]);
      }

      setIsAddingNew(false);
      setEditingCert({
        name: "",
        issuing_organization: "",
        issue_date: "",
        expiration_date: "",
        credential_id: "",
        credential_url: "",
        description: "",
        never_expires: false,
      });
    } catch (error) {
      console.error("Failed to save certification:", error);
      toast({
        title: "Error",
        description: "Failed to save certification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCertification = (certId: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) {
      return;
    }
    setCertifications(certifications.filter((cert) => cert.id !== certId));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const isEmpty = !certifications || certifications.length === 0;
  const isHidden = !isOwnProfile && isPrivate;

  if (isHidden) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Award className="w-5 h-5" />
          Certifications
          {isPrivate && <Lock className="w-4 h-4 text-gray-500" />}
        </CardTitle>
        {isOwnProfile && (
          <div className="flex gap-2">
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingNew(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
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

            {/* Save Button */}
            <div className="flex gap-3">
              <Button onClick={handleSaveCertifications} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Privacy Settings"}
              </Button>
            </div>
          </div>
        ) : isEmpty && !isAddingNew ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No certifications added
            </h3>
            <p className="text-gray-500 mb-4 max-w-sm">
              Showcase your professional certifications and credentials.
            </p>
            {isOwnProfile && (
              <Button
                onClick={() => setIsAddingNew(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Certification
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Existing certifications */}
            {certifications.map((cert, index) => (
              <div
                key={cert.id || index}
                className="border-b last:border-b-0 pb-6 last:pb-0"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {cert.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Building className="w-4 h-4" />
                      <span className="font-medium">
                        {cert.issuing_organization}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Issued {formatDate(cert.issue_date)}
                          {cert.expiration_date &&
                            !cert.never_expires &&
                            ` • Expires ${formatDate(cert.expiration_date)}`}
                          {cert.never_expires && " • No expiration"}
                        </span>
                      </div>
                    </div>
                    {cert.credential_id && (
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Credential ID: </span>
                        <span>{cert.credential_id}</span>
                      </div>
                    )}
                    {cert.credential_url && (
                      <div className="mb-2">
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                          View Credential
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                  {isOwnProfile && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCert(cert);
                          setIsAddingNew(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCertification(cert.id!)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {cert.description && (
                  <p className="text-gray-700">{cert.description}</p>
                )}
              </div>
            ))}

            {/* Add/Edit form */}
            {isAddingNew && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingCert.id ? "Edit Certification" : "Add Certification"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certification Name *
                    </label>
                    <Input
                      value={editingCert.name}
                      onChange={(e) =>
                        setEditingCert({ ...editingCert, name: e.target.value })
                      }
                      placeholder="AWS Certified Solutions Architect"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issuing Organization *
                    </label>
                    <Input
                      value={editingCert.issuing_organization}
                      onChange={(e) =>
                        setEditingCert({
                          ...editingCert,
                          issuing_organization: e.target.value,
                        })
                      }
                      placeholder="Amazon Web Services"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Date *
                    </label>
                    <Input
                      type="month"
                      value={editingCert.issue_date}
                      onChange={(e) =>
                        setEditingCert({
                          ...editingCert,
                          issue_date: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiration Date
                    </label>
                    <Input
                      type="month"
                      value={editingCert.expiration_date}
                      onChange={(e) =>
                        setEditingCert({
                          ...editingCert,
                          expiration_date: e.target.value,
                        })
                      }
                      disabled={editingCert.never_expires}
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center space-x-2">
                    <Checkbox
                      id="never_expires"
                      checked={editingCert.never_expires}
                      onCheckedChange={(checked) =>
                        setEditingCert({
                          ...editingCert,
                          never_expires: checked as boolean,
                          expiration_date: checked
                            ? ""
                            : editingCert.expiration_date,
                        })
                      }
                    />
                    <label
                      htmlFor="never_expires"
                      className="text-sm font-medium"
                    >
                      This credential does not expire
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credential ID
                    </label>
                    <Input
                      value={editingCert.credential_id}
                      onChange={(e) =>
                        setEditingCert({
                          ...editingCert,
                          credential_id: e.target.value,
                        })
                      }
                      placeholder="ABC123DEF456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credential URL
                    </label>
                    <Input
                      value={editingCert.credential_url}
                      onChange={(e) =>
                        setEditingCert({
                          ...editingCert,
                          credential_url: e.target.value,
                        })
                      }
                      placeholder="https://www.credly.com/badges/..."
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={editingCert.description}
                    onChange={(e) =>
                      setEditingCert({
                        ...editingCert,
                        description: e.target.value,
                      })
                    }
                    placeholder="Additional details about this certification..."
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSaveCertification} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save Certification"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingCert({
                        name: "",
                        issuing_organization: "",
                        issue_date: "",
                        expiration_date: "",
                        credential_id: "",
                        credential_url: "",
                        description: "",
                        never_expires: false,
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
