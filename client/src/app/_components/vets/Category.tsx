"use client";

import Link from "next/link";

interface VetCategoryItem {
  name: string;
  link: string;
  src: string;
}

interface VetCategoryProps {
  categories: VetCategoryItem[];
}

const Category: React.FC<VetCategoryProps> = ({ categories }) => {
  return (
    <div className="md:px-0 px-5">
      <div className="container mx-auto pt-5 pb-20">
        <div className="mb-10">
          <h1 className="md:text-4xl text-3xl font-bold text-center">
            Services
          </h1>
        </div>

        <div className="flex flex-row flex-wrap items-center justify-between">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.link}
              className="md:w-[200px] w-[100px] cursor-pointer md:basis-1/6 basis-1/3 -me-2 px-2"
            >
              <img
                src={category.src}
                alt={category.name}
                className="w-full hover:scale-105 transition-transform duration-300"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
