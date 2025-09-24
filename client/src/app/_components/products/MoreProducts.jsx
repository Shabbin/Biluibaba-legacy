"use client";

import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useRouter } from "next/navigation";

import Product from "@/src/components/product";

import "swiper/css";

import { PiGreaterThan, PiLessThan } from "react-icons/pi";

export default function MoreProducts({ products, type }) {
  const swiperRef = useRef(null);
  const router = useRouter();

  return (
    <div className="relative py-10">
      <div className="absolute h-full w-full flex flex-row items-center justify-between">
        <div
          className="bg-white py-14 rounded-tr-lg rounded-br-lg cursor-pointer hover:bg-neutral-100 transition-all ease-in-out duration-300 shadow z-20"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <PiLessThan size="3em" className="px-2" />
        </div>
        <div
          className="bg-white py-14 rounded-tl-lg rounded-bl-lg cursor-pointer hover:bg-neutral-100 transition-all ease-in-out duration-300 shadow z-20"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <PiGreaterThan size="3em" className="px-2" />
        </div>
      </div>
      <Swiper
        className="z-10"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
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
        spaceBetween={10}
        loop={true}
      >
        {products.map((product) => (
          <SwiperSlide key={product._id} className="md:px-0 px-10">
            <Product
              id={product.id}
              name={product.name}
              src={product.images[0].path}
              price={product.price}
              discount={product.discount}
              category={product.category}
              description={product.description}
              slug={product.slug}
              router={router}
              size={product.size}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
