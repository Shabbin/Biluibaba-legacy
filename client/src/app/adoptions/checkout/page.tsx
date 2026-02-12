"use client";

import React from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

import withRouter from "@/src/app/controllers/router";

import Input from "@/src/components/ui/input";
import Select from "@/src/components/ui/select";
import Textarea from "@/src/components/ui/textarea";
import Button from "@/src/components/ui/button";

import axios from "@/src/lib/axiosInstance";

import { WithRouterProps } from "@/src/app/controllers/router";

interface AdoptionCheckoutState {
  loading: boolean;
  adoption: Record<string, unknown>;
  region: string;
  shippingCost: number;
  name: string;
  phoneNumber: string;
  address: string;
  whyAdopt: string;
  petProof: string;
  takeCareOfPet: string;
}

export default withRouter(
  class Checkout extends React.Component<WithRouterProps, AdoptionCheckoutState> {
    constructor(props: WithRouterProps) {
      super(props);

      this.state = {
        loading: true,
        adoption: {},
        region: "Inside Dhaka",
        shippingCost: 500,
        name: "",
        phoneNumber: "",
        address: "",
        whyAdopt: "",
        petProof: "",
        takeCareOfPet: "",
      };

      this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
      let adoption = JSON.parse(localStorage.getItem("adoption"));
      if (!adoption) window.location.href = "/adoptions";
      else {
        this.setState({
          adoption: adoption,
          loading: false,
        });
      }
    }

    async onSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      if (
        this.state.name === "" ||
        this.state.name.length < 4 ||
        this.state.name.length > 50
      )
        return toast.error(
          "Name needs to be at least 4 characters long and at most 50 characters long"
        );
      if (this.state.phoneNumber === "" || this.state.phoneNumber.length > 30)
        return toast.error("Please provide valid phone number (11 digits)");
      if (this.state.address === "" || this.state.address.length > 100)
        return toast.error("Please provide valid address (max 100 characters)");
      if (this.state.whyAdopt === "" || this.state.whyAdopt.length > 750)
        return toast.error(
          "Please provide valid reason why you want to adopt pet (max 750 characters)"
        );
      if (
        this.state.takeCareOfPet === "" ||
        this.state.takeCareOfPet.length > 750
      )
        return toast.error(
          "Please provide valid reason how you will take care of the pet (max 750 characters)"
        );
      if (this.state.petProof === "" || this.state.petProof.length > 750)
        return toast.error(
          "Please provide how your home is pet proof (max 750 characters)"
        );

      this.setState({ loading: true });
      try {
        const { data } = await axios.post("/api/adoptions/order", {
          name: this.state.name,
          phoneNumber: this.state.phoneNumber,
          adoptionId: this.state.adoption.adoptionId,
          address: this.state.address,
          area: this.state.region,
          payment: this.state.shippingCost,
          whyAdopt: this.state.whyAdopt,
          takeCareOfPet: this.state.takeCareOfPet,
          address: this.state.address,
          petProof: this.state.petProof,
        });

        console.log(data);

        if (data.success) window.location.href = data.url;
        else {
          toast.error("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        this.setState({ loading: false });
      }
    }

    render() {
      return (
        <div className="md:py-20 py-10 bg-neutral-100">
          <div className="container mx-auto">
            {this.state.loading ? null : (
              <div className="flex md:flex-row flex-col md:gap-10 md:mx-0 mx-5">
                <div className="basis-2/3 md:order-1 order-2 ">
                  <div className="border rounded-2xl my-5 bg-white">
                    <div className="px-6 py-8 border-b-1 rounded-tr-2xl rounded-tl-2xl text-3xl font-semibold">
                      Adoption Form
                    </div>

                    <div className="p-6">
                      <h2 className="text-4xl py-5 mb-10">
                        Tell us about yourself!
                      </h2>
                      <div>Full name *</div>
                      <Input
                        type="text"
                        placeholder="Enter name"
                        className="mb-5"
                        onChange={(event) =>
                          this.setState({ name: event.target.value })
                        }
                        value={this.state.name}
                        onKeyPress={(event) => {
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
                        onChange={(event) =>
                          this.setState({ phoneNumber: event.target.value })
                        }
                        value={this.state.phoneNumber}
                        onKeyPress={(event) => {
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
                        onChange={(event) =>
                          this.setState({ region: event.target.value }, () =>
                            this.state.region === "Inside Dhaka"
                              ? this.setState({ shippingCost: 500 })
                              : this.setState({ shippingCost: 1000 })
                          )
                        }
                        value={this.state.region}
                      />

                      <div>Full Address*</div>
                      <Textarea
                        type="text"
                        placeholder="Enter your street address here"
                        className="mb-5"
                        onChange={(event) =>
                          this.setState({ address: event.target.value })
                        }
                        value={this.state.address}
                        rows="6"
                      />
                      <div
                        className={
                          "flex flex-row justify-end " +
                          (this.state.address.length > 100
                            ? "text-red-500"
                            : "")
                        }
                      >
                        {this.state.address.length}/100 characters
                      </div>

                      <div>Why do you want to adopt a pet?</div>
                      <Textarea
                        type="text"
                        className="mb-5"
                        rows="6"
                        onChange={(event) =>
                          this.setState({ whyAdopt: event.target.value })
                        }
                        value={this.state.whyAdopt}
                      />
                      <div
                        className={
                          "flex flex-row justify-end " +
                          (this.state.whyAdopt.length > 750
                            ? "text-red-500"
                            : "")
                        }
                      >
                        {this.state.whyAdopt.length}/750 characters
                      </div>

                      <div>
                        Is your home {this.state.adoption.species.toLowerCase()}{" "}
                        proof?
                      </div>
                      <Textarea
                        type="text"
                        className="mb-5"
                        rows="6"
                        onChange={(event) =>
                          this.setState({ petProof: event.target.value })
                        }
                        value={this.state.petProof}
                      />
                      <div
                        className={
                          "flex flex-row justify-end " +
                          (this.state.petProof.length > 750
                            ? "text-red-500"
                            : "")
                        }
                      >
                        {this.state.petProof.length}/750 characters
                      </div>

                      <div>
                        How you take care of this{" "}
                        {this.state.adoption.species.toLowerCase()}?
                      </div>
                      <Textarea
                        type="text"
                        className="mb-5"
                        rows="6"
                        onChange={(event) =>
                          this.setState({ takeCareOfPet: event.target.value })
                        }
                        value={this.state.takeCareOfPet}
                      />

                      <div
                        className={
                          "flex flex-row justify-end " +
                          (this.state.takeCareOfPet.length > 750
                            ? "text-red-500"
                            : "")
                        }
                      >
                        {this.state.takeCareOfPet.length}/750 characters
                      </div>

                      <Button
                        type="default"
                        text="Proceed to payment"
                        className="w-full my-3"
                        disabled={this.state.loading}
                        onClick={(event) => this.onSubmit(event)}
                      />
                    </div>
                  </div>
                  <div className="border rounded-2xl bg-yellow-100">
                    <div className="px-5 py-4 text-lg border-b-1 rounded-tr-2xl rounded-tl-2xl font-bold text-yellow-700 uppercase">
                      Disclaimer
                    </div>
                    <div className="px-6 py-6">
                      <div className="text-sm text-yellow-700">
                        Submitting the payment does not guarantee approval of
                        your adoption application. All adoption requests are
                        subject to review. In the event that your application is
                        not approved, your payment will be fully refunded.
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
                          src={this.state.adoption.pic}
                          alt={this.state.adoption.name}
                          className="w-[60px] h-[60px] rounded-full"
                        />
                        <div className="flex flex-row items-center justify-between flex-1 my-1">
                          <div>
                            <div className="text-lg font-bold">
                              {this.state.adoption.name}
                            </div>
                            <div>{this.state.adoption.gender}</div>
                          </div>
                          <div>
                            <div className="px-8 py-1 bg-gray-100 font-light uppercase rounded-2xl">
                              {this.state.adoption.species}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 ">
                      <div className="flex flex-row items-center justify-between my-4 text-lg border-b-1 pb-5">
                        <div>Shipping Cost</div>
                        <div className="font-semibold">
                          &#2547;{this.state.shippingCost}
                        </div>
                      </div>

                      <div className="flex flex-row items-center justify-between my-4 text-lg pb-5 font-semibold">
                        <div>Total Amount</div>
                        <div>&#2547;{this.state.shippingCost}</div>
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
  }
);
