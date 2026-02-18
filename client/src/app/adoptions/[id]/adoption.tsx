"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Adoption as AdoptionType, AdoptionWishlistItem, ApiAxiosError } from "@/src/types";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";

import { useAuth } from "@/src/components/providers/AuthProvider";

import { Share, HeartOutline } from "@/src/components/svg";

import ImageSlider from "@/src/components/image-slider";
import Button from "@/src/components/ui/button";

import Adoption from "@/src/components/adoption";

import axios from "@/src/lib/axiosInstance";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [adoption, setAdoption] = useState<Partial<AdoptionType>>({});
  const [moreAdoptions, setMoreAdoptions] = useState<AdoptionType[]>([]);

  const auth = useAuth();

  const params = useParams();

  let wishlist: AdoptionWishlistItem[];
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false);

  const handleClick = () => {
    const wishlistItems: AdoptionWishlistItem[] =
      JSON.parse(localStorage.getItem("adoption-wishlist") || "[]");
    if (wishlistItems.some((item) => item.id === adoption?.adoptionId)) {
      // Remove from wishlist
      const updatedWishlist = wishlistItems.filter(
        (item) => item.id !== adoption?.adoptionId
      );
      localStorage.setItem(
        "adoption-wishlist",
        JSON.stringify(updatedWishlist)
      );
    } else {
      // Add to wishlist
      wishlistItems.push({
        age: adoption?.age || "",
        breed: adoption?.breed || "",
        gender: adoption?.gender || "",
        id: adoption?.adoptionId || "",
        location: adoption?.location || "",
        name: adoption?.name || "",
        pet: adoption?.species || "",
        pic: adoption?.images?.[0]?.path || "",
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
        console.log(data);
      }
    } catch (error: unknown) {
      console.error(error as ApiAxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoption();
    wishlist = JSON.parse(localStorage.getItem("adoption-wishlist") || "[]");
    setIsInWishlist(wishlist.some((item) => item.id === params.id));
  }, []);

  return (
    <div className="py-5 bg-neutral-50">
      {loading ? null : (
        <div className="mx-auto container md:px-0 px-5 py-5">
          <div className="flex md:flex-row flex-col gap-5">
            <div className="basis-2/3">
              <ImageSlider images={adoption?.images || []} />
            </div>
            <div className="basis-1/3">
              <div className="gap-5 bg-white p-8 rounded-md border flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Hi everyone! I'm</h2>
                  <h3 className="text-4xl font-bold mt-2">{adoption?.name}</h3>
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
                      <div className="font-semibold">{adoption?.age}</div>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div>Gender</div>
                      <div className="font-semibold">{adoption?.gender}</div>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div>Species</div>
                      <div className="font-semibold">{adoption?.species}</div>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div>Size</div>
                      <div className="font-semibold">{adoption?.size}</div>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div>Breed</div>
                      <div className="font-semibold">{adoption?.breed}</div>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div>Vaccinated</div>
                      <div className="font-semibold">{adoption?.vaccinated}</div>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div>Sprayed/Neuter</div>
                      <div className="font-semibold">{adoption?.neutered}</div>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div>Location</div>
                      <div className="font-semibold">{adoption?.location}</div>
                    </div>

                    <div className="flex flex-row items-center justify-between">
                      <div>Shipping Cost</div>
                      <div className="font-bold text-2xl">&#2547; 500</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-5">
                  {auth.user?.id === (typeof adoption?.user === 'object' ? adoption?.user?._id : adoption?.user) ? (
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
                              name: adoption?.name,
                              pic: adoption?.images?.[0]?.path,
                              species: adoption?.species,
                              gender: adoption?.gender,
                              adoptionId: adoption?._id,
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
                    src={typeof adoption?.user === 'object' ? adoption?.user?.avatar : undefined}
                    alt={typeof adoption?.user === 'object' ? adoption?.user?.name : ''}
                    className="rounded-full w-[80px] h-[8]"
                  />
                  <div>
                    <div className="text-2xl font-bold">
                      {typeof adoption?.user === 'object' ? adoption?.user?.name : ''}
                    </div>
                    <div>{adoption?.phoneNumber}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-5">
            <div className="p-8 bg-white rounded">
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <p className="text-lg">{adoption?.description}</p>
            </div>
          </div>

          <div className="py-5">
            <div className="py-5 text-4xl font-medium text-center">
              More pets to adopt
            </div>

            <div className="flex md:flex-row flex-col justify-between gap-5 py-5">
              {moreAdoptions.map((adoptionItem: AdoptionType) => (
                <Adoption
                  key={adoptionItem.adoptionId || adoptionItem._id}
                  pic={adoptionItem.images[0].path}
                  name={adoptionItem.name}
                  pet={adoptionItem.species || ''}
                  location={adoptionItem.location}
                  gender={adoptionItem.gender}
                  breed={adoptionItem.breed}
                  age={adoptionItem.age}
                  id={adoptionItem.adoptionId || adoptionItem._id}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
