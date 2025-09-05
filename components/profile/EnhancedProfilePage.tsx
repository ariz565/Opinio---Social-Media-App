"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { profileAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  MapPin,
  Globe,
  Phone,
  Mail,
  Camera,
  Edit3,
  Plus,
  Trash2,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Heart,
  Link,
  Github,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";
import { ProfileBasicInfoEdit } from "@/components/profile/ProfileBasicInfoEdit";
import { ProfileExperienceEdit } from "@/components/profile/ProfileExperienceEdit";
import { ProfileEducationEdit } from "@/components/profile/ProfileEducationEdit";
import { ProfileSkillsEdit } from "@/components/profile/ProfileSkillsEdit";
import { ProfileCertificationsEdit } from "@/components/profile/ProfileCertificationsEdit";
import { ProfileInterestsEdit } from "@/components/profile/ProfileInterestsEdit";
import { ProfileSocialLinksEdit } from "@/components/profile/ProfileSocialLinksEdit";
import { ProfilePhotoUpload } from "@/components/profile/ProfilePhotoUpload";

interface ProfileData {
  id: string;
  username: string;
  email: string;
  full_name: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  profile_picture?: string;
  is_verified: boolean;
  is_online: boolean;
  profile: {
    experience: any[];
    education: any[];
    skills: any[];
    languages: any[];
    certifications: any[];
    interests: string[];
    social_links: any;
    cover_photo?: string;
  };
  stats: {
    posts: number;
    followers: number;
    following: number;
    connections: number;
  };
  created_at: string;
  updated_at: string;
}

