"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/src/components/ui/button";
import { FaArrowRight, FaStar } from "react-icons/fa6"; // Added icons
import { WavyDivider } from "../components/ui";

// Components
import Services from "@/src/app/_components/home/Services";
import ProductCategory from "@/src/app/_components/home/ProductCategory";
import Landing from "@/src/app/_components/home/Landing";
import FeatureProducts from "@/src/app/_components/home/FeatureProducts";
import ExpertVets from "@/src/app/_components/home/ExpertVets";
import Adoptions from "@/src/app/_components/home/Adoptions";
import Testimonials from "@/src/app/_components/home/Testimonials";
import ProductAd from "@/src/components/productad";

// Data & Libs
import ProductsData from "@/src/app/demo.products";
import VetsData from "@/src/app/demo.vets";
import AdoptionData from "@/src/app/demo.adoptions";
import axios from "@/src/lib/axiosInstance";

const productCategories = [
  { src: "/pets/cat.png", link: "/products?pet=cat" },
  { src: "/pets/dog.png", link: "/products?pet=dog" },
  { src: "/pets/fish.png", link: "/products?pet=fish" },
  { src: "/pets/bird.png", link: "/products?pet=bird" },
  { src: "/pets/rabbit.png", link: "/products?pet=rabbit" },
];

// Helper for Section Headers
const SectionHeader = ({ title, seeAllLink }) => (
  <div className="flex flex-row items-end justify-between mb-8 md:mb-12 px-2 border-b border-petzy-slate/5 pb-4">
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-petzy-slate relative">
      {title}
      <span className="absolute -bottom-4 left-0 w-1/3 h-1 bg-petzy-coral rounded-full"></span>
    </h2>
    {seeAllLink && (
      <Link
        href={seeAllLink}
        className="group flex items-center gap-2 text-petzy-coral font-bold hover:text-petzy-slate transition-colors duration-300"
      >
        <span>See all</span>
        <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
      </Link>
    )}
  </div>
);

