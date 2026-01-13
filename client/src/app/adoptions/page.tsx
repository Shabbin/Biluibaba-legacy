"use client";

import React, { useState, useEffect, ChangeEvent } from "react";

import { Pagination } from "@heroui/pagination";

import Adoption from "@/src/components/adoption";
import Select from "@/src/components/ui/select";
import Button from "@/src/components/ui/button";

import axios from "@/src/lib/axiosInstance";

import BreedData from "@/src/app/adoptions/post/breed.data";
import ColorData from "@/src/app/adoptions/post/color.data";
import LocationData from "@/src/app/adoptions/post/location.data";

interface AdoptionImage {
  path: string;
}

interface AdoptionData {
  adoptionId: string;
  name: string;
  species: string;
  location: string;
  gender: string;
  updatedAt: string;
  breed: string;
  age: string;
  images: AdoptionImage[];
}

interface FilterState {
  age: string;
  species: string;
  breed: string;
  gender: string;
  size: string;
  vaccinated: string;
  color: string;
  location: string;
  neutered: string;
}

const ageOptions = [
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
  ...Array.from({ length: 20 }, (_, i) => ({
    value: `${11 + i} years`,
    text: `${11 + i} years`,
  })),
  { value: "30+ years", text: "30+ years" },
];

const Page: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [adoptions, setAdoptions] = useState<AdoptionData[]>([]);
  const [count, setCount] = useState<number>(0);
  const [adoptionCount, setAdoptionCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 40;
  const [filters, setFilters] = useState<FilterState>({
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

  const fetchAdoptions = async (
    pageCount: number = 0,
    filterParams: FilterState = filters
  ): Promise<void> => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("count", pageCount.toString());

      Object.entries(filterParams).forEach(([key, value]) => {
        if (value && value !== "") {
          params.append(key, value);
        }
      });

      const { data } = await axios.get(`/api/adoptions?${params.toString()}`);

      if (data.success) {
        setAdoptions(data.adoptions);
        setAdoptionCount(data.adoptionCount);

        const calculatedTotalPages = Math.ceil(data.adoptionCount / itemsPerPage);
        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        setCount(pageCount);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof FilterState, event: ChangeEvent<HTMLSelectElement>): void => {
    setFilters((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const applyFilters = (): void => {
    setCurrentPage(1);
    fetchAdoptions(0, filters);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    fetchAdoptions(page - 1, filters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchAdoptions(count, filters);
  }, []);

  const getBreedOptions = () => {
    const speciesBreeds = BreedData.find((breed) => breed.name === filters.species);
    if (speciesBreeds) {
      return [
        { text: "All options", value: "" },
        ...speciesBreeds.breeds.map((breed) => ({ value: breed, text: breed })),
      ];
    }
    return [{ text: "All options", value: "" }];
  };

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
              data={ageOptions}
              onChange={(event) => handleFilterChange("age", event)}
              className="!bg-white !text-sm !text-gray-400"
            />
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
              onChange={(event) => handleFilterChange("species", event)}
            />
          </div>
          <div className="basis-1/5 w-full md:-me-2 px-3">
            <label className="text-lg">Breed</label>
            <Select
              data={getBreedOptions()}
              className="!bg-white !text-sm !text-gray-400"
              onChange={(event) => handleFilterChange("breed", event)}
            />
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
              onChange={(event) => handleFilterChange("gender", event)}
            />
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
              onChange={(event) => handleFilterChange("size", event)}
            />
          </div>
          <div className="basis-1/5 w-full md:-me-2 px-3">
            <label className="text-lg">Vaccinated</label>
            <Select
              data={[
                { text: "All options", value: "" },
                { value: "Yes", text: "Yes" },
                { value: "No", text: "No" },
              ]}
              onChange={(event) => handleFilterChange("vaccinated", event)}
              disabled={filters.species !== "Cat" && filters.species !== "Dog"}
              className="!bg-white !text-sm !text-gray-400"
            />
          </div>
          <div className="basis-1/5 w-full md:-me-2 px-3">
            <label className="text-lg">Color</label>
            <Select
              data={[
                { text: "All options", value: "" },
                ...ColorData.map((color) => ({ value: color, text: color })),
              ]}
              className="!bg-white !text-sm !text-gray-400"
              onChange={(event) => handleFilterChange("color", event)}
            />
          </div>
          <div className="basis-1/5 w-full md:-me-2 px-3">
            <label className="text-lg">Location</label>
            <Select
              data={[
                { text: "All options", value: "" },
                ...LocationData.map((location) => ({ value: location, text: location })),
              ]}
              className="!bg-white !text-sm !text-gray-400"
              onChange={(event) => handleFilterChange("location", event)}
            />
          </div>
          <div className="basis-1/5 w-full md:-me-2 px-3">
            <label className="text-lg">Neutered/Sprayed</label>
            <Select
              data={[
                { text: "All options", value: "" },
                { value: "Yes", text: "Yes" },
                { value: "No", text: "No" },
              ]}
              onChange={(event) => handleFilterChange("neutered", event)}
              disabled={filters.species !== "Cat" && filters.species !== "Dog"}
              className="!bg-white !text-sm !text-gray-400"
            />
          </div>
          <div className="basis-1/5 w-full md:-me-2 px-3">
            <Button
              text="Apply"
              type="default"
              className="w-full mt-6 !py-3"
              onClick={applyFilters}
            />
          </div>
        </div>
      </div>

      <div className="py-20 flex md:flex-row flex-col items-center justify-between bg-[url('/post-adoption.png')] bg-cover bg-no-repeat bg-bottom text-white md:px-20 px-10 my-5 rounded-lg gap-5">
        <h2 className="text-4xl md:text-left text-center">Do you have any adoption?</h2>
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
        {!loading && (
          <div className="flex md:flex-row flex-col flex-wrap justify-center gap-5">
            {adoptions.map((adoption, index) => (
              <React.Fragment key={adoption.adoptionId}>
                <div className="basis-1/4 md:-m-5 md:p-5">
                  <Adoption
                    pic={adoption.images[0].path}
                    name={adoption.name}
                    pet={adoption.species}
                    location={adoption.location}
                    gender={adoption.gender}
                    addedOn={adoption.updatedAt}
                    breed={adoption.breed}
                    age={adoption.age}
                    id={adoption.adoptionId}
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
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-row items-center justify-center py-5">
        {!loading && totalPages > 1 && (
          <Pagination
            total={totalPages}
            initialPage={currentPage}
            page={currentPage}
            variant="flat"
            classNames={{
              cursor: "bg-zinc-950 border-zinc-950",
            }}
            showControls
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