export default function EnhancedProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [editingSections, setEditingSections] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileAPI.getProfile(username);
      setProfile(data);

      // Check if this is the current user's profile
      const currentUser = localStorage.getItem("user");
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        setIsOwnProfile(userData.username === username);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = (section: string) => {
    setEditingSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleProfileUpdate = () => {
    loadProfile(); // Reload profile after updates
  };

  const handlePhotoUpload = async (file: File, type: "profile" | "cover") => {
    try {
      if (type === "profile") {
        await profileAPI.uploadProfilePhoto(file);
      } else {
        await profileAPI.uploadCoverPhoto(file);
      }
      handleProfileUpdate();
    } catch (err: any) {
      console.error("Photo upload error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <User className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Profile Not Found</h3>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo Section */}
      <div className="relative">
        <div
          className="h-80 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
          style={{
            backgroundImage: profile.profile.cover_photo
              ? `url(${profile.profile.cover_photo})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {isOwnProfile && (
            <ProfilePhotoUpload
              type="cover"
              onUpload={(file) => handlePhotoUpload(file, "cover")}
              className="absolute top-4 right-4"
            />
          )}
        </div>

        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
              {profile.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            {isOwnProfile && (
              <ProfilePhotoUpload
                type="profile"
                onUpload={(file) => handlePhotoUpload(file, "profile")}
                className="absolute bottom-0 right-0"
              />
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            {/* Basic Info Card */}
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                {isOwnProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleEdit("basic")}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {editingSections.basic ? (
                  <ProfileBasicInfoEdit
                    profile={profile}
                    onUpdate={handleProfileUpdate}
                    onCancel={() => toggleEdit("basic")}
                  />
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        {profile.full_name}
                        {profile.is_verified && (
                          <Badge variant="secondary" className="text-blue-600">
                            ✓ Verified
                          </Badge>
                        )}
                      </h2>
                      <p className="text-gray-600">@{profile.username}</p>
                      {profile.is_online && (
                        <Badge
                          variant="outline"
                          className="text-green-600 mt-1"
                        >
                          🟢 Online
                        </Badge>
                      )}
                    </div>

                    {profile.bio && (
                      <p className="text-gray-700">{profile.bio}</p>
                    )}

                    <div className="space-y-2 text-sm text-gray-600">
                      {profile.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {profile.location}
                        </div>
                      )}
                      {profile.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {profile.website}
                          </a>
                        </div>
                      )}
                      {profile.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {profile.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {profile.email}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {profile.stats.posts}
                    </div>
                    <div className="text-sm text-gray-600">Posts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {profile.stats.followers}
                    </div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {profile.stats.following}
                    </div>
                    <div className="text-sm text-gray-600">Following</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {profile.stats.connections}
                    </div>
                    <div className="text-sm text-gray-600">Connections</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Social Links
                </CardTitle>
                {isOwnProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleEdit("social")}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {editingSections.social ? (
                  <ProfileSocialLinksEdit
                    profile={profile}
                    onUpdate={handleProfileUpdate}
                    onCancel={() => toggleEdit("social")}
                  />
                ) : (
                  <div className="space-y-3">
                    {profile.profile.social_links?.linkedin && (
                      <a
                        href={profile.profile.social_links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {profile.profile.social_links?.github && (
                      <a
                        href={profile.profile.social_links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-800 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <Github className="h-5 w-5" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {profile.profile.social_links?.twitter && (
                      <a
                        href={profile.profile.social_links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-blue-400 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                        <span>Twitter</span>
                      </a>
                    )}
                    {profile.profile.social_links?.instagram && (
                      <a
                        href={profile.profile.social_links.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-pink-600 hover:bg-pink-50 p-2 rounded-lg transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                        <span>Instagram</span>
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="experience" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
                <TabsTrigger value="interests">Interests</TabsTrigger>
              </TabsList>

              {/* Experience Tab */}
              <TabsContent value="experience" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Work Experience
                    </CardTitle>
                    {isOwnProfile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEdit("experience")}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {editingSections.experience ? (
                      <ProfileExperienceEdit
                        profile={profile}
                        onUpdate={handleProfileUpdate}
                        onCancel={() => toggleEdit("experience")}
                      />
                    ) : (
                      <div className="space-y-6">
                        {profile.profile.experience?.map(
                          (exp: any, index: number) => (
                            <div
                              key={exp.id || index}
                              className="border-l-2 border-blue-200 pl-4 relative"
                            >
                              <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-2 top-2"></div>
                              <div className="bg-white p-4 rounded-lg shadow-sm border">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {exp.title}
                                    </h3>
                                    <p className="text-blue-600 font-medium">
                                      {exp.company}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                      {exp.location}
                                    </p>
                                  </div>
                                  {exp.company_logo && (
                                    <img
                                      src={exp.company_logo}
                                      alt={exp.company}
                                      className="w-12 h-12 rounded-lg"
                                    />
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {exp.start_date} -{" "}
                                  {exp.current ? "Present" : exp.end_date}
                                </p>
                                <p className="text-gray-700 mb-3">
                                  {exp.description}
                                </p>
                                {exp.skills && exp.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {exp.skills.map(
                                      (skill: string, skillIndex: number) => (
                                        <Badge
                                          key={skillIndex}
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {skill}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        )}
                        {(!profile.profile.experience ||
                          profile.profile.experience.length === 0) && (
                          <div className="text-center py-8 text-gray-500">
                            <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No work experience added yet</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Education
                    </CardTitle>
                    {isOwnProfile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEdit("education")}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {editingSections.education ? (
                      <ProfileEducationEdit
                        profile={profile}
                        onUpdate={handleProfileUpdate}
                        onCancel={() => toggleEdit("education")}
                      />
                    ) : (
                      <div className="space-y-6">
                        {profile.profile.education?.map(
                          (edu: any, index: number) => (
                            <div
                              key={edu.id || index}
                              className="border-l-2 border-green-200 pl-4 relative"
                            >
                              <div className="absolute w-3 h-3 bg-green-600 rounded-full -left-2 top-2"></div>
                              <div className="bg-white p-4 rounded-lg shadow-sm border">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {edu.degree}
                                    </h3>
                                    <p className="text-green-600 font-medium">
                                      {edu.school}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                      {edu.field} • {edu.location}
                                    </p>
                                  </div>
                                  {edu.logo && (
                                    <img
                                      src={edu.logo}
                                      alt={edu.school}
                                      className="w-12 h-12 rounded-lg"
                                    />
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {edu.start_date} - {edu.end_date}
                                </p>
                                {edu.gpa && (
                                  <p className="text-sm text-gray-600 mb-2">
                                    GPA: {edu.gpa}
                                  </p>
                                )}
                                {edu.achievements &&
                                  edu.achievements.length > 0 && (
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium">
                                        Achievements:
                                      </p>
                                      <ul className="text-sm text-gray-600 list-disc list-inside">
                                        {edu.achievements.map(
                                          (
                                            achievement: string,
                                            achIndex: number
                                          ) => (
                                            <li key={achIndex}>
                                              {achievement}
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}
                              </div>
                            </div>
                          )
                        )}
                        {(!profile.profile.education ||
                          profile.profile.education.length === 0) && (
                          <div className="text-center py-8 text-gray-500">
                            <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No education added yet</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Skills & Languages
                    </CardTitle>
                    {isOwnProfile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEdit("skills")}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {editingSections.skills ? (
                      <ProfileSkillsEdit
                        profile={profile}
                        onUpdate={handleProfileUpdate}
                        onCancel={() => toggleEdit("skills")}
                      />
                    ) : (
                      <div className="space-y-8">
                        {/* Skills */}
                        <div>
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Technical Skills
                          </h3>
                          <div className="space-y-4">
                            {profile.profile.skills?.map(
                              (skill: any, index: number) => (
                                <div key={index} className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">
                                      {skill.name}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-gray-600">
                                        {skill.level}%
                                      </span>
                                      {skill.endorsements > 0 && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {skill.endorsements} endorsements
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${skill.level}%` }}
                                    ></div>
                                  </div>
                                  <p className="text-xs text-gray-600">
                                    {skill.category}
                                  </p>
                                </div>
                              )
                            )}
                            {(!profile.profile.skills ||
                              profile.profile.skills.length === 0) && (
                              <p className="text-gray-500 text-center py-4">
                                No skills added yet
                              </p>
                            )}
                          </div>
                        </div>

                        <Separator />

                        {/* Languages */}
                        <div>
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Languages className="h-4 w-4" />
                            Languages
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profile.profile.languages?.map(
                              (lang: any, index: number) => (
                                <div
                                  key={index}
                                  className="bg-gray-50 p-4 rounded-lg"
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">
                                      {lang.name}
                                    </span>
                                    <Badge variant="secondary">
                                      {lang.proficiency}
                                    </Badge>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${lang.level}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )
                            )}
                            {(!profile.profile.languages ||
                              profile.profile.languages.length === 0) && (
                              <p className="text-gray-500 text-center py-4 col-span-full">
                                No languages added yet
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Certifications Tab */}
              <TabsContent value="certifications" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Certifications
                    </CardTitle>
                    {isOwnProfile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEdit("certifications")}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {editingSections.certifications ? (
                      <ProfileCertificationsEdit
                        profile={profile}
                        onUpdate={handleProfileUpdate}
                        onCancel={() => toggleEdit("certifications")}
                      />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {profile.profile.certifications?.map(
                          (cert: any, index: number) => (
                            <div
                              key={cert.id || index}
                              className="bg-white p-6 rounded-lg shadow-sm border"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg mb-1">
                                    {cert.name}
                                  </h3>
                                  <p className="text-blue-600 font-medium">
                                    {cert.issuer}
                                  </p>
                                </div>
                                {cert.logo && (
                                  <img
                                    src={cert.logo}
                                    alt={cert.issuer}
                                    className="w-12 h-12 rounded-lg"
                                  />
                                )}
                              </div>
                              <div className="space-y-2 text-sm text-gray-600">
                                <p>Issued: {cert.date}</p>
                                {cert.expiry_date && (
                                  <p>Expires: {cert.expiry_date}</p>
                                )}
                                <p className="font-mono text-xs bg-gray-100 p-2 rounded">
                                  ID: {cert.credential_id}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                        {(!profile.profile.certifications ||
                          profile.profile.certifications.length === 0) && (
                          <div className="text-center py-8 text-gray-500 col-span-full">
                            <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No certifications added yet</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Interests Tab */}
              <TabsContent value="interests" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Interests
                    </CardTitle>
                    {isOwnProfile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEdit("interests")}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {editingSections.interests ? (
                      <ProfileInterestsEdit
                        profile={profile}
                        onUpdate={handleProfileUpdate}
                        onCancel={() => toggleEdit("interests")}
                      />
                    ) : (
                      <div>
                        {profile.profile.interests &&
                        profile.profile.interests.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {profile.profile.interests.map(
                              (interest: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-sm px-3 py-1"
                                >
                                  {interest}
                                </Badge>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No interests added yet</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
