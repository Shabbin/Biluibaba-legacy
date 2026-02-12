"use client";

import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import Product from "@/src/components/product";
import { Product as ProductType } from "@/src/types";

import "swiper/css";

import { PiGreaterThan, PiLessThan } from "react-icons/pi";
import { ArrowLeft, ArrowRight } from "@/src/components/svg";

interface MoreProductsProps {
  products: ProductType[];
  type: string;
}

export default function MoreProducts({ products, type }: MoreProductsProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="relative py-10">
      <div className="absolute h-full w-full flex flex-row items-center justify-between">
        <div
          className="bg-white md:py-14 py-10 rounded-tr-lg rounded-br-lg cursor-pointer hover:bg-neutral-100 transition-all ease-in-out duration-300 shadow z-20"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ArrowLeft className="px-2 text-[3em]" />
        </div>
        <div
          className="bg-white md:py-14 py-10 rounded-tl-lg rounded-bl-lg cursor-pointer hover:bg-neutral-100 transition-all ease-in-out duration-300 shadow z-20"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ArrowRight className="px-2 text-[3em]" />
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
              size={product.size}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
