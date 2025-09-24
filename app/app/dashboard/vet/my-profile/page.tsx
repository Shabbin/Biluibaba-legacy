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

import { Loader2 } from "lucide-react";

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
        return value.length > 0; // Ensure non-empty URL
      }
      return isFileDefined && value instanceof File; // Avoid ReferenceError
    },
    { message: "At least one image is required" }
  ),
});

type FormValues = z.infer<typeof ProfileSchema>;

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

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
    <div className="p-5">
      <div className="text-4xl">My Profile</div>

      <div className="py-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Write a bio describing about yourself..."
                      rows={10}
                    />
                  </FormControl>
                  <div
                    className={`text-sm mt-1 text-right ${
                      field.value.length > 500
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {field.value.length}/500 characters
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {profilePicture && (
              <>
                <h2 className="text-xl">Current profile picture</h2>
                <img
                  className="w-[200px] h-[200px] rounded-full"
                  src={profilePicture}
                  alt={profilePicture}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="profilePicture"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Set new profile picture</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        onChange(file);
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row justify-end">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
