"use client";

import BookingProfile from "@/src/components/booking";

export default function Booking(): JSX.Element {
  return (
    <div>
      <div className="flex flex-row flex-nowrap items-center my-5">
        <div className="flex-grow block border-t border-gray-500"></div>
        <div className="flex-none block mx-4 px-4 py-2.5 text-xl text-gray-500 font-bold">
          Pending approval
        </div>
        <div className="flex-grow block border-t border-gray-500"></div>
      </div>
      <BookingProfile
        profilePic="A"
        name="Aminul Islam"
        status="Pending"
        date="Sunday, September 8, 2024"
        slot="11:30 AM"
        pet="Dog"
        reason="Dolor minim Lorem quis est aliqua. Mollit veniam incididunt veniam incididunt proident irure proident cillum sunt est anim tempor do. Sunt adipisicing voluptate enim excepteur incididunt sint consequat dolore sit fugiat dolore."
        concern="Flea and Ticks"
        bookedAt="Tuesday, September 3, 2024 at 8:04 PM"
        sex="Male"
        breed="German Shepherd"
        birthdate="12/02/2016"
      />
      <BookingProfile
        profilePic="A"
        name="Asif Mostafa Hossain"
        status="Pending"
        date="Tuesday, September 10, 2024"
        slot="1:30 PM"
        pet="Cat"
        reason="Dolor minim Lorem quis est aliqua. Mollit veniam incididunt veniam incididunt proident irure proident cillum sunt est anim tempor do. Sunt adipisicing voluptate enim excepteur incididunt sint consequat dolore sit fugiat dolore."
        concern="Skin and ear infections"
        bookedAt="Wednesday, September 4, 2024 at 10:33 PM"
        sex="Male"
        breed="Street cat"
        birthdate="12/02/2016"
      />

      <div className="flex flex-row flex-nowrap items-center my-5">
        <div className="flex-grow block border-t border-gray-500"></div>
        <div className="flex-none block mx-4 px-4 py-2.5 text-xl text-gray-500 font-bold">
          All bookings
        </div>
        <div className="flex-grow block border-t border-gray-500"></div>
      </div>

      <BookingProfile
        profilePic="R"
        name="Rafi Adil"
        status="Approved"
        date="Tuesday, September 4, 2024"
        slot="2:40 PM"
        pet="Dog"
        reason="Dolor minim Lorem quis est aliqua. Mollit veniam incididunt veniam incididunt proident irure proident cillum sunt est anim tempor do. Sunt adipisicing voluptate enim excepteur incididunt sint consequat dolore sit fugiat dolore."
        concern="Skin and ear infections"
        bookedAt="Sunday, September 1, 2024 at 12:10 PM"
        sex="Male"
        breed="Chihuahua"
        birthdate="12/02/2022"
      />

      <BookingProfile
        profilePic="A"
        name="Nahian Khan"
        status="Declined"
        date="Tuesday, September 5, 2024"
        slot="1:30 PM"
        pet="Cat"
        reason="Dolor minim Lorem quis est aliqua. Mollit veniam incididunt veniam incididunt proident irure proident cillum sunt est anim tempor do. Sunt adipisicing voluptate enim excepteur incididunt sint consequat dolore sit fugiat dolore."
        concern="Skin and ear infections"
        bookedAt="Monday, September 2, 2024 at 4:20 PM"
        sex="Male"
        breed="Street cat"
        birthdate="12/02/2016"
      />
    </div>
  );
}
