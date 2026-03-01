"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

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

import { Loader2, Mail, ArrowLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/app/forgot-password", {
        email: data.email,
      });

      if (response.data.success) {
        setIsSuccess(true);
        toast({
          title: "Email sent!",
          description: response.data.data,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.error || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-b from-[#FAFBFC] to-white p-4">
      <div className="w-full max-w-md animate-fadeIn">
        <Card className="rounded-2xl shadow-lg border-border/60">
          <CardHeader className="text-center space-y-4 pb-2">
            <div className="mx-auto w-16 h-16 bg-[#FF8A80]/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-[#FF8A80]" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Forgot Password?
            </CardTitle>
            <CardDescription className="text-sm">
              {isSuccess
                ? "Check your email for a password reset link"
                : "Enter your email and we'll send you a link to reset your password"}
            </CardDescription>
          </CardHeader>

          {!isSuccess ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="h-11 rounded-xl bg-white border-border/60 focus:border-[#FF8A80] focus:ring-[#FF8A80]/20 transition-all"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
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
                <p className="text-sm text-gray-700 mb-3">
                  We&apos;ve sent a password reset link to{" "}
                  <strong>{form.getValues("email")}</strong>
                </p>
                <p className="text-xs text-gray-500">
                  The link will expire in 30 minutes. Don&apos;t forget to check
                  your spam folder!
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-xl font-semibold"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full text-sm"
                  onClick={() => {
                    setIsSuccess(false);
                    form.reset();
                  }}
                >
                  Send Another Link
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
