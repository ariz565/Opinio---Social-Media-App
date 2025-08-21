"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Search,
  Filter,
  Star,
  Building,
  Users,
  TrendingUp,
  Calendar,
  Heart,
  BookOpen,
  Target,
  Award,
  ChevronRight,
  ExternalLink,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isAuthenticated, getCurrentUser, type User } from "@/lib/api";

// Mock data for jobs
const featuredJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp UAE",
    location: "Dubai, UAE",
    type: "Full-time",
    salary: "$80,000 - $120,000",
    postedDate: "2 days ago",
    logo: "/api/placeholder/60/60",
    tags: ["React", "Node.js", "AWS"],
    description: "Join our innovative team building cutting-edge solutions for the Middle East market.",
    applicants: 24,
    featured: true,
  },
  {
    id: 2,
    title: "Product Manager",
    company: "InnovateLab",
    location: "Abu Dhabi, UAE",
    type: "Full-time",
    salary: "$90,000 - $130,000",
    postedDate: "1 week ago",
    logo: "/api/placeholder/60/60",
    tags: ["Strategy", "Analytics", "Agile"],
    description: "Lead product development for our flagship fintech application.",
    applicants: 18,
    featured: true,
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "DesignStudio",
    location: "Remote",
    type: "Contract",
    salary: "$60,000 - $80,000",
    postedDate: "3 days ago",
    logo: "/api/placeholder/60/60",
    tags: ["Figma", "Design Systems", "User Research"],
    description: "Design exceptional user experiences for mobile and web applications.",
    applicants: 31,
    featured: false,
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "AI Solutions",
    location: "Sharjah, UAE",
    type: "Full-time",
    salary: "$70,000 - $100,000",
    postedDate: "5 days ago",
    logo: "/api/placeholder/60/60",
    tags: ["Python", "Machine Learning", "SQL"],
    description: "Build predictive models and extract insights from large datasets.",
    applicants: 12,
    featured: false,
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Dubai, UAE",
    type: "Full-time",
    salary: "$85,000 - $115,000",
    postedDate: "1 day ago",
    logo: "/api/placeholder/60/60",
    tags: ["Docker", "Kubernetes", "CI/CD"],
    description: "Optimize our cloud infrastructure and deployment pipelines.",
    applicants: 8,
    featured: true,
  },
];

const categories = [
  { name: "Technology", count: 342, icon: Briefcase, color: "bg-blue-500" },
  { name: "Finance", count: 189, icon: DollarSign, color: "bg-green-500" },
  { name: "Healthcare", count: 156, icon: Heart, color: "bg-red-500" },
  { name: "Education", count: 98, icon: BookOpen, color: "bg-purple-500" },
  { name: "Marketing", count: 234, icon: Target, color: "bg-orange-500" },
  { name: "Sales", count: 167, icon: TrendingUp, color: "bg-teal-500" },
];

const companySpotlight = [
  {
    name: "TechCorp UAE",
    logo: "/api/placeholder/80/80",
    employees: "500-1000",
    openings: 12,
    rating: 4.8,
    description: "Leading technology company in the Middle East",
  },
  {
    name: "InnovateLab",
    logo: "/api/placeholder/80/80",
    employees: "100-500",
    openings: 8,
    rating: 4.6,
    description: "Fintech innovator transforming banking",
  },
  {
    name: "DesignStudio",
    logo: "/api/placeholder/80/80",
    employees: "50-100",
    openings: 5,
    rating: 4.9,
    description: "Creative agency with global reach",
  },
];

