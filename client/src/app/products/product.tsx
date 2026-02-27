"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

// Assuming you still want to use HeroUI pagination as it handles state well, 
// but wrapped in a stunning container.
import { Pagination } from "@heroui/pagination"; 

import { FaChevronLeft, FaChevronRight, FaFilter } from "react-icons/fa6";

// Shadcn UI Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

import axios from "@/src/lib/axiosInstance";
import { CardSkeleton, NoProductsFound } from "@/src/components/ui";
import Product from "@/src/components/product";

import type { 
  Product as ProductType, 
  PetProductCategory, 
  PetProductEntry, 
  PetProductData 
} from "@/src/types";

import PetData from "@/src/app/products/pet-product.data";

const typedPetData = PetData as PetProductData;

const Products: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pet = searchParams.get("pet");

  const [loading, setLoading] = useState<boolean>(true);
  
  const [petData, setPetData] = useState<PetProductEntry | undefined>(
    typedPetData.pets.find((item) => item.name === pet)
  );
  
  const [selectedCategory, setSelectedCategory] = useState<PetProductCategory>(
    typedPetData.pets.find((item) => item.name === pet)?.categories[0] || { name: "", value: [], src: "" }
  );
  
  const [filter, setFilter] = useState<string>("popularity");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [count, setCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 40;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchProducts = async (pageCount?: number) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/product/get?parent=${petData?.name}&category=${selectedCategory.value[1]}&count=${pageCount ?? count}`
      );

      if (data.success) {
        setProducts(data.products);
        setProductCount(data.totalProducts);

        const calculatedTotalPages = Math.ceil(data.totalProducts / itemsPerPage);
        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        
        if (pageCount !== undefined) setCount(pageCount);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const newCount = (page - 1) * itemsPerPage;
    setCount(newCount);
    fetchProducts(newCount);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  useEffect(() => {
    if (!pet) {
       router.push("/products?pet=cat");
    } else {
       fetchProducts(count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (pet) params.set("pet", pet);
    params.set("category", selectedCategory.value[1]);
    if (selectedCategory.value[2]) params.set("sub", selectedCategory.value[2]);
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    fetchProducts(0); // Reset count on category change
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Top Banner */}
      {petData?.src && (
         <div className="container mx-auto px-4 md:px-8 py-8">
            <div className="rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 bg-white">
               <img 
                  src={petData.src} 
                  alt={`${pet} banner`}
                  className="w-full h-auto max-h-[300px] object-cover mix-blend-multiply" 
               />
            </div>
         </div>
      )}

      <div className="container mx-auto px-4 md:px-8">
        
        {/* --- Toolbar / Filter Bar (Shadcn styling) --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 text-petzy-slate font-bold text-lg md:w-1/3">
            <FaFilter className="text-petzy-coral" /> 
            <span>Filters</span>
          </div>

          <div className="text-center font-semibold text-gray-500 bg-gray-50 px-6 py-2 rounded-full md:w-1/3">
            Showing <span className="text-petzy-slate font-bold">{productCount}</span> Products
          </div>

          <div className="flex justify-end md:w-1/3 w-full">
             {/* Shadcn Select Component */}
             <Select value={filter} onValueChange={(val) => setFilter(val)}>
               <SelectTrigger className="w-[200px] bg-white border-gray-200 shadow-none focus:ring-petzy-coral/20">
                 <SelectValue placeholder="Sort by..." />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="popularity">Popularity</SelectItem>
                 <SelectItem value="price-low">Price (Low to High)</SelectItem>
                 <SelectItem value="price-high">Price (High to Low)</SelectItem>
               </SelectContent>
             </Select>
          </div>
        </div>

        {/* --- Category Slider --- */}
        <div className="mb-12">
          <CategorySlider
            categories={petData?.categories || []}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {/* --- Product Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               <CardSkeleton count={8} type="product" />
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full py-12">
              <NoProductsFound onReset={() => window.location.reload()} />
            </div>
          ) : (
            products.map((product, index) => (
              <React.Fragment key={product._id}>
                {/* Product Card */}
                <div className="h-full">
                  <Product
                    id={product._id}
                    name={product.name}
                    src={product.images?.[0]?.path || "/placeholder.png"}
                    price={product.price}
                    discount={product.discount}
                    category={product.category}
                    description={product.description}
                    slug={product.slug}
                  />
                </div>

                {/* Injected Promotional Banner */}
                {(index + 1) % 8 === 0 && index !== products.length - 1 && (
                  <div className="col-span-full my-8 rounded-3xl overflow-hidden shadow-soft border border-gray-100">
                    <img
                      src="/shop-banner.png"
                      alt="Shop Promotional Banner"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </div>

        {/* --- Pagination --- */}
        {!loading && totalPages > 1 && (
           <div className="flex justify-center mt-16 pb-8">
              <div className="bg-white p-2 rounded-full shadow-sm border border-gray-100">
                 <Pagination
                   total={totalPages}
                   initialPage={currentPage}
                   page={currentPage}
                   variant="flat"
                   color="danger" // Closest HeroUI equivalent to your Coral theme
                   classNames={{
                     cursor: "bg-petzy-coral text-white font-bold",
                   }}
                   showControls
                   onChange={handlePageChange}
                 />
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default Products;

// --- Sub-components ---

interface CategorySliderProps {
  categories: PetProductCategory[];
  selectedCategory: PetProductCategory;
  setSelectedCategory: (category: PetProductCategory) => void;
}

const CategorySlider: React.FC<CategorySliderProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="relative group">
      {/* Navigation Buttons (Appear on Hover) */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-petzy-slate hover:text-petzy-coral hover:scale-110 transition-all border border-gray-100"
        >
          <FaChevronLeft />
        </button>
      </div>
      
      <div className="absolute top-1/2 -translate-y-1/2 -right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-petzy-slate hover:text-petzy-coral hover:scale-110 transition-all border border-gray-100"
        >
          <FaChevronRight />
        </button>
      </div>

      <Swiper
        className="px-2 py-4"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        loop={categories.length > 6} // Only loop if there are enough items
        modules={[Autoplay, Navigation]}
        autoplay={{ delay: 4000, disableOnInteraction: true }}
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 16 },
          480: { slidesPerView: 3, spaceBetween: 16 },
          768: { slidesPerView: 5, spaceBetween: 20 },
          1024: { slidesPerView: 6, spaceBetween: 24 },
        }}
      >
        {categories.map((category, index) => {
          const isActive = category.name === selectedCategory.name;

          return (
            <SwiperSlide key={index} className="py-2">
              <div
                onClick={() => setSelectedCategory(category)}
                className={`
                  flex flex-col items-center justify-center h-40 md:h-48 p-4 cursor-pointer 
                  rounded-3xl border transition-all duration-300 transform 
                  ${isActive 
                    ? "bg-petzy-coral/5 border-petzy-coral shadow-md scale-105" 
                    : "bg-white border-gray-100 shadow-sm hover:border-petzy-coral/30 hover:shadow-md hover:-translate-y-1"
                  }
                `}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 mb-3 bg-white rounded-full p-2 shadow-sm flex items-center justify-center mix-blend-multiply">
                   <img
                     src={category.src}
                     alt={category.name}
                     className="w-full h-full object-contain"
                   />
                </div>
                <div className={`text-center text-sm md:text-base font-bold ${isActive ? "text-petzy-coral" : "text-petzy-slate"}`}>
                  {category.name}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};