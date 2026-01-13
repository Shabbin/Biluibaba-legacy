"use client";

import { useState, useEffect, useRef, ChangeEvent, DragEvent } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import MultiSelect, { MultiValue, StylesConfig } from "react-select";

import { X } from "lucide-react";

import { Upload } from "@/src/components/svg";

import Input from "@/src/components/ui/input";
import Select from "@/src/components/ui/select";
import Textarea from "@/src/components/ui/textarea";
import Button from "@/src/components/ui/button";

import axios from "@/src/lib/axiosInstance";

import BreedData from "@/src/app/adoptions/post/breed.data";
import ColorData from "@/src/app/adoptions/post/color.data";
import LocationData from "@/src/app/adoptions/post/location.data";

const DynamicQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
  ],
};

interface PetInfo {
  name: string;
  species: string;
  gender: string;
  age: string;
  breed: string;
  size: string;
  vaccinated: string;
  neutered: string;
  color: string[];
  location: string;
  phoneNumber: string;
  description: string;
}

interface ColorOption {
  value: string;
  label: string;
}

export default function Page(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const colorSelectRef = useRef<any>(null);

  // Single resize handler for mobile viewport adjustments
  useEffect(() => {
    const handleResize = (): void => {
      const menuPortal = document.querySelector(
        ".select__menu-portal"
      ) as HTMLElement | null;
      if (menuPortal) {
        if (window.innerWidth < 768) {
          menuPortal.style.width = "calc(100vw - 32px)";
          menuPortal.style.left = "50%";
          menuPortal.style.transform = "translateX(-50%)";
        } else {
          menuPortal.style.width = "auto";
          menuPortal.style.left = "0";
          menuPortal.style.transform = "none";
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Simplified effect to handle mobile dropdown positioning
  useEffect(() => {
    const handleDropdownPosition = (): void => {
      if (typeof window === "undefined" || !document) return;

      const positionDropdownMenu = (): void => {
        const menuPortal = document.querySelector(
          ".select__menu-portal"
        ) as HTMLElement | null;
        if (menuPortal && window.innerWidth < 768) {
          menuPortal.style.width = "calc(100vw - 32px)";
          menuPortal.style.left = "50%";
          menuPortal.style.transform = "translateX(-50%)";
        }
      };

      document.body.addEventListener("click", (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest(".select__control")) {
          setTimeout(positionDropdownMenu, 50);
        }
      });
    };

    handleDropdownPosition();
  }, []);

  const [files, setFiles] = useState<File[]>([]);
  const [petInfo, setPetInfo] = useState<PetInfo>({
    name: "",
    species: "Cat",
    gender: "Female",
    age: "2 years",
    breed: "Persian",
    size: "Medium",
    vaccinated: "No",
    neutered: "No",
    color: ["Black"],
    location: "Bagerhat",
    phoneNumber: "",
    description: "",
  });

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prev) => {
      const newFiles = [...prev, ...droppedFiles];
      return newFiles.slice(0, 5);
    });
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles((prev) => {
        const newFiles = [...prev, ...selectedFiles];
        return newFiles.slice(0, 5);
      });
    }
  };

  const handleRemoveFile = (index: number): void => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    setPetInfo({
      ...petInfo,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmit = async (type: "createAnother" | "post"): Promise<void> => {
    setLoading(true);

    try {
      if (!petInfo.name || petInfo.name.length > 50) {
        toast.error("Please enter your pet's name (max 50 characters)");
        return;
      }
      if (!petInfo.description || petInfo.description.length > 1000) {
        toast.error("Please enter a valid description (max 1000 characters)");
        return;
      }
      if (files.length === 0) {
        toast.error("Please upload your pet's image");
        return;
      }
      if (!petInfo.phoneNumber || petInfo.phoneNumber.length > 30) {
        toast.error("Please enter a valid phone number (max 30 characters)");
        return;
      }
      if (petInfo.color.length === 0) {
        toast.error("Please select at least one color for your pet");
        return;
      }

      const formData = new FormData();

      formData.append("name", petInfo.name);
      formData.append("species", petInfo.species);
      formData.append("gender", petInfo.gender);
      formData.append("age", petInfo.age);
      formData.append("breed", petInfo.breed);
      formData.append("size", petInfo.size);
      formData.append("vaccinated", petInfo.vaccinated);
      formData.append("neutered", petInfo.neutered);
      formData.append("color", JSON.stringify(petInfo.color));
      formData.append("phoneNumber", petInfo.phoneNumber);
      formData.append("location", petInfo.location);
      formData.append("description", petInfo.description);

      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      const { data } = await axios.post("/api/adoptions/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        if (type === "createAnother") {
          toast.success(
            "Adoption post created successfully! You can create another."
          );
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          toast.success("Adoption post created successfully!");
          window.location.href = "/adoptions/status?status=processing";
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create adoption post");
    } finally {
      setLoading(false);
    }
  };

  const selectStyles: StylesConfig<ColorOption, true> = {
    control: (base) => ({
      ...base,
      height: "50px",
      borderRadius: "0.375rem",
      borderColor: "#e5e7eb",
      backgroundColor: "#f3f4f6",
      margin: "0.5rem 0",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#d1d5db",
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#e5e7eb",
      borderRadius: "0.25rem",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#4b5563"
        : state.isFocused
        ? "#e5e7eb"
        : undefined,
      color: state.isSelected ? "white" : "black",
      padding: "10px",
      fontSize: "14px",
      cursor: "pointer",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    menuList: (base) => ({
      ...base,
      padding: "5px",
      maxHeight: "250px",
    }),
    container: (base) => ({
      ...base,
      width: "100%",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "2px 8px",
      flexWrap: "wrap",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "6px",
    }),
  };

  return (
    <div className="p-5">
      <h1 className="py-8 text-4xl font-bold text-center">Post an Adoption</h1>

      <div className="py-5 flex md:flex-row flex-col gap-5">
        <div className="basis-1/3 rounded-lg shadow-sm">
          {files.length < 5 && (
            <div
              className="border-2 border-dotted rounded-2xl px-12 py-32 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept="image/png, image/jpeg, image/heic, image/heif"
                multiple
                onChange={handleFileSelect}
              />
              <Upload className="w-16 h-16 text-gray-400 rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">
                Upload Pet&apos;s Image
              </h3>
              <p className="text-gray-500">
                Or{" "}
                <span className="text-blue-500 hover:text-blue-600 underline">
                  Browse
                </span>
              </p>
              <p className="text-gray-500 mt-2">
                {files.length}/5 images uploaded
              </p>
            </div>
          )}
          {files.length > 0 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                      onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {files.length === 5 && (
            <div className="mt-4 text-center text-amber-600 font-medium">
              Maximum of 5 images reached. Remove an image to add another.
            </div>
          )}
          <div className="mt-6 border rounded-2xl shadow-sm p-12">
            <h2 className="text-2xl font-bold">Pet Description</h2>
            <Textarea
              rows={20}
              className="mt-5"
              value={petInfo.description}
              onChange={handleChange}
              name="description"
            />
            <div
              className={
                "flex flex-row justify-end " +
                (petInfo.description.length > 1000 ? "text-red-500" : "")
              }
            >
              {petInfo.description.length}/1000 characters
            </div>
          </div>
        </div>
        <div className="basis-2/3">
          <div className="rounded-lg shadow-sm">
            <div className="border rounded-2xl p-12 space-y-5 h-auto">
              <h2 className="text-3xl font-bold py-5">Add a pet</h2>

              <div className="flex flex-row flex-wrap font-medium gap-y-2">
                <div className="basis-full">
                  <label>Pet&apos;s Name</label>
                  <Input
                    value={petInfo.name}
                    onChange={handleChange}
                    name="name"
                  />
                </div>
                <div className="basis-1/2 pe-2">
                  <label>Species</label>
                  <Select
                    data={BreedData.map((breed) => ({
                      value: breed.name,
                      text: breed.name,
                    }))}
                    value={petInfo.species}
                    onChange={handleChange}
                    name="species"
                  />
                </div>
                <div className="basis-1/2">
                  <label>Gender</label>
                  <Select
                    data={[
                      { value: "Female", text: "Female" },
                      { value: "Male", text: "Male" },
                    ]}
                    value={petInfo.gender}
                    onChange={handleChange}
                    name="gender"
                  />
                </div>
                <div className="basis-1/2 pe-2">
                  <label>Age</label>
                  <Select
                    data={[
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
                    value={petInfo.age}
                    onChange={handleChange}
                    name="age"
                  />
                </div>
                <div className="basis-1/2">
                  <label>Breed</label>
                  <Select
                    data={
                      BreedData.find((breed) => breed.name === petInfo.species)?.breeds.map(
                        (breed) => ({
                          value: breed,
                          text: breed,
                        })
                      ) || []
                    }
                    value={petInfo.breed}
                    onChange={handleChange}
                    name="breed"
                  />
                </div>
                <div className="basis-1/2 pe-2">
                  <label>Size</label>
                  <Select
                    data={[
                      { value: "Small", text: "Small" },
                      { value: "Medium", text: "Medium" },
                      { text: "Large", value: "Large" },
                    ]}
                    value={petInfo.size}
                    onChange={handleChange}
                    name="size"
                  />
                </div>
                <div className="basis-1/2">
                  <label>Vaccinated</label>
                  <Select
                    data={[
                      { value: "Yes", text: "Yes" },
                      { value: "No", text: "No" },
                      { value: "Not Applicable", text: "Not Applicable" },
                    ]}
                    value={petInfo.vaccinated}
                    onChange={handleChange}
                    name="vaccinated"
                  />
                </div>
                <div className="basis-1/2 pe-2">
                  <label>Neutered/Sprayed</label>
                  <Select
                    data={[
                      { value: "Yes", text: "Yes" },
                      { value: "No", text: "No" },
                      { value: "Not Applicable", text: "Not Applicable" },
                    ]}
                    value={petInfo.neutered}
                    onChange={handleChange}
                    name="neutered"
                  />
                </div>
                <div className="md:basis-1/2 basis-full">
                  <label>Color</label>
                  <MultiSelect
                    ref={colorSelectRef}
                    options={ColorData.map((color) => ({
                      value: color,
                      label: color,
                    }))}
                    value={petInfo.color.map((color) => ({
                      value: color,
                      label: color,
                    }))}
                    onChange={(selectedOptions: MultiValue<ColorOption>) => {
                      const selectedColors = selectedOptions
                        ? selectedOptions.map((option) => option.value).slice(0, 5)
                        : [];
                      setPetInfo({ ...petInfo, color: selectedColors });
                    }}
                    isMulti
                    name="color"
                    classNamePrefix="select"
                    className="w-full my-1 text-sm"
                    menuPosition="fixed"
                    menuPlacement="auto"
                    menuShouldBlockScroll={true}
                    menuShouldScrollIntoView={false}
                    isClearable={false}
                    maxMenuHeight={300}
                    menuPortalTarget={
                      typeof document !== "undefined" ? document.body : null
                    }
                    closeMenuOnScroll={(e) =>
                      (e.target as HTMLElement) === document.documentElement
                    }
                    noOptionsMessage={() => "No more colors available"}
                    isOptionDisabled={() => petInfo.color.length >= 5}
                    styles={selectStyles}
                  />
                  {petInfo.color.length >= 5 && (
                    <p className="text-amber-600 text-sm mt-1">
                      Maximum of 5 colors reached
                    </p>
                  )}
                </div>
                <div className="md:basis-1/2 basis-full pe-2">
                  <label>Location</label>
                  <Select
                    data={LocationData.map((location) => ({
                      value: location,
                      text: location,
                    }))}
                    value={petInfo.location}
                    onChange={handleChange}
                    name="location"
                  />
                </div>
                <div className="md:basis-1/2 basis-full">
                  <label>Contact Information (Phone Number)</label>
                  <Input
                    value={petInfo.phoneNumber}
                    onChange={handleChange}
                    name="phoneNumber"
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex md:flex-row flex-col gap-5">
        <Button
          type="outline"
          text="SUBMIT AND CREATE ANOTHER"
          className="basis-1/2"
          onClick={() => onSubmit("createAnother")}
        />
        <Button
          type="default"
          text="SUBMIT AND POST"
          className="basis-1/2"
          disabled={loading}
          onClick={() => onSubmit("post")}
        />
      </div>
    </div>
  );
}
