"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Tippy from "@tippyjs/react";
import { toast } from "react-hot-toast";

import axios from "@/src/lib/axiosInstance";

import Button from "@/src/components/ui/button";

import Calendar from "@/src/components/calendar";
import ReviewCard from "@/src/components/review";

import VetsData from "@/src/app/demo.vets";

import { FaStar, FaCheck } from "react-icons/fa";
import { PiDogThin, PiCatThin } from "react-icons/pi";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [vet, setVet] = useState({});
  const [selectedSlot, setSelectedSlot] = useState("");
  const [date, setDate] = useState("");

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "physical";

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`/api/vet/get/${params.id}`);

      if (data.success) {
        setVet(data.vet);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = () => {
    if (selectedSlot === "" || !selectedSlot)
      return toast.error("Please select a time slot");
    localStorage.setItem(
      "vet-appointment",
      JSON.stringify({
        id: vet._id,
        name: vet.name,
        date,
        time: selectedSlot,
        totalAmount: vet.appointments[type].fee,
        type,
        address: vet.address.fullAddress,
        hospital: vet.hospital,
        profilePicture: vet.profilePicture,
        degree: vet.degree,
      })
    );

    return (window.location.href = "/vets/checkout");
  };

  useEffect(() => {
    fetchData();

    const newDate = new Date();

    setDate(
      `${newDate.toLocaleDateString("en-US", {
        weekday: "long",
      })}, ${newDate.toLocaleDateString("en-US", {
        month: "long",
      })} ${newDate.getDate()}, ${newDate.getFullYear()}`
    );

    if (type == null) router.push(`/vets/${params.id}?type=physical`);

    const petFilter = JSON.parse(localStorage.getItem("pet-filter"));
    if (!petFilter || petFilter.concerns?.length === 0)
      return router.push(
        "/vets/filter?from=" +
          `/vets/${params.id}` +
          (type ? `?type=${type}` : "")
      );
  }, []);

  useEffect(() => {
    setSelectedSlot(
      vet.appointments?.slots[date.split(",")[0].toLowerCase()]
        .availableSlots[0]
    );
  }, [date]);

  return (
    <div className="py-20">
      <div className="container mx-auto">
        {loading ? null : (
          <div className="flex md:flex-row flex-col gap-10 md:mx-0 mx-5">
            <div className="basis-2/3">
              <div className="flex md:flex-row flex-col gap-5 items-center">
                <img
                  src={vet.profilePicture}
                  className="w-[180px] h-[180px] rounded-full"
                />
                <div className="md:text-left text-center">
                  <div className="text-3xl font-bold text-zinc-800">
                    {vet.name}
                  </div>
                  <div className="text-md my-5 text-gray-500 mb-3">
                    <div className="flex flex-row gap-2 items-center">
                      <div>{vet.degree}</div>
                      <div>&#183;</div>
                      <FaStar size="1em" className="text-black" />
                      <div>5</div>
                      <div>&#183;</div>
                      <div className="underline">100 reviews</div>
                    </div>
                  </div>
                  {vet.license ? (
                    <div className="flex mt-5 md:justify-start justify-center">
                      <Tippy
                        content="This vet has passed an extensive verification process with their ENG veterinarian license"
                        className="bg-zinc-900 text-white text-center px-4 py-2 rounded-3xl text-sm"
                      >
                        <div className="flex flex-row items-center gap-2 bg-green-100 px-4 py-2 text-sm rounded-2xl">
                          <FaCheck size="1em" className="text-emerald-800" />
                          <div className="text-emerald-800">
                            License verified
                          </div>
                        </div>
                      </Tippy>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="py-10 border-b-1 text-lg">{vet.bio}</div>
              <div className="py-10 border-b-1">
                <div className="text-2xl font-bold">Species treated</div>
                <div className="flex flex-row gap-5 my-5">
                  {vet.specializedZone.map((s, i) => (
                    <div
                      className="flex flex-row items-center gap-4 w-[200px] h-[100px] px-5 rounded-xl border shadow-lg"
                      key={i}
                    >
                      {s.pet == "Dog" ? (
                        <PiDogThin size="2em" />
                      ) : (
                        <PiCatThin size="2em" />
                      )}
                      <div className="text-lg">{s.pet}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="py-10 border-b-1">
                <div className="text-2xl font-bold">Areas of interest</div>
                <div className="flex flex-col gap-2 my-5">
                  {vet.specializedZone.map((s, i) => (
                    <div key={i}>
                      {s.concerns.map((concern, concernIndex) => (
                        <div
                          className="flex flex-row items-center gap-4 text-lg"
                          key={`${i}-${concernIndex}`}
                        >
                          <FaCheck />
                          <div>
                            {s.pet} - {concern}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="py-10 border-b-1">
                <div className="text-2xl font-bold">Licenses</div>
                <div className="flex flex-row gap-5 my-5 justify-between flex-wrap text-lg">
                  {vet.license}
                </div>
              </div>
              {/* <div className="py-10">
                <div className="text-2xl font-bold flex flex-row gap-2 items-center">
                  <FaStar size="1em" className="text-black" />
                  <div>{vet.star.toFixed(1)}</div>
                  <div>&#183;</div>
                  <div>{vet.reviews.length} reviews</div>
                </div>
                <div className="flex md:flex-row flex-col gap-5 my-5 justify-between flex-wrap">
                  {vet.reviews.map((r, i) => (
                    <div
                      className="md:w-1/2 w-full md:-m-2 md:p-2 flex-grow"
                      key={i}
                    >
                      <ReviewCard
                        review={r.review}
                        profilePic={r.profilePic}
                        name={r.name}
                        date={r.date}
                      />
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
            <div className="basis-1/3 sticky top-10 max-h-[865px] rounded-xl border border-neutral-200 shadow-xl">
              <div className="text-2xl font-bold px-4 pt-6 text-center whitespace-nowrap">
                Next available {type.toLowerCase()} time slots
              </div>
              <div className="px-6">
                <Calendar
                  date={date}
                  setDate={(date) => setDate(date)}
                  availableSlots={vet.appointments.slots}
                />
              </div>

              <div className="border-t-1 border-b-1 flex flex-col px-5 gap-3 py-5 overflow-auto min-h-20 max-h-96 h-[100v-31rem]">
                {vet.appointments.slots[
                  date.split(",")[0].toLowerCase()
                ].availableSlots.map((slot, index) => (
                  <div
                    className={
                      "flex flex-row justify-between items-center p-5 border-black border rounded-lg text-sm cursor-pointer hover:text-neutral-500 " +
                      (selectedSlot === slot ? "border-2" : "border-1")
                    }
                    key={index}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <div>
                      <span className="font-bold">{date}</span> at {slot}
                    </div>
                    <div className="text-lg">
                      &#2547;{vet.appointments[type].fee}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto py-5">
                <div className="flex flex-row justify-between items-center px-6">
                  <div>
                    <div className="text-3xl font-semibold">Total</div>
                    <div className="text-neutral-500 text-sm">
                      Incl. tax & fees
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-neutral-900 font-bold text-3xl">
                      &#2547; {vet.appointments[type].fee + 150}
                    </div>
                    <div className="text-neutral-700">
                      {date} at {selectedSlot}
                    </div>
                  </div>
                </div>
                <div className="my-5 text-center px-6">
                  <Button
                    className="!rounded-full !w-full"
                    text="Continue Booking"
                    type="default"
                    onClick={() => confirmBooking()}
                  />
                  <div className="mt-2 text-lg text-neutral-500 font-semibold">
                    You won't be charged yet.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
