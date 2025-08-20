"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  Lock,
  User,
  UserCheck,
  Loader2,
  ArrowRight,
  Chrome,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { authAPI, isAuthenticated } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { OTPVerification } from "@/components/auth/otp-verification";
import { ForgotPassword } from "@/components/auth/forgot-password";
import {
  isCurrentlyRedirecting,
  setRedirectingState,
} from "@/lib/redirect-manager";

// Validation patterns matching backend
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // OTP verification states
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [isLoginOTP, setIsLoginOTP] = useState(false); // true for login OTP, false for email verification
  const [pendingLoginData, setPendingLoginData] = useState<any>(null);
  
  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    email: "",
    username: "",
    full_name: "",
    password: "",
    confirmPassword: "",
  });

  // Real-time validation
  const validateField = (field: string, value: string) => {
    const errors = { ...validationErrors };

    switch (field) {
      case "email":
        if (value && !EMAIL_REGEX.test(value)) {
          errors.email = "Please enter a valid email address";
        } else {
          delete errors.email;
        }
        break;
      case "username":
        if (value && !USERNAME_REGEX.test(value)) {
          errors.username =
            "Username must be 3-20 characters (letters, numbers, underscores only)";
        } else {
          delete errors.username;
        }
        break;
      case "password":
        if (value && !PASSWORD_REGEX.test(value)) {
          errors.password =
            "Password must be 8+ characters with uppercase, lowercase & number";
        } else {
          delete errors.password;
        }
        break;
      case "confirmPassword":
        if (value && value !== registerForm.password) {
          errors.confirmPassword = "Passwords do not match";
        } else {
          delete errors.confirmPassword;
        }
        break;
      case "full_name":
        if (value && value.trim().length < 2) {
          errors.full_name = "Full name must be at least 2 characters";
        } else {
          delete errors.full_name;
        }
        break;
    }

    setValidationErrors(errors);
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isCurrentlyRedirecting()) return; // Prevent multiple redirects

    const checkAuth = () => {
      if (isAuthenticated()) {
        setRedirectingState(true);
        router.replace("/feed");
      }
    };

    // Small delay to prevent rapid execution
    const timeoutId = setTimeout(checkAuth, 100);
    return () => clearTimeout(timeoutId);
  }, [router]); // Include router in dependencies

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // Redirect to Google OAuth
      window.location.href = `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      }/api/v1/auth/google`;
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Failed to initialize Google sign-in. Please try again.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate form
    if (!EMAIL_REGEX.test(loginForm.email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      await authAPI.login({
        email: loginForm.email,
        password: loginForm.password,
      });

      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your account.",
      });

      router.push("/");
    } catch (error: any) {
      const errorDetail =
        error.response?.data?.detail || "Login failed. Please try again.";

      // Check if error indicates OTP is required for first-time login
      if (
        error.response?.status === 400 &&
        (errorDetail.includes("OTP") ||
          errorDetail.includes("verification") ||
          errorDetail.includes("first time"))
      ) {
        // Show OTP verification for login
        setOtpEmail(loginForm.email);
        setPendingLoginData({
          email: loginForm.email,
          password: loginForm.password,
        });
        setIsLoginOTP(true);
        setShowOTPVerification(true);
      } else {
        setError(errorDetail);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate all fields
    const errors: Record<string, string> = {};

    if (!EMAIL_REGEX.test(registerForm.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!USERNAME_REGEX.test(registerForm.username)) {
      errors.username =
        "Username must be 3-20 characters (letters, numbers, underscores only)";
    }
    if (!PASSWORD_REGEX.test(registerForm.password)) {
      errors.password =
        "Password must be 8+ characters with uppercase, lowercase & number";
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (registerForm.full_name.trim().length < 2) {
      errors.full_name = "Full name must be at least 2 characters";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError("Please fix the validation errors above");
      setIsLoading(false);
      return;
    }

    try {
      await authAPI.register({
        email: registerForm.email,
        username: registerForm.username,
        full_name: registerForm.full_name,
        password: registerForm.password,
      });

      // Show OTP verification after successful registration
      setOtpEmail(registerForm.email);
      setIsLoginOTP(false); // This is email verification, not login OTP
      setShowOTPVerification(true);

      toast({
        title: "Registration Successful!",
        description: "Please check your email for a verification code.",
      });
    } catch (error: any) {
      setError(
        error.response?.data?.detail || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSuccess = async () => {
    if (isLoginOTP && pendingLoginData) {
      // Complete login with OTP
      setIsLoading(true);
      try {
        const otpCode = (window as any).getOTPCode?.() || "";
        await authAPI.login({
          email: pendingLoginData.email,
          password: pendingLoginData.password,
          otp_code: otpCode,
        });

        toast({
          title: "Welcome back!",
          description: "Successfully logged in to your account.",
        });

        router.push("/");
      } catch (error: any) {
        setError(
          error.response?.data?.detail || "Login failed. Please try again."
        );
        setShowOTPVerification(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Email verification completed, redirect to login
      setShowOTPVerification(false);
      toast({
        title: "Email Verified!",
        description: "You can now log in to your account.",
      });
    }
  };

  const handleOTPBack = () => {
    setShowOTPVerification(false);
    setOtpEmail("");
    setIsLoginOTP(false);
    setPendingLoginData(null);
  };

  const handleForgotPasswordSuccess = () => {
    setShowForgotPassword(false);
    toast({
      title: "Password Reset Complete!",
      description: "You can now log in with your new password.",
    });
  };

  const handleForgotPasswordBack = () => {
    setShowForgotPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {showOTPVerification ? (
        <OTPVerification
          email={otpEmail}
          onSuccess={handleOTPSuccess}
          onBack={handleOTPBack}
          isLoginMode={isLoginOTP}
        />
      ) : showForgotPassword ? (
        <ForgotPassword
          onSuccess={handleForgotPasswordSuccess}
          onBack={handleForgotPasswordBack}
        />
      ) : (
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          {/* Enhanced Left side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-16 h-16 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl opacity-20"></div>
                  <Image
                    src="/assets/images/gulf-return-logo.jpg"
                    alt="Gulf Return"
                    fill
                    className="object-contain rounded-2xl relative z-10"
                  />
                </motion.div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                  Gulf Return
                </h1>
              </div>
              <p className="text-xl text-slate-600 dark:text-gray-300 leading-relaxed">
                Connect with professionals, share your journey, and build
                meaningful relationships in the Gulf region.
              </p>
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-3 text-slate-600 dark:text-gray-300"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>Share your professional experiences</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-3 text-slate-600 dark:text-gray-300"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>Connect with like-minded professionals</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center space-x-3 text-slate-600 dark:text-gray-300"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>Discover opportunities in the Gulf</span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-gray-700"
            >
              <p className="text-sm text-slate-600 dark:text-gray-300 italic">
                &quot;Gulf Return has transformed how I connect with the
                professional community. It&apos;s more than a social platform -
                it&apos;s a career catalyst.&quot;
              </p>
              <div className="mt-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">SA</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-gray-200">
                    Sarah Ahmed
                  </p>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Software Engineer, Dubai
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Right side - Auth Forms */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl overflow-hidden">
              <CardHeader className="space-y-1 text-center pb-8 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-gray-800/50 dark:to-gray-900/50">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                    Welcome
                  </CardTitle>
                  <CardDescription className="text-slate-500 dark:text-gray-400 mt-2">
                    Join the Gulf professional community
                  </CardDescription>
                </motion.div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Google Sign-In Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <Button
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading}
                    className="w-full h-12 bg-white hover:bg-gray-50 border border-slate-300 text-slate-700 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group"
                    variant="outline"
                  >
                    {isGoogleLoading ? (
                      <Loader2 className="mr-3 h-5 w-5 animate-spin text-slate-600" />
                    ) : (
                      <Chrome className="mr-3 h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                    )}
                    <span className="text-slate-700 group-hover:text-slate-900 transition-colors">
                      {isGoogleLoading
                        ? "Connecting..."
                        : "Continue with Google"}
                    </span>
                  </Button>
                </motion.div>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-900 text-slate-500 dark:text-gray-400 font-medium">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 dark:bg-gray-800 rounded-xl p-1">
                    <TabsTrigger
                      value="login"
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg font-medium transition-all"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg font-medium transition-all"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4"
                      >
                        <Alert
                          variant="destructive"
                          className="border-red-200 bg-red-50 dark:bg-red-900/20"
                        >
                          <AlertDescription className="text-red-700 dark:text-red-400">
                            {error}
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <TabsContent value="login">
                    <motion.form
                      onSubmit={handleLogin}
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-slate-700 dark:text-gray-200 font-medium"
                        >
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-gray-500" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className={`pl-10 h-12 rounded-xl border-slate-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all ${
                              validationErrors.email
                                ? "border-red-300 focus:ring-red-500"
                                : ""
                            }`}
                            value={loginForm.email}
                            onChange={(e) => {
                              setLoginForm({
                                ...loginForm,
                                email: e.target.value,
                              });
                              validateField("email", e.target.value);
                            }}
                            required
                          />
                          {loginForm.email &&
                            EMAIL_REGEX.test(loginForm.email) && (
                              <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-emerald-500" />
                            )}
                        </div>
                        {validationErrors.email && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {validationErrors.email}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-slate-700 dark:text-gray-200 font-medium"
                        >
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-gray-500" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10 h-12 rounded-xl border-slate-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all"
                            value={loginForm.password}
                            onChange={(e) =>
                              setLoginForm({
                                ...loginForm,
                                password: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        
                        {/* Forgot Password Link */}
                        <div className="text-right">
                          <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            className="text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 hover:underline transition-colors"
                          >
                            Forgot password?
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="mr-2 h-4 w-4" />
                        )}
                        {isLoading ? "Signing In..." : "Sign In"}
                      </Button>
                    </motion.form>
                  </TabsContent>

                  <TabsContent value="register">
                    <motion.form
                      onSubmit={handleRegister}
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="full_name"
                            className="text-slate-700 dark:text-gray-200 font-medium"
                          >
                            Full Name
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-gray-500" />
                            <Input
                              id="full_name"
                              type="text"
                              placeholder="John Doe"
                              className={`pl-10 h-12 rounded-xl border-slate-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all ${
                                validationErrors.full_name
                                  ? "border-red-300 focus:ring-red-500"
                                  : ""
                              }`}
                              value={registerForm.full_name}
                              onChange={(e) => {
                                setRegisterForm({
                                  ...registerForm,
                                  full_name: e.target.value,
                                });
                                validateField("full_name", e.target.value);
                              }}
                              required
                            />
                            {registerForm.full_name &&
                              registerForm.full_name.trim().length >= 2 && (
                                <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-emerald-500" />
                              )}
                          </div>
                          {validationErrors.full_name && (
                            <p className="text-xs text-red-600 dark:text-red-400">
                              {validationErrors.full_name}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="username"
                            className="text-slate-700 dark:text-gray-200 font-medium"
                          >
                            Username
                          </Label>
                          <div className="relative">
                            <UserCheck className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-gray-500" />
                            <Input
                              id="username"
                              type="text"
                              placeholder="johndoe"
                              className={`pl-10 h-12 rounded-xl border-slate-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all ${
                                validationErrors.username
                                  ? "border-red-300 focus:ring-red-500"
                                  : ""
                              }`}
                              value={registerForm.username}
                              onChange={(e) => {
                                setRegisterForm({
                                  ...registerForm,
                                  username: e.target.value,
                                });
                                validateField("username", e.target.value);
                              }}
                              required
                            />
                            {registerForm.username &&
                              USERNAME_REGEX.test(registerForm.username) && (
                                <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-emerald-500" />
                              )}
                          </div>
                          {validationErrors.username && (
                            <p className="text-xs text-red-600 dark:text-red-400">
                              {validationErrors.username}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="reg_email"
                          className="text-slate-700 dark:text-gray-200 font-medium"
                        >
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-gray-500" />
                          <Input
                            id="reg_email"
                            type="email"
                            placeholder="john@example.com"
                            className={`pl-10 h-12 rounded-xl border-slate-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all ${
                              validationErrors.email
                                ? "border-red-300 focus:ring-red-500"
                                : ""
                            }`}
                            value={registerForm.email}
                            onChange={(e) => {
                              setRegisterForm({
                                ...registerForm,
                                email: e.target.value,
                              });
                              validateField("email", e.target.value);
                            }}
                            required
                          />
                          {registerForm.email &&
                            EMAIL_REGEX.test(registerForm.email) && (
                              <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-emerald-500" />
                            )}
                        </div>
                        {validationErrors.email && (
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {validationErrors.email}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="reg_password"
                          className="text-slate-700 dark:text-gray-200 font-medium"
                        >
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-gray-500" />
                          <Input
                            id="reg_password"
                            type="password"
                            placeholder="Create a secure password"
                            className={`pl-10 pr-10 h-12 rounded-xl border-slate-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all ${
                              validationErrors.password
                                ? "border-red-300 focus:ring-red-500"
                                : ""
                            }`}
                            value={registerForm.password}
                            onChange={(e) => {
                              setRegisterForm({
                                ...registerForm,
                                password: e.target.value,
                              });
                              validateField("password", e.target.value);
                            }}
                            required
                          />
                          {registerForm.password &&
                            PASSWORD_REGEX.test(registerForm.password) && (
                              <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-emerald-500" />
                            )}
                        </div>
                        {validationErrors.password && (
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {validationErrors.password}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="confirm_password"
                          className="text-slate-700 dark:text-gray-200 font-medium"
                        >
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Shield className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-gray-500" />
                          <Input
                            id="confirm_password"
                            type="password"
                            placeholder="Confirm your password"
                            className={`pl-10 pr-10 h-12 rounded-xl border-slate-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all ${
                              validationErrors.confirmPassword
                                ? "border-red-300 focus:ring-red-500"
                                : ""
                            }`}
                            value={registerForm.confirmPassword}
                            onChange={(e) => {
                              setRegisterForm({
                                ...registerForm,
                                confirmPassword: e.target.value,
                              });
                              validateField("confirmPassword", e.target.value);
                            }}
                            required
                          />
                          {registerForm.confirmPassword &&
                            registerForm.confirmPassword ===
                              registerForm.password &&
                            registerForm.password && (
                              <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-emerald-500" />
                            )}
                        </div>
                        {validationErrors.confirmPassword && (
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {validationErrors.confirmPassword}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <UserCheck className="mr-2 h-4 w-4" />
                        )}
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </motion.form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Enhanced Mobile branding */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="lg:hidden mt-8 text-center"
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-2">
                Gulf Return
              </h2>
              <p className="text-slate-600 dark:text-gray-400">
                Connect. Share. Grow.
              </p>
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
