"use client";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import toast from "react-hot-toast";
import type { Swiper as SwiperType } from "swiper";

import axios from "@/src/lib/axiosInstance";

import Adoption from "@/src/components/adoption";
import { Adoption as AdoptionType } from "@/src/types";

import "swiper/css";
import { ArrowLeft, ArrowRight } from "@/src/components/svg";

interface AdoptionsSectionProps {
  AdoptionData?: AdoptionType[];
}

const Adoptions: React.FC<AdoptionsSectionProps> = ({ AdoptionData }) => {
  const swiperRef = useRef<SwiperType | undefined>();

  const [loading, setLoading] = useState<boolean>(true);
  const [adoptions, setAdoptions] = useState<AdoptionType[]>([]);

  const fetchAdoptions = async () => {
    try {
      const { data } = await axios.get("/api/adoptions");

      if (data.success) {
        setAdoptions(data.adoptions);
      }
    } catch (error) {
      toast.error("Failed to fetch adoptions");
      console.error("Error fetching adoptions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAdoptions();
  }, []);

  return (
    <div className="relative py-20">
      <div className="absolute h-full w-full flex flex-row items-center justify-between">
        <div
          className="bg-white md:py-10 py-4 rounded-pill cursor-pointer hover:bg-petzy-mint-light transition-all ease-in-out duration-300 shadow-soft hover:shadow-soft-lg z-20"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ArrowLeft className="md:text-[4em] text-[1.5em] text-petzy-slate-light px-3" />
        </div>
        <div
          className="bg-white md:py-10 py-4 rounded-pill cursor-pointer hover:bg-petzy-mint-light transition-all ease-in-out duration-300 shadow-soft hover:shadow-soft-lg z-20"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ArrowRight className="md:text-[4em] text-[1.5em] text-petzy-slate-light px-3" />
        </div>
      </div>
      <Swiper
        className="z-10"
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        autoplay={{ delay: 3000, disableOnInteraction: true }}
        modules={[Autoplay, Navigation]}
        breakpoints={{
          480: {
            slidesPerView: 1,
            spaceBetween: 40,
          },
          640: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
        }}
        spaceBetween={30}
        loop={true}
      >
        {adoptions?.slice(0, 8).map((adoption, index) => (
          <SwiperSlide key={index} className="md:px-0 px-10">
            <Adoption
              pic={adoption.images[0].path}
              name={adoption.name}
              pet={adoption.species || adoption.pet || ""}
              location={adoption.location}
              gender={adoption.gender}
              breed={adoption.breed}
              age={adoption.age}
              id={adoption.adoptionId || adoption._id}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Adoptions;
