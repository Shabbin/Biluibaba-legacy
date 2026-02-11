import { useState, useEffect } from "react";

import axios from "@/src/lib/axiosInstance";

import VetProfile from "@/src/components/profile/vet";
import { CardSkeleton } from "@/src/components/ui";

export default function ExpertVets() {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVets = async () => {
    try {
      const { data } = await axios.get("/api/vet");

      if (data.success) setVets(data.vets);
    } catch (error) {
      console.error("Error fetching vets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchVets();
  }, []);

  return (
    <div>
      <h1 className="md:text-4xl text-3xl font-bold text-center py-10">
        Our Expert Vets
      </h1>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
