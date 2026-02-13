"use client";

import React from "react";

import { GiSettingsKnobs } from "react-icons/gi";
import { CiSearch } from "react-icons/ci";

import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";

interface AdoptionFilterState {
  categories: string[];
  gender: string[];
  size: string[];
  age: string[];
  selectedCat: string;
  selectedGender: string;
  selectedSize: string;
  selectedAge: string;
  vaccinated: string;
}

export default class Filter extends React.Component<Record<string, never>, AdoptionFilterState> {
  constructor(props: Record<string, never>) {
    super(props);

    this.state = {
      categories: ["Dogs", "Cats"],
      gender: ["Female", "Male", "Unknown"],
      size: ["Chonk", "Regular", "Small"],
      age: [
        "+60 months",
        "0-6 months",
        "6-12 months",
        "12-36 months",
        "36-60 months",
      ],
      selectedCat: "Dogs",
      selectedGender: "",
      selectedSize: "",
      selectedAge: "",
      vaccinated: "",
    };
  }

  render() {
    return (
      <div className="border p-6 rounded-xl flex flex-col">
        <div className="inline-flex items-center gap-2 font-medium text-2xl">
          <GiSettingsKnobs size="1.2em" />
          Filter
        </div>
        <div className="relative block my-5">
          <CiSearch
            size="2em"
            className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 right-3"
          />
          <Input placeholder="Tags/Location" />
        </div>
        <div className="my-2">
          <div className="text-2xl">All categoies</div>
          <div className="px-4 text-lg my-2">
            {this.state.categories.map((c, i) => (
              <div
                className="flex items-center gap-3 mb-2 cursor-pointer"
                onClick={() => this.setState({ selectedCat: c })}
                key={i}
              >
                <div
                  className={
                    "w-[16px] h-[16px]  border-black rounded-full " +
                    (this.state.selectedCat === c ? "border-4" : "border")
                  }
                />
                {c}
              </div>
            ))}
          </div>

          <div className="text-xl mt-2">Gender</div>
          <div className="px-4 text-lg my-2">
            {this.state.gender.map((g, i) => (
              <div
                className="flex items-center gap-3 mb-2 cursor-pointer"
                onClick={() => this.setState({ selectedGender: g })}
                key={i}
              >
                <div
                  className={
                    "w-[16px] h-[16px]  border-black rounded-full " +
                    (this.state.selectedGender === g ? "border-4" : "border")
                  }
                />
                {g}
              </div>
            ))}
          </div>

          <div className="text-xl mt-2">Size</div>
          <div className="px-4 text-lg my-2">
            {this.state.size.map((s, i) => (
              <div
                className="flex items-center gap-3 mb-2 cursor-pointer"
                onClick={() => this.setState({ selectedSize: s })}
                key={i}
              >
                <div
                  className={
                    "w-[16px] h-[16px] border-black rounded-full " +
                    (this.state.selectedSize === s ? "border-4" : "border")
                  }
                />
                {s}
              </div>
            ))}
          </div>

          <div className="text-xl mt-2">Age</div>
          <div className="px-4 text-lg my-2">
            {this.state.age.map((a, i) => (
              <div
                className="flex items-center gap-3 mb-2 cursor-pointer"
                onClick={() => this.setState({ selectedAge: a })}
                key={i}
              >
                <div
                  className={
                    "w-[16px] h-[16px] border-black rounded-full " +
                    (this.state.selectedAge === a ? "border-4" : "border")
                  }
                />
                {a}
              </div>
            ))}
          </div>

          <div className="text-xl mt-2">Vaccinated</div>
          <div className="px-4 text-lg my-2">
            <div
              className="flex items-center gap-3 mb-2 cursor-pointer"
              onClick={() => this.setState({ vaccinated: "Yes" })}
            >
              <div
                className={
                  "w-[16px] h-[16px] border-black rounded-full " +
                  (this.state.vaccinated === "Yes" ? "border-4" : "border")
                }
              />
              Yes
            </div>

            <div
              className="flex items-center gap-3 mb-2 cursor-pointer"
              onClick={() => this.setState({ vaccinated: "No" })}
            >
              <div
                className={
                  "w-[16px] h-[16px] border-black rounded-full " +
                  (this.state.vaccinated === "No" ? "border-4" : "border")
                }
              />
              No
            </div>
          </div>

          <Button type="default" text="Filter" className="my-5 w-full" />
        </div>
      </div>
    );
  }
}
