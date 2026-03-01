"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import axios from "@/lib/axios";

import { LoginSchema } from "@/schema/LoginSchema";

import { Loader2, PawPrint, ShieldCheck, TrendingUp, Star } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const loginForm = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(form: z.infer<typeof LoginSchema>) {
    setLoading(true);
    try {
      let { data } = await axios.post("/api/app/login", {
        email: form.email,
        password: form.password,
      });

      if (data.success) {
        toast({
          title: "Login successful",
          description: "Redirecting you to dashboard...",
        });
        return router.push("/dashboard");
      }
    } catch (error: any) {
      console.error(error);
      return toast({
        title: "Incorrect email or password. Please try again",
        description: error.response?.data?.error || "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex">
      {/* Left side — Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#FF8A80] via-[#FF6B61] to-[#e85a51] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-[30%] left-[20%] w-[200px] h-[200px] rounded-full bg-white/5 blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image src="/logo-black.png" alt="Biluibaba Logo" width={160} height={30} />
          </div>

          {/* Center content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
                Manage your
                <br />
                business with
                <br />
                <span className="text-white/90">confidence</span>
              </h1>
              <p className="text-white/80 text-lg mt-4 max-w-md leading-relaxed">
                Your all-in-one dashboard for managing products, orders,
                appointments, and growing your pet care business.
              </p>
            </div>

            {/* Feature cards */}
            <div className="space-y-3">
              {[
                { icon: TrendingUp, label: "Track orders & revenue in real-time" },
                { icon: ShieldCheck, label: "Secure & reliable platform" }
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/90 text-sm font-medium">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Biluibaba. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side — Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gradient-to-b from-[#FAFBFC] to-white">
        <div className="w-full max-w-[420px] animate-fadeIn">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <Image src="/logo.png" alt="Biluibaba Logo" width={48} height={48} className="w-12 h-12" />
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm">
              Sign in to your vendor or vet dashboard
            </p>
          </div>

          <Form {...loginForm}>
            <form
              className="space-y-5"
              onSubmit={loginForm.handleSubmit(onSubmit)}
            >
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="you@example.com"
                        className="h-11 rounded-xl bg-white border-border/60 focus:border-[#FF8A80] focus:ring-[#FF8A80]/20 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        autoComplete="password"
                        placeholder="Enter your password"
                        className="h-11 rounded-xl bg-white border-border/60 focus:border-[#FF8A80] focus:ring-[#FF8A80]/20 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-[#FF8A80] hover:bg-[#FF6B61] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                Sign in
              </Button>
            </form>
          </Form>

          <div className="mt-8 space-y-3">
            <p className="text-xs text-muted-foreground text-center">
              <Link
                href="/forgot-password"
                className="text-[#FF8A80] hover:text-[#FF6B61] font-semibold transition-colors"
              >
                Forgot your password?
              </Link>
            </p>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-muted-foreground font-medium">
                  New to Biluibaba?
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/register")}
              className="w-full h-11 rounded-xl border-border/60 hover:bg-slate-50 font-semibold transition-all"
            >
              Create Vendor Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
