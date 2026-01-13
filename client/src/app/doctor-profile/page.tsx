"use client";

import { useState, useEffect } from "react";

import DoctorProfile from "@/src/app/doctor-profile/profile";
import Booking from "@/src/app/doctor-profile/booking";

export default function Doctor(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    if (!localStorage.getItem("doctor")) {
      window.location.href = "/my-account";
      return;
    }
    setLoading(false);
  }, []);

  return (
    <div className="py-20">
      {!loading && (
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
                    onClick={() => setSelected(0)}
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
                    onClick={() => setSelected(1)}
                  >
                    Edit your profile
                  </div>
                </div>
              </div>
            </div>
            <div className="basis-3/4 border p-6 rounded-lg md:mx-0 mx-5">
              {selected === 0 ? <Booking /> : <DoctorProfile />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
