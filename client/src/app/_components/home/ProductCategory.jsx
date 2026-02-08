"use client";

const ProductCategory = ({ categories }) => {
  return (
    <div className="md:pb-20 md:px-0 px-5 bg-petzy-periwinkle-light">
      <div className="container mx-auto pt-5 pb-20">
        <div className="mb-10 md:mb-14">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-petzy-slate">
            Shop By Pet
          </h1>
        </div>

        <div className="flex flex-row flex-wrap items-center justify-between gap-y-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="md:basis-1/6 basis-1/3 px-2 transform transition-all duration-300 hover:scale-110 cursor-pointer"
            >
              <div className="bg-white rounded-3xl shadow-soft hover:shadow-soft-lg p-4 transition-all duration-300">
                <img
                  src={category.src}
                  alt={category.name}
                  className="md:w-[200px] w-[100px] mx-auto"
                  onClick={() => (window.location.href = category.link)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCategory;
