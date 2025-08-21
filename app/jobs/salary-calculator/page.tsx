"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calculator,
  DollarSign,
  TrendingUp,
  MapPin,
  Briefcase,
  Users,
  Star,
  BarChart3,
  PieChart,
  Target,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { isAuthenticated, getCurrentUser, type User } from "@/lib/api";

interface SalaryData {
  jobTitle: string;
  location: string;
  experience: number;
  education: string;
  companySize: string;
  industry: string;
}

interface SalaryResults {
  baseSalary: number;
  totalCompensation: number;
  percentile25: number;
  percentile50: number;
  percentile75: number;
  percentile90: number;
  marketPosition: string;
  factors: Array<{
    factor: string;
    impact: string;
    amount: number;
  }>;
}

// Mock salary data - in a real app, this would come from an API
const salaryDatabase = {
  "software-engineer": {
    dubai: { base: 85000, min: 65000, max: 120000 },
    "abu-dhabi": { base: 82000, min: 62000, max: 115000 },
    sharjah: { base: 75000, min: 55000, max: 100000 },
    riyadh: { base: 90000, min: 70000, max: 130000 },
  },
  "product-manager": {
    dubai: { base: 95000, min: 75000, max: 140000 },
    "abu-dhabi": { base: 92000, min: 72000, max: 135000 },
    sharjah: { base: 85000, min: 65000, max: 120000 },
    riyadh: { base: 100000, min: 80000, max: 150000 },
  },
  "data-scientist": {
    dubai: { base: 88000, min: 68000, max: 125000 },
    "abu-dhabi": { base: 85000, min: 65000, max: 120000 },
    sharjah: { base: 78000, min: 58000, max: 105000 },
    riyadh: { base: 93000, min: 73000, max: 135000 },
  },
};

