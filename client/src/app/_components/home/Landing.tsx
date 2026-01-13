'use client';

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import { ArrowRight, ArrowLeft } from '@/src/components/svg';

interface SliderItem {
  _id: string;
  filename: string;
  path: string;
  link?: string;
}

interface LandingProps {
  slider: SliderItem[];
}

const Landing: React.FC<LandingProps> = ({ slider }) => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="relative">
      <div className="absolute z-[2] h-full w-full flex flex-row items-center justify-between">
        <div
          className="bg-white md:py-10 py-4 rounded-tr-lg rounded-br-lg cursor-pointer hover:bg-neutral-100 transition-all ease-in-out duration-300"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ArrowLeft className="md:text-[5em] text-[1.5em] text-gray-400" />
        </div>
        <div
          className="bg-white md:py-10 py-4 rounded-tl-lg rounded-bl-lg cursor-pointer hover:bg-neutral-100 transition-all ease-in-out duration-300"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ArrowRight className="md:text-[5em] text-[1.5em] text-gray-400" />
        </div>
      </div>
      <Swiper
        className="!z-[1]"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        autoplay={{ delay: 5000, disableOnInteraction: true }}
        modules={[Autoplay, Navigation]}
        loop={true}
      >
        {slider?.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div
              className="bg-cover bg-no-repeat bg-center w-full md:h-[400px] h-[120px] rounded-lg"
              style={{ backgroundImage: `url(${slide.path})` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Landing;
