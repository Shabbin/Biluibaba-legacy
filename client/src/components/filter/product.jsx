"use client";

import { useState, useEffect } from "react";

import { GiSettingsKnobs } from "react-icons/gi";
import { CiSearch } from "react-icons/ci";
import { Slider } from "@heroui/slider";

import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";

const Filter = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <div
      className="p-8 border rounded-3xl flex flex-col"
      suppressHydrationWarning={true}
    >
      <div className="flex flex-row items-center text-2xl gap-2 font-medium">
        <GiSettingsKnobs size="1.2em" /> Filter
      </div>
      <div className="relative block my-5">
        <CiSearch
          size="2em"
          className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 right-3"
        />
        <Input placeholder="Search Product" />
      </div>

      <Slider
        label="Price Range"
        step={50}
        minValue={0}
        maxValue={10000}
        defaultValue={[2000, 7000]}
        formatOptions={{ style: "currency", currency: "BDT" }}
        color="foreground"
        className="mb-5"
      />

      <div className="mb-5 ">
        <div className="text-xl mb-2">Category</div>
        <ul>
          <li>Adult dry cat food</li>
        </ul>
      </div>

      <Button text="Reset" type="default" className="w-full" />
    </div>
  ) : null;
};

export default Filter;
