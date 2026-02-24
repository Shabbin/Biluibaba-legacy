import React from "react";

import { FaCircleXmark, FaCircleCheck } from "react-icons/fa6";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";

interface BookingProfileProps {
  profilePic: React.ReactNode;
  name: string;
  status: string;
  date: string;
  slot: string;
  pet: string;
  concern: string;
  sex: string;
  breed: string;
  birthdate: string;
  reason: string;
  bookedAt: string;
}

export default class BookingProfile extends React.Component<BookingProfileProps> {
  render() {
    return (
      <div className="my-2 px-5 py-10 border rounded-xl">
        <div className="flex md:flex-row flex-col gap-5 justify-between items-center">
          <div className="flex flex-row gap-5 text-lg">
            <Avatar className="w-[70px] h-[70px] flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-petzy-blue-light to-petzy-coral/30 text-petzy-slate text-xl font-bold">
                {this.props.profilePic}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-2xl inline-flex items-center gap-2">
                {this.props.name}{" "}
                <span className="bg-black px-3 py-1 rounded-2xl text-xs text-white">
                  {this.props.status}
                </span>
              </div>
              <div>
                Booking Date:{" "}
                <span className="font-semibold">{this.props.date}</span> at{" "}
                <span className="font-semibold">{this.props.slot}</span>
              </div>
              <div className="inline-flex items-center gap-2 ">
                <div>
                  Pet: <span className="font-semibold">{this.props.pet}</span>
                </div>
                <div>|</div>
                <div>
                  Concern:{" "}
                  <span className="font-semibold">{this.props.concern}</span>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 ">
                  <div>
                    Sex: <span className="font-semibold">{this.props.sex}</span>
                  </div>
                  <div>|</div>
                  <div>
                    Breed:{" "}
                    <span className="font-semibold">{this.props.breed}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 ">
                  <div>
                    Birthdate:{" "}
                    <span className="font-semibold">
                      {this.props.birthdate}
                    </span>
                  </div>
                </div>
              </div>
              <div>Reason: {this.props.reason}</div>
              <div>Request Sent: {this.props.bookedAt}</div>
            </div>
          </div>
          {this.props.status === "Pending" ? (
            <div>
              <div className="flex flex-row gap-2">
                <div className="inline-flex items-center gap-2 border border-black px-2 py-1 rounded-2xl text-sm hover:bg-red-200 cursor-pointer">
                  <FaCircleXmark />
                  <span> Reject</span>
                </div>
                <div className="inline-flex items-center gap-2 border border-black px-2 py-1 rounded-2xl text-sm hover:bg-green-200 cursor-pointer">
                  <FaCircleCheck />
                  <span> Approve</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
