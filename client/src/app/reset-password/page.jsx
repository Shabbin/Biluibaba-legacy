"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CheckCircle } from "lucide-react";

import { Button } from "@/src/components/ui/button-legacy";
import { Input } from "@/src/components/ui/input-legacy";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { toast } from "@/src/hooks/use-toast";
import axios from "@/src/lib/axiosInstance";

const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      toast({
        title: "Invalid Link",
        description: "No reset token found. Please request a new password reset.",
        variant: "destructive",
      });
      router.push("/forgot-password");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, router]);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/auth/reset-password", {
        token,
        newPassword: data.newPassword,
      });

      if (response.data.success) {
        setIsSuccess(true);
        toast({
          title: "Success!",
          description: "Your password has been reset successfully.",
        });

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.error || "Failed to reset password. The link may be expired.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-petzy-blue-light p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center space-y-4">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
              isSuccess ? "bg-green-100" : "bg-petzy-coral/10"
            }`}>
              {isSuccess ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <Lock className="w-8 h-8 text-petzy-coral" />
              )}
            </div>
            <CardTitle className="text-3xl">
              {isSuccess ? "Password Reset!" : "Reset Password"}
            </CardTitle>
            <CardDescription className="text-base">
              {isSuccess
                ? "Your password has been successfully reset"
                : "Enter your new password below"}
            </CardDescription>
          </CardHeader>

          {!isSuccess ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter new password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-petzy-blue-light rounded-2xl p-4">
                    <p className="text-sm text-petzy-slate-light">
                      Password requirements:
                    </p>
                    <ul className="text-xs text-petzy-slate-light mt-2 space-y-1 ml-4">
                      <li>• At least 8 characters</li>
                      <li>• One uppercase letter</li>
                      <li>• One lowercase letter</li>
                      <li>• One number</li>
                    </ul>
                  </div>
                </CardContent>

                <CardFooter className="flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                  </Button>

                  <div className="text-center text-sm">
                    <Link
                      href="/login"
                      className="text-petzy-coral hover:text-petzy-coral-dark font-semibold transition-colors"
                    >
                      Back to Login
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Form>
          ) : (
            <CardContent className="space-y-6">
              <div className="bg-green-50 rounded-2xl p-6 text-center">
                <p className="text-petzy-slate mb-2">
                  Your password has been successfully reset.
                </p>
                <p className="text-sm text-petzy-slate-light">
                  Redirecting you to the login page...
                </p>
              </div>

              <Link href="/login" className="w-full">
                <Button className="w-full">
                  Go to Login
                </Button>
              </Link>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
