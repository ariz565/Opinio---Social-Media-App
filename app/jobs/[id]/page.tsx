"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Building,
  Calendar,
  Share,
  Bookmark,
  Heart,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Star,
  Send,
  FileText,
  Download,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { isAuthenticated, getCurrentUser, type User } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Mock job data (in real app, this would be fetched based on ID)
const jobData = {
  id: 1,
  title: "Senior Software Engineer",
  company: "TechCorp UAE",
  location: "Dubai, UAE",
  type: "Full-time",
  salary: "$80,000 - $120,000",
  postedDate: "2 days ago",
  logo: "/api/placeholder/80/80",
  tags: ["React", "Node.js", "AWS", "TypeScript", "GraphQL"],
  description: `We are seeking a highly skilled Senior Software Engineer to join our innovative team building cutting-edge solutions for the Middle East market. You will be responsible for designing, developing, and maintaining scalable web applications that serve millions of users across the region.`,
  responsibilities: [
    "Design and develop high-quality, scalable web applications",
    "Collaborate with cross-functional teams to define and implement new features",
    "Participate in code reviews and maintain code quality standards",
    "Mentor junior developers and contribute to team knowledge sharing",
    "Optimize application performance and ensure security best practices",
    "Stay updated with latest technologies and industry trends",
  ],
  requirements: [
    "5+ years of experience in software development",
    "Strong proficiency in React, Node.js, and TypeScript",
    "Experience with cloud platforms (AWS preferred)",
    "Knowledge of GraphQL and RESTful APIs",
    "Familiarity with modern development tools and practices",
    "Excellent problem-solving and communication skills",
    "Bachelor's degree in Computer Science or related field",
  ],
  benefits: [
    "Competitive salary and performance bonuses",
    "Comprehensive health insurance",
    "Annual flight tickets to home country",
    "Professional development budget",
    "Flexible working arrangements",
    "Modern office with latest equipment",
    "Team building activities and events",
  ],
  applicants: 24,
  featured: true,
  companyInfo: {
    name: "TechCorp UAE",
    size: "500-1000 employees",
    industry: "Technology",
    founded: "2015",
    website: "https://techcorp.ae",
    description:
      "Leading technology company in the Middle East, specializing in digital transformation solutions for enterprises.",
    rating: 4.8,
    reviews: 156,
  },
};

