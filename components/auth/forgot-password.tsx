"use client";

import { useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { authAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ForgotPasswordProps {
  onBack: () => void;
  onSuccess?: () => void;
}

export function ForgotPassword({ onBack, onSuccess }: ForgotPasswordProps) {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authAPI.forgotPassword({ email });

      toast({
        title: "Reset Code Sent!",
        description: "Check your email for a password reset code.",
      });

      setStep("reset");

      // Start countdown
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        "Failed to send reset code. Please try again.";
      setError(errorMessage);
      toast({
        title: "Failed to Send Code",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!otpCode.trim()) {
      setError("Please enter the verification code");
      return;
    }

    if (!newPassword.trim()) {
      setError("Please enter a new password");
      return;
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      setError(
        "Password must be 8+ characters with uppercase, lowercase & number"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authAPI.resetPassword({
        email,
        otp_code: otpCode,
        new_password: newPassword,
      });

      toast({
        title: "Password Reset Successful!",
        description:
          "Your password has been reset. You can now log in with your new password.",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        onBack();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        "Failed to reset password. Please try again.";
      setError(errorMessage);
      toast({
        title: "Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    setError("");

    try {
      await authAPI.forgotPassword({ email });

      toast({
        title: "Code Resent",
        description: "A new reset code has been sent to your email.",
      });

      // Start countdown
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        "Failed to resend code. Please try again.";
      setError(errorMessage);
      toast({
        title: "Resend Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (step === "email") {
    return (
      <Card className="w-full max-w-md mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl ring-1 ring-gray-100 dark:ring-gray-800">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Enter your email address and we&apos;ll send you a code to reset
            your password.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert
              variant="destructive"
              className="border-red-200 dark:border-red-800"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSendResetCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 border-2 focus:border-orange-500 dark:focus:border-orange-400"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium transition-all duration-200 hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Reset Code
                </>
              )}
            </Button>
          </form>

          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="w-full text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl ring-1 ring-gray-100 dark:ring-gray-800">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Reset Password
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Enter the code sent to your email and create a new password
          <br />
          <span className="font-medium text-orange-600 dark:text-orange-400">
            {email}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert
            variant="destructive"
            className="border-red-200 dark:border-red-800"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otpCode">Verification Code</Label>
            <Input
              id="otpCode"
              type="text"
              placeholder="Enter 6-digit code"
              value={otpCode}
              onChange={(e) =>
                setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="text-center text-lg font-mono tracking-widest h-11 border-2 focus:border-orange-500 dark:focus:border-orange-400"
              maxLength={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-11 border-2 focus:border-orange-500 dark:focus:border-orange-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-11 border-2 focus:border-orange-500 dark:focus:border-orange-400"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium transition-all duration-200 hover:shadow-lg"
            disabled={isLoading || otpCode.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting Password...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Reset Password
              </>
            )}
          </Button>
        </form>

        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Didn&apos;t receive the code?
          </p>

          <Button
            type="button"
            variant="ghost"
            onClick={handleResendCode}
            disabled={isResending || countdown > 0}
            className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : countdown > 0 ? (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Resend in {countdown}s
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Resend Code
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep("email")}
            className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Change Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
