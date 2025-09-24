"use client";

const ProductCategory = ({ categories }) => {
  return (
    <div className="md:pb-20  md:px-0 px-5">
      <div className="container mx-auto pt-5 pb-20">
        <div className="mb-14">
          <h1 className="md:text-6xl text-5xl font-bold text-center">
            Shop By Pet
          </h1>
        </div>

        <div className="flex flex-row flex-wrap items-center justify-between">
          {categories.map((category, index) => (
            <img
              src={category.src}
              alt={category.name}
              key={index}
              className="md:w-[200px] w-[100px] cursor-pointer md:basis-1/6 basis-1/3 -me-2 px-2"
              onClick={() => (window.location.href = category.link)}
            ></img>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCategory;
