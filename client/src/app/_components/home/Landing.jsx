"use client";

import Image from "next/image";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import { PiGreaterThan, PiLessThan } from "react-icons/pi";
import { ArrowRight, ArrowLeft } from "@/src/components/svg";

const Landing = ({ slider }) => {
  const swiperRef = useRef(null); // Initialize with null

  return (
    <div className="relative">
      <div className="absolute z-[2] h-full w-full flex flex-row items-center justify-between">
        <div
          className="bg-white md:py-14 py-4 rounded-tr-lg rounded-br-lg cursor-pointer hover:bg-neutral-100 transition-all ease-in-out duration-300"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ArrowLeft className="px-2 md:text-[3em] text-[1.5em]" />
        </div>
        <div
          className="bg-white md:py-14 py-4 rounded-tl-lg rounded-bl-lg cursor-pointer hover:bg-neutral-100 transition-all ease-in-out duration-300"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ArrowRight className="px-2 md:text-[3em] text-[1.5em]" />
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
              className="bg-cover bg-no-repeat bg-center w-full md:h-[400px] h-[120px] rounded-lg"
              style={{ backgroundImage: `url(${slide.path})` }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Landing;
