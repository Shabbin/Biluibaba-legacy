"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { Cat, Dog, Bird, Rabbit } from "@/src/components/svg";

import Button from "@/src/components/ui/button";

const ConcernsList = [
  { value: "Flea and tick", label: "Flea and tick" },
  { value: "Skin/ear infections", label: "Skin/ear infections" },
  { value: "Urinary problems", label: "Urinary problems" },
  { value: "Eye issues", label: "Eye issues" },
  { value: "Diarrhea and vomiting", label: "Diarrhea and vomiting" },
  { value: "Mobility concerns", label: "Mobility concerns" },
  { value: "Trauma/injury triage", label: "Trauma/injury triage" },
  { value: "Preventative wellness", label: "Preventative wellness" },
  { value: "Nutrition", label: "Nutrition" },
  { value: "Training & obedience", label: "Training & obedience" },
  { value: "Toxin ingestion", label: "Toxin ingestion" },
  { value: "Grooming advice", label: "Grooming advice" },
  { value: "Weight loss", label: "Weight loss" },
  { value: "New parent", label: "New parent" },
  { value: "Others", label: "Others" },
];

export default function Page() {
  const search = useSearchParams();
  const from = search.get("from") || "/vets";

  const [species, setSpecies] = useState("cat");
  const [concerns, setConcerns] = useState([]);

  useEffect(() => {
    const petFilter = JSON.parse(localStorage.getItem("pet-filter"));
    if (!petFilter) {
      localStorage.setItem(
        "pet-filter",
        JSON.stringify({ species: "cat", concerns: [] })
      );
    } else {
      setSpecies(petFilter.species);
      setConcerns(petFilter.concerns);
    }
  }, []);

  const handleSpeciesChange = (newSpecies) => {
    setSpecies(newSpecies);
  };

  return (
    <div className="py-10">
      <div className="container mx-auto">
        <h2 className="text-4xl font-semibold mb-8 text-center">
          Your Pet Type
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4 py-5">
          {[
            { name: "cat", icon: Cat },
            { name: "dog", icon: Dog },
            { name: "bird", icon: Bird },
            { name: "rabbit", icon: Rabbit },
          ].map((pet) => (
            <button
              key={pet.name}
              onClick={() => handleSpeciesChange(pet.name)}
              className={`relative aspect-square rounded-xl border-4 p-4 flex flex-col items-center justify-center gap-4 hover:border-black transition-colors
                ${species === pet.name ? "border-black" : "border-gray-200"}`}
            >
              <div className="w-20 h-20">
                <pet.icon className="w-full h-full" />
              </div>
              <span className="text-xl capitalize">{pet.name}</span>
              {species === pet.name && (
                <div className="absolute top-3 left-3 w-4 h-4 rounded-full border-4 border-black" />
              )}
            </button>
          ))}
        </div>

        <div className="py-10">
          <h2 className="text-5xl font-bold mb-8 text-center">Concerns</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto px-4 py-5">
            {ConcernsList.map((concern) => (
              <div
                key={concern.value}
                className={`relative rounded-xl border-2 p-4 flex items-center gap-3 cursor-pointer hover:border-black transition-colors
                  ${
                    concerns.includes(concern.value)
                      ? "border-black"
                      : "border-gray-200"
                  }`}
                onClick={() => {
                  const newConcerns = concerns.includes(concern.value)
                    ? concerns.filter((c) => c !== concern.value)
                    : [...concerns, concern.value];
                  setConcerns(newConcerns);
                }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-lg">{concern.label}</span>
                </div>
                <div
                  className={`w-7 h-7 border-2 rounded flex items-center justify-center
                  ${
                    concerns.includes(concern.value)
                      ? "border-black bg-black"
                      : "border-gray-300"
                  }`}
                >
                  {concerns.includes(concern.value) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          className="w-1/2 uppercase mx-auto my-10"
          text="See all vets"
          type="default"
          onClick={() => {
            if (concerns.length === 0) {
              toast.error("Please select at least one concern");
              return;
            }

            localStorage.setItem(
              "pet-filter",
              JSON.stringify({ species, concerns })
            );

            return (window.location.href = from);
          }}
        />
      </div>
    </div>
  );
}
