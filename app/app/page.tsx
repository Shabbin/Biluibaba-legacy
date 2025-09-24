"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import axios from "@/lib/axios";

import { LoginSchema } from "@/schema/LoginSchema";

import { Loader2 } from "lucide-react";

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
    <div className="h-dvh flex items-center justify-center md:px-0 px-5">
      <Card className="md:w-1/3 w-full">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Please login to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form
              className="space-y-4"
              onSubmit={loginForm.handleSubmit(onSubmit)}
            >
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input id="email" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput autoComplete="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
