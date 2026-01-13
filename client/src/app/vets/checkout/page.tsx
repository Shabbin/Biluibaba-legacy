"use client";

import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { toast } from "react-hot-toast";

import Input from "@/src/components/ui/input";
import Textarea from "@/src/components/ui/textarea";
import Button from "@/src/components/ui/button";

import { Hospital, Calendar } from "@/src/components/svg";

import axios from "@/src/lib/axiosInstance";

interface VetAppointment {
  id: string;
  type: "online" | "homeService" | "offline";
  name: string;
  degree: string;
  hospital: string;
  address: string;
  profilePicture: string;
  date: string;
  time: string;
  totalAmount: number;
}

export default function Page(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [petName, setPetName] = useState<string>("");
  const [petConcern, setPetConcern] = useState<string>("");
  const [homeAddress, setHomeAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [vet, setVet] = useState<VetAppointment | null>(null);
  const [species, setSpecies] = useState<string>("cat");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    if (!vet) return;

    if (vet.type === "homeService" && homeAddress === "")
      return void toast.error("Home address is required for home service");

    if (petName === "" || petName.length < 3 || petName.length > 50)
      return void toast.error(
        "Pet's name needs to be at least 4 characters long and at most 50 characters long"
      );

    if (phoneNumber === "" || phoneNumber.length > 30)
      return void toast.error("Please enter a valid phone number.");

    if (petConcern === "" || petConcern.length < 10 || petConcern.length > 1000)
      return void toast.error(
        "Pet's concern needs to be at least 10 characters long and at most 1000 characters long"
      );

    setBookingLoading(true);
    try {
      const { data } = await axios.post("/api/vet/appointment/create", {
        petName,
        petConcern: concerns,
        species,
        vetId: vet.id,
        date: vet.date,
        time: vet.time,
        totalAmount: vet.totalAmount + 150,
        type: vet.type,
        detailedConcern: petConcern,
        phoneNumber,
        homeAddress: vet.type === "homeService" ? homeAddress : "",
      });

      console.log(data);

      if (data.success) window.location.href = data.url;
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    const vetStorageStr = localStorage.getItem("vet-appointment");
    const petFilterStr = localStorage.getItem("pet-filter");
    const vetStorage = vetStorageStr ? JSON.parse(vetStorageStr) : null;
    const petFilter = petFilterStr ? JSON.parse(petFilterStr) : null;

    if (!vetStorage) {
      window.location.href = "/vets";
      return;
    }
    
    setVet(vetStorage);

    if (petFilter) {
      setSpecies(petFilter.species);
      setConcerns(petFilter.concerns);
    }
    setLoading(false);
  }, []);

  if (loading || !vet) return <div className="py-20">Loading...</div>;

  return (
    <div className="md:py-20 py-10 bg-neutral-100">
      <div className="container mx-auto">
        <div className="flex md:flex-row flex-col md:gap-10 md:mx-0 mx-5">
          <div className="basis-2/3">
            <div className="border rounded-2xl my-5 bg-white">
              <div className="px-8 py-8 border-b-1 rounded-tr-2xl rounded-tl-2xl text-3xl font-medium">
                Pet and Payment
              </div>

              <div className="p-8">
                <div className="text-4xl mb-10">
                  Tell the vet about your pets problem
                </div>

                <div className="font-bold">*Pet&apos;s Name</div>
                <Input
                  type="text"
                  className="mt-2 mb-5"
                  value={petName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPetName(e.target.value)
                  }
                  onKeyPress={(event: KeyboardEvent<HTMLInputElement>) => {
                    if (!/[a-zA-z\s]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />

                <div className="font-bold">*Phone Number</div>
                <Input
                  type="text"
                  className="mt-2 mb-5"
                  value={phoneNumber}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setPhoneNumber(event.target.value)
                  }
                  onKeyPress={(event: KeyboardEvent<HTMLInputElement>) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />

                {vet.type === "homeService" && (
                  <>
                    <div className="font-bold">*Your home address</div>
                    <Input
                      type="text"
                      className="mt-2 mb-5"
                      value={homeAddress}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setHomeAddress(e.target.value)
                      }
                    />
                  </>
                )}

                <div className="font-bold">
                  *Tell the vet about your concern
                </div>
                <Textarea
                  className="mb-5"
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    setPetConcern(event.target.value)
                  }
                  value={petConcern}
                  rows={15}
                />
                <div
                  className={
                    "flex flex-row justify-end " +
                    (petConcern.length > 1000 ? "text-red-500" : "")
                  }
                >
                  {petConcern.length}/1000 characters
                </div>
              </div>
            </div>
          </div>

          <div className="basis-1/3">
            <div className="border rounded-2xl my-5 bg-white">
              <div className="flex justify-center items-center px-8 py-8 border-b-1">
                <div className="font-bold text-2xl text-center">
                  Booking Summary
                </div>
              </div>

              <div>
                <div className="px-8">
                  <h2 className="text-2xl mb-5 mt-8">Vet Information</h2>
                  <div className="flex flex-row items-center gap-5 py-4">
                    <img
                      src={vet.profilePicture}
                      alt={vet.name}
                      className="w-[60px] rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-xl">{vet.name}</div>
                      <div>{vet.degree}</div>
                    </div>
                  </div>
                  <div className="py-4 flex flex-row items-center gap-5">
                    <Hospital className="w-14 h-14" />
                    <div>
                      <div className="text-xl font-semibold">{vet.hospital}</div>
                      <div>{vet.address}</div>
                    </div>
                  </div>
                  <div className="py-4 flex flex-row items-center gap-5">
                    <Calendar className="w-12 h-12" />
                    <div className="text-lg">{vet.date}</div>
                  </div>
                </div>

                <div className="py-5 border-t-2 px-6 text-xl space-y-5">
                  <div className="flex flex-row justify-between items-center">
                    <div>Appointment Fee</div>
                    <div className="font-bold">&#2547; {vet.totalAmount}</div>
                  </div>
                  <div className="flex flex-row justify-between items-center">
                    <div>Booking Fee</div>
                    <div className="font-bold">&#2547; 150</div>
                  </div>
                </div>

                <div className="py-5 border-t-2 px-6 shadow-[0_-8px_20px_-6px_rgba(0,0,0,0.18)] mt-20">
                  <div className="flex flex-row items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold mb-2">Total</div>
                      <div className="text-xs">Incl. tax & fees</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold mb-2">
                        &#2547; {vet.totalAmount + 150}
                      </div>
                      <div className="text-xs">
                        {vet.date} at {vet.time}
                      </div>
                    </div>
                  </div>

                  <Button
                    text="Checkout"
                    onClick={handleSubmit}
                    type="default"
                    className="w-full mt-10"
                    disabled={bookingLoading}
                  />

                  <div className="text-center py-5 text-xl">
                    Pay and get your service
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
