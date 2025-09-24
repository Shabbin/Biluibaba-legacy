"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";

import axios from "@/lib/axios";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableCaption,
  TableHeader,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from "@/components/ui/table";
import { SheetUpload } from "@/components/upload-sheet";
import { AlertDialogBox } from "@/components/alert-dialog";

import { Loader2, ChevronDownIcon } from "lucide-react";

// Helper function to format duration in seconds to a human-readable format
const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = seconds % 60;

  let result = "";
  if (days > 0) result += `${days} day${days !== 1 ? "s" : ""} `;
  if (hours > 0) result += `${hours} hour${hours !== 1 ? "s" : ""} `;
  if (minutes > 0) result += `${minutes} minute${minutes !== 1 ? "s" : ""} `;
  if (remainingSeconds > 0)
    result += `${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`;

  return result.trim() || "0 seconds";
};

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [bestDeals, setBestDeals] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<number>(
    Math.floor(Date.now() / 1000) + 86400
  ); // Unix timestamp in seconds for end time (not milliseconds)
  const [displayDate, setDisplayDate] = useState<Date>(
    new Date(Date.now() + 86400 * 1000)
  ); // For calendar display
  const [time, setTime] = useState<string>("10:30:00");
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const bestDealsDurationForm = useForm<{
    duration: number;
  }>({
    resolver: zodResolver(
      z.object({
        duration: z.number().min(1, "Duration must be at least 1 second"),
      })
    ),
    defaultValues: {
      duration: 86400, // Default to 1 day (in seconds)
    },
  });

  const addProductsForm = useForm<{
    productId: string;
  }>({
    resolver: zodResolver(
      z.object({
        productId: z.string().min(1, "At least one product is required"),
      })
    ),
    defaultValues: {
      productId: "",
    },
  });

  // Update the duration whenever displayDate or time changes
  useEffect(() => {
    // Calculate the end timestamp directly from the selected date and time
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const target = new Date(displayDate);
    target.setHours(hours, minutes, seconds);

    // Set the Unix timestamp (seconds) for the end time
    const endTimestamp = Math.floor(target.getTime() / 1000);
    setDate(endTimestamp);

    // Calculate the remaining duration from now until the end time
    const durationInSeconds = Math.max(
      endTimestamp - Math.floor(Date.now() / 1000),
      1
    );
    bestDealsDurationForm.setValue("duration", durationInSeconds);
  }, [displayDate, time, bestDealsDurationForm]);

  const fetchBestDeals = async () => {
    try {
      const { data } = await axios.get("/api/admin/site-settings");

      if (data.success && data.site.best_deals) {
        setBestDeals(data.site.best_deals.products || []);

        // If there's a duration, calculate the end date to display in the UI
        if (data.site.best_deals.duration) {
          // The duration from the server is actually the end timestamp
          // Calculate the remaining duration by subtracting current time
          const remainingDuration =
            data.site.best_deals.duration - Math.floor(Date.now() / 1000);

          // Set the duration in the form
          bestDealsDurationForm.setValue(
            "duration",
            Math.max(remainingDuration, 1) // Ensure duration is at least 1 second
          );

          // Use the timestamp directly from the server
          const endTimestamp = data.site.best_deals.duration;
          setDate(endTimestamp);

          // Create a Date object for the UI display - multiply by 1000 to convert to milliseconds
          const endDate = new Date(endTimestamp * 1000);
          setDisplayDate(endDate);

          // Format time as HH:MM:SS
          const hours = endDate.getHours().toString().padStart(2, "0");
          const minutes = endDate.getMinutes().toString().padStart(2, "0");
          const seconds = endDate.getSeconds().toString().padStart(2, "0");
          setTime(`${hours}:${minutes}:${seconds}`);
        }

        // Set products array in the form
        if (
          data.site.best_deals.products &&
          data.site.best_deals.products.length
        ) {
          const productIds = data.site.best_deals.products.map(
            (product: any) => product.id || product
          );
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error fetching best deals",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBestDeals();
  }, []);

  const onProductSubmit = async (formData: { productId: string }) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/admin/site-settings/best-deals/products",
        formData
      );

      if (data.success) {
        toast({
          title: "Products added successfully",
          description: "The products have been added to best deals.",
        });
        fetchBestDeals();
      } else {
        toast({
          title: "Product ID already exists on best deals or invalid ID",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error adding products",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onDurationSubmit = async (formData: { duration: number }) => {
    setLoading(true);
    try {
      // Use the date state value directly which is already the correct end timestamp
      // This value is already in Unix timestamp format (seconds)
      const endTimestamp = date;

      console.log("Submitting timestamp to server:", endTimestamp);

      // Send the Unix timestamp to the server
      const { data } = await axios.post(
        "/api/admin/site-settings/best-deals",
        { duration: endTimestamp } // Send the Unix timestamp in seconds
      );

      if (data.success) {
        toast({
          title: "Best Deals updated successfully",
          description: "The best deals have been updated.",
        });
        fetchBestDeals();
      } else {
        toast({
          title: "Error updating Best Deals",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error updating Best Deals",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string | null) => {
    setLoading(true);
    if (productId === null) return;
    try {
      const { data } = await axios.delete(
        `/api/admin/site-settings/best-deals/products/${productId}`
      );

      if (data.success) {
        toast({
          title: "Product deleted successfully",
          description: "The product has been removed from best deals.",
        });

        return fetchBestDeals();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Server Error",
        description: "Something went wrong! Please try again.",
        variant: "destructive",
      });
    } finally {
      setAlertOpen(false);
    }
  };

  return (
    <div className="py-5">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-4xl">Best Deal Page</h2>
        <Button onClick={() => setSheetOpen(true)}>Add new product</Button>
      </div>
      <p className="mt-3 text-lg">
        Configure the best deals for your site. You can set how long the deals
        will run by selecting a future date and time, along with the products
        that will be featured.
      </p>

      <h2 className="text-2xl py-5">Edit the campaign duration</h2>

      <Form {...bestDealsDurationForm}>
        <form
          onSubmit={bestDealsDurationForm.handleSubmit(onDurationSubmit)}
          className="space-y-4"
        >
          <div className="flex gap-4 items-end">
            <div className="flex flex-col gap-3">
              <Label htmlFor="date-picker" className="px-1">
                Date
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date-picker"
                    className="w-32 justify-between font-normal"
                  >
                    {displayDate
                      ? displayDate.toLocaleDateString()
                      : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={displayDate}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      if (date) {
                        setDisplayDate(date);
                        setOpen(false);
                      }
                    }}
                    disabled={(date) => {
                      // Disable dates before tomorrow
                      const tomorrow = new Date();
                      tomorrow.setHours(0, 0, 0, 0);
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      return date < tomorrow;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="time-picker" className="px-1">
                Time
              </Label>
              <Input
                type="time"
                id="time-picker"
                step="1"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
            <div className="flex">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Update Best Deals"
                )}
              </Button>
            </div>
          </div>

          <FormField
            control={bestDealsDurationForm.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deal Duration</FormLabel>
                <FormControl>
                  <div className="text-sm text-muted-foreground">
                    Deals will run for: {formatDuration(field.value)} (ends on{" "}
                    {new Date(
                      // Use the stored date directly, which is already a Unix timestamp
                      date * 1000 // Convert seconds to milliseconds for the Date constructor
                    ).toLocaleString()}
                    )
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Table>
        <TableCaption>Best Deals Products</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bestDeals.map((deal) => (
            <TableRow key={deal.id}>
              <TableCell>{deal.id.productId}</TableCell>
              <TableCell>{deal.id.name}</TableCell>
              <TableCell>
                {new Date(deal.id.createdAt).toLocaleString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setAlertOpen(true);
                    setSelectedProduct(deal.id.productId);
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <SheetUpload
        open={sheetOpen}
        setIsOpen={setSheetOpen}
        title="Add a product to best deal"
      >
        <Form {...addProductsForm}>
          <form
            className="space-y-4 my-5"
            onSubmit={addProductsForm.handleSubmit(onProductSubmit)}
          >
            <FormField
              control={addProductsForm.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="productId"
                      placeholder="Enter product ID"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />} Add Product
            </Button>
          </form>
        </Form>
      </SheetUpload>

      <AlertDialogBox
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this product?"
        onConfirm={(e) => {
          e.preventDefault();
          deleteProduct(selectedProduct);
        }}
      />
    </div>
  );
}
