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
          physical: Boolean(appointments?.physical.status),
          online: Boolean(appointments?.online.status),
          emergency: Boolean(appointments?.emergency.status),
          instantChat: Boolean(appointments?.instantChat.status), // Handle instantChat from API
          homeService: Boolean(appointments?.homeService.status), // Add homeService
          physicalFee:
            appointments?.physical.fee !== undefined &&
            appointments?.physical.fee !== null
              ? Number(appointments?.physical.fee)
              : null,
          onlineFee:
            appointments?.online.fee !== undefined &&
            appointments?.online.fee !== null
              ? Number(appointments?.online.fee)
              : null,
          emergencyFee:
            appointments?.emergency.fee !== undefined &&
            appointments?.emergency.fee !== null
              ? Number(appointments?.emergency.fee)
              : null,
          homeServiceFee:
            appointments?.homeService.fee !== undefined &&
            appointments?.homeService.fee !== null
              ? Number(appointments?.homeService.fee)
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 rounded-full bg-[#FF8A80]" />
            <h1 className="text-2xl font-bold tracking-tight">Availability & Pricing</h1>
          </div>
          <p className="text-muted-foreground mt-1 ml-5">
            Configure your consultation types, toggle availability, and set pricing
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Physical Appointment */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🏥</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Physical Appointment</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Allow pet owners to request in-person appointments for their pets
                  </p>
                </div>
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
              <div className="mt-4 pt-4 border-t border-border/60">
                <FormField
                  control={form.control}
                  name="physicalFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consultation Fee (BDT)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter fee amount"
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? null : Number(value));
                          }}
                          onWheel={(e) => {
                            e.preventDefault();
                            (e.target as HTMLElement).blur();
                          }}
                          onBlur={field.onBlur}
                          className="max-w-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Online Appointment */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">💻</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Online Appointment</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Allow pet owners to request video consultations for their pets
                  </p>
                </div>
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
              <div className="mt-4 pt-4 border-t border-border/60">
                <FormField
                  control={form.control}
                  name="onlineFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consultation Fee (BDT)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter fee amount"
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? null : Number(value));
                          }}
                          onWheel={(e) => {
                            e.preventDefault();
                            (e.target as HTMLElement).blur();
                          }}
                          onBlur={field.onBlur}
                          className="max-w-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Emergency */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🚨</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Emergency</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Allow pet owners to request emergency veterinary services
                  </p>
                </div>
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
              <div className="mt-4 pt-4 border-t border-border/60">
                <FormField
                  control={form.control}
                  name="emergencyFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Fee (BDT)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter fee amount"
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? null : Number(value));
                          }}
                          onWheel={(e) => {
                            e.preventDefault();
                            (e.target as HTMLElement).blur();
                          }}
                          onBlur={field.onBlur}
                          className="max-w-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Home Service */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🏠</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Home Service</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Offer veterinary home visits for pets at the owner&apos;s location
                  </p>
                </div>
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
              <div className="mt-4 pt-4 border-t border-border/60">
                <FormField
                  control={form.control}
                  name="homeServiceFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Service Fee (BDT)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter fee amount"
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? null : Number(value));
                          }}
                          onWheel={(e) => {
                            e.preventDefault();
                            (e.target as HTMLElement).blur();
                          }}
                          onBlur={field.onBlur}
                          className="max-w-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Instant Chat */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">💬</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Instant Chat</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Allow clients to send quick messages without scheduling an appointment
                  </p>
                </div>
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

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={loading} size="lg">
              {loading ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : null}
              Save Availability & Pricing
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
