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
import { Loader2, Mail, RefreshCw, CheckCircle2 } from "lucide-react";
import { authAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface OTPVerificationProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
  isLoginMode?: boolean; // true for login OTP, false for email verification
}

export function OTPVerification({
  email,
  onSuccess,
  onBack,
  isLoginMode = false,
}: OTPVerificationProps) {
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setError("Please enter the OTP code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (isLoginMode) {
        // For login mode, we'll pass the OTP back to the parent component
        // The parent will handle the login with OTP
        onSuccess();
      } else {
        // For email verification mode
        await authAPI.verifyEmail({
          email,
          otp_code: otpCode,
        });

        toast({
          title: "Email Verified!",
          description:
            "Your email has been successfully verified. You can now log in.",
        });

        onSuccess();
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Invalid OTP code. Please try again.";
      setError(errorMessage);
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    setError("");

    try {
      await authAPI.resendVerification({ email });

      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your email.",
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
        "Failed to resend OTP. Please try again.";
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

  // Get OTP code for login mode
  const getOTPCode = () => otpCode;

  // Expose getOTPCode function to parent
  if (isLoginMode && typeof window !== "undefined") {
    (window as any).getOTPCode = getOTPCode;
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl ring-1 ring-gray-100 dark:ring-gray-800">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          {isLoginMode ? "Enter Verification Code" : "Verify Your Email"}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {isLoginMode
            ? "Enter the 6-digit code sent to your email to complete login"
            : "We've sent a 6-digit verification code to"}
          <br />
          <span className="font-medium text-teal-600 dark:text-teal-400">
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

        <form onSubmit={handleVerifyOTP} className="space-y-4">
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
              className="text-center text-2xl font-mono tracking-widest h-14 border-2 focus:border-teal-500 dark:focus:border-teal-400"
              maxLength={6}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-medium transition-all duration-200 hover:shadow-lg"
            disabled={isLoading || otpCode.length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {isLoginMode ? "Continue" : "Verify Email"}
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
            onClick={handleResendOTP}
            disabled={isResending || countdown > 0}
            className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : countdown > 0 ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend in {countdown}s
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend Code
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Back to {isLoginMode ? "Login" : "Sign Up"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
