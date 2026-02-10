"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import VetProfile from "@/src/components/profile/vet";
import { CardSkeleton } from "@/src/components/ui";

import axios from "@/src/lib/axiosInstance";

const ExpertVets = () => {
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
    <div className="py-10 px-4 md:px-0">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CardSkeleton count={4} type="vet" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {vets.map((vet, i) => (
            <VetProfile
              key={i}
              src={vet.profilePicture}
              id={vet._id}
              name={vet.name}
              designation={vet.degree}
              star={5} // You might want to make this dynamic later
              reviews={100} // You might want to make this dynamic later
              verified={vet.verified}
              slots={vet.appointments?.slots || {}}
              price={vet.appointments?.online?.fee || 0}
              type="online"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpertVets;