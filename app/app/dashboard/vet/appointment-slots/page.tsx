"use client";

import { useState, useEffect } from "react";
import { TimePicker } from "antd";
import dayjs from "dayjs";

import axios from "@/lib/axios";

import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";

interface Slot {
  startTime: string;
  endTime: string;
  duration: string;
  interval: string;
}

interface Slots {
  monday: Slot;
  tuesday: Slot;
  wednesday: Slot;
  thursday: Slot;
  friday: Slot;
  saturday: Slot;
  sunday: Slot;
}

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [slots, setSlots] = useState<Slots>({
    monday: {
      startTime: "",
      endTime: "",
      duration: "30",
      interval: "5",
    },
    tuesday: {
      startTime: "",
      endTime: "",
      duration: "30",
      interval: "5",
    },
    wednesday: {
      startTime: "",
      endTime: "",
      duration: "30",
      interval: "5",
    },
    thursday: {
      startTime: "",
      endTime: "",
      duration: "30",
      interval: "5",
    },
    friday: {
      startTime: "",
      endTime: "",
      duration: "30",
      interval: "5",
    },
    saturday: {
      startTime: "",
      endTime: "",
      duration: "30",
      interval: "5",
    },
    sunday: {
      startTime: "",
      endTime: "",
      duration: "30",
      interval: "5",
    },
  });

  const fetchSlots = async () => {
    try {
      const { data } = await axios.get("/api/vet/me");

      if (data.success) {
        const fetchedSlots = data.vet.appointments?.slots;
        setSlots({
          monday: {
            startTime: fetchedSlots.monday?.startTime || "",
            endTime: fetchedSlots.monday?.endTime || "",
            duration: fetchedSlots.monday?.duration || "30",
            interval: fetchedSlots.monday?.interval || "5",
          },
          tuesday: {
            startTime: fetchedSlots.tuesday?.startTime || "",
            endTime: fetchedSlots.tuesday?.endTime || "",
            duration: fetchedSlots.tuesday?.duration || "30",
            interval: fetchedSlots.tuesday?.interval || "5",
          },
          wednesday: {
            startTime: fetchedSlots.wednesday?.startTime || "",
            endTime: fetchedSlots.wednesday?.endTime || "",
            duration: fetchedSlots.wednesday?.duration || "30",
            interval: fetchedSlots.wednesday?.interval || "5",
          },
          thursday: {
            startTime: fetchedSlots.thursday?.startTime || "",
            endTime: fetchedSlots.thursday?.endTime || "",
            duration: fetchedSlots.thursday?.duration || "30",
            interval: fetchedSlots.thursday?.interval || "5",
          },
          friday: {
            startTime: fetchedSlots.friday?.startTime || "",
            endTime: fetchedSlots.friday?.endTime || "",
            duration: fetchedSlots.friday?.duration || "30",
            interval: fetchedSlots.friday?.interval || "5",
          },
          saturday: {
            startTime: fetchedSlots.saturday?.startTime || "",
            endTime: fetchedSlots.saturday?.endTime || "",
            duration: fetchedSlots.saturday?.duration || "30",
            interval: fetchedSlots.saturday?.interval || "5",
          },
          sunday: {
            startTime: fetchedSlots.sunday?.startTime || "",
            endTime: fetchedSlots.sunday?.endTime || "",
            duration: fetchedSlots.sunday?.duration || "30",
            interval: fetchedSlots.sunday?.interval || "5",
          },
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Something went wrong. Please try again.",
        description: "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (day: keyof Slots, time: [string, string]) => {
    setSlots((prevSlots) => ({
      ...prevSlots,
      [day]: {
        ...prevSlots[day],
        startTime: time[0],
        endTime: time[1],
      },
    }));
  };

  const handleDurationChange = (day: keyof Slots, duration: string) => {
    setSlots((prevSlots) => ({
      ...prevSlots,
      [day]: {
        ...prevSlots[day],
        duration,
      },
    }));
  };

  const handleIntervalChange = (day: keyof Slots, interval: string) => {
    setSlots((prevSlots) => ({
      ...prevSlots,
      [day]: {
        ...prevSlots[day],
        interval,
      },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/vet/update/slot", {
        slots,
      });

      if (data.success)
        toast({
          title: "Slots updated successfully",
          description: "Your slots have been updated successfully",
        });

      fetchSlots();
    } catch (error) {
      console.error(error);
      toast({
        title: "Something went wrong. Please try again.",
        description: "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSlots();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 rounded-full bg-[#FF8A80]" />
            <h1 className="text-2xl font-bold tracking-tight">Appointment Slots</h1>
          </div>
          <p className="text-muted-foreground mt-1 ml-5">
            Configure your weekly schedule — set available hours, duration, and break intervals
          </p>
        </div>
      </div>

      <div>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="animate-spin h-8 w-8 text-[#FF8A80] mx-auto mb-3" />
              <p className="text-muted-foreground">Loading your schedule...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.keys(slots).map((day) => (
              <AvailabilitySlots
                key={day}
                day={day}
                startTime={slots[day as keyof Slots].startTime}
                endTime={slots[day as keyof Slots].endTime}
                duration={slots[day as keyof Slots].duration}
                interval={slots[day as keyof Slots].interval}
                onTimeChange={(time) =>
                  handleTimeChange(day as keyof Slots, time)
                }
                onDurationChange={(duration) =>
                  handleDurationChange(day as keyof Slots, duration)
                }
                onIntervalChange={(interval) =>
                  handleIntervalChange(day as keyof Slots, interval)
                }
              />
            ))}
          </div>
        )}

        <div className="flex justify-center pt-6">
          <Button disabled={loading} onClick={() => handleSubmit()} size="lg">
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />} Save Schedule
          </Button>
        </div>
      </div>
    </div>
  );
}

interface AvailabilitySlotsProps {
  startTime: string;
  endTime: string;
  day: string;
  duration: string;
  interval: string;
  onDurationChange: (value: string) => void;
  onTimeChange: (value: [string, string]) => void;
  onIntervalChange: (value: string) => void;
}

function AvailabilitySlots({
  startTime,
  endTime,
  day,
  duration,
  interval,
  onDurationChange,
  onTimeChange,
  onIntervalChange,
}: AvailabilitySlotsProps) {
  let format = "HH:mm";
  return (
    <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-[#FF8A80] to-[#FF6B61] text-white px-4 py-3 font-semibold text-center uppercase tracking-wide text-sm">
        {day}
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Time Range</label>
          <TimePicker.RangePicker
            defaultValue={[
              startTime === "" ? null : dayjs(startTime, format),
              endTime === "" ? null : dayjs(endTime, format),
            ]}
            format={format}
            onChange={(time, timeString) =>
              onTimeChange(timeString as [string, string])
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Duration</label>
          <Select value={duration} onValueChange={onDurationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 mins</SelectItem>
              <SelectItem value="45">45 mins</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="75">1 hr 15 mins</SelectItem>
              <SelectItem value="90">1 hr 30 mins</SelectItem>
              <SelectItem value="105">1 hr 45 mins</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Break Interval</label>
          <Select value={interval} onValueChange={onIntervalChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select interval"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 mins</SelectItem>
              <SelectItem value="10">10 mins</SelectItem>
              <SelectItem value="15">15 mins</SelectItem>
              <SelectItem value="20">20 mins</SelectItem>
              <SelectItem value="25">25 mins</SelectItem>
              <SelectItem value="30">30 mins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
