"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axiosInstance from "@/src/lib/axiosInstance";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Testimonial {
  _id: string;
  name: string;
  role: string;
  quote_title: string;
  review: string;
  image: { filename: string; path: string };
  display_order: number;
}

// ─── Pastel card colors cycling through 4 shades ──────────────────────────────
const CARD_COLORS = [
  "#EDE9FF", // Lavender / Light Purple
  "#DCFCE7", // Mint Green
  "#FEF3C7", // Pale Yellow
  "#DBEAFE", // Light Blue
];

// ─── Placeholder pet images (used when no customer image is uploaded) ──────────
const PET_PLACEHOLDERS = [
  "/pets/cat.png",
  "/pets/dog.png",
  "/pets/rabbit.png",
  "/pets/guinea-pig.png",
];

// ─── Static fallback (shown before API responds or when empty) ─────────────────
const FALLBACK: Testimonial[] = [
  {
    _id: "f1",
    name: "Sarah Jenkins",
    role: "Cat Mom",
    quote_title: "I'm in love with this service.",
    review:
      "I've never seen my Tabby so excited for meal time! The delivery was super fast, and the packaging was eco-friendly. Biluibaba is now my go-to for all pet supplies.",
    image: { filename: "", path: "" },
    display_order: 0,
  },
  {
    _id: "f2",
    name: "Michael Ross",
    role: "Dog Trainer",
    quote_title: "Absolutely the best pet store.",
    review:
      "As a professional trainer, I'm picky about treats. The selection here is top-notch. Customer service helped me pick the right supplements for my aging Golden Retriever.",
    image: { filename: "", path: "" },
    display_order: 1,
  },
  {
    _id: "f3",
    name: "Emily Chen",
    role: "Rabbit Enthusiast",
    quote_title: "Every small pet owner needs this.",
    review:
      "Finally, a store that understands small pets! The hay quality is excellent, and the toys are durable. My bunny loves the new enclosure setup.",
    image: { filename: "", path: "" },
    display_order: 2,
  },
  {
    _id: "f4",
    name: "David Miller",
    role: "Bird Owner",
    quote_title: "Fast delivery, great quality.",
    review:
      "Great variety of bird food and accessories. I ordered a new cage and it arrived in perfect condition within 2 hours. Highly recommended service!",
    image: { filename: "", path: "" },
    display_order: 3,
  },
];

// ─── Single card component ─────────────────────────────────────────────────────
function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  const cardColor = CARD_COLORS[index % CARD_COLORS.length];
  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  const imageSrc =
    testimonial.image?.filename
      ? `${apiBase}/uploads/testimonials/${testimonial.image.filename}`
      : PET_PLACEHOLDERS[index % PET_PLACEHOLDERS.length];

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col h-full">
      {/* ── Top: Colored content area ── */}
      <div
        className="flex flex-col p-7 flex-grow"
        style={{ backgroundColor: cardColor }}
      >
        <h3 className="font-bold text-[1.1rem] leading-snug text-gray-900 mb-3">
          {testimonial.quote_title}
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed flex-grow">
          {testimonial.review}
        </p>
        <div className="mt-6 pt-4 border-t border-black/10">
          <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{testimonial.role}</p>
        </div>
      </div>

      {/* ── Bottom: Image area ── */}
      <div className="relative w-full aspect-square">
        <Image
          src={imageSrc}
          alt={`${testimonial.name} with their pet`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
    </div>
  );
}

// ─── Main Section Component ─────────────────────────────────────────────────────
const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axiosInstance.get("/api/testimonials");
        if (data.success && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        }
      } catch {
        // Silently fall through — fallback data is already set
      }
    };
    load();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-5">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-blue-500 mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
            Loved By Happy Pet Parents
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 text-base leading-relaxed">
            Don&apos;t just take our word for it. Here is what our community has to
            say about the Biluibaba experience.
          </p>
        </div>

        {/* ── Swiper Slider ── */}
        <Swiper
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="w-full h-full"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={t._id} className="h-auto">
              <TestimonialCard testimonial={t} index={i} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;