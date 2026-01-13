'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import { ArrowRight, ArrowLeft } from '@/src/components/svg';
import { IoCalendarClearOutline } from 'react-icons/io5';

interface AvailableSlots {
  availableSlots?: string[];
}

interface AvailableSlotsMap {
  sunday?: AvailableSlots;
  monday?: AvailableSlots;
  tuesday?: AvailableSlots;
  wednesday?: AvailableSlots;
  thursday?: AvailableSlots;
  friday?: AvailableSlots;
  saturday?: AvailableSlots;
  [key: string]: AvailableSlots | undefined;
}

interface CalendarSlot {
  date: number;
  day: string;
  fullDate: string;
  available: boolean;
  current: boolean;
  dateObj: Date;
}

interface CalendarProps {
  date: string;
  setDate: (date: string) => void;
  availableSlots: AvailableSlotsMap;
}

const Calendar: React.FC<CalendarProps> = ({ date, setDate, availableSlots }) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [slots, setSlots] = useState<CalendarSlot[]>([]);
  const [slotDate, setSlotDate] = useState(date);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const dates: CalendarSlot[] = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const todayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todaySlots = availableSlots?.[todayName];
    const isTodayAvailable = todaySlots?.availableSlots && todaySlots.availableSlots.length > 0;

    let startDate: Date;
    if (isTodayAvailable) {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() + 1);
    } else {
      startDate = new Date(now);
    }

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(endDate.getDate() - 1);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const daySlots = availableSlots?.[dayName];
      const hasAvailableSlots = daySlots?.availableSlots && daySlots.availableSlots.length > 0;

      const currentDate = new Date(d);
      const nowDate = new Date();
      nowDate.setHours(0, 0, 0, 0);

      if (currentDate >= nowDate) {
        dates.push({
          date: currentDate.getDate(),
          day: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
          fullDate: `${currentDate.toLocaleDateString('en-US', {
            weekday: 'long',
          })}, ${currentDate.toLocaleDateString('en-US', {
            month: 'long',
          })} ${currentDate.getDate()}, ${currentDate.getFullYear()}`,
          available: hasAvailableSlots || false,
          current: currentDate.toDateString() === nowDate.toDateString(),
          dateObj: currentDate,
        });
      }
    }

    setSlots(dates);

    if (initialLoad) {
      const nextAvailableDate = dates.find((slot) => slot.available);
      if (nextAvailableDate) {
        setSlotDate(nextAvailableDate.fullDate);
        setDate(nextAvailableDate.fullDate);

        const slideIndex = Math.floor(dates.indexOf(nextAvailableDate) / 7);
        if (swiperRef.current && slideIndex > 0) {
          setTimeout(() => {
            swiperRef.current?.slideTo(slideIndex);
          }, 100);
        }
      }
      setInitialLoad(false);
    }
  }, [date, availableSlots, setDate, initialLoad]);

  const handleDateSelect = (slot: CalendarSlot): void => {
    if (slot.available) {
      const newDate = slot.fullDate;
      setSlotDate(newDate);
      setDate(newDate);
    }
  };

  const formattedSelectedDate =
    slotDate || slots.find((slot) => slot.available)?.fullDate || 'No available dates';

  return (
    <div className="my-5">
      <div className="flex flex-row items-center justify-between mb-5">
        <div className="text-lg font-bold">
          {new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </div>
        <div className="flex gap-x-3">
          <button
            className="cursor-pointer focus:outline-none"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous dates"
          >
            <ArrowLeft className="text-[2em]" />
          </button>
          <button
            className="cursor-pointer focus:outline-none"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next dates"
          >
            <ArrowRight className="text-[2em]" />
          </button>
        </div>
      </div>
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation]}
        slidesPerView={5}
        spaceBetween={10}
        className="my-5 max-w-[450px]"
        initialSlide={0}
      >
        {slots.map((slot, index) => (
          <SwiperSlide key={index}>
            <div
              className={`
                border rounded-2xl w-[5rem] h-[5rem] flex flex-col items-center justify-center
                ${
                  slot.available
                    ? 'border-black hover:bg-neutral-50 hover:border-2 cursor-pointer'
                    : 'border-gray-300 bg-gray-100 cursor-not-allowed'
                }
                ${slot.fullDate === slotDate ? 'border-2 bg-neutral-100' : 'border-1'}
                transition-all duration-200
              `}
              onClick={() => handleDateSelect(slot)}
            >
              <div
                className={`text-xs font-medium ${
                  slot.available ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {slot.day}
              </div>
              <div
                className={`text-lg font-bold ${slot.available ? 'text-black' : 'text-gray-400'}`}
              >
                {slot.date}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex flex-row items-center gap-2">
        <IoCalendarClearOutline size="1.2em" />
        <div className="text-lg">{formattedSelectedDate}</div>
      </div>
    </div>
  );
};

export default Calendar;