export default function JobsPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [filteredJobs, setFilteredJobs] = useState(featuredJobs);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);
    if (authenticated) {
      setCurrentUser(getCurrentUser());
    }
  }, []);

  useEffect(() => {
    let filtered = featuredJobs;

    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((job) =>
        job.type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    setFilteredJobs(filtered);
  }, [searchQuery, selectedCategory, selectedLocation, selectedType]);

  const JobCard = ({ job }: { job: typeof featuredJobs[0] }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="group cursor-pointer"
      onClick={() => router.push(`/jobs/${job.id}`)}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 border-2 border-slate-200 dark:border-gray-700">
                <AvatarImage src={job.logo} alt={job.company} />
                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white font-semibold">
                  {job.company.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {job.title}
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-gray-400 font-medium">
                  {job.company}
                </p>
              </div>
            </div>
            {job.featured && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-700 dark:text-gray-300 line-clamp-2">
            {job.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{job.type}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-teal-600 dark:text-teal-400 font-medium">
              <Users className="h-4 w-4" />
              <span>{job.applicants} applicants</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-gray-700">
            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 font-semibold">
              <DollarSign className="h-4 w-4" />
              <span>{job.salary}</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-gray-500">
              {job.postedDate}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Find Your Dream Job
            </h1>
            <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover opportunities with top companies in the Gulf region and beyond
            </p>
            
            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto mt-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                      <Input
                        type="text"
                        placeholder="Job title, company, or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-12 bg-slate-50 dark:bg-gray-700 border-slate-200 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 rounded-xl"
                      />
                    </div>
                  </div>
                  
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="h-12 bg-slate-50 dark:bg-gray-700 border-slate-200 dark:border-gray-600 rounded-xl">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="dubai">Dubai</SelectItem>
                      <SelectItem value="abu dhabi">Abu Dhabi</SelectItem>
                      <SelectItem value="sharjah">Sharjah</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="h-12 bg-slate-50 dark:bg-gray-700 border-slate-200 dark:border-gray-600 rounded-xl">
                      <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <Search className="h-5 w-5 mr-2" />
                    Search Jobs
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-6">
        <Tabs defaultValue="jobs" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-1">
            <TabsTrigger value="jobs" className="rounded-lg">
              <Briefcase className="h-4 w-4 mr-2" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="companies" className="rounded-lg">
              <Building className="h-4 w-4 mr-2" />
              Companies
            </TabsTrigger>
            <TabsTrigger value="categories" className="rounded-lg">
              <Award className="h-4 w-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="resources" className="rounded-lg">
              <BookOpen className="h-4 w-4 mr-2" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-8">
            {/* Job Listings */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {filteredJobs.length} Jobs Found
                </h2>
                <Button
                  variant="outline"
                  onClick={() => router.push("/jobs/post")}
                  className="border-teal-200 dark:border-teal-700 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post a Job
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="companies" className="space-y-8">
            {/* Company Spotlight */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
                Featured Companies
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companySpotlight.map((company) => (
                  <motion.div
                    key={company.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                      <CardContent className="p-6 text-center space-y-4">
                        <Avatar className="h-20 w-20 mx-auto border-4 border-slate-200 dark:border-gray-700">
                          <AvatarImage src={company.logo} alt={company.name} />
                          <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white font-bold text-xl">
                            {company.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {company.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                            {company.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-4 text-sm text-slate-600 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{company.employees}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{company.rating}</span>
                          </div>
                        </div>
                        
                        <Button className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white">
                          View {company.openings} Open Positions
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-8">
            {/* Job Categories */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
                Browse by Category
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05 }}
                      className="cursor-pointer"
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <CardContent className="p-6 text-center space-y-4">
                          <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                              {category.name}
                            </h3>
                            <p className="text-slate-600 dark:text-gray-400 mt-1">
                              {category.count} open positions
                            </p>
                          </div>
                          
                          <Button variant="outline" className="w-full">
                            Explore Jobs
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-8">
            {/* Career Resources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Career Resources
                </h2>
                
                <div className="space-y-4">
                  {[
                    {
                      title: "Resume Builder",
                      description: "Create a professional resume with our AI-powered tool",
                      icon: Award,
                      link: "/jobs/resume-builder",
                    },
                    {
                      title: "Interview Preparation",
                      description: "Practice with common interview questions and tips",
                      icon: Target,
                      link: "/jobs/interview-prep",
                    },
                    {
                      title: "Salary Calculator",
                      description: "Research fair compensation for your role and location",
                      icon: DollarSign,
                      link: "/jobs/salary-calculator",
                    },
                    {
                      title: "Career Guidance",
                      description: "Get personalized advice from industry experts",
                      icon: BookOpen,
                      link: "/jobs/career-guidance",
                    },
                  ].map((resource) => {
                    const Icon = resource.icon;
                    return (
                      <motion.div
                        key={resource.title}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer"
                        onClick={() => router.push(resource.link)}
                      >
                        <Card className="hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <Icon className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                  {resource.title}
                                </h3>
                                <p className="text-slate-600 dark:text-gray-400 mt-1">
                                  {resource.description}
                                </p>
                              </div>
                              <ExternalLink className="h-5 w-5 text-slate-400" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  Latest Articles
                </h2>
                
                <div className="space-y-4">
                  {[
                    {
                      title: "Top 10 Tech Skills in Demand for 2024",
                      date: "Dec 15, 2023",
                      readTime: "5 min read",
                    },
                    {
                      title: "How to Network Effectively in the Gulf Region",
                      date: "Dec 12, 2023",
                      readTime: "8 min read",
                    },
                    {
                      title: "Remote Work Trends in the Middle East",
                      date: "Dec 10, 2023",
                      readTime: "6 min read",
                    },
                    {
                      title: "Salary Negotiation Tips for Professionals",
                      date: "Dec 8, 2023",
                      readTime: "7 min read",
                    },
                  ].map((article) => (
                    <motion.div
                      key={article.title}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            {article.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{article.date}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{article.readTime}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
