"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import Input from "@/src/components/ui/input";
import Textarea from "@/src/components/ui/textarea";
import Button from "@/src/components/ui/button";

import { Hospital, Calendar } from "@/src/components/svg";

import axios from "@/src/lib/axiosInstance";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [petName, setPetName] = useState("");
  const [petConcern, setPetConcern] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vet, setVet] = useState(null);
  const [species, setSpecies] = useState("cat");
  const [concerns, setConcerns] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleSubmit = async () => {
    if (vet.type === "homeService" && homeAddress === "")
      return toast.error("Home address is required for home service");

    if (petName === "" || petName.length < 3 || petName.length > 50)
      return toast.error(
        "Pet's name needs to be at least 4 characters long and at most 50 characters long"
      );

    if (this.state.phoneNumber === "" || this.state.phoneNumber.length > 30)
      return toast.error("Please enter a valid phone number.");

    if (petConcern === "" || petConcern.length < 10 || petConcern.length > 1000)
      return toast.error(
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

      if (data.success) return (window.location.href = data.url);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    const vetStorage = JSON.parse(localStorage.getItem("vet-appointment"));
    const petFilter = JSON.parse(localStorage.getItem("pet-filter"));
    if (!vetStorage) window.location.href = "/vets";
    else setVet(vetStorage);

    setSpecies(petFilter.species);
    setConcerns(petFilter.concerns);
    setLoading(false);
  }, []);

  return (
    <div className="md:py-20 py-10">
      <div className="container mx-auto">
        {loading ? null : (
          <div className="flex md:flex-row flex-col md:gap-10 md:mx-0 mx-5">
            <div className="basis-2/3">
              <div className="border rounded-2xl my-5">
                <div className="px-6 py-5 border-b-1 rounded-tr-2xl rounded-tl-2xl text-3xl font-medium">
                  Pet and Payment
                </div>

                <div className="p-6">
                  <div className="text-2xl mb-10">
                    Tell the vet about your pets problem
                  </div>

                  <div>*Pet's Name</div>
                  <Input
                    type="text"
                    className="mt-2 mb-5"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    onKeyPress={(event) => {
                      if (!/[a-zA-z\s]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />

                  <div>*Phone Number</div>
                  <Input
                    type="text"
                    className="mt-2 mb-5"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />

                  {vet.type === "homeService" && (
                    <>
                      <div>*Your home address</div>
                      <Input
                        type="text"
                        className="mt-2 mb-5"
                        value={homeAddress}
                        onChange={(e) => setHomeAddress(e.target.value)}
                      />
                    </>
                  )}

                  <div>*Tell the vet about your concern</div>
                  <Textarea
                    type="text"
                    className="mb-5"
                    onChange={(event) => setPetConcern(event.target.value)}
                    value={petConcern}
                    rows="15"
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
              <div className="border rounded-2xl my-5">
                <div className="flex justify-between items-center px-6 py-5 border-b-1">
                  <div className="font-medium text-2xl">Booking Summary</div>
                </div>

                <div>
                  <div className="px-6">
                    <h2 className="text-2xl my-4">Vet Information</h2>
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
                        <div className="text-xl font-semibold">
                          {vet.hospital}
                        </div>
                        <div>{vet.address}</div>
                      </div>
                    </div>
                    <div className="py-4 flex flex-row items-center gap-5">
                      <Calendar className="w-14 h-14" />
                      <div className="text-lg">{vet.date}</div>
                    </div>
                  </div>

                  <div className="py-5 border-t-2 px-6 text-xl space-y-5">
                    <div className="flex flex-row justify-between items-center">
                      <div>Appointment Fee</div>
                      <div>&#2547; {vet.totalAmount}</div>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                      <div>Booking Fee</div>
                      <div>&#2547; 150</div>
                    </div>
                  </div>

                  <div className="py-5 border-t-2 px-6">
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
        )}
      </div>
    </div>
  );
}
