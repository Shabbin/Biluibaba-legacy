"use client";

import Image from "next/image";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import { PiGreaterThan, PiLessThan } from "react-icons/pi";
import { ArrowRight, ArrowLeft } from "@/src/components/svg";
import { ProductImage } from "@/src/types";

interface SliderItem extends ProductImage {
  _id: string;
}

interface LandingProps {
  slider: SliderItem[];
}

const Landing: React.FC<LandingProps> = ({ slider }) => {
  const swiperRef = useRef<SwiperType | null>(null); // Initialize with null

  return (
    <div className="relative">
      <div className="absolute z-[2] h-full w-full flex flex-row items-center justify-between">
        <div
          className="bg-white md:py-10 py-4 rounded-pill cursor-pointer hover:bg-petzy-mint-light transition-all ease-in-out duration-300 shadow-soft hover:shadow-soft-lg"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ArrowLeft className="md:text-[5em] text-[1.5em] text-petzy-slate-light px-2" />
        </div>
        <div
          className="bg-white md:py-10 py-4 rounded-pill cursor-pointer hover:bg-petzy-mint-light transition-all ease-in-out duration-300 shadow-soft hover:shadow-soft-lg"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ArrowRight className="md:text-[5em] text-[1.5em] text-petzy-slate-light px-2" />
        </div>
      </div>
      <Swiper
        className="!z-[1]"
        onSwiper={(swiper) => (swiperRef.current = swiper)} // Assign ref directly to Swiper
        autoplay={{ delay: 5000, disableOnInteraction: true }}
        modules={[Autoplay, Navigation]}
        loop={true}
      >
        {slider?.map((slide, index) => (
          <SwiperSlide key={slide._id}>
            <div
              className="bg-cover bg-no-repeat bg-center w-full md:h-[400px] h-[120px] rounded-3xl shadow-soft"
              style={{ backgroundImage: `url(${slide.path})` }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Landing;
