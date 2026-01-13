"use client";

import { useState, useEffect, ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import Input from "@/src/components/ui/input";
import Select from "@/src/components/ui/select";
import Textarea from "@/src/components/ui/textarea";
import Button from "@/src/components/ui/button";

import axios from "@/src/lib/axiosInstance";

interface AdoptionItem {
  name: string;
  pic: string;
  species: string;
  gender: string;
  adoptionId: string;
}

interface CheckoutState {
  loading: boolean;
  adoption: AdoptionItem | null;
  region: string;
  shippingCost: number;
  name: string;
  phoneNumber: string;
  address: string;
  whyAdopt: string;
  petProof: string;
  takeCareOfPet: string;
}

export default function Checkout(): JSX.Element {
  const router = useRouter();
  const [state, setState] = useState<CheckoutState>({
    loading: true,
    adoption: null,
    region: "Inside Dhaka",
    shippingCost: 500,
    name: "",
    phoneNumber: "",
    address: "",
    whyAdopt: "",
    petProof: "",
    takeCareOfPet: "",
  });

  useEffect(() => {
    const adoptionStr = localStorage.getItem("adoption");
    const adoption: AdoptionItem | null = adoptionStr
      ? JSON.parse(adoptionStr)
      : null;

    if (!adoption) {
      window.location.href = "/adoptions";
    } else {
      setState((prev) => ({
        ...prev,
        adoption,
        loading: false,
      }));
    }
  }, []);

  const onSubmit = async (event: FormEvent<HTMLButtonElement>): Promise<void> => {
    event.preventDefault();

    if (
      state.name === "" ||
      state.name.length < 4 ||
      state.name.length > 50
    ) {
      toast.error(
        "Name needs to be at least 4 characters long and at most 50 characters long"
      );
      return;
    }
    if (state.phoneNumber === "" || state.phoneNumber.length > 30) {
      toast.error("Please provide valid phone number (11 digits)");
      return;
    }
    if (state.address === "" || state.address.length > 100) {
      toast.error("Please provide valid address (max 100 characters)");
      return;
    }
    if (state.whyAdopt === "" || state.whyAdopt.length > 750) {
      toast.error(
        "Please provide valid reason why you want to adopt pet (max 750 characters)"
      );
      return;
    }
    if (state.takeCareOfPet === "" || state.takeCareOfPet.length > 750) {
      toast.error(
        "Please provide valid reason how you will take care of the pet (max 750 characters)"
      );
      return;
    }
    if (state.petProof === "" || state.petProof.length > 750) {
      toast.error(
        "Please provide how your home is pet proof (max 750 characters)"
      );
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    try {
      const { data } = await axios.post("/api/adoptions/order", {
        name: state.name,
        phoneNumber: state.phoneNumber,
        adoptionId: state.adoption?.adoptionId,
        address: state.address,
        area: state.region,
        payment: state.shippingCost,
        whyAdopt: state.whyAdopt,
        takeCareOfPet: state.takeCareOfPet,
        petProof: state.petProof,
      });

      console.log(data);

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  if (state.loading || !state.adoption) {
    return (
      <div className="md:py-20 py-10 bg-neutral-100">
        <div className="container mx-auto">Loading...</div>
      </div>
    );
  }

  return (
    <div className="md:py-20 py-10 bg-neutral-100">
      <div className="container mx-auto">
        <div className="flex md:flex-row flex-col md:gap-10 md:mx-0 mx-5">
          <div className="basis-2/3 md:order-1 order-2 ">
            <div className="border rounded-2xl my-5 bg-white">
              <div className="px-6 py-8 border-b-1 rounded-tr-2xl rounded-tl-2xl text-3xl font-semibold">
                Adoption Form
              </div>

              <div className="p-6">
                <h2 className="text-4xl py-5 mb-10">Tell us about yourself!</h2>
                <div>Full name *</div>
                <Input
                  type="text"
                  placeholder="Enter name"
                  className="mb-5"
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setState((prev) => ({ ...prev, name: event.target.value }))
                  }
                  value={state.name}
                  onKeyPress={(event: KeyboardEvent<HTMLInputElement>) => {
                    if (!/[a-zA-z\s]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />

                <div>Phone Number *</div>
                <Input
                  type="text"
                  placeholder="Enter phone number"
                  className="mb-5"
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setState((prev) => ({
                      ...prev,
                      phoneNumber: event.target.value,
                    }))
                  }
                  value={state.phoneNumber}
                  onKeyPress={(event: KeyboardEvent<HTMLInputElement>) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />

                <div>Region *</div>
                <Select
                  data={[
                    { value: "Inside Dhaka", text: "Inside Dhaka" },
                    { value: "Outside Dhaka", text: "Outside Dhaka" },
                  ]}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                    const newRegion = event.target.value;
                    setState((prev) => ({
                      ...prev,
                      region: newRegion,
                      shippingCost: newRegion === "Inside Dhaka" ? 500 : 1000,
                    }));
                  }}
                  value={state.region}
                />

                <div>Full Address*</div>
                <Textarea
                  placeholder="Enter your street address here"
                  className="mb-5"
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    setState((prev) => ({
                      ...prev,
                      address: event.target.value,
                    }))
                  }
                  value={state.address}
                  rows={6}
                />
                <div
                  className={
                    "flex flex-row justify-end " +
                    (state.address.length > 100 ? "text-red-500" : "")
                  }
                >
                  {state.address.length}/100 characters
                </div>

                <div>Why do you want to adopt a pet?</div>
                <Textarea
                  className="mb-5"
                  rows={6}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    setState((prev) => ({
                      ...prev,
                      whyAdopt: event.target.value,
                    }))
                  }
                  value={state.whyAdopt}
                />
                <div
                  className={
                    "flex flex-row justify-end " +
                    (state.whyAdopt.length > 750 ? "text-red-500" : "")
                  }
                >
                  {state.whyAdopt.length}/750 characters
                </div>

                <div>
                  Is your home {state.adoption.species.toLowerCase()} proof?
                </div>
                <Textarea
                  className="mb-5"
                  rows={6}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    setState((prev) => ({
                      ...prev,
                      petProof: event.target.value,
                    }))
                  }
                  value={state.petProof}
                />
                <div
                  className={
                    "flex flex-row justify-end " +
                    (state.petProof.length > 750 ? "text-red-500" : "")
                  }
                >
                  {state.petProof.length}/750 characters
                </div>

                <div>
                  How you take care of this{" "}
                  {state.adoption.species.toLowerCase()}?
                </div>
                <Textarea
                  className="mb-5"
                  rows={6}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    setState((prev) => ({
                      ...prev,
                      takeCareOfPet: event.target.value,
                    }))
                  }
                  value={state.takeCareOfPet}
                />

                <div
                  className={
                    "flex flex-row justify-end " +
                    (state.takeCareOfPet.length > 750 ? "text-red-500" : "")
                  }
                >
                  {state.takeCareOfPet.length}/750 characters
                </div>

                <Button
                  type="default"
                  text="Proceed to payment"
                  className="w-full my-3"
                  disabled={state.loading}
                  onClick={(event) => onSubmit(event)}
                />
              </div>
            </div>
            <div className="border rounded-2xl bg-yellow-100">
              <div className="px-5 py-4 text-lg border-b-1 rounded-tr-2xl rounded-tl-2xl font-bold text-yellow-700 uppercase">
                Disclaimer
              </div>
              <div className="px-6 py-6">
                <div className="text-sm text-yellow-700">
                  Submitting the payment does not guarantee approval of your
                  adoption application. All adoption requests are subject to
                  review. In the event that your application is not approved,
                  your payment will be fully refunded.
                </div>
              </div>
            </div>
          </div>

          <div className="basis-1/3 md:my-5 md:order-2 order-1">
            <div className="border rounded-2xl bg-white">
              <div className="flex justify-center items-center px-6 py-8 border-b-1">
                <div className="font-semibold text-2xl text-center">
                  Order Summary
                </div>
              </div>
              <div className="text-xl px-6 pt-8 pb-5">Adopting</div>
              <div className="border-b-1 pb-5">
                <div className="flex flex-row my-5 gap-5 px-6">
                  <img
                    src={state.adoption.pic}
                    alt={state.adoption.name}
                    className="w-[60px] h-[60px] rounded-full"
                  />
                  <div className="flex flex-row items-center justify-between flex-1 my-1">
                    <div>
                      <div className="text-lg font-bold">
                        {state.adoption.name}
                      </div>
                      <div>{state.adoption.gender}</div>
                    </div>
                    <div>
                      <div className="px-8 py-1 bg-gray-100 font-light uppercase rounded-2xl">
                        {state.adoption.species}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 ">
                <div className="flex flex-row items-center justify-between my-4 text-lg border-b-1 pb-5">
                  <div>Shipping Cost</div>
                  <div className="font-semibold">&#2547;{state.shippingCost}</div>
                </div>

                <div className="flex flex-row items-center justify-between my-4 text-lg pb-5 font-semibold">
                  <div>Total Amount</div>
                  <div>&#2547;{state.shippingCost}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
