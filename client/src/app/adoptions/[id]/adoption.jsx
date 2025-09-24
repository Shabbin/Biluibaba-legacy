"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";

import { useAuth } from "@/src/components/providers/AuthProvider";

import { LuShare2, LuHeart } from "react-icons/lu";

import ImageSlider from "@/src/components/image-slider";
import Button from "@/src/components/ui/button";

import Adoption from "@/src/components/adoption";

import axios from "@/src/lib/axiosInstance";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [adoption, setAdoption] = useState({});
  const [moreAdoptions, setMoreAdoptions] = useState([]);

  const auth = useAuth();

  const params = useParams();

  let wishlist;
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleClick = () => {
    const wishlistItems =
      JSON.parse(localStorage.getItem("adoption-wishlist")) || [];
    if (wishlistItems.some((item) => item.id === adoption.adoptionId)) {
      // Remove from wishlist
      const updatedWishlist = wishlistItems.filter(
        (item) => item.id !== adoption.adoptionId
      );
      localStorage.setItem(
        "adoption-wishlist",
        JSON.stringify(updatedWishlist)
      );
    } else {
      // Add to wishlist
      wishlistItems.push({
        age: adoption.age,
        breed: adoption.breed,
        gender: adoption.gender,
        id: adoption.adoptionId,
        location: adoption.location,
        name: adoption.name,
        pet: adoption.pet,
        pic: adoption.images[0].path,
      });
      localStorage.setItem("adoption-wishlist", JSON.stringify(wishlistItems));
    }

    window.location.reload();
  };

  const fetchAdoption = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/adoptions/get/${params.id}`);

      if (data.success) {
        setAdoption(data.adoption);
        setMoreAdoptions(data.moreAdoption);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoption();
    wishlist = JSON.parse(localStorage.getItem("adoption-wishlist")) || [];
    setIsInWishlist(wishlist.some((item) => item.id === params.id));
  }, []);

  return (
    <div className="py-5 bg-neutral-50">
      {loading ? null : (
        <div className="mx-auto container md:px-0 px-5">
          <div className="flex md:flex-row flex-col gap-5">
            <div className="basis-1/2">
              <ImageSlider images={adoption.images} />
            </div>
            <div className="basis-1/2 bg-white p-8 rounded-xl shadow border flex flex-col justify-between">
              <div>
                <h2 className="text-2xl">Hi everyone! I'm</h2>
                <h3 className="text-5xl font-bold mt-2">{adoption.name}</h3>
              </div>
              <div className="py-5">
                <div className="flex flex-row items-center justify-between">
                  <h2 className="text-2xl">About</h2>
                  <div className="flex flex-row items-center gap-2">
                    <LuShare2 size="1.5em" />
                    <LuHeart size="1.5em" />
                  </div>
                </div>

                <div className="py-3 text-xl flex flex-col gap-2">
                  <div className="flex flex-row items-center justify-between">
                    <div>Age</div>
                    <div className="font-bold">{adoption.age}</div>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <div>Gender</div>
                    <div className="font-bold">{adoption.gender}</div>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <div>Species</div>
                    <div className="font-bold">{adoption.species}</div>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <div>Size</div>
                    <div className="font-bold">{adoption.size}</div>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <div>Breed</div>
                    <div className="font-bold">{adoption.breed}</div>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <div>Vaccinated</div>
                    <div className="font-bold">{adoption.vaccinated}</div>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <div>Sprayed/Neuter</div>
                    <div className="font-bold">{adoption.neutered}</div>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <div>Location</div>
                    <div className="font-bold">{adoption.location}</div>
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div>Shipping Cost</div>
                    <div className="font-bold">&#2547; 500</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                {auth.user?.id === adoption.userId._id ? (
                  <Button
                    text="Manage Adoption"
                    type="default"
                    onClick={() =>
                      (window.location.href = `/my-account/adoptions/`)
                    }
                  />
                ) : (
                  <>
                    {isInWishlist ? (
                      <Button
                        text="Remove from Wishlist"
                        type="outline"
                        onClick={handleClick}
                      />
                    ) : (
                      <Button
                        text="Add to Wishlist"
                        type="outline"
                        onClick={handleClick}
                      />
                    )}
                    <Button
                      text="Apply to Adopt"
                      type="default"
                      onClick={() => {
                        localStorage.setItem(
                          "adoption",
                          JSON.stringify({
                            name: adoption.name,
                            pic: adoption.images[0].path,
                            species: adoption.species,
                            gender: adoption.gender,
                            adoptionId: adoption._id,
                          })
                        );

                        window.location.href = "/adoptions/checkout";
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="py-5">
            <div className="p-5 bg-white shadow flex md:flex-row flex-col items-center justify-between md:divide-x-2 divide-y-2 md:divide-y-0 divide-black gap-5 rounded">
              <div className="basis-1/3 uppercase text-xl text-center">
                Adoption posted by
              </div>
              <div className="basis-2/3 md:ps-10 pt-10 md:pt-0">
                <div className="flex flex-row items-center gap-4">
                  <img
                    src={adoption.userId.avatar}
                    alt={adoption.userId.name}
                    className="rounded-full w-[100px] h-[100px]"
                  />
                  <div>
                    <div className="text-2xl font-bold">
                      {adoption.userId.name}
                    </div>
                    <div>{adoption.phoneNumber || adoption.userId.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-5">
            <div className="p-8 bg-white shadow rounded">
              <h2 className="text-3xl font-bold mb-2">Description</h2>
              <p className="text-2xl">{adoption.description}</p>
            </div>
          </div>

          <div className="py-5">
            <div className="py-5 text-4xl font-medium text-center">
              More pets to adopt
            </div>

            <div className="flex md:flex-row flex-col justify-between gap-5">
              {moreAdoptions.map((adoption, index) => (
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
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
