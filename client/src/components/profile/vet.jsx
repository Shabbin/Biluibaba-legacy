import React from "react";
import Link from "next/link";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Ensure tippy CSS is imported
import moment from "moment";
import { FaStar, FaCheck, FaCalendarCheck, FaUserDoctor } from "react-icons/fa6";

const VetProfile = ({
  src,
  name,
  designation,
  star,
  reviews,
  slots,
  verified,
  price,
  id,
  type,
}) => {
  
  // Helper to get slots (keeping your logic, just cleaning code style)
  const getNextAvailableSlots = (slotsData, limit = 2) => {
    const now = moment();
    const today = now.format("dddd").toLowerCase();
    const daysOrder = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    let startIndex = daysOrder.indexOf(today);
    let availableSlots = [];
    let checkedDays = 0;

    // Loop for next 14 days or until limit reached
    while (availableSlots.length < limit && checkedDays < 14) {
      const index = (startIndex + checkedDays) % 7;
      const dayName = daysOrder[index];
      const dayData = slotsData?.[dayName];
      const dateMoment = moment().add(checkedDays, "days");

      if (dayData?.availableSlots?.length > 0) {
        // If today, filter out past slots + buffer time (e.g. 1 hour)
        const validSlots = checkedDays === 0
          ? dayData.availableSlots.filter(s => moment(s, "HH:mm").isAfter(now.add(1, 'hour')))
          : dayData.availableSlots;

        if (validSlots.length > 0) {
          availableSlots.push({
            label: checkedDays === 0 ? "Today" : checkedDays === 1 ? "Tomorrow" : dateMoment.format("D MMM"),
            fullDate: dateMoment.format("YYYY-MM-DD"),
            day: dayName,
            time: validSlots[0] // Taking the first available slot
          });
        }
      }
      checkedDays++;
    }
    return availableSlots;
  };

  const nextSlots = getNextAvailableSlots(slots);

  return (
    <Link
      href={`/vets/${id}?type=${type}`}
      className="group relative bg-white rounded-3xl border border-gray-100 shadow-soft hover:shadow-xl hover:shadow-petzy-blue-light/50 transition-all duration-300 flex flex-col overflow-hidden h-full transform hover:-translate-y-1"
    >
      {/* Top Section: Profile Info */}
      <div className="p-6 flex flex-col items-center flex-grow bg-gradient-to-b from-white to-gray-50/50">
        
        {/* Avatar with Status Dot */}
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-full p-1 bg-white border-2 border-petzy-blue-light/30 shadow-sm group-hover:border-petzy-coral/30 transition-colors duration-300">
             <img
               src={src || "/default-vet.png"} // Fallback image
               alt={name}
               className="w-full h-full rounded-full object-cover"
             />
          </div>
          {/* Verified Badge Absolute */}
          {verified && (
             <Tippy content="Verified License" placement="bottom">
                <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md">
                   <div className="bg-green-500 text-white p-1 rounded-full text-[10px]">
                      <FaCheck />
                   </div>
                </div>
             </Tippy>
          )}
        </div>

        {/* Text Details */}
        <div className="text-center mb-3">
          <h3 className="text-xl font-bold text-petzy-slate group-hover:text-petzy-coral transition-colors duration-300 line-clamp-1">
            {name}
          </h3>
          <p className="text-sm text-petzy-slate-light font-medium uppercase tracking-wide mt-1 line-clamp-1">
            {designation}
          </p>
        </div>

        {/* Rating Pill */}
        <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100 mb-4">
          <FaStar className="text-yellow-400 text-sm" />
          <span className="text-xs font-bold text-petzy-slate">{star}.0</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500 underline decoration-gray-300">{reviews} reviews</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 w-full"></div>

      {/* Bottom Section: Slots */}
      <div className="p-4 bg-white">
        {nextSlots.length > 0 ? (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 pl-1">Next Available</p>
            {nextSlots.map((slot, i) => (
              <Link
                key={i}
                href={`/vets/${id}?day=${slot.day}&time=${slot.time}`}
                onClick={(e) => e.stopPropagation()}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-petzy-blue-light/30 bg-petzy-blue-light/10 hover:bg-petzy-coral hover:border-petzy-coral hover:text-white transition-all duration-300 group/btn"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-petzy-slate group-hover/btn:text-white">
                  <FaCalendarCheck className="text-petzy-coral group-hover/btn:text-white transition-colors" />
                  <span>{slot.label}, {slot.time}</span>
                </div>
                <div className="text-sm font-bold text-petzy-slate group-hover/btn:text-white">
                  ৳{price}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
             <div className="bg-gray-100 inline-flex p-3 rounded-full text-gray-400 mb-2">
                <FaUserDoctor size="1.2em"/>
             </div>
             <p className="text-sm text-gray-500 font-medium">No slots available soon</p>
          </div>
        )}
        
        {/* View Profile Link */}
        <div className="mt-4 text-center">
           <span className="text-xs font-bold text-petzy-coral hover:underline cursor-pointer">
              View Full Profile
           </span>
        </div>
      </div>
    </Link>
  );
};

export default VetProfile;