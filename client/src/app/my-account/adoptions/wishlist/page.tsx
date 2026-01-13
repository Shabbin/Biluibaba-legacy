"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import Adoption from "@/src/components/adoption";

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

interface WishlistItem {
  id: string;
}

const Page: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [adoptions, setAdoptions] = useState<AdoptionData[]>([]);

  const fetchAdoptions = async (adoptionIds: WishlistItem[]): Promise<void> => {
    try {
      const ids = adoptionIds.map((adoption) => adoption.id).join(",");

      console.log(ids);

      const { data } = await axios.get(`/api/adoptions/wishlist?ids=${ids}`);
      if (data.success) {
        setAdoptions(data.adoptions);
      } else {
        toast.error("Failed to fetch wishlist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const wishlistStr = localStorage.getItem("adoption-wishlist");
    const wishlist: WishlistItem[] = wishlistStr ? JSON.parse(wishlistStr) : [];

    if (wishlist.length > 0) {
      fetchAdoptions(wishlist);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="py-5">
      <div className="pb-5 text-4xl">Adoption Wishlist</div>

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
