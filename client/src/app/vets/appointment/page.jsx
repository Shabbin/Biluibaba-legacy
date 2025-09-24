"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { toast } from "react-hot-toast";

import withRouter from "@/src/app/controllers/router";

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

export default withRouter(
  class Appointment extends React.Component {
    constructor({ router }) {
      super();

      this.state = {
        vet: "",
        slot: "",
        date: "",
        pet: "Dog",
        concerns: "Flea and tick",
        reason: "Flea and ticks",
        togglePetForm: false,
        toggleConcernForm: false,
        toggleReasonForm: false,
        meetingMode: "Online",
      };

      this.router = router;
    }

    componentDidMount() {
      let token = JSON.parse(localStorage.getItem("token"));
      if (!token) return this.router.push("/signin?from=/vet/appointment");

      let booking = JSON.parse(sessionStorage.getItem("vet"));
      if (!booking) return this.router.push("/vet");

      let vet = VetsData.find((v) => v.id === Number(booking.vet));

      this.setState({
        vet: {
          name: vet.name,
          profilePic: vet.profilePic,
          star: vet.star,
          designation: vet.designation,
          review: vet.reviews.length,
          fee: vet.fee,
          totalFee: vet.totalFee,
        },
        date: booking.date,
        slot: booking.slot,
      });
    }

    confirmBooking() {
      sessionStorage.removeItem("vet");
      toast.success("Booking has been confirmed!");
      this.router.push("/vet/appointment/confirm");
    }

    render() {
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
                          {this.state.date} at {this.state.slot}
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex flex-row gap-4 border-b-1 my-4 py-4 hover:opacity-75 cursor-pointer"
                      onClick={() => this.setState({ togglePetForm: true })}
                    >
                      <PiCatThin size="1.5em" />
                      <div className="flex flex-row items-center flex-grow justify-between">
                        <div>
                          <div className="text-lg inline-flex items-center gap-1">
                            Pet{" "}
                            {this.state.pet === "Tap to add" ? (
                              <span className="bg-red-50 border border-red-300 px-2 py-0.5 text-xs rounded-full text-red-800">
                                Required
                              </span>
                            ) : null}
                          </div>
                          <div className="text-gray-500">{this.state.pet}</div>
                        </div>
                        <PiGreaterThan size="1em" />
                      </div>
                    </div>

                    <div
                      className="flex flex-row gap-4 border-b-1 my-4 py-4 hover:opacity-75 cursor-pointer"
                      onClick={() => this.setState({ toggleConcernForm: true })}
                    >
                      <PiStethoscopeThin size="1.5em" />
                      <div className="flex flex-row items-center flex-grow justify-between">
                        <div>
                          <div className="text-lg inline-flex items-center gap-1">
                            Concerns{" "}
                            {this.state.concerns === "Tap to add" ? (
                              <span className="bg-red-50 border border-red-300 px-2 py-0.5 text-xs rounded-full text-red-800">
                                Required
                              </span>
                            ) : null}
                          </div>
                          <div className="text-gray-500">
                            {this.state.concerns}
                          </div>
                        </div>
                        <PiGreaterThan size="1em" />
                      </div>
                    </div>

                    <div
                      className="flex flex-row gap-4 mt-4 py-4 hover:opacity-75 cursor-pointer border-b-1"
                      onClick={() => this.setState({ toggleReasonForm: true })}
                    >
                      <CiMedicalClipboard size="1.5em" />
                      <div className="flex flex-row items-center flex-grow justify-between">
                        <div>
                          <div className="text-lg inline-flex items-center gap-1">
                            Reason for visit{" "}
                            {this.state.reason === "Tap to add" ? (
                              <span className="bg-red-50 border border-red-300 px-2 py-0.5 text-xs rounded-full text-red-800">
                                Required
                              </span>
                            ) : null}
                          </div>
                          <div className="text-gray-500">
                            {this.state.reason}
                          </div>
                        </div>
                        <PiGreaterThan size="1em" />
                      </div>
                    </div>

                    <div className="flex md:flex-row flex-col flex-wrap gap-y-5 justify-between items-center my-5">
                      <div className="md:w-1/2 w-full -m-2 p-2">
                        <div
                          className={
                            "flex flex-row justify-between flex-grow items-center p-3 border-black rounded-xl cursor-pointer hover:bg-neutral-50  " +
                            (this.state.meetingMode === "Online"
                              ? "border-2"
                              : "border")
                          }
                          onClick={() =>
                            this.setState({ meetingMode: "Online" })
                          }
                        >
                          <div className="flex flex-row gap-2 items-center">
                            <PiMonitor size="1em" />
                            <div>Online</div>
                          </div>
                          <div
                            className={
                              "w-4 h-4 border-black rounded-full " +
                              (this.state.meetingMode === "Online"
                                ? "border-4"
                                : "border")
                            }
                          ></div>
                        </div>
                      </div>
                      <div className="md:w-1/2 w-full -m-2 p-2">
                        <div
                          className={
                            "flex flex-row justify-between flex-grow items-center p-3 border-black rounded-xl cursor-pointer hover:bg-neutral-50 " +
                            (this.state.meetingMode === "Offline"
                              ? "border-2"
                              : "border")
                          }
                          onClick={() =>
                            this.setState({ meetingMode: "Offline" })
                          }
                        >
                          <div className="flex flex-row gap-2 items-center">
                            <MdOutlineAddLocationAlt size="1em" />
                            <div>Offline</div>
                          </div>
                          <div
                            className={
                              "w-4 h-4 border-black rounded-full " +
                              (this.state.meetingMode === "Offline"
                                ? "border-4"
                                : "border")
                            }
                          ></div>
                        </div>
                      </div>
                    </div>

                    <PetForm
                      isOpen={this.state.togglePetForm}
                      pet={this.state.pet}
                      onClose={(toggle) =>
                        this.setState({ togglePetForm: toggle })
                      }
                    />
                    <ConcernForm
                      isOpen={this.state.toggleConcernForm}
                      concern={this.state.concerns}
                      onClose={(toggle) =>
                        this.setState({ toggleConcernForm: toggle })
                      }
                    />

                    <ReasonForm
                      isOpen={this.state.toggleReasonForm}
                      reason={this.state.reason}
                      onClose={(toggle) =>
                        this.setState({ toggleReasonForm: toggle })
                      }
                    />
                  </div>
                  <Button
                    text="Confirm booking"
                    className="my-5 w-full"
                    type="default"
                    onClick={() => this.confirmBooking()}
                  />
                  <div className="text-sm text-center">
                    By selecting Confirm and book, I agree to Biluibaba's{" "}
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
                        src={this.state.vet.profilePic}
                        className="w-[100px] h-[100px] rounded-full"
                        alt={this.state.vet.name}
                      />
                      <div className="basis-full">
                        <div className="text-2xl font-bold text-zinc-800">
                          {this.state.vet.name}
                        </div>
                        <div className="text-lg mb-3">
                          {this.state.vet.designation}
                        </div>
                        <div className="flex flex-row justify-between text-lg">
                          <div>
                            <div className="flex flex-row gap-2 items-center">
                              <FaStar size="1em" />
                              <div>{this.state.vet.star}</div>
                              <div>&#183;</div>
                              <div>{this.state.vet.review} reviews</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="py-5 border-b-1">
                      <div className="text-2xl">Price details</div>
                      <div className="flex flex-row justify-between my-2">
                        <div>Appointment</div>
                        <div className="text-xl">
                          &#2547;{this.state.vet.fee}
                        </div>
                      </div>
                      <div className="flex flex-row justify-between my-2">
                        <div className="underline">Tax and fees</div>
                        <div className="text-xl">
                          &#2547;{this.state.vet.totalFee - this.state.vet.fee}
                        </div>
                      </div>
                    </div>
                    <div className="py-5">
                      <div className="flex flex-row justify-between">
                        <div className="underline text-lg">Total</div>
                        <div className="text-xl font-bold">
                          &#2547;{this.state.vet.totalFee}
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
  }
);

class PetForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        scrollBehavior="inside"
        backdrop="blur"
        hideCloseButton={true}
        size="3xl"
      >
        <ModalContent>
          <ModalHeader>Let's meet your pet</ModalHeader>
          <ModalBody>
            <div className="border-b-1">
              <div>Pet's name</div>
              <Input placeholder="Pet's name" />
            </div>
            <div className="border-b-1">
              <div>Species</div>
              <Input placeholder="E.g Cat, Dog" value={this.props.pet} />
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
              onClick={() => this.props.onClose(false)}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
}

class ConcernForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
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
              value={this.props.concern}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              text="save"
              type="default"
              className="rounded-full w-full"
              onClick={() => this.props.onClose(false)}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
}

class ReasonForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        scrollBehavior="inside"
        backdrop="blur"
        hideCloseButton={true}
        size="3xl"
      >
        <ModalContent>
          <ModalHeader>
            Tell us more about the reason for your pet's visit
          </ModalHeader>

          <ModalBody>
            <p>
              A detailed description of any symptoms or other relevant
              information will better prepare your veterinarian for this
              appointment
            </p>
            <Textarea
              placeholder="E.g when did you first notice symptoms, frequency of certain behaviour"
              value={this.props.reason}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              text="save"
              type="default"
              className="rounded-full w-full"
              onClick={() => this.props.onClose(false)}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
}
