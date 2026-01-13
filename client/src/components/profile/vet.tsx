'use client';

import React from 'react';
import Tippy from '@tippyjs/react';
import moment from 'moment';
import { FaStar, FaCheck } from 'react-icons/fa';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface VetSlots {
  availableSlots?: string[];
}

interface VetSlotsMap {
  sunday?: VetSlots;
  monday?: VetSlots;
  tuesday?: VetSlots;
  wednesday?: VetSlots;
  thursday?: VetSlots;
  friday?: VetSlots;
  saturday?: VetSlots;
  [key: string]: VetSlots | undefined;
}

interface AvailableSlot {
  day: string;
  time: string;
}

interface VetProfileProps {
  src: string;
  name: string;
  designation: string;
  star: number;
  reviews: number;
  slots: VetSlotsMap;
  verified: boolean;
  price?: number;
  router: AppRouterInstance;
  id: string;
  type: string;
}

const getNextAvailableSlots = (slots: VetSlotsMap, limit: number = 2): AvailableSlot[] => {
  const now = moment();
  const today = now.format('dddd').toLowerCase();
  const daysOrder = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  const startIndex = daysOrder.indexOf(today);
  const availableSlots: AvailableSlot[] = [];

  for (let i = 0; i < 14 && availableSlots.length < limit; i++) {
    const index = (startIndex + i) % 7;
    const day = daysOrder[index];
    const daySlots = slots[day];
    const currentDate = moment().add(i, 'days');

    if (daySlots?.availableSlots && daySlots.availableSlots.length > 0) {
      const filteredSlots =
        i === 0
          ? daySlots.availableSlots.filter((slot) => {
              const slotTime = moment(slot, 'HH:mm');
              return slotTime.diff(now, 'hours') >= 24;
            })
          : daySlots.availableSlots;

      if (filteredSlots.length > 0) {
        availableSlots.push({
          day:
            i >= 7
              ? currentDate.format('D MMM')
              : day.charAt(0).toUpperCase() + day.slice(1),
          time: filteredSlots[0],
        });
      }
    }
  }

  return availableSlots;
};

const VetProfile: React.FC<VetProfileProps> = ({
  src,
  name,
  designation,
  star,
  reviews,
  slots,
  verified,
  price,
  router,
  id,
  type,
}) => {
  return (
    <div
      className="flex flex-col p-2 group cursor-pointer basis-1/3"
      onClick={() => router.push(`/vets/${id}?type=${type}`)}
    >
      <div className="basis-1/2 border p-6 rounded-tr-lg rounded-tl-lg group-hover:bg-gray-50 py-14">
        <div className="flex flex-col items-center justify-center gap-4">
          <img
            src={src}
            alt={name}
            className="w-[100px] h-[100px] rounded-full"
          />
          <div className="text-center">
            <div className="text-xl font-bold text-zinc-800 mb-1">{name}</div>
            <div className="text-zinc-600">{designation}</div>
          </div>
          <div className="flex flex-row gap-3 text-sm items-center">
            <div className="inline-flex gap-1 items-center">
              <FaStar size="1em" />
              <div className="font-semibold text-lg">{star}</div>
            </div>
            <div>&#183;</div>
            <div className="text-zinc-500">({reviews} Reviews)</div>
          </div>
          {verified && (
            <div className="flex mt-2">
              <Tippy
                content="This vet has passed an extensive verification process with their ENG veterinarian license"
                className="bg-zinc-900 text-white text-center px-4 py-2 rounded-3xl text-sm"
              >
                <div className="flex flex-row items-center gap-2 bg-green-200 px-4 py-2 text-sm rounded-2xl">
                  <FaCheck size="1em" className="text-emerald-800" />
                  <div className="text-emerald-800 font-bold">License verified</div>
                </div>
              </Tippy>
            </div>
          )}
        </div>
      </div>
      <div className="basis-1/2 border p-6 rounded-br-lg rounded-bl-lg bg-gray-50">
        {getNextAvailableSlots(slots).map((slot, i) => (
          <div
            key={i}
            className="border my-4 rounded-full text-black bg-white p-4 flex flex-row justify-between items-center hover:bg-gray-100 cursor-pointer text-lg px-8"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/vets/${id}?day=${slot.day.toLowerCase()}&time=${slot.time}`);
            }}
          >
            <div>
              <span className="font-bold">{slot.day}</span> at {slot.time}
            </div>
            <div className="text-xl text-red-500 font-bold">&#2547;{price || 0}</div>
          </div>
        ))}
        <div className="text-green-600 text-center text-lg font-bold">
          See your prefer {type.toLowerCase()} timeslot
        </div>
      </div>
    </div>
  );
};

export default VetProfile;
