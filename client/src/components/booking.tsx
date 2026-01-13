'use client';

import React from 'react';
import { FaCircleXmark, FaCircleCheck } from 'react-icons/fa6';

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
  onReject?: () => void;
  onApprove?: () => void;
}

const BookingProfile: React.FC<BookingProfileProps> = ({
  profilePic,
  name,
  status,
  date,
  slot,
  pet,
  concern,
  sex,
  breed,
  birthdate,
  reason,
  bookedAt,
  onReject,
  onApprove,
}) => {
  return (
    <div className="my-2 px-5 py-10 border rounded-xl">
      <div className="flex md:flex-row flex-col gap-5 justify-between items-center">
        <div className="flex flex-row gap-5 text-lg">
          <div className="max-w-[70px] max-h-[70px] w-[70px] h-[70px] basis-full bg-gray-200 rounded-full inline-flex items-center justify-center">
            {profilePic}
          </div>
          <div>
            <div className="text-2xl inline-flex items-center gap-2">
              {name}{' '}
              <span className="bg-black px-3 py-1 rounded-2xl text-xs text-white">
                {status}
              </span>
            </div>
            <div>
              Booking Date: <span className="font-semibold">{date}</span> at{' '}
              <span className="font-semibold">{slot}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <div>
                Pet: <span className="font-semibold">{pet}</span>
              </div>
              <div>|</div>
              <div>
                Concern: <span className="font-semibold">{concern}</span>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2">
                <div>
                  Sex: <span className="font-semibold">{sex}</span>
                </div>
                <div>|</div>
                <div>
                  Breed: <span className="font-semibold">{breed}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2">
                <div>
                  Birthdate: <span className="font-semibold">{birthdate}</span>
                </div>
              </div>
            </div>
            <div>Reason: {reason}</div>
            <div>Request Sent: {bookedAt}</div>
          </div>
        </div>
        {status === 'Pending' && (
          <div>
            <div className="flex flex-row gap-2">
              <div
                className="inline-flex items-center gap-2 border border-black px-2 py-1 rounded-2xl text-sm hover:bg-red-200 cursor-pointer"
                onClick={onReject}
              >
                <FaCircleXmark />
                <span>Reject</span>
              </div>
              <div
                className="inline-flex items-center gap-2 border border-black px-2 py-1 rounded-2xl text-sm hover:bg-green-200 cursor-pointer"
                onClick={onApprove}
              >
                <FaCircleCheck />
                <span>Approve</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingProfile;
