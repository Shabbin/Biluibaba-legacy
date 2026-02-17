"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import Adoption from "@/src/components/adoption";

import axios from "@/src/lib/axiosInstance";
import type { Adoption as AdoptionType } from "@/src/types";

interface AdoptionIdObj {
  id: string;
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [adoptions, setAdoptions] = useState<AdoptionType[]>([]);

  const fetchAdoptions = async (adoptionIds: AdoptionIdObj[]) => {
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
    const wishlist: AdoptionIdObj[] =
      JSON.parse(localStorage.getItem("adoption-wishlist") || "[]");

    if (wishlist.length > 0) {
      fetchAdoptions(wishlist);
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="py-5">
      <div className="pb-5 text-4xl">Adoption Wishlist</div>

      <div className="py-5">
        {loading ? null : (
          <div className="flex md:flex-row flex-col flex-wrap justify-center gap-5">
            {adoptions.map((adoption, index) => (
              <div className="basis-1/4 md:-mx-2 md:px-2" key={index}>
                <Adoption
                  pic={adoption.images[0].path}
                  name={adoption.name}
                  pet={adoption.species || "Unknown"}
                  location={adoption.location}
                  gender={adoption.gender}
                  breed={adoption.breed}
                  age={adoption.age}
                  id={adoption.adoptionId || ""}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
