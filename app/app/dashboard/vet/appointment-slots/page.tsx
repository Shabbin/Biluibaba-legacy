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
        const fetchedSlots = data.vet.appointments.slots;
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
    <div className="p-5 text-center">
      <h2 className="text-4xl mb-5">Appointment Slots</h2>
      <p className="text-xl">
        You can adjust your appointment slots from this page.
      </p>

      <div className="py-5">
        <div className="flex flex-row gap-y-5 flex-wrap py-5 items-center justify-center">
          {loading ? (
            <div>Setting appointment data... Please wait!</div>
          ) : (
            Object.keys(slots).map((day) => (
              <div className="md:basis-1/4 basis-full -me-3 px-3" key={day}>
                <AvailabilitySlots
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
              </div>
            ))
          )}
        </div>
        <div className="flex flex-row justify-center">
          <Button disabled={loading} onClick={() => handleSubmit()} size="lg">
            {loading && <Loader2 className="animate-spin" />} Save Slots
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
    <div className="rounded-lg border">
      <div className="bg-black text-white p-5 rounded-tr-lg rounded-tl-lg uppercase font-bold text-center">
        {day}
      </div>

      <div className="p-3 space-y-4">
        <TimePicker.RangePicker
          defaultValue={[
            startTime === "" ? null : dayjs(startTime, format),
            endTime === "" ? null : dayjs(endTime, format),
          ]}
          format={format}
          onChange={(time, timeString) =>
            onTimeChange(timeString as [string, string])
          }
        />

        <div className="flex flex-row items-center gap-5">
          <div>Duration</div>
          <Select value={duration} onValueChange={onDurationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 mins</SelectItem>
              <SelectItem value="45">45 mins</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="75">1 hour 15 mins</SelectItem>
              <SelectItem value="90">1 hour 30 mins</SelectItem>
              <SelectItem value="105">1 hour 45 mins</SelectItem>
              <SelectItem value="120">2 hour</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-row items-center gap-5">
          <div>Interval</div>
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
