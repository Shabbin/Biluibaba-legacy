"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Mail } from "lucide-react";

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
import type { ApiAxiosError } from "@/src/types";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/auth/forgot-password", {
        email: data.email,
      });

      if (response.data.success) {
        setIsSuccess(true);
        toast({
          title: "Email sent!",
          description: response.data.data,
        });
      }
    } catch (error) {
      const axiosError = error as ApiAxiosError;
      toast({
        title: "Error",
        description:
          axiosError.response?.data?.error || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-petzy-blue-light p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-petzy-coral/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-petzy-coral" />
            </div>
            <CardTitle className="text-3xl">Forgot Password?</CardTitle>
            <CardDescription className="text-base">
              {isSuccess
                ? "Check your email for a password reset link"
                : "Enter your email and we'll send you a link to reset your password"}
            </CardDescription>
          </CardHeader>

          {!isSuccess ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>

                <CardFooter className="flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                    text={isSubmitting ? "Sending..." : "Send Reset Link"}
                  />

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
              <div className="bg-petzy-mint-light rounded-2xl p-6 text-center">
                <p className="text-petzy-slate mb-4">
                  We've sent a password reset link to{" "}
                  <strong>{form.getValues("email")}</strong>
                </p>
                <p className="text-sm text-petzy-slate-light">
                  The link will expire in 30 minutes. Don't forget to check your spam folder!
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    Back to Login
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full"
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

        <p className="text-center text-sm text-petzy-slate-light mt-6">
          Don't have an account?{" "}
          <Link
            href="/signin"
            className="text-petzy-coral hover:text-petzy-coral-dark font-semibold transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