export default function SalaryCalculator() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [salaryData, setSalaryData] = useState<SalaryData>({
    jobTitle: "",
    location: "",
    experience: 3,
    education: "",
    companySize: "",
    industry: "",
  });
  const [results, setResults] = useState<SalaryResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsAuth(authenticated);
    if (authenticated) {
      setCurrentUser(getCurrentUser());
    }
  }, []);

  const calculateSalary = async () => {
    setIsCalculating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock calculation logic
    const jobKey = salaryData.jobTitle as keyof typeof salaryDatabase;
    const locationKey =
      salaryData.location as keyof (typeof salaryDatabase)[typeof jobKey];

    let baseSalary = 75000; // default

    if (salaryDatabase[jobKey] && salaryDatabase[jobKey][locationKey]) {
      const data = salaryDatabase[jobKey][locationKey];
      baseSalary = data.base;
    }

    // Apply experience multiplier
    const experienceMultiplier = 1 + salaryData.experience * 0.08;

    // Apply education bonus
    const educationBonus =
      {
        "high-school": 0,
        bachelors: 0.1,
        masters: 0.2,
        phd: 0.3,
      }[salaryData.education] || 0;

    // Apply company size multiplier
    const companySizeMultiplier =
      {
        startup: 0.9,
        small: 0.95,
        medium: 1,
        large: 1.1,
        enterprise: 1.2,
      }[salaryData.companySize] || 1;

    const adjustedSalary =
      baseSalary *
      experienceMultiplier *
      (1 + educationBonus) *
      companySizeMultiplier;

    const mockResults: SalaryResults = {
      baseSalary: Math.round(adjustedSalary),
      totalCompensation: Math.round(adjustedSalary * 1.25), // Including benefits
      percentile25: Math.round(adjustedSalary * 0.8),
      percentile50: Math.round(adjustedSalary),
      percentile75: Math.round(adjustedSalary * 1.2),
      percentile90: Math.round(adjustedSalary * 1.4),
      marketPosition:
        adjustedSalary > baseSalary * 1.1
          ? "Above Market"
          : adjustedSalary < baseSalary * 0.9
          ? "Below Market"
          : "Market Rate",
      factors: [
        {
          factor: "Experience Level",
          impact:
            salaryData.experience > 5
              ? "Positive"
              : salaryData.experience < 2
              ? "Negative"
              : "Neutral",
          amount: Math.round(baseSalary * (experienceMultiplier - 1)),
        },
        {
          factor: "Education",
          impact: educationBonus > 0 ? "Positive" : "Neutral",
          amount: Math.round(baseSalary * educationBonus),
        },
        {
          factor: "Company Size",
          impact:
            companySizeMultiplier > 1
              ? "Positive"
              : companySizeMultiplier < 1
              ? "Negative"
              : "Neutral",
          amount: Math.round(baseSalary * (companySizeMultiplier - 1)),
        },
      ],
    };

    setResults(mockResults);
    setIsCalculating(false);
  };

  const updateSalaryData = (
    field: keyof SalaryData,
    value: string | number
  ) => {
    setSalaryData((prev) => ({ ...prev, [field]: value }));
  };

  const SalaryChart = () => {
    if (!results) return null;

    const data = [
      {
        label: "25th Percentile",
        value: results.percentile25,
        color: "bg-red-500",
      },
      {
        label: "50th Percentile (Median)",
        value: results.percentile50,
        color: "bg-yellow-500",
      },
      {
        label: "Your Estimate",
        value: results.baseSalary,
        color: "bg-teal-500",
      },
      {
        label: "75th Percentile",
        value: results.percentile75,
        color: "bg-blue-500",
      },
      {
        label: "90th Percentile",
        value: results.percentile90,
        color: "bg-purple-500",
      },
    ];

    const maxValue = results.percentile90;

    return (
      <div className="space-y-4">
        {data.map((item, index) => {
          const widthPercentage = (item.value / maxValue) * 100;
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  ${item.value.toLocaleString()}
                </span>
              </div>
              <Progress value={widthPercentage} className="h-3" />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:px-6">
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
              Salary Calculator
            </h1>
            <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get accurate salary insights based on your role, experience, and
              location in the Gulf region
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div>
            <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-teal-600" />
                  <span>Salary Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Select
                    value={salaryData.jobTitle}
                    onValueChange={(value) =>
                      updateSalaryData("jobTitle", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your job title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="software-engineer">
                        Software Engineer
                      </SelectItem>
                      <SelectItem value="product-manager">
                        Product Manager
                      </SelectItem>
                      <SelectItem value="data-scientist">
                        Data Scientist
                      </SelectItem>
                      <SelectItem value="ui-ux-designer">
                        UI/UX Designer
                      </SelectItem>
                      <SelectItem value="devops-engineer">
                        DevOps Engineer
                      </SelectItem>
                      <SelectItem value="business-analyst">
                        Business Analyst
                      </SelectItem>
                      <SelectItem value="project-manager">
                        Project Manager
                      </SelectItem>
                      <SelectItem value="marketing-manager">
                        Marketing Manager
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Select
                    value={salaryData.location}
                    onValueChange={(value) =>
                      updateSalaryData("location", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dubai">Dubai, UAE</SelectItem>
                      <SelectItem value="abu-dhabi">Abu Dhabi, UAE</SelectItem>
                      <SelectItem value="sharjah">Sharjah, UAE</SelectItem>
                      <SelectItem value="riyadh">
                        Riyadh, Saudi Arabia
                      </SelectItem>
                      <SelectItem value="doha">Doha, Qatar</SelectItem>
                      <SelectItem value="kuwait-city">
                        Kuwait City, Kuwait
                      </SelectItem>
                      <SelectItem value="manama">Manama, Bahrain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="experience">
                    Years of Experience: {salaryData.experience}
                  </Label>
                  <div className="mt-2">
                    <Slider
                      value={[salaryData.experience]}
                      onValueChange={(value) =>
                        updateSalaryData("experience", value[0])
                      }
                      max={20}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500 dark:text-gray-500 mt-1">
                      <span>0 years</span>
                      <span>10 years</span>
                      <span>20+ years</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="education">Education Level</Label>
                  <Select
                    value={salaryData.education}
                    onValueChange={(value) =>
                      updateSalaryData("education", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="bachelors">
                        Bachelor&apos;s Degree
                      </SelectItem>
                      <SelectItem value="masters">
                        Master&apos;s Degree
                      </SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select
                    value={salaryData.companySize}
                    onValueChange={(value) =>
                      updateSalaryData("companySize", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">
                        Startup (1-50 employees)
                      </SelectItem>
                      <SelectItem value="small">
                        Small (51-200 employees)
                      </SelectItem>
                      <SelectItem value="medium">
                        Medium (201-1000 employees)
                      </SelectItem>
                      <SelectItem value="large">
                        Large (1001-5000 employees)
                      </SelectItem>
                      <SelectItem value="enterprise">
                        Enterprise (5000+ employees)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={salaryData.industry}
                    onValueChange={(value) =>
                      updateSalaryData("industry", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance & Banking</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">
                        Retail & E-commerce
                      </SelectItem>
                      <SelectItem value="oil-gas">Oil & Gas</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={calculateSalary}
                  disabled={
                    !salaryData.jobTitle ||
                    !salaryData.location ||
                    isCalculating
                  }
                  className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white py-3"
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate Salary
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Main Results */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Salary Estimate</span>
                        <Badge
                          className={`${
                            results.marketPosition === "Above Market"
                              ? "bg-green-100 text-green-800"
                              : results.marketPosition === "Below Market"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {results.marketPosition}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                          ${results.baseSalary.toLocaleString()}
                        </div>
                        <p className="text-slate-600 dark:text-gray-400">
                          Estimated Annual Base Salary
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-slate-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-2xl font-semibold text-slate-900 dark:text-white">
                            ${results.totalCompensation.toLocaleString()}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-gray-400">
                            Total Compensation
                          </p>
                        </div>
                        <div className="text-center p-4 bg-slate-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-2xl font-semibold text-slate-900 dark:text-white">
                            ${results.percentile50.toLocaleString()}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-gray-400">
                            Market Median
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Salary Range Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        <span>Salary Range Comparison</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SalaryChart />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Factors Affecting Salary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-purple-600" />
                        <span>Factors Affecting Your Salary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {results.factors.map((factor, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border border-slate-200 dark:border-gray-700 rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">
                              {factor.factor}
                            </h4>
                            <Badge
                              className={`mt-1 ${
                                factor.impact === "Positive"
                                  ? "bg-green-100 text-green-800"
                                  : factor.impact === "Negative"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {factor.impact}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div
                              className={`font-semibold ${
                                factor.amount > 0
                                  ? "text-green-600"
                                  : factor.amount < 0
                                  ? "text-red-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {factor.amount > 0 ? "+" : ""}$
                              {Math.abs(factor.amount).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Insights and Tips */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Info className="h-5 w-5 text-orange-600" />
                        <span>Salary Insights</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          💡 Tips to Increase Your Salary
                        </h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>
                            • Gain additional certifications in your field
                          </li>
                          <li>
                            • Consider moving to larger companies for higher
                            compensation
                          </li>
                          <li>• Develop leadership and management skills</li>
                          <li>
                            • Stay updated with the latest industry trends and
                            technologies
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                          📊 Market Trends
                        </h4>
                        <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                          <li>
                            • {salaryData.jobTitle.replace("-", " ")} roles are
                            in high demand
                          </li>
                          <li>
                            • Remote work opportunities are increasing salary
                            ranges
                          </li>
                          <li>
                            • Companies are offering better benefits packages
                          </li>
                          <li>
                            • The tech sector continues to lead in compensation
                            growth
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            ) : (
              <Card className="border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <CardContent className="py-12 text-center">
                  <Calculator className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Ready to Calculate?
                  </h3>
                  <p className="text-slate-600 dark:text-gray-400 mb-6">
                    Fill in your information to get personalized salary insights
                  </p>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                        25K+
                      </div>
                      <p className="text-xs text-slate-600 dark:text-gray-400">
                        Salary Data Points
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        98%
                      </div>
                      <p className="text-xs text-slate-600 dark:text-gray-400">
                        Accuracy Rate
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
