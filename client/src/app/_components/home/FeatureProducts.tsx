"use client";

import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import toast from "react-hot-toast";
import type { Swiper as SwiperType } from "swiper";

import axiosInstance from "@/src/lib/axiosInstance";

import Product from "@/src/components/product";
import ProductLoading from "@/src/components/loading/product";
import { Product as ProductType } from "@/src/types";

import "swiper/css";
import { PiGreaterThan, PiLessThan } from "react-icons/pi";
import { ArrowRight, ArrowLeft } from "@/src/components/svg";

interface FeatureProductsProps {
  category: string;
  type: string;
}

const FeatureProducts: React.FC<FeatureProductsProps> = ({ category, type }) => {
  const swiperRef = useRef<SwiperType | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<ProductType[]>([]);

  const fetchProducts = async () => {
    try {
      let { data } = await axiosInstance.get(
        `/api/product/${type}/${category}`
      );
      if (data.success) setProducts(data.products);
    } catch (error) {
      console.log(error);
      return toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return loading ? (
    <ProductLoading />
  ) : (
    <div className="relative py-10">
      <div className="absolute h-full w-full flex flex-row items-center justify-between">
        <div
          className="bg-white md:py-14 py-10 rounded-pill cursor-pointer hover:bg-petzy-mint-light transition-all ease-in-out duration-300 shadow-soft hover:shadow-soft-lg z-20"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ArrowLeft className="px-3 text-[3em] text-petzy-slate-light" />
        </div>
        <div
          className="bg-white md:py-14 py-10 rounded-pill cursor-pointer hover:bg-petzy-mint-light transition-all ease-in-out duration-300 shadow-soft hover:shadow-soft-lg z-20"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ArrowRight className="px-3 text-[3em] text-petzy-slate-light" />
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
};

export default FeatureProducts;
