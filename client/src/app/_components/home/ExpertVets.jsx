"use client";
import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import VetProfile from "@/src/components/profile/vet";

import "swiper/css";
import { PiGreaterThan, PiLessThan } from "react-icons/pi";

const ExpertVets = ({ vet, router }) => {
  const swiperRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [vets, setVets] = useState([]);

  const fetchVets = async () => {
    try {
      let { data } = await axiosInstance.get("/api/vet/get}");
      if (data.success) setVets(data.vets);
    } catch (error) {
      console.log(error);
      return toast.error("Failed to fetch expert vets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVets();
  }, []);

  return (
    <div className="relative py-10">
      <div className="absolute h-full w-full flex flex-row items-center justify-between">
        <div
          className="bg-white py-14 rounded-tr-lg rounded-br-lg cursor-pointer hover:bg-neutral-100 transition-all ease-in-out duration-300 shadow z-20"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <PiLessThan size="3em" className="px-2" />
        </div>
        <div
          className="bg-white py-14 rounded-tl-lg rounded-bl-lg cursor-pointer hover:bg-neutral-100 transition-all ease-in-out duration-300 shadow z-20"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <PiGreaterThan size="3em" className="px-2" />
        </div>
      </div>
      <Swiper
        className="z-10"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        autoplay={{ delay: 3000, disableOnInteraction: true }}
        modules={[Autoplay, Navigation]}
        slidesPerView={3}
        loop={true}
      >
        {vets.map((vet) => (
          <SwiperSlide key={vet.id}>
            <VetProfile
              src={vet.profilePic}
              id={vet._id}
              name={vet.name}
              designation={vet.degree}
              star={5}
              reviews={100}
              verified={vet.verified}
              slots={vet.appointments.slots}
              price={vet.appointments["online"].fee}
              key={vet.id}
              router={router}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ExpertVets;
