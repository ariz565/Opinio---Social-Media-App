"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Eye,
  Save,
  Plus,
  X,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Star,
  Mail,
  Phone,
  MapPin,
  Globe,
  LinkedIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { isAuthenticated, getCurrentUser, type User } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
}

interface WorkExperience {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface Skill {
  name: string;
  level: number;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications: string[];
  projects: string[];
  languages: string[];
}

export default function ResumeBuilder() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      summary: "",
    },
    workExperience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: [],
  });

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);
    if (authenticated) {
      const user = getCurrentUser();
      setCurrentUser(user);
      // Pre-fill with user data
      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          fullName: user?.full_name || "",
          email: user?.email || "",
        }
      }));
    } else {
      router.push("/auth");
    }
  }, [router]);

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      }
    }));
  };

  const addWorkExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      position: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    setResumeData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, newExperience],
    }));
  };

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: any) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeWorkExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter(exp => exp.id !== id),
    }));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  };

  const addSkill = (skillName: string) => {
    if (skillName && !resumeData.skills.find(s => s.name === skillName)) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: skillName, level: 3 }],
      }));
    }
  };

  const updateSkillLevel = (skillName: string, level: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.name === skillName ? { ...skill, level } : skill
      ),
    }));
  };

  const removeSkill = (skillName: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.name !== skillName),
    }));
  };

  const handleSave = () => {
    // Save to localStorage for now
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
    toast({
      title: "Resume Saved",
      description: "Your resume has been saved successfully.",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your resume is being generated and will download shortly.",
    });
    // In a real app, this would generate and download a PDF
  };

  const ResumePreview = () => (
    <div className="bg-white p-8 shadow-lg rounded-lg max-w-2xl mx-auto text-slate-900 min-h-[800px]">
      {/* Header */}
      <div className="text-center border-b border-slate-200 pb-6 mb-6">
        <h1 className="text-3xl font-bold">
          {resumeData.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 mt-3 text-sm text-slate-600">
          {resumeData.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {resumeData.personalInfo.email}
            </div>
          )}
          {resumeData.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {resumeData.personalInfo.phone}
            </div>
          )}
          {resumeData.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {resumeData.personalInfo.location}
            </div>
          )}
        </div>
        {(resumeData.personalInfo.website || resumeData.personalInfo.linkedin) && (
          <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-slate-600">
            {resumeData.personalInfo.website && (
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                {resumeData.personalInfo.website}
              </div>
            )}
            {resumeData.personalInfo.linkedin && (
              <div className="flex items-center gap-1">
                <LinkedIn className="h-4 w-4" />
                {resumeData.personalInfo.linkedin}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      {resumeData.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold border-b border-slate-200 pb-2 mb-3">
            Professional Summary
          </h2>
          <p className="text-slate-700 leading-relaxed">
            {resumeData.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {resumeData.workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold border-b border-slate-200 pb-2 mb-3">
            Work Experience
          </h2>
          <div className="space-y-4">
            {resumeData.workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{exp.position}</h3>
                    <p className="text-slate-600">{exp.company} • {exp.location}</p>
                  </div>
                  <p className="text-sm text-slate-500">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </p>
                </div>
                {exp.description && (
                  <p className="text-slate-700 mt-2">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold border-b border-slate-200 pb-2 mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <p className="text-slate-600">{edu.institution} • {edu.location}</p>
                  {edu.gpa && <p className="text-sm text-slate-500">GPA: {edu.gpa}</p>}
                </div>
                <p className="text-sm text-slate-500">
                  {edu.startDate} - {edu.endDate}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold border-b border-slate-200 pb-2 mb-3">
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {resumeData.skills.map((skill) => (
              <div key={skill.name} className="flex items-center justify-between">
                <span className="text-slate-700">{skill.name}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <Star
                      key={level}
                      className={`h-3 w-3 ${
                        level <= skill.level ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resumeData.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold border-b border-slate-200 pb-2 mb-3">
            Certifications
          </h2>
          <ul className="list-disc list-inside space-y-1">
            {resumeData.certifications.map((cert, index) => (
              <li key={index} className="text-slate-700">{cert}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  if (!isAuth) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Resume Builder
              </h1>
              <p className="text-slate-600 dark:text-gray-400">
                Create a professional resume that stands out
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button onClick={handleSave} variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleDownload} className="bg-teal-600 hover:bg-teal-700 text-white">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">
                  <User className="h-4 w-4 mr-2" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="experience">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Experience
                </TabsTrigger>
                <TabsTrigger value="education">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Education
                </TabsTrigger>
                <TabsTrigger value="skills">
                  <Award className="h-4 w-4 mr-2" />
                  Skills
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={resumeData.personalInfo.fullName}
                          onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={resumeData.personalInfo.email}
                          onChange={(e) => updatePersonalInfo("email", e.target.value)}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={resumeData.personalInfo.location}
                          onChange={(e) => updatePersonalInfo("location", e.target.value)}
                          placeholder="Dubai, UAE"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={resumeData.personalInfo.website}
                          onChange={(e) => updatePersonalInfo("website", e.target.value)}
                          placeholder="https://johndoe.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={resumeData.personalInfo.linkedin}
                          onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                          placeholder="linkedin.com/in/johndoe"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        value={resumeData.personalInfo.summary}
                        onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                        placeholder="A brief summary of your professional background and career objectives..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Work Experience</CardTitle>
                      <Button onClick={addWorkExperience} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resumeData.workExperience.map((exp) => (
                      <div key={exp.id} className="border border-slate-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Experience</h3>
                          <Button
                            onClick={() => removeWorkExperience(exp.id)}
                            variant="outline"
                            size="sm"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Position</Label>
                            <Input
                              value={exp.position}
                              onChange={(e) => updateWorkExperience(exp.id, "position", e.target.value)}
                              placeholder="Software Engineer"
                            />
                          </div>
                          <div>
                            <Label>Company</Label>
                            <Input
                              value={exp.company}
                              onChange={(e) => updateWorkExperience(exp.id, "company", e.target.value)}
                              placeholder="TechCorp"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <Label>Location</Label>
                            <Input
                              value={exp.location}
                              onChange={(e) => updateWorkExperience(exp.id, "location", e.target.value)}
                              placeholder="Dubai, UAE"
                            />
                          </div>
                          <div>
                            <Label>Start Date</Label>
                            <Input
                              type="month"
                              value={exp.startDate}
                              onChange={(e) => updateWorkExperience(exp.id, "startDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>End Date</Label>
                            <Input
                              type="month"
                              value={exp.endDate}
                              onChange={(e) => updateWorkExperience(exp.id, "endDate", e.target.value)}
                              disabled={exp.current}
                              placeholder={exp.current ? "Present" : ""}
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => updateWorkExperience(exp.id, "current", e.target.checked)}
                            />
                            <span className="text-sm">I currently work here</span>
                          </label>
                        </div>

                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={exp.description}
                            onChange={(e) => updateWorkExperience(exp.id, "description", e.target.value)}
                            placeholder="Describe your role, responsibilities, and achievements..."
                            rows={3}
                          />
                        </div>
                      </div>
                    ))}

                    {resumeData.workExperience.length === 0 && (
                      <div className="text-center py-8 text-slate-500 dark:text-gray-400">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No work experience added yet.</p>
                        <p className="text-sm mt-2">Click &quot;Add Experience&quot; to get started.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Education</CardTitle>
                      <Button onClick={addEducation} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="border border-slate-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Education</h3>
                          <Button
                            onClick={() => removeEducation(edu.id)}
                            variant="outline"
                            size="sm"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Degree</Label>
                            <Input
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                              placeholder="Bachelor of Computer Science"
                            />
                          </div>
                          <div>
                            <Label>Institution</Label>
                            <Input
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                              placeholder="University of Dubai"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Location</Label>
                            <Input
                              value={edu.location}
                              onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                              placeholder="Dubai, UAE"
                            />
                          </div>
                          <div>
                            <Label>Start Date</Label>
                            <Input
                              type="month"
                              value={edu.startDate}
                              onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>End Date</Label>
                            <Input
                              type="month"
                              value={edu.endDate}
                              onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {resumeData.education.length === 0 && (
                      <div className="text-center py-8 text-slate-500 dark:text-gray-400">
                        <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No education added yet.</p>
                        <p className="text-sm mt-2">Click &quot;Add Education&quot; to get started.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="newSkill">Add Skill</Label>
                      <div className="flex space-x-2 mt-1">
                        <Input
                          id="newSkill"
                          placeholder="e.g. JavaScript, Project Management"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              const input = e.target as HTMLInputElement;
                              addSkill(input.value);
                              input.value = "";
                            }
                          }}
                        />
                        <Button
                          onClick={(e) => {
                            const input = document.getElementById("newSkill") as HTMLInputElement;
                            addSkill(input.value);
                            input.value = "";
                          }}
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {resumeData.skills.map((skill) => (
                        <div key={skill.name} className="flex items-center justify-between p-3 border border-slate-200 dark:border-gray-700 rounded-lg">
                          <span className="font-medium">{skill.name}</span>
                          <div className="flex items-center space-x-3">
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                  key={level}
                                  onClick={() => updateSkillLevel(skill.name, level)}
                                  title={`Rate skill ${level} out of 5`}
                                  className={`h-6 w-6 ${
                                    level <= skill.level ? "text-yellow-400" : "text-slate-300"
                                  }`}
                                >
                                  <Star className="h-4 w-4 fill-current" />
                                </button>
                              ))}
                            </div>
                            <Button
                              onClick={() => removeSkill(skill.name)}
                              variant="outline"
                              size="sm"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {resumeData.skills.length === 0 && (
                      <div className="text-center py-8 text-slate-500 dark:text-gray-400">
                        <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No skills added yet.</p>
                        <p className="text-sm mt-2">Add your skills and rate your proficiency level.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview */}
          <div>
            <div className="sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Preview
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Toggle preview mode or open in new window
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Full Preview
                </Button>
              </div>
              <div className="max-h-[800px] overflow-y-auto">
                <ResumePreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
