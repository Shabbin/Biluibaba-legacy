"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import VetProfile from "@/src/components/profile/vet";
import { CardSkeleton } from "@/src/components/ui";

import axios from "@/src/lib/axiosInstance";

const ExpertVets = ({ vet, router }) => {
  const [loading, setLoading] = useState(true);
  const [vets, setVets] = useState([]);

  const fetchVets = async () => {
    try {
      let { data } = await axios.get("/api/vet/");
      if (data.success) setVets(data.vets);
    } catch (error) {
      console.log(error);
      return toast.error("Failed to fetch expert vets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchVets();
  }, []);

  return (
    <div className="py-10">
      {loading ? (
        <div className="flex md:flex-row flex-col md:-m-2 mx-2 flex-wrap items-center justify-between">
          <CardSkeleton count={4} type="vet" />
        </div>
      ) : (
        <div className="flex md:flex-row flex-col md:-m-2 mx-2 flex-wrap items-center justify-between ">
          {vets.map((vet, i) => (
            <VetProfile
              src={vet.profilePicture}
              id={vet._id}
              name={vet.name}
              designation={vet.degree}
              star={5}
              reviews={100}
              verified={vet.verified}
              slots={vet.appointments.slots}
              price={vet.appointments["online"]?.fee}
              type="online"
              key={i}
              router={router}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpertVets;
