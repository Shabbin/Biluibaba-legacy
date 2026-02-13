"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RiVipCrownFill } from "react-icons/ri";
import type { ApiAxiosError } from "@/src/types";

// Components
import Button from "@/src/components/ui/button";
import ExpertVets from "@/src/app/_components/vets/ExpertVets";
import Testimonials from "../_components/home/Testimonials";
import Accordion from "@/src/components/ui/accordion";

// Data & Libs
import axios from "@/src/lib/axiosInstance";
import faqData from "@/src/data/faqData";
import Link from "next/link";

// Restored Image Data
const vetCategories = [
  { label: "Online Vet", src: "/vets/vet-online.png", link: "/vets/browse?type=online" },
  { label: "Clinic Visit", src: "/vets/vet-physical.png", link: "/vets/browse?type=physical" },
  { label: "Home Service", src: "/vets/vet-home.png", link: "/vets/browse?type=homeService" },
  { label: "Emergency", src: "/vets/emergency.png", link: "/vets/browse?type=emergency" },
  { label: "Vaccination", src: "/vets/vaccination.png", link: "/vets/browse?type=vaccine" },
  { label: "Spay/Neuter", src: "/vets/spay-neuter.png", link: "/vets/browse?type=spay-neuter" },
];

const Vet = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [site, setSite] = useState<{
    vet_landing_slider: string[];
    vet_banner_one: { filename: string; path: string };
  }>({
    vet_landing_slider: [],
    vet_banner_one: { filename: "", path: "" },
  });

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const { data } = await axios.get("/api/admin/site-settings");
        if (data.success) setSite(data.site);
      } catch (error: unknown) {
        console.error(error as ApiAxiosError);
      } finally {
        setLoading(false);
      }
    };
    fetchSiteSettings();
  }, []);

  return (
    <div className="bg-white">
      
      {/* --- HERO SECTION (GRID, NO SLIDER) --- */}
      <div className="bg-gradient-to-b from-petzy-periwinkle-light to-white pb-20">
        {!loading && site.vet_landing_slider && site.vet_landing_slider.length > 0 && (
           <div className="pt-8 px-4 md:px-8 max-w-[1400px] mx-auto">
             {/* Dynamic Grid Layout for Hero Images */}
             <div className={`grid gap-6 ${
                site.vet_landing_slider.length === 1 ? 'grid-cols-1' : 
                site.vet_landing_slider.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
             }`}>
               {site.vet_landing_slider.map((slide, index) => (
                 <div key={index} className="rounded-3xl overflow-hidden shadow-soft-lg group">
                   <img 
                      src={slide.path || slide} 
                      alt="Vet Service Highlight" 
                      className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-500" 
                   />
                 </div>
               ))}
             </div>
           </div>
        )}

        {/* Categories (Images) */}
        <div className="container mx-auto px-5 mt-16">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {vetCategories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => router.push(cat.link)}
                className="group flex flex-col items-center cursor-pointer"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-3xl shadow-soft group-hover:shadow-xl border border-white/60 flex items-center justify-center p-4 transition-all duration-300 transform group-hover:-translate-y-2">
                  <img 
                    src={cat.src} 
                    alt={cat.label} 
                    className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110" 
                  />
                </div>
                <span className="mt-4 font-bold text-petzy-slate text-sm md:text-base group-hover:text-petzy-coral transition-colors">
                  {cat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- VALUE PROPOSITION --- */}
      <section className="container mx-auto px-5 py-20 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <img
              src="/logo-black.png"
              alt="Biluibaba Logo"
              className="w-48 mx-auto lg:mx-0 opacity-90"
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-petzy-slate leading-tight">
              Your Partner in <br />
              <span className="text-petzy-coral relative inline-block">
                Pet Health
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-petzy-yellow/40 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-petzy-slate-light leading-relaxed max-w-xl mx-auto lg:mx-0">
              Access expert veterinary care from the comfort of your home. 24/7 Online consultations, instant prescriptions, and trusted advice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                text="Consult Now"
                className="px-8 py-4 text-lg shadow-xl shadow-petzy-coral/20"
                onClick={() => router.push("/vets/browse")}
              />
              <button className="px-8 py-4 rounded-full font-bold text-petzy-slate border-2 border-gray-200 hover:border-petzy-coral hover:text-petzy-coral transition-all">
                Learn More
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
             <div className="absolute inset-0 bg-petzy-blue-light/30 rounded-full blur-3xl transform translate-x-10 translate-y-10 -z-10"></div>
             <img src="/vet1.png" alt="Happy Vet" className="w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
      </section>

      {/* --- BANNER 1 (Fixed Cropping) --- */}
      <div className="container mx-auto px-5 mb-24">
         <div className="rounded-[2.5rem] overflow-hidden shadow-2xl group hover:shadow-3xl transition-shadow duration-300">
            {/* Removed object-cover, used h-auto to respect aspect ratio */}
            <img
              src={site.vet_banner_one.path}
              alt="Vet Banner One"
              className="w-full h-auto block"
            />
         </div>
      </div>

      {/* --- SERVICE HIGHLIGHT: ONLINE --- */}
      <section className="bg-petzy-mint-light/30 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="container mx-auto px-5 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 order-2 lg:order-1">
               <img src="/vet2.png" alt="Online Consultation" className="w-3/4 mx-auto drop-shadow-xl rounded-3xl" />
            </div>
            <div className="lg:w-1/2 order-1 lg:order-2 space-y-6">
              <span className="text-sm font-bold text-petzy-coral uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm">Online Consultation</span>
              <h2 className="text-4xl md:text-5xl font-bold text-petzy-slate leading-tight">
                Expert Advice, <br /> Just a Click Away.
              </h2>
              <p className="text-lg text-petzy-slate-light">
                Connect with certified veterinarians via video call. Get diagnosis, prescriptions, and behavioral advice instantly.
              </p>
              <Button
                  text="Book Online Session"
                  type="default"
                  className="px-8 py-3"
                  onClick={() => router.push("/vets/browse?type=online")}
                />
            </div>
          </div>
        </div>
      </section>

      {/* --- PROMO BANNER (Fixed Cropping) --- */}
      <div className="container mx-auto px-5 my-24">
         <div className="rounded-[2.5rem] overflow-hidden shadow-soft">
           <img src="/vet3.png" alt="Promo" className="w-full h-auto block" />
         </div>
      </div>

      {/* --- SERVICE HIGHLIGHT: OFFLINE --- */}
      <section className="container mx-auto px-5 py-12 mb-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-6">
             <span className="text-sm font-bold text-petzy-slate uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">In-Person Care</span>
             <h2 className="text-4xl md:text-5xl font-bold text-petzy-slate leading-tight">
               Visit Our Trusted <br /> Partner Clinics.
             </h2>
             <p className="text-lg text-petzy-slate-light">
               Prefer a physical checkup? Book appointments at top-rated veterinary clinics near you without the wait.
             </p>
             <Button
                text="Find Clinics Nearby"
                type="outline"
                className="px-8 py-3"
                onClick={() => router.push("/vets/browse?type=physical")}
              />
          </div>
          <div className="lg:w-1/2">
             <img src="/vet4.png" alt="Clinic Visit" className="w-3/4 mx-auto drop-shadow-xl rounded-3xl" />
          </div>
        </div>
      </section>

      {/* --- IMAGE GALLERY GRID (Fixed Cropping) --- */}
      <div className="container mx-auto px-5 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['/vets/vet-homepage-3.png', '/vets/vet-homepage-2.png', '/vets/vet-homepage-1.png'].map((src, i) => (
             <div key={i} className="rounded-3xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300">
                {/* Changed object-cover to h-auto to show full image content */}
                <img src={src} alt={`Gallery ${i}`} className="w-full h-auto object-contain hover:scale-105 transition-transform duration-700" />
             </div>
          ))}
        </div>
      </div>

      {/* --- EXPERT VETS LIST --- */}
      <section className="bg-petzy-slate/5 py-24">
         <div className="container mx-auto px-5">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-bold text-petzy-slate mb-4">Meet Our Specialists</h2>
               <p className="text-petzy-slate-light">Highly qualified professionals dedicated to your pet's well-being.</p>
            </div>
            <ExpertVets router={router} />
         </div>
      </section>

      {/* --- PROMO BANNER 2 (Fixed Cropping) --- */}
      <div className="container mx-auto px-5 my-24">
         <div className="rounded-[2.5rem] overflow-hidden shadow-soft">
            <img src="/vet5.png" alt="Promo" className="w-full h-auto block" />
         </div>
      </div>

      {/* --- SERVICE CARDS GRID --- */}
      <section className="container mx-auto px-5 mb-32">
        <h2 className="text-3xl font-bold text-petzy-slate mb-12 text-center">Comprehensive Care Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { img: "/vets/vet-home2.png", title: "Home Services", link: "/vets/browse?type=homeService" },
            { img: "/vets/emergency2.png", title: "Emergency Care", link: "/vets/browse?type=emergency" },
            { img: "/vets/vaccine2.png", title: "Vaccination", link: "/vets/browse?type=vaccine" },
            { img: "/vets/spay2.png", title: "Spay/Neuter", link: "/vets/browse?type=spay-neuter" }
          ].map((service, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
               {/* Container uses padding to ensure image fits without crop */}
               <div className="h-56 bg-petzy-blue-light/5 p-6 flex items-center justify-center">
                 <img src={service.img} alt={service.title} className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-110 transition-transform duration-500" />
               </div>
               <div className="p-6 text-center flex-grow flex flex-col justify-between">
                  <h3 className="text-xl font-bold text-petzy-slate mb-4">{service.title}</h3>
                  <Button
                    text="Book Now"
                    type="default"
                    className="w-full !py-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0"
                    onClick={() => router.push(service.link)}
                  />
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- PREMIUM UPGRADE CARD --- */}
      <div className="container mx-auto px-5 mb-24">
        <div className="bg-gradient-to-r from-gray-900 to-petzy-slate rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 text-white shadow-2xl relative overflow-hidden">
           {/* Decor */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
           
           <div className="flex items-center gap-8 relative z-10">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                 <RiVipCrownFill className="text-5xl text-yellow-400" />
              </div>
              <div>
                 <h2 className="text-3xl md:text-4xl font-bold mb-2 text-yellow-500">Upgrade to Premium</h2>
                 <p className="text-gray-300 text-lg">Unlock exclusive discounts, priority booking, and free shipping.</p>
              </div>
           </div>
           <div className="relative z-10">
              <Link href="/pro" className="bg-white text-petzy-slate px-8 py-4 rounded-full font-bold hover:bg-petzy-coral hover:text-white transition-all shadow-lg transform hover:scale-105">
                 Subscribe Now
              </Link>
           </div>
        </div>
      </div>

      {/* --- INFO SECTION --- */}
      <div className="bg-gray-50 py-24">
         <div className="container mx-auto px-5">
            <div className="flex flex-col lg:flex-row items-center gap-16">
               <div className="lg:w-1/3 border-b-2 lg:border-b-0 lg:border-r-2 border-gray-200 pb-10 lg:pb-0 lg:pr-10 text-center lg:text-right">
                  <img src="/logo-black.png" alt="Logo" className="w-48 mx-auto lg:ml-auto mb-6" />
                  <p className="text-petzy-slate-light font-medium">Trusted by 10,000+ Pet Parents</p>
               </div>
               <div className="lg:w-2/3">
                  <h2 className="text-4xl md:text-5xl font-bold text-petzy-slate mb-4">
                     Take care of your best friend <br />
                     <span className="text-petzy-coral">in seconds.</span>
                  </h2>
                  <p className="text-2xl text-gray-400 font-light">The ultimate platform for your beloved pet.</p>
               </div>
            </div>
         </div>
      </div>

      {/* --- MAP SECTION --- */}
      <div className="container mx-auto px-5 my-24">
         <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-2/3 h-64 md:h-96 bg-gray-100 relative">
               <img src="/vet-map.png" alt="Map" className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 transition-all duration-500" />
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-bold text-petzy-slate">Interactive Map Coming Soon</span>
               </div>
            </div>
            <div className="md:w-1/3 p-10 flex flex-col justify-center bg-petzy-periwinkle-light/20">
               <h3 className="text-2xl text-petzy-slate font-light mb-2">Locate Nearby</h3>
               <h2 className="text-3xl font-bold text-petzy-coral mb-6">Veterinary Hospitals</h2>
               <p className="text-petzy-slate-light mb-8">Find the closest emergency care centers with real-time directions.</p>
               <Button text="View Map" type="outline" />
            </div>
         </div>
      </div>

      {/* --- FAQ SECTION --- */}
      <div className="container mx-auto px-5 mb-24 max-w-4xl">
         <div className="text-center mb-12">
            <span className="text-sm font-bold text-petzy-coral uppercase tracking-widest">Support</span>
            <h2 className="text-3xl md:text-4xl font-bold text-petzy-slate mt-2">Frequently Asked Questions</h2>
         </div>
         <Accordion items={faqData} />
      </div>

      {/* --- TESTIMONIALS --- */}
      <Testimonials />

    </div>
  );
};

export default Vet;