export default function Home() {
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    // A simple skeleton or loader could go here
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <main className="bg-white overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-gradient-to-b from-petzy-blue-light to-white pb-0 relative">
        <div className="pt-8 px-4 md:px-8 max-w-[1400px] mx-auto">
          <Landing slider={site.product_landing_slider} />
        </div>
        <div className="text-white relative z-10 -mb-2 mt-8 opacity-50">
           {/* Optional: Add a subtle curve here if desired, or keep clean */}
        </div>
      </div>

      {/* --- POPULAR CATEGORIES --- */}
      <section className="py-16 bg-white relative">
        <div className="container mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-petzy-slate mb-4">
              Popular Categories
            </h2>
            <p className="text-petzy-slate-light max-w-2xl mx-auto">
              Find exactly what you need for your furry, feathered, or scaled friends.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {site.popular_product_category.map((category) => (
              <div
                key={category._id}
                onClick={() => router.push(category.categorySlug)}
                className="group cursor-pointer flex flex-col items-center"
              >
                <div className="w-full aspect-square bg-petzy-blue-light/30 rounded-full p-4 mb-4 transition-all duration-300 group-hover:bg-petzy-coral/10 group-hover:scale-105 shadow-sm group-hover:shadow-md flex items-center justify-center border border-transparent group-hover:border-petzy-coral/20">
                  <img
                    src={category.image}
                    alt={category.category}
                    className="w-3/4 h-3/4 object-contain transition-transform duration-500 group-hover:rotate-3"
                  />
                </div>
                <h3 className="font-bold text-petzy-slate group-hover:text-petzy-coral transition-colors">
                  {category.category}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- QUICK LINKS (ICONS) --- */}
      <div className="container mx-auto px-5 mb-16">
        <ProductCategory categories={productCategories} />
      </div>

      {/* --- FEATURED PRODUCTS --- */}
      <section className="container mx-auto px-5 mb-20">
        <SectionHeader title="Featured Products" />
        <FeatureProducts type="featured" category="all" />
      </section>

      {/* --- PROMOTIONAL AD 1 --- */}
      <section className="py-16 bg-petzy-yellow-soft/30 my-10 relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-petzy-yellow-soft rounded-full blur-3xl opacity-50"></div>
        <div className="container mx-auto px-5 relative z-10">
          <ProductAd
            title="Treat Them Right"
            desc="Premium nutrition choices for your beloved pets with exclusive discounts."
            buttonText="Shop Now"
          />
        </div>
      </section>

      {/* --- BIG BANNER --- */}
      <section className="container mx-auto px-5 mb-20">
        <div className="rounded-3xl overflow-hidden shadow-soft-lg group">
          <img
            src={site.product_banner_one.path}
            alt="Season Special"
            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
      </section>

      {/* --- BEST SELLERS --- */}
      <section className="container mx-auto px-5 mb-20">
        <SectionHeader title="Best Sellers" />
        <FeatureProducts type="featured" category="all" />
      </section>

      {/* --- SPECIFIC CATEGORIES --- */}
      <section className="container mx-auto px-5 mb-20">
        <SectionHeader title="Cat Food" seeAllLink="/products?pet=cat" />
        <FeatureProducts type="featured" category="all" />
      </section>

      <section className="container mx-auto px-5 mb-24">
        <SectionHeader title="Accessories" seeAllLink="/products?pet=cat" />
        <FeatureProducts type="featured" category="all" />
      </section>

      {/* --- BRAND SPOTLIGHT --- */}
      <section className="bg-petzy-slate/5 py-16 mb-20">
        <div className="container mx-auto px-5">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 text-petzy-slate">
            Brands In Spotlight
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 items-center">
            {site.product_brands_in_spotlight.map((brand, index) => (
              <div 
                key={index} 
                className="w-1/3 md:w-1/6 p-4 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer grayscale hover:grayscale-0 opacity-80 hover:opacity-100"
              >
                <img
                  src={brand.path}
                  alt={brand.name}
                  className="w-full h-auto object-contain aspect-[3/2]"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- VET SECTION --- */}
      <div className="relative">
        {/* Wavy Top */}
        <div className="text-petzy-periwinkle-light -mb-1 relative z-20">
           <WavyDivider flip={false} />
        </div>
        
        <div className="bg-petzy-periwinkle-light pt-10 pb-20 px-5">
           <div className="container mx-auto mb-10">
              <Landing slider={site.vet_landing_slider} />
           </div>
           
           <div className="container mx-auto bg-white/60 backdrop-blur-md rounded-[3rem] p-8 md:p-12 shadow-xl border border-white">
              <div className="text-center mb-10">
                <div className="inline-block bg-petzy-coral text-white px-4 py-1 rounded-full text-sm font-bold mb-4 uppercase tracking-wider">Health First</div>
                <h2 className="text-3xl md:text-5xl font-bold text-petzy-slate">
                  Expert Veterinary Advice
                </h2>
              </div>

              <ExpertVets VetsData={VetsData} />

              <div className="flex justify-center mt-12">
                <Link href="/vets">
                  <Button
                    text="Book a Consultation"
                    type="default"
                    className="shadow-lg shadow-petzy-coral/30"
                  />
                </Link>
              </div>
           </div>
        </div>

         {/* Wavy Bottom */}
         <div className="text-petzy-periwinkle-light -mt-1 relative z-20 transform rotate-180">
           <WavyDivider flip={false} />
        </div>
      </div>

      {/* --- VET BANNERS GRID --- */}
      <section className="container mx-auto px-5 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 rounded-3xl overflow-hidden shadow-soft group">
            <img
              src={site.vet_banner_one.path}
              alt="Vet Services"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          {site.vet_grid_banners.map((banner, index) => (
            <div key={index} className="rounded-3xl overflow-hidden shadow-soft group h-64 md:h-80">
              <img
                src={banner.path}
                alt={`Vet Banner ${index}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* --- ADOPTION SECTION --- */}
      <section className="container mx-auto px-5 mb-20">
        <div className="text-center mb-12">
           <FaStar className="inline-block text-petzy-yellow text-4xl mb-4" />
           <h2 className="text-4xl lg:text-5xl font-bold text-petzy-slate mb-4">Find a Lifelong Friend</h2>
           <p className="text-petzy-slate-light">Open your heart and home to a pet in need.</p>
        </div>

        <Adoptions AdoptionData={AdoptionData} />

        <div className="flex justify-center mt-12">
          <Link href="/adoptions">
            <Button
              type="default"
              text="View All Adoptions"
              className="font-bold text-lg px-10 py-4 shadow-xl shadow-petzy-coral/20"
            />
          </Link>
        </div>
      </section>

      {/* --- DONATION AD --- */}
      <section className="py-16 bg-petzy-mint-light relative overflow-hidden">
        <div className="container mx-auto px-5 relative z-10">
          <ProductAd
            title="Donate and Save Animals"
            desc="Your contribution provides food, shelter, and medical care for rescued animals."
            buttonText="Donate Now"
          />
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-10">
        <Testimonials />
      </section>

      {/* --- SEO / ABOUT TEXT --- */}
      <section className="bg-petzy-slate/5 py-20 border-t border-petzy-slate/10">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="font-bold text-petzy-slate text-2xl md:text-3xl mb-8 text-center">
            Biluibaba: Unleash Joy with Our Online Pet Store
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-petzy-slate-light leading-relaxed text-sm md:text-base text-justify">
            <div>
              <p className="mb-4">
                Welcome to Biluibaba, your ultimate online pet store in Bangladesh! We're more than just a shop; we're partners in your pet parenting journey. Passionate about enhancing lives, we offer essentials catering to every need.
              </p>
              <p className="mb-4">
                As the premier online pet store, our curated selection ensures quality and happiness. Gone are the days of searching "pet store near me"—we deliver in just 120 minutes!
              </p>
            </div>
            <div>
              <p className="mb-4">
                We understand the unique bond you share with your pets. Every product is chosen with care. We take pride in being the best destination for cats and dogs alike.
              </p>
              <p>
                With a variety of products, keep tails wagging and purrs rumbling. Trust Biluibaba for transparency, speed, and love.
              </p>
            </div>
          </div>
        </div>
      </section>
      
    </main>
  );
}