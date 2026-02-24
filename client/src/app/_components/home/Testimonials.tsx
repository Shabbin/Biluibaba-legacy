"use client";

import { FaStar, FaQuoteLeft } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/ui/avatar";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Enriched data with names/roles for a more realistic look
const data = [
  {
    id: 0,
    name: "Sarah Jenkins",
    role: "Cat Mom",
    review:
      "I've never seen my Tabby so excited for meal time! The delivery was super fast, and the packaging was eco-friendly. Biluibaba is now my go-to for all pet supplies.",
    src: "/testimonialdemo.png",
  },
  {
    id: 1,
    name: "Michael Ross",
    role: "Dog Trainer",
    review:
      "As a professional trainer, I'm picky about treats. The selection here is top-notch. Customer service helped me pick the right supplements for my aging Golden Retriever.",
    src: "/testimonialdemo.png",
  },
  {
    id: 2,
    name: "Emily Chen",
    role: "Rabbit Enthusiast",
    review:
      "Finally, a store that understands small pets! The hay quality is excellent, and the toys are durable. My bunny loves the new enclosure setup.",
    src: "/testimonialdemo.png",
  },
  {
    id: 3,
    name: "David Miller",
    role: "Bird Owner",
    review:
      "Great variety of bird food and accessories. I ordered a new cage and it arrived in perfect condition within 2 hours. Highly recommended service!",
    src: "/testimonialdemo.png",
  },
];

const Testimonials = () => {
  return (
    <div className="relative bg-gradient-to-br from-petzy-blue-light via-[#eaf4fc] to-white py-20 overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-petzy-blue-light/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="container mx-auto px-5 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-petzy-coral uppercase tracking-widest mb-3">
            Testimonials
          </h2>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-petzy-slate mb-6">
            Loved by Happy Pet Parents
          </h1>
          <p className="max-w-2xl mx-auto text-petzy-slate-light text-lg">
            Don't just take our word for it. Here is what our community has to say about the Biluibaba experience.
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletActiveClass: "bg-petzy-coral opacity-100", 
            // Note: You might need global css to override swiper-pagination-bullet styles nicely
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="pb-14 !px-2" // Added padding bottom for pagination dots
        >
          {data.map((t) => (
            <SwiperSlide key={t.id} className="h-auto">
              <div className="bg-white rounded-3xl p-8 shadow-soft border border-white/50 hover:shadow-soft-lg transition-all duration-300 h-full flex flex-col relative group">
                
                {/* Decorative Quote Icon */}
                <FaQuoteLeft className="absolute top-6 right-6 text-6xl text-petzy-blue-light/20 group-hover:text-petzy-coral/10 transition-colors duration-300" />

                {/* Stars */}
                <div className="flex gap-1 mb-6 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size="1.1em" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-petzy-slate-light italic leading-relaxed mb-8 flex-grow relative z-10">
                  "{t.review}"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100">
                  <div className="w-14 h-14 rounded-full p-1 bg-gradient-to-tr from-petzy-blue-light to-petzy-coral/30">
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={t.src}
                        alt={t.name}
                        className="object-cover border-2 border-white"
                      />
                      <AvatarFallback className="bg-petzy-blue-light text-petzy-slate text-lg font-bold border-2 border-white">
                        {t.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h4 className="font-bold text-petzy-slate text-lg">
                      {t.name}
                    </h4>
                    <span className="text-sm text-petzy-coral font-medium">
                      {t.role}
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Testimonials;