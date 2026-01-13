'use client';

import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Pagination } from '@heroui/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import type { SwiperClass } from 'swiper/types';

import axios from '@/src/lib/axiosInstance';

import 'swiper/css';
import { Filter, ArrowLeft, ArrowRight } from '@/src/components/svg';

import Select from '@/src/components/ui/select';
import ProductComponent from '@/src/components/product';
import PetData from '@/src/app/products/pet-product.data';

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

interface CategoryData {
  name: string;
  src: string;
  value: string[];
}

interface PetDataItem {
  name: string;
  src: string;
  categories: CategoryData[];
}

interface CategorySliderProps {
  categories: CategoryData[];
  selectedCategory: CategoryData;
  setSelectedCategory: (category: CategoryData) => void;
}

const Products: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pet = searchParams.get('pet');

  const [loading, setLoading] = useState<boolean>(true);
  const [petData, setPetData] = useState<PetDataItem | undefined>(
    PetData.pets.find((item: PetDataItem) => item.name === pet)
  );
  const [selectedCategory, setSelectedCategory] = useState<CategoryData>(
    PetData.pets.find((item: PetDataItem) => item.name === pet)?.categories[0] || {
      name: '',
      src: '',
      value: [],
    }
  );
  const [filter, setFilter] = useState<string>('popularity');
  const [products, setProducts] = useState<ProductData[]>([]);
  const [count, setCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 40;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchProducts = async (pageCount: number = 0): Promise<void> => {
    if (!petData) return;
    
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/product/get?parent=${petData.name}&category=${selectedCategory.value[1]}&count=${pageCount}`
      );

      if (data.success) {
        setProducts(data.products);
        setProductCount(data.totalProducts);

        const calculatedTotalPages = Math.ceil(data.totalProducts / itemsPerPage);
        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        setCount(pageCount);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    const newCount = (page - 1) * itemsPerPage;
    setCount(newCount);
    fetchProducts(newCount);
    window.scrollTo({ top: 50, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!pet) router.push('/products?pet=cat');
    fetchProducts(count);
  }, []);

  useEffect(() => {
    if (!pet || !selectedCategory) return;
    
    const params = new URLSearchParams();
    params.set('pet', pet);
    params.set('category', selectedCategory.value[1]);
    if (selectedCategory.value[2]) params.set('sub', selectedCategory.value[2]);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    fetchProducts();
  }, [selectedCategory]);

  if (!petData) {
    return <div className="text-center py-20">Loading pet data...</div>;
  }

  return (
    <div>
      <div className="py-5 px-10">
        <img src={petData.src} alt={petData.name} />
      </div>

      <div className="py-10 px-5">
        <div className="flex md:flex-row flex-col items-center justify-between py-8 border-b-2 text-xl md:gap-0 gap-5">
          <div className="flex flex-row items-center gap-2 font-medium basis-1/6 justify-center md:text-xl text-3xl">
            <Filter className="text-[1.2em]" /> Filter
          </div>
          <div className="basis-2/3 text-center md:border-r-2 md:border-l-2 border-t-2 border-b-2 md:border-t-0 md:border-b-0 md:text-xl text-3xl font-semibold">
            {productCount} Products
          </div>
          <div className="basis-1/6 text-center">
            <Select
              data={[
                { text: 'Popularity', value: 'popularity' },
                { text: 'Price (Low > High)', value: 'price-low' },
                { text: 'Price (High > Low)', value: 'price-high' },
              ]}
              className="!w-auto"
              value={filter}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                setFilter(event.target.value)
              }
            />
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

      <div className="flex md:flex-row flex-col m-4 gap-4">
        <div className="flex md:flex-row flex-col flex-wrap gap-y-10 items-center justify-start basis-full">
          {loading ? (
            <div>Loading...</div>
          ) : (
            products.map((product, index) => (
              <React.Fragment key={product._id}>
                <div className="md:basis-1/4 basis-full">
                  <ProductComponent
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
                </div>
                {(index + 1) % 8 === 0 && index !== products.length - 1 && (
                  <div className="w-full md:my-8 my-2 md:px-12 px-0">
                    <img
                      src="/shop-banner.png"
                      alt="Shop Banner"
                      className="rounded-lg w-full"
                    />
                  </div>
                )}
              </React.Fragment>
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
              cursor: 'bg-zinc-950 border-zinc-950',
            }}
            showControls
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

const CategorySlider: React.FC<CategorySliderProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <div className="relative">
      <div className="absolute h-full w-full flex flex-row items-center justify-between">
        <div
          className="bg-white z-20 py-4 rounded-tr-lg rounded-br-lg cursor-pointer hover:bg-neutral-100 transition-all ease-in-out duration-300"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ArrowLeft className="px-2 text-[3em]" />
        </div>
        <div
          className="bg-white z-20 py-4 rounded-tl-lg rounded-bl-lg cursor-pointer hover:bg-neutral-100 transition-all ease-in-out duration-300"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ArrowRight className="px-2 text-[3em]" />
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
            slidesPerView: 6,
          },
        }}
      >
        {categories.map((category, index) => (
          <SwiperSlide key={index}>
            <div
              className={
                'border-2 p-5 h-[200px] flex flex-col items-center justify-center gap-4 cursor-pointer ' +
                (category.name === selectedCategory.name &&
                  'border-b-8 border-b-black')
              }
              onClick={() => setSelectedCategory(category)}
            >
              <img
                src={category.src}
                alt={category.name}
                className="w-[80px] h-[80px] object-contain"
              />
              <div className="text-center font-semibold">{category.name}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Products;