const similarJobs = [
  {
    id: 2,
    title: "Full Stack Developer",
    company: "InnovateLab",
    location: "Abu Dhabi, UAE",
    salary: "$70,000 - $100,000",
    type: "Full-time",
  },
  {
    id: 3,
    title: "Frontend Engineer",
    company: "DesignStudio",
    location: "Remote",
    salary: "$60,000 - $85,000",
    type: "Contract",
  },
];

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);
    if (authenticated) {
      setCurrentUser(getCurrentUser());
    }
  }, []);

  const handleSaveJob = () => {
    if (!isAuth) {
      toast({
        title: "Login Required",
        description: "Please login to save jobs",
        variant: "destructive",
      });
      return;
    }
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Job Unsaved" : "Job Saved",
      description: isSaved
        ? "Job removed from your saved list"
        : "Job added to your saved list",
    });
  };

  const handleApply = () => {
    if (!isAuth) {
      toast({
        title: "Login Required",
        description: "Please login to apply for jobs",
        variant: "destructive",
      });
      router.push("/auth");
      return;
    }
    setIsApplying(true);
  };

  const submitApplication = () => {
    // Simulate application submission
    setTimeout(() => {
      setIsApplying(false);
      setHasApplied(true);
      toast({
        title: "Application Submitted",
        description: "Your application has been sent to the employer",
      });
    }, 2000);
  };

  const shareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: `${jobData.title} at ${jobData.company}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Job link copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-6">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <CardHeader className="pb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16 border-2 border-slate-200 dark:border-gray-700">
                        <AvatarImage src={jobData.logo} alt={jobData.company} />
                        <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white font-bold text-xl">
                          {jobData.company.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                          {jobData.title}
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-gray-400 font-medium">
                          {jobData.company}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500 dark:text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{jobData.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{jobData.type}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Posted {jobData.postedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {jobData.featured && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 font-bold text-lg">
                      <DollarSign className="h-5 w-5" />
                      <span>{jobData.salary}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={shareJob}
                        className="border-slate-200 dark:border-gray-700"
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveJob}
                        className={`border-slate-200 dark:border-gray-700 ${
                          isSaved
                            ? "bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400"
                            : ""
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
                        />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Job Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white">
                    Job Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
                    {jobData.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {jobData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Separator className="bg-slate-200 dark:bg-gray-700" />

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Key Responsibilities
                    </h3>
                    <ul className="space-y-2">
                      {jobData.responsibilities.map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-gray-300">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator className="bg-slate-200 dark:bg-gray-700" />

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Requirements
                    </h3>
                    <ul className="space-y-2">
                      {jobData.requirements.map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-gray-300">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator className="bg-slate-200 dark:bg-gray-700" />

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Benefits & Perks
                    </h3>
                    <ul className="space-y-2">
                      {jobData.benefits.map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-gray-300">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <CardContent className="p-6 space-y-4">
                  {hasApplied ? (
                    <div className="text-center space-y-3">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          Application Submitted
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-gray-400">
                          The employer will review your application and get back
                          to you soon.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Dialog open={isApplying} onOpenChange={setIsApplying}>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white py-3 text-lg font-semibold"
                            onClick={handleApply}
                          >
                            <Send className="h-5 w-5 mr-2" />
                            Apply Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Apply for {jobData.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                Application Requirements
                              </h4>
                              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                <li>• Updated resume/CV</li>
                                <li>
                                  • Cover letter (optional but recommended)
                                </li>
                                <li>• Portfolio links (if applicable)</li>
                              </ul>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="resume">Resume/CV *</Label>
                                <div className="border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-lg p-6 text-center">
                                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                                  <p className="text-sm text-slate-600 dark:text-gray-400">
                                    Click to upload or drag and drop
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">
                                    PDF, DOC, DOCX up to 5MB
                                  </p>
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="portfolio">
                                  Portfolio URL (Optional)
                                </Label>
                                <Input
                                  id="portfolio"
                                  placeholder="https://your-portfolio.com"
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <Label htmlFor="cover-letter">
                                  Cover Letter (Optional)
                                </Label>
                                <Textarea
                                  id="cover-letter"
                                  value={coverLetter}
                                  onChange={(e) =>
                                    setCoverLetter(e.target.value)
                                  }
                                  placeholder="Tell us why you're interested in this position..."
                                  rows={6}
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div className="flex space-x-3">
                              <Button
                                variant="outline"
                                onClick={() => setIsApplying(false)}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={submitApplication}
                                className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white"
                              >
                                Submit Application
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <div className="flex items-center justify-center space-x-2 text-sm text-slate-600 dark:text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>{jobData.applicants} people have applied</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white">
                    About {jobData.companyInfo.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-700 dark:text-gray-300">
                    {jobData.companyInfo.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-gray-400">
                        Industry:
                      </span>
                      <span className="text-slate-900 dark:text-white">
                        {jobData.companyInfo.industry}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-gray-400">
                        Company Size:
                      </span>
                      <span className="text-slate-900 dark:text-white">
                        {jobData.companyInfo.size}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-gray-400">
                        Founded:
                      </span>
                      <span className="text-slate-900 dark:text-white">
                        {jobData.companyInfo.founded}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-gray-400">
                        Rating:
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-slate-900 dark:text-white">
                          {jobData.companyInfo.rating} (
                          {jobData.companyInfo.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      window.open(jobData.companyInfo.website, "_blank")
                    }
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Company Website
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Similar Jobs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-white">
                    Similar Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {similarJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => router.push(`/jobs/${job.id}`)}
                    >
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {job.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-gray-400">
                        {job.company}
                      </p>
                      <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-gray-500">
                        <span>{job.location}</span>
                        <span>{job.salary}</span>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/jobs")}
                  >
                    View All Jobs
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
