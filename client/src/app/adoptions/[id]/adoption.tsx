"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useAuth } from "@/src/components/providers/AuthProvider";

import { Share, HeartOutline } from "@/src/components/svg";

import ImageSlider from "@/src/components/image-slider";
import Button from "@/src/components/ui/button";

import Adoption from "@/src/components/adoption";

import axios from "@/src/lib/axiosInstance";

interface AdoptionImage {
  path: string;
}

interface User {
  _id: string;
  name: string;
  avatar: string;
  email: string;
}

interface AdoptionData {
  _id: string;
  adoptionId: string;
  name: string;
  age: string;
  breed: string;
  gender: string;
  species: string;
  size: string;
  vaccinated: string;
  neutered: string;
  location: string;
  description: string;
  phoneNumber?: string;
  images: AdoptionImage[];
  userId: User;
  updatedAt: string;
}

interface WishlistItem {
  id: string;
  name: string;
  age: string;
  breed: string;
  gender: string;
  location: string;
  pet: string;
  pic: string;
}

export default function Page(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [adoption, setAdoption] = useState<AdoptionData | null>(null);
  const [moreAdoptions, setMoreAdoptions] = useState<AdoptionData[]>([]);
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false);

  const auth = useAuth();
  const params = useParams();

  const handleClick = (): void => {
    if (!adoption) return;

    const wishlistItems: WishlistItem[] =
      JSON.parse(localStorage.getItem("adoption-wishlist") || "[]");

    if (wishlistItems.some((item) => item.id === adoption.adoptionId)) {
      const updatedWishlist = wishlistItems.filter(
        (item) => item.id !== adoption.adoptionId
      );
      localStorage.setItem("adoption-wishlist", JSON.stringify(updatedWishlist));
    } else {
      wishlistItems.push({
        age: adoption.age,
        breed: adoption.breed,
        gender: adoption.gender,
        id: adoption.adoptionId,
        location: adoption.location,
        name: adoption.name,
        pet: adoption.species,
        pic: adoption.images[0].path,
      });
      localStorage.setItem("adoption-wishlist", JSON.stringify(wishlistItems));
    }

    window.location.reload();
  };

  const fetchAdoption = async (): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/adoptions/get/${params.id}`);

      if (data.success) {
        setAdoption(data.adoption);
        setMoreAdoptions(data.moreAdoption);
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoption();
    const wishlist: WishlistItem[] =
      JSON.parse(localStorage.getItem("adoption-wishlist") || "[]");
    setIsInWishlist(wishlist.some((item) => item.id === params.id));
  }, []);

  if (loading || !adoption) {
    return <div className="py-5 bg-neutral-50">Loading...</div>;
  }

  return (
    <div className="py-5 bg-neutral-50">
      <div className="mx-auto container md:px-0 px-5 py-5">
        <div className="flex md:flex-row flex-col gap-5">
          <div className="basis-2/3">
            <ImageSlider images={adoption.images} />
          </div>
          <div className="basis-1/3">
            <div className="gap-5 bg-white p-8 rounded-md border flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold">Hi everyone! I&apos;m</h2>
                <h3 className="text-4xl font-bold mt-2">{adoption.name}</h3>
              </div>
              <div className="flex flex-row items-center justify-between">
                <h2 className="text-3xl font-semibold">About</h2>
                <div className="flex flex-row items-center gap-2">
                  <Share className="text-[2em]" />
                  <HeartOutline className="text-[2em]" />
                </div>
              </div>

              <div>
                <div className="py-3 text-xl flex flex-col gap-3">
                  <div className="flex flex-row items-center justify-between">
                    <div>Age</div>
                    <div className="font-semibold">{adoption.age}</div>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <div>Gender</div>
                    <div className="font-semibold">{adoption.gender}</div>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <div>Species</div>
                    <div className="font-semibold">{adoption.species}</div>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <div>Size</div>
                    <div className="font-semibold">{adoption.size}</div>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <div>Breed</div>
                    <div className="font-semibold">{adoption.breed}</div>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <div>Vaccinated</div>
                    <div className="font-semibold">{adoption.vaccinated}</div>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <div>Sprayed/Neuter</div>
                    <div className="font-semibold">{adoption.neutered}</div>
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <div>Location</div>
                    <div className="font-semibold">{adoption.location}</div>
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div>Shipping Cost</div>
                    <div className="font-bold text-2xl">&#2547; 500</div>
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
        </div>

        <div className="py-5 md:my-5 my-5">
          <div className="px-5 py-8 bg-white flex md:flex-row flex-col items-center justify-between md:divide-x-2 divide-y-2 md:divide-y-0 divide-black gap-5 rounded">
            <div className="basis-1/3 uppercase text-xl text-center">
              Adoption posted by
            </div>
            <div className="basis-2/3 md:ps-16 pt-10 md:pt-0">
              <div className="flex flex-row items-center gap-4">
                <img
                  src={adoption.userId.avatar}
                  alt={adoption.userId.name}
                  className="rounded-full w-[80px] h-[80px]"
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
          <div className="p-8 bg-white rounded">
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <p className="text-lg">{adoption.description}</p>
          </div>
        </div>

        <div className="py-5">
          <div className="py-5 text-4xl font-medium text-center">
            More pets to adopt
          </div>

          <div className="flex md:flex-row flex-col justify-between gap-5 py-5">
            {moreAdoptions.map((item) => (
              <Adoption
                key={item.adoptionId}
                pic={item.images[0].path}
                name={item.name}
                pet={item.species}
                location={item.location}
                gender={item.gender}
                addedOn={item.updatedAt}
                breed={item.breed}
                age={item.age}
                id={item.adoptionId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
