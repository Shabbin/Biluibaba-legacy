"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/src/components/ui/button";

import { FaPaw } from "react-icons/fa";

import Services from "@/src/app/_components/home/Services";
import ProductCategory from "@/src/app/_components/home/ProductCategory";
import Landing from "@/src/app/_components/home/Landing";
import FeatureProducts from "@/src/app/_components/home/FeatureProducts";
import ExpertVets from "@/src/app/_components/home/ExpertVets";
import Adoptions from "@/src/app/_components/home/Adoptions";
import Testimonials from "@/src/app/_components/home/Testimonials";

import ProductAd from "@/src/components/productad";

import ProductsData from "@/src/app/demo.products";
import VetsData from "@/src/app/demo.vets";
import AdoptionData from "@/src/app/demo.adoptions";

import axios from "@/src/lib/axiosInstance";

let productCategories = [
  {
    src: "/pets/cat.png",
    link: "/products?pet=cat",
  },
  {
    src: "/pets/dog.png",
    link: "/products?pet=dog",
  },
  {
    src: "/pets/fish.png",
    link: "/products?pet=fish",
  },
  {
    src: "/pets/bird.png",
    link: "/products?pet=bird",
  },
  {
    src: "/pets/rabbit.png",
    link: "/products?pet=rabbit",
  },
];

