"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  Image as ImageIcon,
  Type,
  Layout,
  Palette,
  Settings,
  Globe,
  Lock,
  Users,
  Tag,
  FileText,
  Link as LinkIcon,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { isAuthenticated, getCurrentUser, type User } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface PageFormData {
  title: string;
  description: string;
  category: string;
  isPublic: boolean;
  tags: string[];
  coverImage: string;
  avatar: string;
  theme: string;
  layout: string;
  customDomain: string;
  seoTitle: string;
  seoDescription: string;
  socialLinks: {
    website: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  sections: Section[];
}

interface Section {
  id: string;
  type:
    | "hero"
    | "about"
    | "gallery"
    | "contact"
    | "testimonials"
    | "services"
    | "team"
    | "blog";
  title: string;
  content: any;
  visible: boolean;
  order: number;
}

const pageTemplates = [
  {
    id: 1,
    name: "Business Professional",
    preview: "/api/placeholder/300/200",
    theme: "professional",
    layout: "modern",
    sections: ["hero", "about", "services", "team", "contact"],
  },
  {
    id: 2,
    name: "Creative Portfolio",
    preview: "/api/placeholder/300/200",
    theme: "creative",
    layout: "masonry",
    sections: ["hero", "about", "gallery", "testimonials", "contact"],
  },
  {
    id: 3,
    name: "Community Hub",
    preview: "/api/placeholder/300/200",
    theme: "community",
    layout: "grid",
    sections: ["hero", "about", "blog", "team", "contact"],
  },
];

const themeOptions = [
  {
    id: "professional",
    name: "Professional",
    colors: ["#1e293b", "#0f172a", "#334155"],
  },
  {
    id: "creative",
    name: "Creative",
    colors: ["#7c3aed", "#a855f7", "#c084fc"],
  },
  { id: "modern", name: "Modern", colors: ["#0891b2", "#0e7490", "#155e75"] },
  { id: "minimal", name: "Minimal", colors: ["#374151", "#4b5563", "#6b7280"] },
];

const layoutOptions = [
  { id: "modern", name: "Modern Grid", description: "Clean grid-based layout" },
  { id: "masonry", name: "Masonry", description: "Pinterest-style layout" },
  { id: "classic", name: "Classic", description: "Traditional website layout" },
  { id: "magazine", name: "Magazine", description: "Blog-style layout" },
];

const sectionTypes = [
  {
    id: "hero",
    name: "Hero Section",
    icon: ImageIcon,
    description: "Main banner with call-to-action",
  },
  {
    id: "about",
    name: "About",
    icon: FileText,
    description: "Introduce yourself or your company",
  },
  {
    id: "gallery",
    name: "Gallery",
    icon: ImageIcon,
    description: "Showcase your work or products",
  },
  {
    id: "services",
    name: "Services",
    icon: Settings,
    description: "List your services or offerings",
  },
  {
    id: "team",
    name: "Team",
    icon: Users,
    description: "Meet the team section",
  },
  {
    id: "testimonials",
    name: "Testimonials",
    icon: CheckCircle,
    description: "Customer reviews and feedback",
  },
  {
    id: "contact",
    name: "Contact",
    icon: LinkIcon,
    description: "Contact information and form",
  },
  {
    id: "blog",
    name: "Blog",
    icon: FileText,
    description: "Latest blog posts",
  },
];

export default function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(
    searchParams.get("template")
      ? parseInt(searchParams.get("template")!)
      : null
  );
  const [formData, setFormData] = useState<PageFormData>({
    title: "",
    description: "",
    category: "",
    isPublic: true,
    tags: [],
    coverImage: "",
    avatar: "",
    theme: "professional",
    layout: "modern",
    customDomain: "",
    seoTitle: "",
    seoDescription: "",
    socialLinks: {
      website: "",
      twitter: "",
      linkedin: "",
      instagram: "",
    },
    contactInfo: {
      email: "",
      phone: "",
      address: "",
    },
    sections: [],
  });

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);
    if (authenticated) {
      const user = getCurrentUser();
      setCurrentUser(user);
      setFormData((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          email: user?.email || "",
        },
      }));
    } else {
      router.push("/auth");
    }
  }, [router]);

  useEffect(() => {
    if (selectedTemplate) {
      const template = pageTemplates.find((t) => t.id === selectedTemplate);
      if (template) {
        setFormData((prev) => ({
          ...prev,
          theme: template.theme,
          layout: template.layout,
          sections: template.sections.map((type, index) => ({
            id: `${type}-${Date.now()}-${index}`,
            type: type as Section["type"],
            title: type.charAt(0).toUpperCase() + type.slice(1),
            content: {},
            visible: true,
            order: index,
          })),
        }));
      }
    }
  }, [selectedTemplate]);

  const updateFormData = (field: keyof PageFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      updateFormData("tags", [...formData.tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    updateFormData(
      "tags",
      formData.tags.filter((t) => t !== tag)
    );
  };

  const addSection = (type: Section["type"]) => {
    const newSection: Section = {
      id: `${type}-${Date.now()}`,
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      content: {},
      visible: true,
      order: formData.sections.length,
    };
    updateFormData("sections", [...formData.sections, newSection]);
  };

  const removeSection = (id: string) => {
    updateFormData(
      "sections",
      formData.sections.filter((s) => s.id !== id)
    );
  };

  const handleSubmit = async () => {
    // Simulate page creation
    toast({
      title: "Page Created Successfully",
      description: "Your page is now live and ready to be shared!",
    });
    router.push("/pages");
  };

  const steps = [
    { title: "Template", icon: Layout },
    { title: "Basic Info", icon: FileText },
    { title: "Design", icon: Palette },
    { title: "Sections", icon: Settings },
    { title: "SEO & Settings", icon: Globe },
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

  const TemplateStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Choose a Template
        </h2>
        <p className="text-slate-600 dark:text-gray-400">
          Select a template to get started, or start from scratch
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
            selectedTemplate === null
              ? "border-teal-500 bg-teal-50 dark:bg-teal-900"
              : "border-slate-200 dark:border-gray-700"
          }`}
          onClick={() => setSelectedTemplate(null)}
        >
          <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center mb-4">
            <Plus className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Start from Scratch
          </h3>
          <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
            Build your page from the ground up
          </p>
        </motion.div>

        {pageTemplates.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ scale: 1.02 }}
            className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
              selectedTemplate === template.id
                ? "border-teal-500 bg-teal-50 dark:bg-teal-900"
                : "border-slate-200 dark:border-gray-700"
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center mb-4">
              <Layout className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {template.name}
            </h3>
            <div className="flex flex-wrap gap-1 mt-2">
              {template.sections.slice(0, 3).map((section) => (
                <Badge key={section} variant="secondary" className="text-xs">
                  {section}
                </Badge>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const BasicInfoStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="title">Page Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateFormData("title", e.target.value)}
            placeholder="My Awesome Page"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => updateFormData("category", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="community">Community</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="nonprofit">Non-profit</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData("description", e.target.value)}
          placeholder="Tell people what your page is about..."
          rows={4}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Tags</Label>
        <div className="mt-2">
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200"
              >
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTag(tag)}
                  className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>

          <Input
            placeholder="Add tags... (press Enter)"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                const input = e.target as HTMLInputElement;
                addTag(input.value.trim());
                input.value = "";
              }
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Cover Image</Label>
          <div className="mt-2 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <Camera className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 dark:text-gray-400">
              Click to upload cover image
            </p>
            <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">
              Recommended: 1200x400px
            </p>
          </div>
        </div>

        <div>
          <Label>Profile Picture</Label>
          <div className="mt-2 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 dark:text-gray-400">
              Click to upload profile picture
            </p>
            <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">
              Recommended: 300x300px
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-800 rounded-lg">
        <div>
          <Label htmlFor="isPublic" className="text-sm font-medium">
            Make this page public
          </Label>
          <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">
            Anyone can view and follow your page
          </p>
        </div>
        <Switch
          id="isPublic"
          checked={formData.isPublic}
          onCheckedChange={(checked) => updateFormData("isPublic", checked)}
        />
      </div>
    </div>
  );

  const DesignStep = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold">Choose Theme</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {themeOptions.map((theme) => (
            <motion.div
              key={theme.id}
              whileHover={{ scale: 1.02 }}
              className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                formData.theme === theme.id
                  ? "border-teal-500 bg-teal-50 dark:bg-teal-900"
                  : "border-slate-200 dark:border-gray-700"
              }`}
              onClick={() => updateFormData("theme", theme.id)}
            >
              <div className="flex space-x-1 mb-3">
                {theme.colors.map((color, index) => (
                  <div
                    key={index}
                    className={`w-6 h-6 rounded-full ${
                      index === 0
                        ? "bg-slate-800"
                        : index === 1
                        ? "bg-slate-900"
                        : "bg-slate-600"
                    }`}
                  />
                ))}
              </div>
              <h3 className="font-medium text-slate-900 dark:text-white">
                {theme.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-lg font-semibold">Layout Style</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {layoutOptions.map((layout) => (
            <motion.div
              key={layout.id}
              whileHover={{ scale: 1.02 }}
              className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                formData.layout === layout.id
                  ? "border-teal-500 bg-teal-50 dark:bg-teal-900"
                  : "border-slate-200 dark:border-gray-700"
              }`}
              onClick={() => updateFormData("layout", layout.id)}
            >
              <div className="h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-700 rounded-lg mb-3 flex items-center justify-center">
                <Layout className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="font-medium text-slate-900 dark:text-white">
                {layout.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                {layout.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const SectionsStep = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold">Page Sections</Label>
        <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
          Add and arrange sections for your page
        </p>
      </div>

      <div className="space-y-4">
        {formData.sections.map((section) => {
          const sectionType = sectionTypes.find((s) => s.id === section.type);
          const Icon = sectionType?.icon || FileText;

          return (
            <div
              key={section.id}
              className="flex items-center justify-between p-4 border border-slate-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                  <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white">
                    {sectionType?.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-gray-400">
                    {sectionType?.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Switch
                  checked={section.visible}
                  onCheckedChange={(checked) => {
                    const updatedSections = formData.sections.map((s) =>
                      s.id === section.id ? { ...s, visible: checked } : s
                    );
                    updateFormData("sections", updatedSections);
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSection(section.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <Label className="text-lg font-semibold">Add More Sections</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {sectionTypes
            .filter(
              (sectionType) =>
                !formData.sections.some((s) => s.type === sectionType.id)
            )
            .map((sectionType) => {
              const Icon = sectionType.icon;
              return (
                <Button
                  key={sectionType.id}
                  variant="outline"
                  onClick={() => addSection(sectionType.id as Section["type"])}
                  className="justify-start h-auto p-4"
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">{sectionType.name}</div>
                    <div className="text-xs text-slate-500 dark:text-gray-500">
                      {sectionType.description}
                    </div>
                  </div>
                </Button>
              );
            })}
        </div>
      </div>
    </div>
  );

  const SEOStep = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold">SEO Settings</Label>
        <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
          Optimize your page for search engines
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="seoTitle">SEO Title</Label>
          <Input
            id="seoTitle"
            value={formData.seoTitle}
            onChange={(e) => updateFormData("seoTitle", e.target.value)}
            placeholder="Page Title for Search Engines"
            className="mt-1"
          />
          <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">
            {formData.seoTitle.length}/60 characters
          </p>
        </div>

        <div>
          <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
          <Input
            id="customDomain"
            value={formData.customDomain}
            onChange={(e) => updateFormData("customDomain", e.target.value)}
            placeholder="yourpage.com"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="seoDescription">SEO Description</Label>
        <Textarea
          id="seoDescription"
          value={formData.seoDescription}
          onChange={(e) => updateFormData("seoDescription", e.target.value)}
          placeholder="Describe your page for search engines..."
          rows={3}
          className="mt-1"
        />
        <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">
          {formData.seoDescription.length}/160 characters
        </p>
      </div>

      <Separator />

      <div>
        <Label className="text-lg font-semibold">Social Links</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.socialLinks.website}
              onChange={(e) =>
                updateFormData("socialLinks", {
                  ...formData.socialLinks,
                  website: e.target.value,
                })
              }
              placeholder="https://yourwebsite.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              value={formData.socialLinks.twitter}
              onChange={(e) =>
                updateFormData("socialLinks", {
                  ...formData.socialLinks,
                  twitter: e.target.value,
                })
              }
              placeholder="@yourusername"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={formData.socialLinks.linkedin}
              onChange={(e) =>
                updateFormData("socialLinks", {
                  ...formData.socialLinks,
                  linkedin: e.target.value,
                })
              }
              placeholder="linkedin.com/in/yourusername"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={formData.socialLinks.instagram}
              onChange={(e) =>
                updateFormData("socialLinks", {
                  ...formData.socialLinks,
                  instagram: e.target.value,
                })
              }
              placeholder="@yourusername"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-lg font-semibold">Contact Information</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.contactInfo.email}
              onChange={(e) =>
                updateFormData("contactInfo", {
                  ...formData.contactInfo,
                  email: e.target.value,
                })
              }
              placeholder="contact@example.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.contactInfo.phone}
              onChange={(e) =>
                updateFormData("contactInfo", {
                  ...formData.contactInfo,
                  phone: e.target.value,
                })
              }
              placeholder="+1 (555) 123-4567"
              className="mt-1"
            />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={formData.contactInfo.address}
            onChange={(e) =>
              updateFormData("contactInfo", {
                ...formData.contactInfo,
                address: e.target.value,
              })
            }
            placeholder="Your business address..."
            rows={2}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );

  if (!isAuth) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="max-w-5xl mx-auto px-4 py-8 lg:px-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pages
          </Button>

          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Create New Page
            </h1>
            <p className="text-lg font-medium text-slate-600 dark:text-gray-400">
              Build your professional online presence with ease
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
            {currentStep === 0 && <TemplateStep />}
            {currentStep === 1 && <BasicInfoStep />}
            {currentStep === 2 && <DesignStep />}
            {currentStep === 3 && <SectionsStep />}
            {currentStep === 4 && <SEOStep />}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>

              <div className="flex space-x-3">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={() =>
                      setCurrentStep(
                        Math.min(steps.length - 1, currentStep + 1)
                      )
                    }
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Create Page
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
