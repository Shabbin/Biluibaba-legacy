"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { toast } from "react-hot-toast";

import Input from "@/src/components/ui/input";
import Textarea from "@/src/components/ui/textarea";
import Button from "@/src/components/ui/button";

import VetsData from "@/src/app/demo.vets";

import { IoCalendarClearOutline } from "react-icons/io5";
import {
  PiCatThin,
  PiStethoscopeThin,
  PiGreaterThan,
  PiMonitor,
} from "react-icons/pi";
import { CiMedicalClipboard } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { MdOutlineAddLocationAlt } from "react-icons/md";

interface Vet {
  name: string;
  profilePic: string;
  star: number;
  designation: string;
  review: number;
  fee: number;
  totalFee: number;
}

interface PetFormProps {
  isOpen: boolean;
  pet: string;
  onClose: (toggle: boolean) => void;
}

interface ConcernFormProps {
  isOpen: boolean;
  concern: string;
  onClose: (toggle: boolean) => void;
}

interface ReasonFormProps {
  isOpen: boolean;
  reason: string;
  onClose: (toggle: boolean) => void;
}

function PetForm({ isOpen, pet, onClose }: PetFormProps): JSX.Element {
  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      backdrop="blur"
      hideCloseButton={true}
      size="3xl"
    >
      <ModalContent>
        <ModalHeader>Let&apos;s meet your pet</ModalHeader>
        <ModalBody>
          <div className="border-b-1">
            <div>Pet&apos;s name</div>
            <Input placeholder="Pet's name" />
          </div>
          <div className="border-b-1">
            <div>Species</div>
            <Input placeholder="E.g Cat, Dog" value={pet} />
          </div>
          <div className="border-b-1">
            <div>Breed</div>
            <Input placeholder="Breed" />
          </div>
          <div className="border-b-1">
            <div>Sex</div>
            <Input placeholder="Sex" />
          </div>
          <div className="border-b-1">
            <div>Birth date</div>
            <Input placeholder="22nd August, 2024" />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            text="save"
            type="default"
            className="rounded-full w-full"
            onClick={() => onClose(false)}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function ConcernForm({
  isOpen,
  concern,
  onClose,
}: ConcernFormProps): JSX.Element {
  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      backdrop="blur"
      hideCloseButton={true}
      size="3xl"
    >
      <ModalContent>
        <ModalHeader>What are your main concerns?</ModalHeader>
        <ModalBody>
          <Textarea
            placeholder="E.g Flea and tick, Skin/ear infections etc"
            value={concern}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            text="save"
            type="default"
            className="rounded-full w-full"
            onClick={() => onClose(false)}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function ReasonForm({
  isOpen,
  reason,
  onClose,
}: ReasonFormProps): JSX.Element {
  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      backdrop="blur"
      hideCloseButton={true}
      size="3xl"
    >
      <ModalContent>
        <ModalHeader>
          Tell us more about the reason for your pet&apos;s visit
        </ModalHeader>
        <ModalBody>
          <p>
            A detailed description of any symptoms or other relevant information
            will better prepare your veterinarian for this appointment
          </p>
          <Textarea
            placeholder="E.g when did you first notice symptoms, frequency of certain behaviour"
            value={reason}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            text="save"
            type="default"
            className="rounded-full w-full"
            onClick={() => onClose(false)}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function Appointment(): JSX.Element {
  const router = useRouter();

  const [vet, setVet] = useState<Vet | null>(null);
  const [slot, setSlot] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [pet, setPet] = useState<string>("Dog");
  const [concerns, setConcerns] = useState<string>("Flea and tick");
  const [reason, setReason] = useState<string>("Flea and ticks");
  const [togglePetForm, setTogglePetForm] = useState<boolean>(false);
  const [toggleConcernForm, setToggleConcernForm] = useState<boolean>(false);
  const [toggleReasonForm, setToggleReasonForm] = useState<boolean>(false);
  const [meetingMode, setMeetingMode] = useState<"Online" | "Offline">("Online");

  useEffect(() => {
    const tokenStr = localStorage.getItem("token");
    const token = tokenStr ? JSON.parse(tokenStr) : null;
    if (!token) {
      router.push("/signin?from=/vet/appointment");
      return;
    }

    const bookingStr = sessionStorage.getItem("vet");
    const booking = bookingStr ? JSON.parse(bookingStr) : null;
    if (!booking) {
      router.push("/vet");
      return;
    }

    const vetData = VetsData.find((v) => v.id === Number(booking.vet));
    if (vetData) {
      setVet({
        name: vetData.name,
        profilePic: vetData.profilePic,
        star: vetData.star,
        designation: vetData.designation,
        review: vetData.reviews.length,
        fee: vetData.fee,
        totalFee: vetData.totalFee,
      });
      setDate(booking.date);
      setSlot(booking.slot);
    }
  }, [router]);

  const confirmBooking = (): void => {
    sessionStorage.removeItem("vet");
    toast.success("Booking has been confirmed!");
    router.push("/vet/appointment/confirm");
  };

  if (!vet) return <div className="py-20">Loading...</div>;

  return (
    <div className="py-20">
      <div className="container mx-auto md:px-0 px-5">
        <div className="text-3xl md:text-left text-center">
          Confirm and book
        </div>
        <div className="py-10">
          <div className="flex md:flex-row flex-col gap-10">
            <div className="basis-2/3">
              <div className="py-6 px-8 border rounded-lg">
                <div className="text-2xl md:text-left text-center">
                  Your appointment
                </div>

                <div className="flex flex-row gap-4 border-b-1 my-4 py-4">
                  <IoCalendarClearOutline size="1.5em" />
                  <div>
                    <div className="text-lg">Date</div>
                    <div className="text-gray-500">
                      {date} at {slot}
                    </div>
                  </div>
                </div>

                <div
                  className="flex flex-row gap-4 border-b-1 my-4 py-4 hover:opacity-75 cursor-pointer"
                  onClick={() => setTogglePetForm(true)}
                >
                  <PiCatThin size="1.5em" />
                  <div className="flex flex-row items-center flex-grow justify-between">
                    <div>
                      <div className="text-lg inline-flex items-center gap-1">
                        Pet{" "}
                        {pet === "Tap to add" && (
                          <span className="bg-red-50 border border-red-300 px-2 py-0.5 text-xs rounded-full text-red-800">
                            Required
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500">{pet}</div>
                    </div>
                    <PiGreaterThan size="1em" />
                  </div>
                </div>

                <div
                  className="flex flex-row gap-4 border-b-1 my-4 py-4 hover:opacity-75 cursor-pointer"
                  onClick={() => setToggleConcernForm(true)}
                >
                  <PiStethoscopeThin size="1.5em" />
                  <div className="flex flex-row items-center flex-grow justify-between">
                    <div>
                      <div className="text-lg inline-flex items-center gap-1">
                        Concerns{" "}
                        {concerns === "Tap to add" && (
                          <span className="bg-red-50 border border-red-300 px-2 py-0.5 text-xs rounded-full text-red-800">
                            Required
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500">{concerns}</div>
                    </div>
                    <PiGreaterThan size="1em" />
                  </div>
                </div>

                <div
                  className="flex flex-row gap-4 mt-4 py-4 hover:opacity-75 cursor-pointer border-b-1"
                  onClick={() => setToggleReasonForm(true)}
                >
                  <CiMedicalClipboard size="1.5em" />
                  <div className="flex flex-row items-center flex-grow justify-between">
                    <div>
                      <div className="text-lg inline-flex items-center gap-1">
                        Reason for visit{" "}
                        {reason === "Tap to add" && (
                          <span className="bg-red-50 border border-red-300 px-2 py-0.5 text-xs rounded-full text-red-800">
                            Required
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500">{reason}</div>
                    </div>
                    <PiGreaterThan size="1em" />
                  </div>
                </div>

                <div className="flex md:flex-row flex-col flex-wrap gap-y-5 justify-between items-center my-5">
                  <div className="md:w-1/2 w-full -m-2 p-2">
                    <div
                      className={
                        "flex flex-row justify-between flex-grow items-center p-3 border-black rounded-xl cursor-pointer hover:bg-neutral-50  " +
                        (meetingMode === "Online" ? "border-2" : "border")
                      }
                      onClick={() => setMeetingMode("Online")}
                    >
                      <div className="flex flex-row gap-2 items-center">
                        <PiMonitor size="1em" />
                        <div>Online</div>
                      </div>
                      <div
                        className={
                          "w-4 h-4 border-black rounded-full " +
                          (meetingMode === "Online" ? "border-4" : "border")
                        }
                      ></div>
                    </div>
                  </div>
                  <div className="md:w-1/2 w-full -m-2 p-2">
                    <div
                      className={
                        "flex flex-row justify-between flex-grow items-center p-3 border-black rounded-xl cursor-pointer hover:bg-neutral-50 " +
                        (meetingMode === "Offline" ? "border-2" : "border")
                      }
                      onClick={() => setMeetingMode("Offline")}
                    >
                      <div className="flex flex-row gap-2 items-center">
                        <MdOutlineAddLocationAlt size="1em" />
                        <div>Offline</div>
                      </div>
                      <div
                        className={
                          "w-4 h-4 border-black rounded-full " +
                          (meetingMode === "Offline" ? "border-4" : "border")
                        }
                      ></div>
                    </div>
                  </div>
                </div>

                <PetForm
                  isOpen={togglePetForm}
                  pet={pet}
                  onClose={(toggle) => setTogglePetForm(toggle)}
                />
                <ConcernForm
                  isOpen={toggleConcernForm}
                  concern={concerns}
                  onClose={(toggle) => setToggleConcernForm(toggle)}
                />

                <ReasonForm
                  isOpen={toggleReasonForm}
                  reason={reason}
                  onClose={(toggle) => setToggleReasonForm(toggle)}
                />
              </div>
              <Button
                text="Confirm booking"
                className="my-5 w-full"
                type="default"
                onClick={() => confirmBooking()}
              />
              <div className="text-sm text-center">
                By selecting Confirm and book, I agree to Biluibaba&apos;s{" "}
                <span className="font-bold underline cursor-pointer">
                  Terms of use
                </span>{" "}
                and{" "}
                <span className="font-bold underline cursor-pointer">
                  Rebooking and refund policy
                </span>{" "}
                and acknowledge that may contact information may be made
                available to the veterinary professional.
              </div>
            </div>
            <div className="basis-1/3">
              <div className="px-6 py-8 border rounded-lg">
                <div className="flex flex-row items-center gap-4 border-b-1 pb-8">
                  <img
                    src={vet.profilePic}
                    className="w-[100px] h-[100px] rounded-full"
                    alt={vet.name}
                  />
                  <div className="basis-full">
                    <div className="text-2xl font-bold text-zinc-800">
                      {vet.name}
                    </div>
                    <div className="text-lg mb-3">{vet.designation}</div>
                    <div className="flex flex-row justify-between text-lg">
                      <div>
                        <div className="flex flex-row gap-2 items-center">
                          <FaStar size="1em" />
                          <div>{vet.star}</div>
                          <div>&#183;</div>
                          <div>{vet.review} reviews</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="py-5 border-b-1">
                  <div className="text-2xl">Price details</div>
                  <div className="flex flex-row justify-between my-2">
                    <div>Appointment</div>
                    <div className="text-xl">&#2547;{vet.fee}</div>
                  </div>
                  <div className="flex flex-row justify-between my-2">
                    <div className="underline">Tax and fees</div>
                    <div className="text-xl">
                      &#2547;{vet.totalFee - vet.fee}
                    </div>
                  </div>
                </div>
                <div className="py-5">
                  <div className="flex flex-row justify-between">
                    <div className="underline text-lg">Total</div>
                    <div className="text-xl font-bold">
                      &#2547;{vet.totalFee}
                    </div>
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
