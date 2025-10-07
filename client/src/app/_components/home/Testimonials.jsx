"use client";

import { FaStar } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const data = [
  {
    id: 0,
    review:
      "Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries",
    src: "/testimonialdemo.png",
  },
  {
    id: 1,
    review:
      "Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries",
    src: "/testimonialdemo.png",
  },
  {
    id: 2,
    review:
      "Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries",
    src: "/testimonialdemo.png",
  },
  {
    id: 3,
    review:
      "Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries",
    src: "/testimonialdemo.png",
  },
];

const Testimonials = () => {
  return (
    <div className="bg-gradient-to-b from-[#74bdf1]  to-[#1096F5] py-20 px-5">
      <div className="container mx-auto ">
        <h1 className="text-6xl font-bold text-center text-white">
          Happy Pet Parents
        </h1>
        <div className="flex md:flex-row flex-col items-center justify-between gap-5 py-20">
          {data.map((t) => (
            <div className="md:basis-1/4" key={t.id}>
              <div
                className="h-[350px] bg-top bg-no-repeat bg-cover rounded-tr-lg rounded-tl-lg"
                style={{ backgroundImage: `url(${t.src})` }}
              />
              <div className="bg-white px-4 py-6 rounded-br-lg rounded-bl-lg">
                <div className="text-justify">{t.review}</div>
                <div className="flex flex-row items-center justify-center my-3 gap-3">
                  <FaStar size="1.2em" className="text-yellow-400" />
                  <FaStar size="1.2em" className="text-yellow-400" />
                  <FaStar size="1.2em" className="text-yellow-400" />
                  <FaStar size="1.2em" className="text-yellow-400" />
                  <FaStar size="1.2em" className="text-yellow-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
