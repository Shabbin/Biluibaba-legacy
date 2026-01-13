"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import { FaLocationDot } from "react-icons/fa6";

import Button from "@/src/components/ui/button";

import axios from "@/src/lib/axiosInstance";

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

interface AdoptionProps {
  pic: string;
  name: string;
  pet: string;
  location: string;
  gender: string;
  addedOn: string;
  breed: string;
  age: string;
  id: string;
}

const Adoption: React.FC<AdoptionProps> = ({
  pic,
  pet,
  name,
  location,
  age,
  gender,
  breed,
  id,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const deleteAdoption = async (adoptionId: string): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/adoptions/delete/${adoptionId}`);
      if (data.success) {
        toast.success("Adoption post deleted successfully");
        window.location.reload();
      } else {
        toast.error("Failed to delete adoption post");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl shadow hover:shadow-lg transition-all ease-in-out duration-300 w-full">
      <div
        className="bg-cover bg-no-repeat bg-top h-[350px] rounded-tr-xl rounded-tl-xl"
        style={{ backgroundImage: `url(${pic})` }}
      ></div>
      <div className="px-5 py-8">
        <div className="flex flex-row items-center justify-between">
          <div className="bg-gray-100 text-gray-500 font-light px-8 py-1 rounded-3xl tracking-wider uppercase">
            {pet}
          </div>
        </div>
        <div className="text-xl font-bold my-2">{name}</div>
        <div className="flex flex-row gap-1 items-center">
          <FaLocationDot size="0.8em" />
          <div className="text-sm">{location}</div>
        </div>
        <div className="my-5 text-sm">
          <div className="font-bold">
            Age: <span className="font-normal">{age}</span>
          </div>
          <div className="font-bold">
            Gender: <span className="font-normal">{gender}</span>
          </div>
          <div className="font-bold">
            Breed: <span className="font-normal">{breed}</span>
          </div>
        </div>
        <Button
          type="default"
          text="Delete Post"
          className="w-full"
          disabled={loading}
          onClick={() => deleteAdoption(id)}
        />
      </div>
    </div>
  );
};

const Page: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [adoptions, setAdoptions] = useState<AdoptionData[]>([]);

  const fetchAdoptions = async (): Promise<void> => {
    try {
      const { data } = await axios.get("/api/adoptions/list");
      if (data.success) setAdoptions(data.adoptions);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch adoptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoptions();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="py-5">
      <h2 className="pb-5 text-4xl">All of your adoptions post</h2>

      <div className="py-5">
        <div className="flex md:flex-row flex-col flex-wrap justify-center gap-5">
          {adoptions.map((adoption, index) => (
            <div className="basis-1/4 md:-mx-2 md:px-2" key={index}>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
