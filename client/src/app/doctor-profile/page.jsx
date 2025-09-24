"use client";

import React from "react";

import DoctorProfile from "@/src/app/doctor-profile/profile";
import Booking from "@/src/app/doctor-profile/booking";

export default class Doctor extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      selected: 0,
    };
  }

  componentDidMount() {
    if (!localStorage.getItem("doctor"))
      return (window.location.href = "/my-account");
    this.setState({ loading: false });
  }

  render() {
    return (
      <div className="py-20">
        {this.state.loading ? null : (
          <div className="container mx-auto">
            <div className="flex md:flex-row flex-col gap-5">
              <div className="basis-1/4">
                <div className="border rounded-lg flex flex-col gap-2 text-lg md:mx-0 mx-5">
                  <h1 className="text-xl font-bold p-4 border-b-1">
                    Doctor Dashboard
                  </h1>
                  <div className="py-1">
                    <div
                      className="block px-5 py-3 bg-white hover:bg-gray-100 cursor-pointer"
                      onClick={() => this.setState({ selected: 0 })}
                    >
                      <div className="flex flex-row justify-between items-center">
                        <div>View Bookings</div>
                        <div className="text-white bg-black w-[20px] text-xs h-[20px] inline-flex items-center justify-center rounded-full">
                          2
                        </div>
                      </div>
                    </div>
                    <div
                      className="block px-5 py-3 bg-white hover:bg-gray-100 cursor-pointer"
                      onClick={() => this.setState({ selected: 1 })}
                    >
                      Edit your profile
                    </div>
                  </div>
                </div>
              </div>
              <div className="basis-3/4 border p-6 rounded-lg md:mx-0 mx-5">
                {this.state.selected === 0 ? <Booking /> : <DoctorProfile />}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
