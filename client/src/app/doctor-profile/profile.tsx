"use client";

import React from "react";
import dynamic from "next/dynamic";
import { TimePicker, DatePicker } from "antd";

import Input from "@/src/components/ui/input";
import Select from "@/src/components/ui/select";
import Button from "@/src/components/ui/button";

const LazyMap = dynamic(() => import("@/src/components/map"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
const DynamicQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

import "react-quill/dist/quill.snow.css";

import {
  FaClipboard,
  FaImage,
  FaPaste,
  FaTag,
  FaCalendarCheck,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

let modules = {
  toolbar: [
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
  ],
};

interface DaySlotConfig {
  startTime: string;
  endTime: string;
  duration: string;
  interval: string;
}

interface DoctorProfileState {
  loading: boolean;
  slots: {
    slots: Record<string, DaySlotConfig>;
  };
}

export default class DoctorProfile extends React.Component<Record<string, never>, DoctorProfileState> {
  constructor() {
    super({});

    this.state = {
      loading: true,
      slots: {
        slots: {
          monday: { startTime: "", endTime: "", duration: "30", interval: "5" },
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
          friday: { startTime: "", endTime: "", duration: "30", interval: "5" },
          saturday: {
            startTime: "",
            endTime: "",
            duration: "30",
            interval: "5",
          },
          sunday: { startTime: "", endTime: "", duration: "30", interval: "5" },
        },
      },
    };
  }

  componentDidMount() {
    this.setState({ loading: false });
  }

  render() {
    return (
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <div className="border p-5 rounded-xl my-5">
          <h1 className="flex flex-row gap-2 items-center border-b-1 pb-5 font-medium">
            <FaClipboard size="1.5em" />
            <span className="text-2xl">Basic Information</span>
          </h1>
          <div className="my-5">
            <label>Doctor Name</label>
            <Input type="text" value="Dr. Maria Lamprou" />
          </div>
          <div className="my-5">
            <label>Designation</label>
            <Input type="text" value="Veterinarian, MRCVS" />
          </div>
        </div>

        <div className="border p-5 rounded-xl my-5">
          <h1 className="flex flex-row gap-2 items-center border-b-1 pb-5 font-bold">
            <FaLocationDot size="1.5em" />
            <span className="text-2xl">Location</span>
          </h1>

          <div className="my-5">
            <LazyMap />
          </div>
          <div className="my-5">
            <div className="flex md:flex-row flex-col gap-2">
              <div className="basis-1/2">
                <label>Address</label>
                <Input type="text" value="Shimanto Square" />
              </div>
              <div className="basis-1/2">
                <label>Region</label>
                <Input type="text" value="Dhaka, Bangladesh" />
              </div>
            </div>

            <div className="flex md:flex-row flex-col gap-2">
              <div className="basis-1/2">
                <label>Latitude</label>
                <Input type="text" value="23.7382546" />
              </div>
              <div className="basis-1/2">
                <label>Longitude</label>
                <Input type="text" value="90.374648" />
              </div>
            </div>
          </div>
        </div>

        <div className="border p-5 rounded-xl my-5">
          <div className="flex flex-row gap-2 items-center border-b-1 pb-5 font-medium">
            <FaImage size="1.5em" />
            <span className="text-2xl">Gallery</span>
          </div>
          <div className="my-5">
            <Input type="file" />
          </div>
          <img className="my-5 rounded-full" src="/vets/vet1.webp" />
        </div>

        <div className="border p-5 rounded-xl my-5">
          <div className="flex flex-row gap-2 items-center border-b-1 pb-5 font-medium">
            <FaPaste size="1.5em" />
            <span className="text-2xl">Details</span>
          </div>
          <div className="my-5">
            <DynamicQuill
              theme="snow"
              modules={modules}
              value="Hello! I am Dr Maria Lamprou and I graduated with a distinction from the Veterinary School of Aristotle University of Thessaloniki in 2019. On the same year, I completed a postgraduate training in Anesthesia and Critical Care in the same department and currently I study towards a Certificate in Small Animal Medicine. I’m an experienced General Practitioner, with a passion on emergencies and soft tissue surgeries. I attend multiple courses throughout the year to keep my knowledge up to date. I used to run my family veterinary clinic in Greece for more than 2 years and since September 2022 I have been treating pets in the Uk. Feel free to book an appointment with me and go through your pet’s needs together. I look forward meeting you both!"
              style={{ height: "220px", marginBottom: "70px" }}
            />
          </div>

          <div className="my-5 flex md:flex-row flex-col gap-5 justify-between">
            <div className="basis-1/3">
              <label>Phone Number</label>
              <Input type="text" placeholder="Enter your phone number" />
            </div>
            <div className="basis-1/3">
              <label>Email</label>
              <Input type="text" placeholder="Enter your email" />
            </div>
            <div className="basis-1/3">
              <label>Linkedin</label>
              <Input
                type="text"
                placeholder="Enter your linkedin profile link"
              />
            </div>
          </div>
        </div>

        <div className="border p-5 rounded-xl my-5">
          <div className="flex flex-row gap-2 items-center border-b-1 pb-5 font-medium">
            <FaTag size="1.5em" />
            <span className="text-2xl">Pricing</span>
          </div>
          <div className="my-5 bg-cyan-50 bg-opacity-50 text-cyan-500 border-cyan-500 border rounded-xl p-4">
            Provide the range of your pricing, indicating both the online and
            offline range to ensure flexibility in budget considerations.
          </div>

          <div className="my-5 flex md:flex-row flex-col gap-5 justify-between">
            <div className="basis-1/2">
              <label>Online price (&#2547;)</label>
              <Input type="text" value="4000" />
            </div>
            <div className="basis-1/2">
              <label>Offline price (&#2547;)</label>
              <Input type="text" value="4000" />
            </div>
          </div>
        </div>

        <div className="border p-5 rounded-xl my-5">
          <div className="flex flex-row gap-2 items-center border-b-1 pb-5 font-medium">
            <FaCalendarCheck size="1.5em" />
            <span className="text-2xl">Booking</span>
          </div>

          <div className="flex md:flex-row flex-col flex-wrap gap-4 my-5">
            <div className="md:w-1/2 w-full -m-2 p-2">
              <DaySlots day="Monday" />
            </div>
            <div className="md:w-1/2 w-full -m-2 p-2">
              <DaySlots day="Tuesday" />
            </div>
            <div className="md:w-1/2 w-full -m-2 p-2">
              <DaySlots day="Wednesday" />
            </div>
            <div className="md:w-1/2 w-full -m-2 p-2">
              <DaySlots day="Thursday" />
            </div>
            <div className="md:w-1/2 w-full -m-2 p-2">
              <DaySlots day="Friday" />
            </div>
            <div className="md:w-1/2 w-full -m-2 p-2">
              <DaySlots day="Saturday" />
            </div>
            <div className="md:w-1/2 w-full -m-2 p-2">
              <DaySlots day="Sunday" />
            </div>
          </div>
        </div>

        <div className="border p-5 rounded-xl my-5">
          <div className="flex flex-row gap-2 items-center border-b-1 pb-5 font-medium">
            <FaCalendarCheck size="1.5em" />
            <span className="text-2xl">Availability Calendar</span>
          </div>

          <div className="my-5 bg-cyan-50 bg-opacity-50 text-cyan-500 border-cyan-500 border rounded-xl p-4">
            Click date in calendar to mark the day as unavailable.
          </div>

          <div className="my-5">
            <DatePicker size="large" maxTagCount="responsive" multiple />
          </div>
        </div>

        <Button type="default" text="Submit" className="w-full" />
      </div>
    );
  }
}

interface DaySlotsProps {
  day: string;
}

interface DaySlotsState {
  duration: { value: string; text: string }[];
  interval: { value: string; text: string }[];
}

class DaySlots extends React.Component<DaySlotsProps, DaySlotsState> {
  constructor() {
    super({ day: "" });

    this.state = {
      duration: [
        { value: "30", text: "30 mins" },
        { value: "45", text: "45 mins" },
        { value: "60", text: "1 hour" },
        { value: "75", text: "1 hour 15 mins" },
        { value: "90", text: "1 hour 30 mins" },
        { value: "105", text: "1 hour 45 mins" },
        { value: "120", text: "2 hour" },
      ],
      interval: [
        { value: "5", text: "5 mins" },
        { value: "10", text: "10 mins" },
        { value: "15", text: "15 mins" },
        { value: "20", text: "20 mins" },
        { value: "25", text: "25 mins" },
        { value: "30", text: "30 mins" },
      ],
    };
  }

  render() {
    return (
      <div className="p-5 rounded-xl border">
        <p className="p-4 bg-zinc-800 text-white rounded-lg mx-auto">
          {this.props.day}
        </p>

        <TimePicker.RangePicker className="mt-3 w-full" size="large" />

        <div className="flex flex-row ms-1 gap-2 items-center">
          <label>Duration: </label>
          <Select
            value={this.state.duration[0].text}
            data={this.state.duration}
          />
        </div>
        <div className="flex flex-row ms-1 gap-2 items-center">
          <label>Interval: </label>
          <Select
            value={this.state.interval[0].text}
            data={this.state.interval}
          />
        </div>
      </div>
    );
  }
}
