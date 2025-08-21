"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Building,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  Tags,
  Users,
  Calendar,
  Globe,
  Plus,
  X,
  Save,
  Eye,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isAuthenticated, getCurrentUser, type User } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const jobCategories = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Sales",
  "Operations",
  "Human Resources",
  "Design",
  "Engineering",
];

const skillSuggestions = [
  "JavaScript", "Python", "React", "Node.js", "AWS", "Docker", "TypeScript",
  "SQL", "MongoDB", "PostgreSQL", "Kubernetes", "GraphQL", "Vue.js", "Angular",
  "Java", "C#", ".NET", "Spring Boot", "Django", "Flask", "Express.js",
  "Product Management", "Project Management", "Agile", "Scrum", "Leadership",
  "Marketing", "Sales", "Customer Service", "Business Analysis", "Data Analysis",
];

interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  salaryMin: string;
  salaryMax: string;
  currency: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  skills: string[];
  experience: string;
  education: string;
  applicationDeadline: string;
  contactEmail: string;
  companyWebsite: string;
  remote: boolean;
  featured: boolean;
}

export default function PostJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: "",
    location: "",
    type: "",
    category: "",
    salaryMin: "",
    salaryMax: "",
    currency: "USD",
    description: "",
    responsibilities: [""],
    requirements: [""],
    benefits: [""],
    skills: [],
    experience: "",
    education: "",
    applicationDeadline: "",
    contactEmail: "",
    companyWebsite: "",
    remote: false,
    featured: false,
  });

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);
    if (authenticated) {
      setCurrentUser(getCurrentUser());
    } else {
      router.push("/auth");
    }
  }, [router]);

  const updateFormData = (field: keyof JobFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: keyof JobFormData) => {
    if (field === "responsibilities" || field === "requirements" || field === "benefits") {
      updateFormData(field, [...(formData[field] as string[]), ""]);
    }
  };

  const updateArrayItem = (field: keyof JobFormData, index: number, value: string) => {
    if (field === "responsibilities" || field === "requirements" || field === "benefits") {
      const newArray = [...(formData[field] as string[])];
      newArray[index] = value;
      updateFormData(field, newArray);
    }
  };

  const removeArrayItem = (field: keyof JobFormData, index: number) => {
    if (field === "responsibilities" || field === "requirements" || field === "benefits") {
      const newArray = (formData[field] as string[]).filter((_, i) => i !== index);
      updateFormData(field, newArray);
    }
  };

  const addSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      updateFormData("skills", [...formData.skills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    updateFormData("skills", formData.skills.filter(s => s !== skill));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    toast({
      title: "Job Posted Successfully",
      description: "Your job posting is now live and visible to candidates.",
    });
    
    router.push("/jobs");
  };

  const steps = [
    { title: "Basic Info", icon: Briefcase },
    { title: "Details", icon: FileText },
    { title: "Requirements", icon: CheckCircle },
    { title: "Preview", icon: Eye },
  ];

  const StepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <div key={index} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isActive
                  ? "bg-teal-600 text-white"
                  : isCompleted
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span
              className={`ml-2 text-sm font-medium ${
                isActive
                  ? "text-teal-600 dark:text-teal-400"
                  : isCompleted
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 mx-4" />
            )}
          </div>
        );
      })}
    </div>
  );

  const BasicInfoStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateFormData("title", e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="company">Company Name *</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => updateFormData("company", e.target.value)}
            placeholder="e.g. TechCorp UAE"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => updateFormData("location", e.target.value)}
            placeholder="e.g. Dubai, UAE"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="type">Job Type *</Label>
          <Select value={formData.type} onValueChange={(value) => updateFormData("type", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {jobCategories.map(category => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="salaryMin">Minimum Salary</Label>
          <Input
            id="salaryMin"
            type="number"
            value={formData.salaryMin}
            onChange={(e) => updateFormData("salaryMin", e.target.value)}
            placeholder="50000"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="salaryMax">Maximum Salary</Label>
          <Input
            id="salaryMax"
            type="number"
            value={formData.salaryMax}
            onChange={(e) => updateFormData("salaryMax", e.target.value)}
            placeholder="80000"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select value={formData.currency} onValueChange={(value) => updateFormData("currency", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="AED">AED</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remote"
            checked={formData.remote}
            onCheckedChange={(checked) => updateFormData("remote", checked)}
          />
          <Label htmlFor="remote">Remote work available</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => updateFormData("featured", checked)}
          />
          <Label htmlFor="featured">Featured listing (+$50)</Label>
        </div>
      </div>
    </div>
  );

  const DetailsStep = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="description">Job Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData("description", e.target.value)}
          placeholder="Describe the role, what the candidate will be doing, and what makes this opportunity exciting..."
          rows={6}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Key Responsibilities</Label>
        <div className="space-y-2 mt-2">
          {formData.responsibilities.map((responsibility, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={responsibility}
                onChange={(e) => updateArrayItem("responsibilities", index, e.target.value)}
                placeholder="Enter a key responsibility..."
                className="flex-1"
              />
              {formData.responsibilities.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem("responsibilities", index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => addArrayItem("responsibilities")}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Responsibility
          </Button>
        </div>
      </div>

      <div>
        <Label>Benefits & Perks</Label>
        <div className="space-y-2 mt-2">
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={benefit}
                onChange={(e) => updateArrayItem("benefits", index, e.target.value)}
                placeholder="Enter a benefit or perk..."
                className="flex-1"
              />
              {formData.benefits.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem("benefits", index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => addArrayItem("benefits")}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Benefit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="contactEmail">Contact Email *</Label>
          <Input
            id="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={(e) => updateFormData("contactEmail", e.target.value)}
            placeholder="hr@company.com"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="companyWebsite">Company Website</Label>
          <Input
            id="companyWebsite"
            type="url"
            value={formData.companyWebsite}
            onChange={(e) => updateFormData("companyWebsite", e.target.value)}
            placeholder="https://company.com"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="applicationDeadline">Application Deadline</Label>
        <Input
          id="applicationDeadline"
          type="date"
          value={formData.applicationDeadline}
          onChange={(e) => updateFormData("applicationDeadline", e.target.value)}
          className="mt-1 max-w-xs"
        />
      </div>
    </div>
  );

  const RequirementsStep = () => (
    <div className="space-y-6">
      <div>
        <Label>Requirements *</Label>
        <div className="space-y-2 mt-2">
          {formData.requirements.map((requirement, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={requirement}
                onChange={(e) => updateArrayItem("requirements", index, e.target.value)}
                placeholder="Enter a requirement..."
                className="flex-1"
              />
              {formData.requirements.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem("requirements", index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => addArrayItem("requirements")}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Requirement
          </Button>
        </div>
      </div>

      <div>
        <Label>Required Skills</Label>
        <div className="mt-2">
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200"
              >
                {skill}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {skillSuggestions
              .filter(skill => !formData.skills.includes(skill))
              .slice(0, 12)
              .map((skill) => (
                <Button
                  key={skill}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addSkill(skill)}
                  className="text-xs justify-start"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {skill}
                </Button>
              ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="experience">Experience Level</Label>
          <Select value={formData.experience} onValueChange={(value) => updateFormData("experience", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
              <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
              <SelectItem value="senior">Senior Level (5-10 years)</SelectItem>
              <SelectItem value="lead">Lead/Principal (10+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="education">Education Level</Label>
          <Select value={formData.education} onValueChange={(value) => updateFormData("education", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high-school">High School</SelectItem>
              <SelectItem value="associates">Associate Degree</SelectItem>
              <SelectItem value="bachelors">Bachelor&apos;s Degree</SelectItem>
              <SelectItem value="masters">Master&apos;s Degree</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
              <SelectItem value="none">No Requirement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const PreviewStep = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900 dark:to-blue-900 p-6 rounded-lg border border-teal-200 dark:border-teal-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {formData.title || "Job Title"}
            </h2>
            <p className="text-slate-600 dark:text-gray-400">
              {formData.company || "Company Name"}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{formData.location || "Location"}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{formData.type || "Job Type"}</span>
          </div>
          {formData.salaryMin && formData.salaryMax && (
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4" />
              <span>{formData.currency} {formData.salaryMin} - {formData.salaryMax}</span>
            </div>
          )}
        </div>
        
        {formData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.skills.slice(0, 6).map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
            {formData.skills.length > 6 && (
              <Badge variant="secondary">+{formData.skills.length - 6} more</Badge>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Job Description
          </h3>
          <p className="text-slate-700 dark:text-gray-300">
            {formData.description || "No description provided"}
          </p>
        </div>

        {formData.responsibilities.filter(r => r.trim()).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Key Responsibilities
            </h3>
            <ul className="space-y-1">
              {formData.responsibilities.filter(r => r.trim()).map((responsibility, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-gray-300">{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {formData.requirements.filter(r => r.trim()).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Requirements
            </h3>
            <ul className="space-y-1">
              {formData.requirements.filter(r => r.trim()).map((requirement, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-gray-300">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  if (!isAuth) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8 lg:px-6">
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
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Post a New Job
            </h1>
            <p className="text-slate-600 dark:text-gray-400">
              Find the perfect candidate for your team
            </p>
          </div>
        </div>

        <StepIndicator />

        <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">
              {steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && <BasicInfoStep />}
            {currentStep === 1 && <DetailsStep />}
            {currentStep === 2 && <RequirementsStep />}
            {currentStep === 3 && <PreviewStep />}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Post Job
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
