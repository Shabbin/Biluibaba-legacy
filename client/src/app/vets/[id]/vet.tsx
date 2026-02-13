"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Tippy from "@tippyjs/react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import type { Vet, VetReview, ApiAxiosError, PetFilter } from "@/src/types";
import { Pagination } from "@heroui/pagination";

import axios from "@/src/lib/axiosInstance";
import { formatCurrency } from "@/src/lib/currency";

import Button from "@/src/components/ui/button";
import { ReviewSkeleton, NoReviews } from "@/src/components/ui";
import Calendar from "@/src/components/calendar";
import Textarea from "@/src/components/ui/textarea";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  ModalBody,
} from "@heroui/modal";

import { useAuth } from "@/src/components/providers/AuthProvider";

import { formatDate } from "@/src/utils/formatDate";

import { FaStar, FaCheck } from "react-icons/fa";
import { Cat, Dog, Star } from "@/src/components/svg";

export default function Page() {
  const { user } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [vet, setVet] = useState<Vet | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [rating, setRating] = useState<number>(1);
  const [comment, setComment] = useState<string>("");
  const [reviewStatus, setReviewStatus] = useState<boolean>(false);

  const [reviewCurrentPage, setReviewCurrentPage] = useState<number>(1);
  const reviewsPerPage = 2;

  const indexOfLastReview = reviewCurrentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews: VetReview[] = vet?.reviews
    ?.slice()
    .reverse()
    .slice(indexOfFirstReview, indexOfLastReview) || [];

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
    } catch (error: unknown) {
      console.error(error as ApiAxiosError);
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = () => {
    if (!vet) return toast.error("Vet information not loaded");
    if (selectedSlot === "" || !selectedSlot)
      return toast.error("Please select a time slot");
    localStorage.setItem(
      "vet-appointment",
      JSON.stringify({
        id: vet._id,
        name: vet.name,
        date,
        time: selectedSlot,
        totalAmount: vet.appointments?.[type]?.fee || 0,
        type,
        address: vet.address?.fullAddress,
        hospital: vet.hospital,
        profilePicture: vet.profilePicture,
        degree: vet.degree,
      })
    );

    return (window.location.href = "/vets/checkout");
  };

  const submitReview = async (onClose: () => void) => {
    if (!rating || rating < 1 || rating > 5) {
      return toast.error("Please provide a valid rating between 1 and 5");
    }

    try {
      const { data } = await axios.post(`/api/vet/rating/`, {
        rating,
        vetId: vet?._id,
        comment,
      });

      if (data.success) {
        toast.success("Review submitted successfully");
        setRating(1);
        setComment("");
        onClose();
        fetchData();
      } else {
        toast.error("Failed to submit review");
      }
    } catch (error: unknown) {
      console.error(error as ApiAxiosError);
      toast.error("An error occurred while submitting your review");
    } finally {
      setReviewStatus(false);
    }
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

    const petFilter: PetFilter | null = JSON.parse(localStorage.getItem("pet-filter") || "{}");
    if (!petFilter || petFilter.concerns?.length === 0)
      return router.push(
        "/vets/filter?from=" +
          `/vets/${params.id}` +
          (type ? `?type=${type}` : "")
      );
  }, []);

  useEffect(() => {
    if (vet?.appointments?.slots) {
      const daySlots = vet.appointments.slots[date.split(",")[0].toLowerCase()];
      if (daySlots?.availableSlots?.[0]) {
        setSelectedSlot(daySlots.availableSlots[0]);
      }
    }
  }, [date, vet]);

  return (
    <div className="py-20">
      <div className="container mx-auto">
        {loading || !vet ? null : (
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
                  {vet.specializedZone?.map((s, i) => (
                    <div
                      className="flex flex-row items-center gap-4 w-[200px] h-[100px] px-5 rounded-xl border shadow-lg"
                      key={i}
                    >
                      {s.pet == "Dog" ? (
                        <Dog className="text-[2em]" />
                      ) : (
                        <Cat className="text-[2em]" />
                      )}
                      <div className="text-lg">{s.pet}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="py-10 border-b-1">
                <div className="text-2xl font-bold">Areas of interest</div>
                <div className="flex flex-row flex-wrap items-center my-5">
                  {vet.specializedZone?.map((s, i) =>
                    s.concerns.map((concern, concernIndex) => (
                      <div
                        className="basis-1/4 -me-2 px-2 flex flex-row items-center gap-4 text-lg"
                        key={`${i}-${concernIndex}`}
                      >
                        <FaCheck />
                        <div>
                          {s.pet} - {concern}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="py-10 border-b-1">
                <div className="text-2xl font-bold">Licenses</div>
                <div className="flex flex-row gap-5 my-5 justify-between flex-wrap text-lg">
                  {vet.license}
                </div>
              </div>
              <div className="py-5">
                <div className="border-b flex md:flex-row flex-col items-center justify-between gap-10 py-10">
                  <h2 className="text-xl font-bold">What's on your mind?</h2>

                  {user && user.id ? (
                    <>
                      <Button
                        text="Write a Review"
                        type="outline"
                        className="text-lg md:w-auto w-full"
                        onClick={onOpen}
                      />

                      <Modal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        size="4xl"
                      >
                        <ModalContent>
                          {(onClose) => (
                            <>
                              <ModalHeader className="flex flex-col gap-1">
                                Write a review
                              </ModalHeader>
                              <ModalBody>
                                <div className="flex flex-row gap-5 items-center justify-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <div
                                      key={star}
                                      className="flex flex-row items-center gap-2 cursor-pointer py-5"
                                      onClick={() => setRating(star)}
                                    >
                                      <span
                                        className={`text-5xl ${
                                          rating >= star
                                            ? "text-yellow-500"
                                            : "text-gray-400"
                                        }`}
                                      >
                                        <FaStar />
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                <div>Your Comment</div>
                                <Textarea
                                  placeholder="Write your review here..."
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  rows="5"
                                />
                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  onClick={onClose}
                                  text="Close"
                                  type="outline"
                                ></Button>
                                <Button
                                  onClick={() => submitReview(onClose)}
                                  text="Submit"
                                  type="default"
                                  disabled={reviewStatus}
                                ></Button>
                              </ModalFooter>
                            </>
                          )}
                        </ModalContent>
                      </Modal>
                    </>
                  ) : (
                    <div className="text-lg">
                      <Link
                        href={`/login?from=/vets/${vet._id}`}
                        className="text-blue-500 underline"
                      >
                        Login
                      </Link>{" "}
                      to write a review.
                    </div>
                  )}
                </div>

                <div className=" py-14">
                  <div className="flex flex-row items-center gap-2 text-2xl font-bold">
                    <div className="flex flex-row items-center gap-2">
                      <Star className="text-[1rem]" /> {vet.ratings?.toFixed(1) || "0.0"}
                    </div>
                    <div>.</div>
                    <div>{vet.totalReviews || 0} Reviews</div>
                  </div>

                  {currentReviews.length === 0 && (
                    <NoReviews />
                  )}

                  {currentReviews.map((review, index) => (
                    <div key={review.id}>
                      <div className="py-4 border-b flex flex-col gap-4">
                        <div className="flex items-center gap-4 mb-2">
                          <img
                            src={review.userId.avatar}
                            alt={review.userId.name}
                            className="w-[50px] h-[50px] rounded-full"
                          />
                          <h3 className="text-xl text-gray-600">
                            {review.userId.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 font-bold">
                            <Star className="text-[1em]" />
                            {review.rating.toFixed(1)}
                          </div>
                          <span className="text-gray-500">
                            Posted on {formatDate(review.date)}
                          </span>
                        </div>

                        <p className="my-2 text-xl">{review.comment}</p>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-center mt-8">
                    {!loading && (vet.reviews?.length || 0) > 2 && (
                      <Pagination
                        total={Math.ceil((vet.reviews?.length || 0) / reviewsPerPage)}
                        initialPage={1}
                        page={reviewCurrentPage}
                        onChange={setReviewCurrentPage}
                        classNames={{
                          cursor: "bg-zinc-950 border-zinc-950 ",
                        }}
                        variant="flat"
                        showControls
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="basis-1/3 sticky top-10 max-h-[865px] rounded-xl border border-neutral-200 shadow-xl">
              <div className="text-2xl font-bold px-4 pt-6 text-center whitespace-nowrap">
                Next available {type.toLowerCase()} time slots
              </div>
              <div className="px-6">
                <Calendar
                  date={date}
                  setDate={(date: string) => setDate(date)}
                  availableSlots={vet.appointments?.slots || {}}
                />
              </div>

              <div className="border-t-1 border-b-1 flex flex-col px-5 gap-3 py-5 overflow-auto min-h-20 max-h-96 h-[100v-31rem]">
                {(vet.appointments?.slots?.[date.split(",")[0].toLowerCase()]?.availableSlots || []).map((slot, index) => (
                  <div
                    className={
                      "flex flex-row justify-between items-center p-5 border-2 rounded-lg text-sm cursor-pointer hover:text-neutral-500 " +
                      (selectedSlot === slot
                        ? "border-black"
                        : "border-default")
                    }
                    key={index}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <div>
                      <span className="font-bold">{date}</span> at {slot}
                    </div>
                    <div className="text-lg">
                      &#2547;{formatCurrency(vet?.appointments[type]?.fee)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto py-5 shadow-[0_-8px_20px_-6px_rgba(0,0,0,0.18)]">
                <div className="flex flex-row justify-between items-center px-6">
                  <div>
                    <div className="text-3xl font-semibold">Total</div>
                    <div className="text-neutral-500 text-sm">
                      Incl. tax & fees
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-neutral-900 font-bold text-3xl">
                      &#2547; {formatCurrency(vet?.appointments[type]?.fee + 150)}
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