export default function Home() {
  const router = useRouter();

  const [site, setSite] = useState({
    product_landing_slider: [],
    popular_product_category: [],
    featured_product: null,
    product_banner_one: { filename: "", path: "" },
    product_brands_in_spotlight: [],
    vet_landing_slider: [],
    vet_banner_one: { filename: "", path: "" },
    vet_grid_banners: [],
    adoption_banner_one: { filename: "", path: "" },
    adoption_banner_two: { filename: "", path: "" },
    featured_adoptions: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchSiteSettings = async () => {
    try {
      const { data } = await axios.get("/api/admin/site-settings");

      if (data.success) setSite(data.site);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  return (
    <main>
      {!loading && (
        <>
          <div className="p-5">
            <Landing slider={site.product_landing_slider} />
          </div>

          <div className="pt-10">
            <div className="container mx-auto">
              <h2 className="md:text-6xl text-5xl text-center font-bold">
                Popular Category
              </h2>
              <div className="md:py-14 py-10 flex flex-row items-center md:justify-start justify-center flex-wrap gap-y-10">
                {site.popular_product_category.map((category, index) => (
                  <div
                    className="md:basis-1/6 basis-1/3 -me-2 px-2"
                    key={category._id}
                  >
                    <img
                      src={category.image}
                      alt={category.category}
                      className="rounded-lg mx-auto cursor-pointer"
                      onClick={() =>
                        (window.location.href = category.categorySlug)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ProductCategory categories={productCategories} />

          <div className="container md:mx-auto py-10">
            <h1 className="md:text-6xl text-5xl font-bold text-center">
              Feature Products
            </h1>
            <FeatureProducts
              type="featured"
              category="all"
              router={useRouter()}
            />
          </div>

          <div className="py-10">
            <div className="container mx-auto">
              <ProductAd
                title="Product Title"
                desc="Lorem Ipsum is simply dummy text of the printing and typesetting industry"
                buttonText="Shop Now"
              />
            </div>
          </div>

          <div className="container mx-auto py-10">
            <img
              src={site.product_banner_one.path}
              alt="Product Banner 1"
              className="w-full h-full"
            />
          </div>

          <div className="container mx-auto py-10">
            <h1 className="md:text-6xl text-5xl font-bold text-center">
              Best Seller
            </h1>
            <FeatureProducts
              type="featured"
              category="all"
              router={useRouter()}
            />
          </div>

          <div className="container mx-auto py-10">
            <div className="flex flex-row items-center justify-between md:px-0 px-5">
              <h1 className="md:text-6xl text-5xl font-bold">Cat Food</h1>
              <div
                className="text-red-600 font-bold hover:underline text-2xl cursor-pointer transition-all ease-in-out duration-300"
                onClick={() => (window.location.href = "/products?pet=cat")}
              >
                see all
              </div>
            </div>
            <FeatureProducts
              type="featured"
              category="all"
              router={useRouter()}
            />
          </div>

          <div className="container mx-auto py-10">
            <div className="flex flex-row items-center justify-between md:px-0 px-5">
              <h1 className="md:text-6xl text-5xl font-bold">Accessories</h1>
              <div
                className="text-red-600 font-bold hover:underline text-2xl cursor-pointer transition-all ease-in-out duration-300"
                onClick={() => (window.location.href = "/products?pet=cat")}
              >
                see all
              </div>
            </div>
            <FeatureProducts
              type="featured"
              category="all"
              router={useRouter()}
            />
          </div>

          <div className="container mx-auto py-10 md:px-0 px-5">
            <h1 className="md:text-6xl text-5xl font-bold text-center mb-10">
              Brand In Spotlight
            </h1>
            <div className="flex flex-row flex-wrap items-center gap-y-5">
              {site.product_brands_in_spotlight.map((brand, index) => (
                <img
                  src={brand.path}
                  alt={brand.name}
                  className="md:basis-1/5 basis-1/2 -me-2 px-2 md:w-[200px] w-[150px]"
                />
              ))}
            </div>
          </div>

          <div className="py-10 px-5">
            <Landing slider={site.vet_landing_slider} />
          </div>

          <div className="container mx-auto">
            <div className="my-5 py-10">
              <div className="md:text-6xl text-5xl font-bold text-center">
                Get Advice From Expert Vet
              </div>

              <ExpertVets router={useRouter()} VetsData={VetsData} />

              <div className="mx-auto text-center flex justify-center">
                <Button
                  text="See All Vets"
                  type="default"
                  className="mt-10"
                  onClick={() => router.push("/vets")}
                ></Button>
              </div>
            </div>
          </div>

          <div className="container mx-auto py-5">
            <img
              src={site.vet_banner_one.path}
              alt="Vet Banner One"
              className="w-full h-full"
            />
            <div className="flex md:flex-row flex-col gap-5 items-center justify-between mt-5">
              {site.vet_grid_banners.map((banner, index) => (
                <div key={index} className="md:basis-1/3 basis-full">
                  <img
                    src={banner.path}
                    alt={`Vet Banner ${index}`}
                    className="min-w-auto min-h-auto"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="container mx-auto">
            <div className="my-5 pb-20">
              <div className="md:text-6xl text-5xl font-bold text-center">
                Find a Life Long Friend
              </div>

              <Adoptions AdoptionData={AdoptionData} router={useRouter()} />

              <div className="text-center flex justify-center">
                <Button
                  type="default"
                  text="See all Pets"
                  className="font-extrabold text-xl z-30"
                  onClick={() => (window.location.href = "/adoptions")}
                />
              </div>
            </div>
          </div>

          <div className="py-10">
            <div className="container mx-auto">
              <ProductAd
                title="Donate and Save an Animals"
                desc="Lorem Ipsum is simply dummy text of the printing and typesetting industry"
                buttonText="Donate"
              />
            </div>
          </div>

          <Testimonials />

          <div className="container mx-auto py-20 md:px-0 px-5">
            <h2 className="font-bold text-gray-700 text-3xl mb-5">
              Biluibaba: Unleash Joy with Our Online Pet Store
            </h2>
            <div className="flex flex-col gap-10 text-2xl text-gray-500">
              <p>
                Welcome to Biluibaba, your ultimate online pet store in
                Bangladesh! At Biluibaba, we're more than just a pet shop online
                - we're your partners in pet parenting. With a passion for
                enhancing the lives of pets and pet parents with our pet
                products, we offer a wide array of pet essentials that cater to
                your pets' every need.
              </p>
              <p>
                As the best online pet store in Bangladesh, we bring you a
                curated selection of pet products that are not only of the
                highest quality but also designed to make your pets' lives
                happier and healthier.
              </p>
              <p>
                Gone are the days of searching for a "pet store near me" or "pet
                shop near me".With Biluibaba, pet online shopping becomes a
                breeze. Get all your pet supplies delivered in just 120 minutes!
              </p>
              <p>
                As your trusted online pet shop in Bangladesh, we understand the
                unique bond you share with your pets. That's why we ensure that
                every pet product we offer is chosen with care and
                consideration.
              </p>
              <p>
                We take pride in being the best online cat and dog store as
                well. Your pets deserve the best, and we are here to provide it.
                With a variety of cat and dog shop products, you can keep your
                pets wagging their tails with joy.{" "}
              </p>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
