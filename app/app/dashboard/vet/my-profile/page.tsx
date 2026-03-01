"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import axios from "@/lib/axios";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Loader2, UserCircle, Camera, Save } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const isFileDefined = typeof File !== "undefined";

const imageSchema = isFileDefined
  ? z.union([
      z.instanceof(File, { message: "Invalid file format" }),
      z.string().url({ message: "Invalid image URL" }),
    ])
  : z.string().url({ message: "Invalid image URL" });

const ProfileSchema = z.object({
  bio: z.string().min(10).max(500),
  name: z.string().min(3).max(50),
  profilePicture: imageSchema.refine(
    (value) => {
      if (typeof value === "string") {
        return value.length > 0;
      }
      return isFileDefined && value instanceof File;
    },
    { message: "At least one image is required" }
  ),
});

type FormValues = z.infer<typeof ProfileSchema>;

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      bio: "",
      name: "",
      profilePicture: "",
    },
  });

  const fetchVetData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/vet/me");

      if (data.success)
        form.reset({
          name: data.vet.name,
          bio: data.vet.bio,
        });
      setProfilePicture(data.vet.profilePicture);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while fetching your profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("bio", values.bio);
      if (values.profilePicture) {
        formData.append("profile", values.profilePicture);
      }

      const { data } = await axios.post("/api/vet/update", formData);

      if (data.success)
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });

      fetchVetData();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while updating your profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVetData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 rounded-full bg-[#FF8A80]" />
            <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          </div>
          <p className="text-muted-foreground mt-1 ml-5">
            Manage your professional profile and how clients see you
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6 text-center">
            <div className="relative inline-block">
              {profilePicture ? (
                <Avatar className="w-40 h-40 ring-4 ring-[#FF8A80]/20 mx-auto">
                  <AvatarImage
                    src={profilePicture}
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-[#FF8A80] to-[#FF6B61] text-white">
                    <UserCircle className="w-20 h-20" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="w-40 h-40 ring-4 ring-[#FF8A80]/20 mx-auto">
                  <AvatarFallback className="bg-gradient-to-br from-[#FF8A80] to-[#FF6B61] text-white">
                    <UserCircle className="w-20 h-20" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="absolute bottom-1 right-1 bg-white rounded-full p-2 shadow-md border border-border/60">
                <Camera className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <h3 className="mt-4 font-semibold text-lg">{form.watch("name") || "Your Name"}</h3>
            <p className="text-sm text-muted-foreground">Veterinarian</p>

            {previewImage && (
              <div className="mt-6 pt-6 border-t border-border/60">
                <p className="text-sm font-medium text-muted-foreground mb-3">New Photo Preview</p>
                <Avatar className="w-32 h-32 ring-4 ring-emerald-100 mx-auto">
                  <AvatarImage
                    src={previewImage}
                    alt="Profile preview"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-[#FF8A80] to-[#FF6B61] text-white">
                    <UserCircle className="w-16 h-16" />
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Profile Information</h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your display name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Write a bio describing about yourself, your experience, and specializations..."
                          rows={6}
                        />
                      </FormControl>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-muted-foreground">This will be visible to pet owners</p>
                        <span
                          className={`text-xs font-medium ${
                            field.value.length > 500
                              ? "text-red-500"
                              : field.value.length > 400
                              ? "text-amber-500"
                              : "text-muted-foreground"
                          }`}
                        >
                          {field.value.length}/500
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profilePicture"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Update Profile Picture</FormLabel>
                      <FormControl>
                        <div className="border-2 border-dashed border-border rounded-xl p-4 hover:border-[#FF8A80]/40 transition-colors cursor-pointer">
                          <Input
                            type="file"
                            accept="image/jpeg,image/png,image/jpg"
                            className="border-0 shadow-none p-0 h-auto"
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setPreviewImage(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              } else {
                                setPreviewImage(null);
                              }
                              onChange(file);
                            }}
                            {...field}
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            Accepted formats: JPG, JPEG, PNG
                          </p>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-4 border-t border-border/60">
                  <Button type="submit" disabled={loading} size="lg">
                    {loading ? (
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
