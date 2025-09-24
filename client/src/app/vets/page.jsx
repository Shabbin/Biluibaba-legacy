"use client";

import React from "react";

import Filter from "@/src/components/filter/vet";
import VetProfile from "@/src/components/profile/vet";
import Button from "@/src/components/ui/button";

import withRouter from "@/src/app/controllers/router";

import Landing from "@/src/app/_components/home/Landing";
import Category from "@/src/app/_components/vets/Category";
import ExpertVets from "@/src/app/_components/vets/ExpertVets";

import VetsData from "@/src/app/demo.vets";

import axios from "@/src/lib/axiosInstance";

let vetCategories = [
  {
    src: "/vets/vet-online.png",
    link: "/vets/browse?type=online",
  },
  {
    src: "/vets/vet-physical.png",
    link: "/vets/browse?type=physical",
  },
  {
    src: "/vets/vet-home.png",
    link: "/vets/browse?type=homeService",
  },
  {
    src: "/vets/emergency.png",
    link: "/vets/browse?type=emergency",
  },
  {
    src: "/vets/vaccination.png",
    link: "/vets/browse?type=vaccination",
  },
  {
    src: "/vets/spay-neuter.png",
    link: "/vets/browse?type=spay-neuter",
  },
];

export default withRouter(
  class Vet extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        location: "",
        calendar: "",
        species: "",
        site: {
          vet_landing_slider: [],
          vet_banner_one: { filename: "", path: "" },
        },
      };

      this.fetchSiteSettings = this.fetchSiteSettings.bind(this);
    }

    componentDidMount() {
      const date = new Date();
      this.setState({
        location: "Dhaka, BD",
        calendar: `${date.toLocaleDateString("en-US", {
          weekday: "long",
        })}, ${date.toLocaleDateString("en-US", {
          month: "long",
        })} ${date.getDate()}, ${new Date().getFullYear()}`,
        species: "Dog",
      });

      this.fetchSiteSettings();
    }

    async fetchSiteSettings() {
      try {
        const { data } = await axios.get("/api/admin/site-settings");

        if (data.success) this.setState({ site: data.site });
      } catch (error) {
        console.error(error);
      } finally {
        this.setState({ loading: false });
      }
    }
    render() {
      return (
        <div className="">
          {!this.state.loading && (
            <>
              <Landing slider={this.state.site.vet_landing_slider} />

              <Category categories={vetCategories} />

              <div className="container mx-auto md:px-0 px-5">
                <div className="flex flex-row justify-center items-center py-10">
                  <div className="basis-1/2">
                    <img
                      src="/logo-black.png"
                      alt="Logo Black"
                      className="w-[200px] mb-5"
                    />
                    <h2 className="text-4xl font-semibold">
                      Your partner in pet health!
                    </h2>
                    <h2 className="text-4xl font-semibold">
                      Choose us for expert care.
                    </h2>
                    <p className="text-lg py-5">
                      24/7 Online Vets & Many Services
                    </p>
                    <Button
                      text="Consult Now"
                      className="w-full"
                      type="default"
                    ></Button>
                  </div>
                  <img
                    src="/vet1.png"
                    alt="Vet One"
                    className="basis-1/2 w-1/2"
                  />
                </div>

                <img
                  src={this.state.site.vet_banner_one.path}
                  alt="Vet Banner One"
                />

                <div className="flex flex-row items-center gap-10 justify-between py-10">
                  <img
                    src="/vet2.png"
                    alt="Vet Two"
                    className="basis-1/2 w-1/2"
                  ></img>
                  <div className="basis-1/2">
                    <h2 className="text-4xl font-semibold mb-5">
                      Get an online appointment with an expert vet!
                    </h2>
                    <Button
                      text="Consult Now"
                      className="w-1/2"
                      type="default"
                    ></Button>
                  </div>
                </div>

                <img src="/vet3.png" alt="Vet Banner Two" />

                <div className="flex flex-row items-center gap-10 justify-between py-10">
                  <div className="basis-1/2">
                    <h2 className="text-4xl font-semibold mb-5">
                      Get an offline appointment with an expert vet!
                    </h2>
                    <Button
                      text="Consult Now"
                      className="w-1/2"
                      type="default"
                    ></Button>
                  </div>
                  <img
                    src="/vet4.png"
                    alt="Vet Two"
                    className="basis-1/2 w-1/2"
                  ></img>
                </div>

                <div className="flex md:flex-row flex-col gap-5">
                  <div className="basis-1/3">
                    <img
                      src="/vets/vet-homepage-3.png"
                      alt="homepage1"
                      className=""
                    />
                  </div>
                  <div className="basis-1/3">
                    <img
                      src="/vets/vet-homepage-2.png"
                      alt="homepage2"
                      className=""
                    />
                  </div>
                  <div className="basis-1/3">
                    <img
                      src="/vets/vet-homepage-1.png"
                      alt="homepage3"
                      className=""
                    />
                  </div>
                </div>

                <ExpertVets />

                <img src="/vet5.png" alt="Vet Banner Four" />

                <div className="flex md:flex-row flex-col gap-5 py-10">
                  <div className="basis-1/4 border-2 rounded flex flex-col gap-5 items-center pb-5">
                    <img src="/vets/vet-home2.png" alt="Home" />
                    <h2 className="text-xl">Home Services</h2>
                    <Button
                      text="Book Appointment"
                      type="default"
                      className="!py-2"
                    />
                  </div>
                  <div className="basis-1/4 border-2 rounded flex flex-col gap-5 items-center pb-5">
                    <img src="/vets/emergency2.png" alt="Emergency" />
                    <h2 className="text-xl">Emergency</h2>
                    <Button
                      text="Book Appointment"
                      type="default"
                      className="!py-2"
                    />
                  </div>
                  <div className="basis-1/4 border-2 rounded flex flex-col gap-5 items-center pb-5">
                    <img src="/vets/vaccine2.png" alt="Vaccine" />
                    <h2 className="text-xl">Vaccine</h2>
                    <Button
                      text="Book Appointment"
                      type="default"
                      className="!py-2"
                    />
                  </div>
                  <div className="basis-1/4 border-2 rounded flex flex-col gap-5 items-center pb-5">
                    <img src="/vets/spay2.png" alt="Spay" />
                    <h2 className="text-xl">Spay/Neutered</h2>
                    <Button
                      text="Book Appointment"
                      type="default"
                      className="!py-2"
                    />
                  </div>
                </div>

                <img src="/vet6.png" alt="Vet Banner Five" />
              </div>
            </>
          )}
        </div>
      );
    }
  }
);
