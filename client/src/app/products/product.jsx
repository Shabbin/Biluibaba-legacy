"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Pagination } from "@heroui/pagination";
import { useSearchParams, usePathname } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import axios from "@/src/lib/axiosInstance";

import "swiper/css";
import { PiGreaterThan, PiLessThan } from "react-icons/pi";

import Select from "@/src/components/ui/select";

import Product from "@/src/components/product";

import ProductsData from "@/src/app/demo.products";

import { GiSettingsKnobs } from "react-icons/gi";

import PetData from "@/src/app/products/pet-product.data";

const Products = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pet = searchParams.get("pet");

  const [loading, setLoading] = useState(true);
  const [petData, setPetData] = useState(
    PetData.pets.find((item) => item.name === pet)
  );
  const [selectedCategory, setSelectedCategory] = useState(
    PetData.pets.find((item) => item.name === pet).categories[0]
  );
  const [filter, setFilter] = useState("popularity");
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0); // Current page count (0-based)
  const [productCount, setProductCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1); // Initialize totalPages
  const itemsPerPage = 40; // Fixed number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async (pageCount) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/product/get?parent=${petData.name}&category=${selectedCategory.value[1]}&count=${pageCount}`
      );

      if (data.success) {
        setProducts(data.products);
        setProductCount(data.totalProducts);

        const calculatedTotalPages = Math.ceil(
          data.totalProducts / itemsPerPage
        );

        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        setCount(pageCount);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const newCount = (page - 1) * itemsPerPage; // Calculate new count based on page number
    setCount(newCount);
    fetchProducts(newCount);
    window.scrollTo({ top: 50, behavior: "smooth" }); // Scroll to top on page change
  };

  useEffect(() => {
    if (!pet) router.push("/products?pet=cat");
    fetchProducts(count);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("pet", pet);
    params.set("category", selectedCategory.value[1]);
    if (selectedCategory.value[2]) params.set("sub", selectedCategory.value[2]);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    fetchProducts();
  }, [selectedCategory]);

  return (
    <div>
      <div className="">
        <img src={petData.src} />
      </div>

      <div className="py-10 px-5">
        <div className="flex md:flex-row flex-col items-center justify-between py-8 border-b-2 text-xl md:gap-0 gap-5">
          <div className="flex flex-row items-center gap-2 font-medium basis-1/4 justify-center md:text-xl text-3xl">
            <GiSettingsKnobs size="1.2em" /> Filter
          </div>
          <div className="basis-1/2 text-center md:border-r-2 md:border-l-2 border-t-2 border-b-2 md:border-t-0 md:border-b-0 md:text-xl text-3xl">
            {productCount} Products
          </div>
          <div className="basis-1/4 text-center">
            <Select
              data={[
                { text: "Popularity", value: "popularity" },
                { text: "Price (Low > High)", value: "price-low" },
                { text: "Price (High > Low)", value: "price-high" },
              ]}
              className="!w-auto"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            ></Select>
          </div>
        </div>

        <div className="py-10">
          <CategorySlider
            categories={petData.categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
      </div>

      <div className="flex md:flex-row flex-col m-4 gap-4 ">
        <div className="flex md:flex-row flex-col flex-wrap gap-y-10 items-center justify-start basis-full">
          {loading ? (
            <div>Loading...</div>
          ) : (
            products.map((product) => (
              <div className="md:basis-1/4 basis-full" key={product._id}>
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
              </div>
            ))
          )}
          {products.length <= 0 && (
            <div className="text-xl font-bold text-gray-500 text-center uppercase mx-auto py-5">
              No Products
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center justify-center py-5">
        {!loading && totalPages > 1 && (
          <Pagination
            total={totalPages}
            initialPage={currentPage}
            page={currentPage}
            variant="flat"
            classNames={{
              cursor: "bg-zinc-950 border-zinc-950 ",
            }}
            showControls
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Products;

const CategorySlider = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const swiperRef = useRef(null);

  return (
    <div className="relative">
      <div className="absolute h-full w-full flex flex-row items-center justify-between">
        <div
          className="bg-white z-20 py-14 rounded-tr-lg rounded-br-lg cursor-pointer hover:bg-neutral-100 transition-all ease-in-out duration-300"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <PiLessThan size="3em" className="px-2" />
        </div>
        <div
          className="bg-white z-20 py-14 rounded-tl-lg rounded-bl-lg cursor-pointer hover:bg-neutral-100 transition-all ease-in-out duration-300"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <PiGreaterThan size="3em" className="px-2" />
        </div>
      </div>
      <Swiper
        className="z-10"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        loop={true}
        modules={[Autoplay, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: true }}
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
      >
        {categories.map((category, index) => (
          <SwiperSlide key={index}>
            <div
              className={
                "border-2 p-5 flex flex-col items-center justify-center gap-2 cursor-pointer " +
                (category.name === selectedCategory.name &&
                  "border-b-8 border-b-black")
              }
              onClick={() => setSelectedCategory(category)}
            >
              <img
                src={category.src}
                alt={category.name}
                className="w-[100px]"
              />
              <div>{category.name}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
