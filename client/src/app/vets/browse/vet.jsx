"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import axios from "@/src/lib/axiosInstance";

import Filter from "@/src/components/filter/vet";
import VetProfile from "@/src/components/profile/vet";
import { CardSkeleton, NoVetsFound } from "@/src/components/ui";

import VetsData from "@/src/app/vets/browse/vet.data";

import VetsDemoData from "@/src/app/demo.vets";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const type = searchParams.get("type");

  const date = new Date();

  const [loading, setLoading] = useState(false);
  const [vetData, setVetData] = useState(
    VetsData.vets.find((item) => item.name === type)
  );
  const [vets, setVets] = useState([]);
  const [location, setLocation] = useState("Dhaka, Bangladesh");
  const [calendar, setCalendar] = useState(
    `${date.toLocaleDateString("en-US", {
      weekday: "long",
    })}, ${date.toLocaleDateString("en-US", {
      month: "long",
    })} ${date.getDate()}, ${new Date().getFullYear()}`
  );
  const [species, setSpecies] = useState("Dog");

  const fetchVets = async () => {
    try {
      const { data } = await axios.get(`/api/vet/get?type=${vetData.name}`);

      if (data.success) setVets(data.vets);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);

    const petFilter = JSON.parse(localStorage.getItem("pet-filter"));
    if (!petFilter || petFilter.concerns.length === 0)
      return router.push(
        "/vets/filter?from=" + pathname + (type ? `?type=${type}` : "")
      );
    else setSpecies(petFilter.species);

    fetchVets();
  }, []);

  console.log(vets[0]);

  return (
    <div className="p-6">
      <img src={vetData.src} alt="Banner" />

      <div className="flex md:flex-row flex-col justify-between md:items-center my-20 md:mx-0 mx-5">
        <div className="text-center md:text-left md:mb-0 mb-10">
          <div className="text-xl">Select a vet</div>
          <div className="text-lg">For your {vetData.name} appointment</div>
        </div>
        <Filter
          location={location}
          setLocation={setLocation}
          calendar={calendar}
          setCalendar={setCalendar}
          species={species}
          setSpecies={setSpecies}
        />
      </div>

      <div className="flex md:flex-row flex-col md:-m-2 mx-2 flex-wrap items-center">
        {loading ? (
          <div className="w-full flex flex-wrap gap-4">
            <CardSkeleton count={6} type="vet" />
          </div>
        ) : vets.length === 0 ? (
          <div className="w-full">
            <NoVetsFound onReset={() => router.push("/vets")} />
          </div>
        ) : (
          vets.map((vet, i) => (
            <VetProfile
              src={vet.profilePicture}
              id={vet._id}
              name={vet.name}
              designation={vet.degree}
              star={5}
              reviews={100}
              verified={vet.verified}
              slots={vet.appointments.slots}
              price={vet.appointments[type].fee}
              key={i}
              type={type}
              router={router}
            />
          ))
        )}
      </div>
    </div>
  );
}
