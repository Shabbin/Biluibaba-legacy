'use client';

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import type { SwiperClass } from 'swiper/types';

import Product from '@/src/components/product';

import 'swiper/css';

import { ArrowLeft, ArrowRight } from '@/src/components/svg';

interface ProductImage {
  path: string;
  filename?: string;
}

interface ProductData {
  _id: string;
  id: string;
  name: string;
  images: ProductImage[];
  price: number;
  discount: number;
  category: string;
  description: string;
  slug: string;
  size?: string;
}

interface MoreProductsProps {
  products: ProductData[];
  type?: string;
}

const MoreProducts: React.FC<MoreProductsProps> = ({ products, type }) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const router = useRouter();

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
              src={product.images[0]?.path || ''}
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
};

export default MoreProducts;
