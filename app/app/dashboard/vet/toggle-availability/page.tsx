"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import axios from "@/lib/axios";

import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
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

const AvailabilitySchema = z
  .object({
    physical: z.boolean().default(false),
    online: z.boolean().default(false),
    emergency: z.boolean().default(false),
    instantChat: z.boolean().default(false),
    homeService: z.boolean().default(false), // Add homeService field
    physicalFee: z.number().nullable().optional(),
    onlineFee: z.number().nullable().optional(),
    emergencyFee: z.number().nullable().optional(),
    homeServiceFee: z.number().nullable().optional(), // Add homeServiceFee field
  })
  .superRefine((data, ctx) => {
    // Validate physical fee
    if (
      data.physical &&
      (data.physicalFee === undefined || data.physicalFee === null)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Physical fee is required when physical consultation is enabled",
        path: ["physicalFee"],
      });
    }
    if (
      data.physicalFee !== undefined &&
      data.physicalFee !== null &&
      data.physicalFee < 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Fee must be a positive number",
        path: ["physicalFee"],
      });
    }

    // Validate online fee
    if (
      data.online &&
      (data.onlineFee === undefined || data.onlineFee === null)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Online fee is required when online consultation is enabled",
        path: ["onlineFee"],
      });
    }
    if (
      data.onlineFee !== undefined &&
      data.onlineFee !== null &&
      data.onlineFee < 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Fee must be a positive number",
        path: ["onlineFee"],
      });
    }

    // Validate emergency fee
    if (
      data.emergency &&
      (data.emergencyFee === undefined || data.emergencyFee === null)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Emergency fee is required when emergency consultation is enabled",
        path: ["emergencyFee"],
      });
    }
    if (
      data.emergencyFee !== undefined &&
      data.emergencyFee !== null &&
      data.emergencyFee < 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Fee must be a positive number",
        path: ["emergencyFee"],
      });
    }

    // Validate home service fee
    if (
      data.homeService &&
      (data.homeServiceFee === undefined || data.homeServiceFee === null)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Home service fee is required when home service is enabled",
        path: ["homeServiceFee"],
      });
    }
    if (
      data.homeServiceFee !== undefined &&
      data.homeServiceFee !== null &&
      data.homeServiceFee < 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Fee must be a positive number",
        path: ["homeServiceFee"],
      });
    }
  });

type FormValues = z.infer<typeof AvailabilitySchema>;

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(AvailabilitySchema),
    defaultValues: {
      physical: false,
      online: false,
      emergency: false,
      instantChat: false,
      homeService: false,
      physicalFee: 0,
      onlineFee: 0,
      emergencyFee: 0,
      homeServiceFee: 0,
    },
    mode: "onBlur", // Add validation on blur
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/vet/update/availability", values);
      if (data.success) {
        toast({
          title: "Success",
          description: "Availability and pricing updated successfully",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while updating availability",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update this to handle null values
  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/vet/me");

      const appointments = data.vet.appointments;

      if (data.success) {
        form.reset({
          physical: Boolean(appointments.physical.status),
          online: Boolean(appointments.online.status),
          emergency: Boolean(appointments.emergency.status),
          instantChat: Boolean(appointments.instantChat.status), // Handle instantChat from API
          homeService: Boolean(appointments.homeService.status), // Add homeService
          physicalFee:
            appointments.physical.fee !== undefined &&
            appointments.physical.fee !== null
              ? Number(appointments.physical.fee)
              : null,
          onlineFee:
            appointments.online.fee !== undefined &&
            appointments.online.fee !== null
              ? Number(appointments.online.fee)
              : null,
          emergencyFee:
            appointments.emergency.fee !== undefined &&
            appointments.emergency.fee !== null
              ? Number(appointments.emergency.fee)
              : null,
          homeServiceFee:
            appointments.homeService.fee !== undefined &&
            appointments.homeService.fee !== null
              ? Number(appointments.homeService.fee)
              : null, // Add homeServiceFee
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while fetching availability",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-4xl mb-5">Toggle Availability & Pricing</h1>
      <p className="text-xl">
        You can toggle physical, online, emergency and home service availability
        and set the pricing from this page.
      </p>

      <div className="py-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="border p-4 rounded-md">
              <h2 className="text-xl font-medium mb-3">Physical Appointment</h2>
              <div className="flex flex-row items-center justify-between mb-3">
                <div>
                  <p>Toggle if you want to take physical appointments</p>
                  <p className="text-sm text-muted-foreground">
                    This allows pet owners to request physical appointments for
                    their pets
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="physical"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            // Reset fee when toggled off
                            if (!checked) {
                              form.setValue("physicalFee", null);
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("physical") && (
                <FormField
                  control={form.control}
                  name="physicalFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Physical appointment fee</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter fee amount"
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? null : Number(value));
                          }}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="border p-4 rounded-md">
              <h2 className="text-xl font-medium mb-3">Online Appointment</h2>
              <div className="flex flex-row items-center justify-between mb-3">
                <div>
                  <p>Toggle if you want to take online appointments</p>
                  <p className="text-sm text-muted-foreground">
                    This allows pet owners to request online appointment for
                    their pets
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="online"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            // Reset fee when toggled off
                            if (!checked) {
                              form.setValue("onlineFee", null);
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("online") && (
                <FormField
                  control={form.control}
                  name="onlineFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Online appointment fee</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter fee amount"
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? null : Number(value));
                          }}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="border p-4 rounded-md">
              <h2 className="text-xl font-medium mb-3">Emergency</h2>
              <div className="flex flex-row items-center justify-between mb-3">
                <div>
                  <p>Toggle if you take emergency cases</p>
                  <p className="text-sm text-muted-foreground">
                    This allows pet owners to request emergency services for
                    their pets
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="emergency"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            // Reset fee when toggled off
                            if (!checked) {
                              form.setValue("emergencyFee", null);
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("emergency") && (
                <FormField
                  control={form.control}
                  name="emergencyFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency appointment fee</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter fee amount"
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? null : Number(value));
                          }}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="border p-4 rounded-md">
              <h2 className="text-xl font-medium mb-3">Home Service</h2>
              <div className="flex flex-row items-center justify-between mb-3">
                <div>
                  <p>
                    Toggle if you offer veterinary services at client's homes
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This allows pet owners to request home visits for their pets
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="homeService"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            // Reset fee when toggled off
                            if (!checked) {
                              form.setValue("homeServiceFee", null);
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("homeService") && (
                <FormField
                  control={form.control}
                  name="homeServiceFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home service fee</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter fee amount"
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? null : Number(value));
                          }}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="border p-4 rounded-md">
              <h2 className="text-xl font-medium mb-3">Instant Chat</h2>
              <div className="flex flex-row items-center justify-between mb-3">
                <div>
                  <p>Toggle if you want to enable instant chat with clients</p>
                  <p className="text-sm text-muted-foreground">
                    This allows clients to send you quick messages without
                    scheduling an appointment
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="instantChat"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-row justify-end">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                Save availability & pricing
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
