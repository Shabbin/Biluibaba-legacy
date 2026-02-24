"use client";

import { Suspense, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import axios from "@/lib/axios";

import { Loader2, Lock, CheckCircle, ArrowLeft } from "lucide-react";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF8A80]" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
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
        description:
          "No reset token found. Please request a new password reset.",
        variant: "destructive",
      });
      router.push("/forgot-password");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, router]);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/app/reset-password", {
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
          router.push("/");
        }, 3000);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.error ||
          "Failed to reset password. The link may be expired.",
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
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-b from-[#FAFBFC] to-white p-4">
      <div className="w-full max-w-md animate-fadeIn">
        <Card className="rounded-2xl shadow-lg border-border/60">
          <CardHeader className="text-center space-y-4 pb-2">
            <div
              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                isSuccess ? "bg-green-100" : "bg-[#FF8A80]/10"
              }`}
            >
              {isSuccess ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <Lock className="w-8 h-8 text-[#FF8A80]" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {isSuccess ? "Password Reset!" : "Reset Password"}
            </CardTitle>
            <CardDescription className="text-sm">
              {isSuccess
                ? "Your password has been successfully reset"
                : "Enter your new password below"}
            </CardDescription>
          </CardHeader>

          {!isSuccess ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          New Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter new password"
                            className="h-11 rounded-xl bg-white border-border/60 focus:border-[#FF8A80] focus:ring-[#FF8A80]/20 transition-all"
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
                        <FormLabel className="text-sm font-medium">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            className="h-11 rounded-xl bg-white border-border/60 focus:border-[#FF8A80] focus:ring-[#FF8A80]/20 transition-all"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Password requirements:
                    </p>
                    <ul className="text-xs text-gray-400 space-y-1 ml-1">
                      <li>• At least 8 characters</li>
                      <li>• One uppercase letter</li>
                      <li>• One lowercase letter</li>
                      <li>• One number</li>
                    </ul>
                  </div>
                </CardContent>

                <CardFooter className="flex-col space-y-4 pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-xl bg-[#FF8A80] hover:bg-[#FF6B61] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {isSubmitting && (
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    )}
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                  </Button>

                  <Link
                    href="/"
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-[#FF8A80] font-medium transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>
                </CardFooter>
              </form>
            </Form>
          ) : (
            <CardContent className="space-y-6 pt-4">
              <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100">
                <p className="text-sm text-gray-700 mb-2">
                  Your password has been successfully reset.
                </p>
                <p className="text-xs text-gray-500">
                  Redirecting you to the login page...
                </p>
              </div>

              <Link href="/" className="block w-full">
                <Button className="w-full h-11 rounded-xl bg-[#FF8A80] hover:bg-[#FF6B61] text-white font-semibold">
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
