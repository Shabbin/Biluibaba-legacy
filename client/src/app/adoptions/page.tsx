// [FUTURE] Adoptions page — uncomment when enabling adoption features
// Original adoption page content preserved below. To restore:
// 1. Remove the ComingSoon import and default export at the bottom
// 2. Uncomment the entire original code block

/*
"use client";

import { useState, useEffect } from "react";
import type { Adoption as AdoptionType, AdoptionFilters, ApiAxiosError } from "@/src/types";

import Header from "@/src/components/header";
import Filter from "@/src/components/filter/adoptions";

import { Pagination } from "@heroui/pagination";

import Adoption from "@/src/components/adoption";
import Select from "@/src/components/ui/select";
import Button from "@/src/components/ui/button";
import { CardSkeleton, NoAdoptionsFound } from "@/src/components/ui";

import AdoptionData from "@/src/app/demo.adoptions";

import axios from "@/src/lib/axiosInstance";

import BreedData from "@/src/app/adoptions/post/breed.data";
import ColorData from "@/src/app/adoptions/post/color.data";
import LocationData from "@/src/app/adoptions/post/location.data";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [adoptions, setAdoptions] = useState<AdoptionType[]>([]);
  const [count, setCount] = useState<number>(0); // Current page count (0-based)
  const [adoptionCount, setAdoptionCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1); // Initialize totalPages
  const itemsPerPage = 40; // Fixed number of items per page
  const [filters, setFilters] = useState<AdoptionFilters>({
    age: "",
    species: "",
    breed: "",
    gender: "",
    size: "",
    vaccinated: "",
    color: "",
    location: "",
    neutered: "",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const fetchAdoptions = async (pageCount = 0, filterParams = {}) => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      params.append("count", String(pageCount));

      // Add filters to query params if they exist
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value && value !== "") {
          params.append(key, String(value));
        }
      });

      const { data } = await axios.get(`/api/adoptions?${params.toString()}`);

      if (data.success) {
        setAdoptions(data.adoptions);
        setAdoptionCount(data.adoptionCount);

        // Calculate total pages based on adoption count and fixed items per page
        const calculatedTotalPages = Math.ceil(
          data.adoptionCount / itemsPerPage
        );
        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        setCount(pageCount); // Update the count state
      }
    } catch (error: unknown) {
      console.error(error as ApiAxiosError);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle filter changes
  const handleFilterChange = (field: keyof AdoptionFilters, event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, [field]: event.target.value }));
  };

  // Function to apply filters
  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page when applying filters
    fetchAdoptions(0, filters); // Count 0 is the first page
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAdoptions(page - 1, filters); // Convert 1-based page to 0-based count
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchAdoptions(count, filters);
  }, []); // Only run on initial load

  return (
    <div className="py-5 mx-5">
      <img
        src="/adoption_banner.png"
        alt="Banner"
        className="rounded-lg mx-auto md:py-5 py-0"
      />

      <div className="bg-neutral-100 md:px-20 px-10 py-10 my-10 rounded-lg">
        <div className="flex md:flex-row flex-col items-center flex-wrap gap-y-8">
          <div className="basis-1/5 w-full md:-me-2 px-3">
            <label className="text-lg">Age</label>
            <Select
              data={[
                { value: "", text: "All options" },
                { value: "0-3 months", text: "0-3 months" },
                { value: "3-6 months", text: "3-6 months" },
                { value: "6-9 months", text: "6-9 months" },
                { value: "1 year", text: "1 year" },
                { value: "1.5 years", text: "1.5 years" },
                { value: "2 years", text: "2 years" },
                { value: "2.5 years", text: "2.5 years" },
                { value: "3 years", text: "3 years" },
                { value: "4 years", text: "4 years" },
                { value: "5 years", text: "5 years" },
                { value: "6 years", text: "6 years" },
                { value: "7 years", text: "7 years" },
                { value: "8 years", text: "8 years" },
                { value: "9 years", text: "9 years" },
                { value: "10 years", text: "10 years" },
                { value: "11 years", text: "11 years" },
                { value: "12 years", text: "12 years" },
                { value: "13 years", text: "13 years" },
                { value: "14 years", text: "14 years" },
                { value: "15 years", text: "15 years" },
                { value: "16 years", text: "16 years" },
                { value: "17 years", text: "17 years" },
                { value: "18 years", text: "18 years" },
                { value: "19 years", text: "19 years" },
                { value: "20 years", text: "20 years" },
                { value: "21 years", text: "21 years" },
                { value: "22 years", text: "22 years" },
                { value: "23 years", text: "23 years" },
                { value: "24 years", text: "24 years" },
                { value: "25 years", text: "25 years" },
                { value: "26 years", text: "26 years" },
                { value: "27 years", text: "27 years" },
                { value: "28 years", text: "28 years" },
                { value: "29 years", text: "29 years" },
                { value: "30 years", text: "30 years" },
                { value: "30+ years", text: "30+ years" },
              ]}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange("age", event)}
              className="!bg-white !text-sm !text-gray-400"
            ></Select>
          </div>
          <div className="basis-1/5 w-full md:-me-2 px-3">
            <label className="text-lg">Species</label>
            <Select
              data={[
                { value: "", text: "All options" },
                ...BreedData.map((breed) => ({
                  value: breed.name,
                  text: breed.name,
                })),
              ]}
              className="!bg-white !text-sm !text-gray-400"
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange("species", event)}
            ></Select>
          </div>
          <div className="basis-1/5 w-full md:-me-2 px-3">
            <label className="text-lg">Breed</label>
            <Select
              data={[
                { text: "All options", value: "" },
                ...(BreedData.find(
                  (breed) => breed.name === filters.species
                )?.breeds.map((breed) => ({
                  value: breed,
                  text: breed,
                })) || []),
              ]}
              className="!bg-white !text-sm !text-gray-400"
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange("neutered", event)}
            ></Select>
          </div>
          <div className="basis-1/5 w-full md:-me-2 px-3">
            <label className="text-lg">Gender</label>
            <Select
              data={[
                { text: "All options", value: "" },
                { text: "Male", value: "Male" },
                { text: "Female", value: "Female" },
              ]}
              className="!bg-white !text-sm !text-gray-400"
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange("gender", event)}
            ></Select>
          </div>
          <div className="basis-1/5 w-full md:-me-2 px-3">
            <label className="text-lg">Size</label>
            <Select
              data={[
                { value: "", text: "All options" },
                { value: "Small", text: "Small" },
                { value: "Medium", text: "Medium" },
                { text: "Large", value: "Large" },
              ]}
              className="!bg-white !text-sm !text-gray-400"
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange("size", event)}
            ></Select>
          </div>
          <div className="basis-1/5 w-full md:-me-2 px-3">
            <label className="text-lg">Vaccinated</label>
            <Select
              data={[
                { text: "All options", value: "" },
                { value: "Yes", text: "Yes" },
                { value: "No", text: "No" },
              ]}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange("vaccinated", event)}
              disabled={
                filters.species === "Cat" || filters.species === "Dog"
                  ? false
                  : true
              }
              className="!bg-white !text-sm !text-gray-400"
            ></Select>
          </div>
          <div className="basis-1/5 w-full md:-me-2 px-3">
            <label className="text-lg">Color</label>
            <Select
              data={[
                { text: "All options", value: "" },
                ...ColorData.map((color) => ({
                  value: color,
                  text: color,
                })),
              ]}
              className="!bg-white !text-sm !text-gray-400"
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange("color", event)}
            ></Select>
          </div>
          <div className="basis-1/5 w-full md:-me-2 px-3">
            <label className="text-lg">Location</label>
            <Select
              data={[
                { text: "All options", value: "" },
                ...LocationData.map((location) => ({
                  value: location,
                  text: location,
                })),
              ]}
              className="!bg-white !text-sm !text-gray-400"
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange("location", event)}
            ></Select>
          </div>
          <div className="basis-1/5 w-full md:-me-2 px-3">
            <label className="text-lg">Neutered/Sprayed</label>
            <Select
              data={[
                { text: "All options", value: "" },
                { value: "Yes", text: "Yes" },
                { value: "No", text: "No" },
              ]}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange("neutered", event)}
              disabled={
                filters.species === "Cat" || filters.species === "Dog"
                  ? false
                  : true
              }
              className="!bg-white !text-sm !text-gray-400"
            ></Select>
          </div>
          <div className="basis-1/5 w-full md:-me-2 px-3">
            <Button
              text="Apply"
              type="default"
              className="w-full mt-6 !py-3"
              onClick={applyFilters}
            ></Button>
          </div>
        </div>
      </div>

      <div className="py-20 flex md:flex-row flex-col items-center justify-between bg-[url('/post-adoption.png')] bg-cover bg-no-repeat bg-bottom text-white md:px-20 px-10 my-5 rounded-lg gap-5">
        <h2 className="text-4xl md:text-left text-center">
          Do you have any adoption?
        </h2>
        <button
          className="relative inline-flex h-14 items-center justify-center px-1 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-gradient-to-r before:from-[#ff75c3] before:via-[#ffa647] before:to-[#91ffff] before:opacity-0 before:transition before:duration-300 hover:before:opacity-100 rounded-full bg-gradient-to-r from-[#ff75c3] via-[#ffa647] to-[#91ffff] text-xl"
          onClick={() => (window.location.href = "/adoptions/post")}
        >
          <span className="relative rounded-full bg-[#0a0118] md:px-8 py-3 text-white transition duration-300 hover:bg-transparent">
            <span className="px-10"></span>
            Post Adoption
            <span className="px-10"></span>
          </span>
        </button>
      </div>

      <div className="py-8 text-5xl text-center font-bold">Available Pets</div>

      <div className="py-5">
        {loading ? (
          <div className="flex md:flex-row flex-col flex-wrap justify-center gap-5">
            <CardSkeleton count={8} type="adoption" />
          </div>
        ) : adoptions.length === 0 ? (
          <NoAdoptionsFound onReset={() => {
            setFilters({
              age: "",
              species: "",
              breed: "",
              gender: "",
              size: "",
              vaccinated: "",
              color: "",
              location: "",
              neutered: "",
            });
            setCurrentPage(1);
            fetchAdoptions(0, {});
          }} />
        ) : (
          <div className="flex md:flex-row flex-col flex-wrap justify-center gap-5">
            {adoptions.map((adoption: AdoptionType, index: number) => (
              <>
                <div
                  className="basis-1/4 md:-m-5 md:p-5"
                  key={adoption.adoptionId}
                >
                  <Adoption
                    pic={adoption.images[0].path}
                    name={adoption.name}
                    pet={adoption.species || ''}
                    location={adoption.location}
                    gender={adoption.gender}
                    breed={adoption.breed}
                    age={adoption.age}
                    id={adoption.adoptionId || adoption._id}
                  />
                </div>
                {(index + 1) % 8 === 0 && index !== adoptions.length - 1 && (
                  <div className="w-full md:my-8 my-2 md:px-12 px-0">
                    <img
                      src="/adoption_banner2.png"
                      alt="Adoption Banner"
                      className="rounded-lg w-full"
                    />
                  </div>
                )}
              </>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-row items-center justify-center py-5">\n        {!loading && totalPages > 1 && (
          <Pagination
            total={totalPages}
            initialPage={currentPage}
            page={currentPage}
            variant="flat"
            classNames={{
              cursor: "bg-zinc-950 border-zinc-950 ",
            }}
            showControls
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
*/

// Active export — shows Coming Soon placeholder
import ComingSoon from "@/src/components/coming-soon";

export default function Page() {
  return (
    <ComingSoon 
      title="Pet Adoption — Coming Soon" 
      description="Find your lifelong furry friend here soon. Browse adoptable pets, post adoption listings, and more!" 
    />
  );
}
