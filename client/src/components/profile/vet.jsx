import React from "react";
import Tippy from "@tippyjs/react";
import moment from "moment";
import { FaStar, FaCheck } from "react-icons/fa";

const VetProfile = ({
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
  const getNextAvailableSlots = (slots, limit = 2) => {
    const now = moment();
    const today = now.format("dddd").toLowerCase();
    const currentTime = now.format("HH:mm");
    const daysOrder = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    let startIndex = daysOrder.indexOf(today);
    let availableSlots = [];

    for (let i = 0; i < 14 && availableSlots.length < limit; i++) {
      const index = (startIndex + i) % 7;
      const day = daysOrder[index];
      const daySlots = slots[day];
      const currentDate = moment().add(i, "days");

      if (
        daySlots &&
        daySlots.availableSlots &&
        daySlots.availableSlots.length > 0
      ) {
        const filteredSlots =
          i === 0
            ? daySlots.availableSlots.filter((slot) => {
                const slotTime = moment(slot, "HH:mm");
                return slotTime.diff(now, "hours") >= 24;
              })
            : daySlots.availableSlots;

        if (filteredSlots.length > 0) {
          availableSlots.push({
            day:
              i >= 7
                ? currentDate.format("D MMM")
                : day.charAt(0).toUpperCase() + day.slice(1),
            time: filteredSlots[0],
          });
        }
      }
    }

    return availableSlots;
  };

  return (
    <div
      className="flex flex-col p-2 group cursor-pointer basis-1/3"
      onClick={() => router.push(`/vets/${id}?type=${type}`)}
    >
      <div className="basis-1/2 border-2 border-petzy-periwinkle p-4 md:p-6 rounded-t-3xl group-hover:bg-petzy-blue-light transition-colors py-8 md:py-14">
        <div className="flex flex-col items-center justify-center gap-4">
          <img
            src={src}
            alt={name}
            className="w-[100px] h-[100px] rounded-full"
          />
          <div className="text-center">
            <div className="text-lg md:text-xl font-bold text-zinc-800 mb-1">{name}</div>
            <div className="text-sm md:text-base text-zinc-600">{designation}</div>
          </div>
          <div className="flex flex-row gap-2 md:gap-3 text-xs md:text-sm items-center">
            <div className="inline-flex gap-1 items-center">
              <FaStar size="0.9em" />
              <div className="font-semibold text-base md:text-lg">{star}</div>
            </div>
            <div>&#183;</div>
            <div className="text-zinc-500">({reviews} Reviews)</div>
          </div>
          {verified ? (
            <div className="flex mt-2">
              <Tippy
                content="This vet has passed an extensive verification process with their ENG veterinarian license"
                className="bg-zinc-900 text-white text-center px-4 py-2 rounded-3xl text-sm"
              >
                <div className="flex flex-row items-center gap-2 bg-green-200 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-pill">
                  <FaCheck size="1em" className="text-emerald-800" />
                  <div className="text-emerald-800 font-bold">
                    License verified
                  </div>
                </div>
              </Tippy>
            </div>
          ) : null}
        </div>
      </div>
      <div className="basis-1/2 border-2 border-t-0 border-petzy-periwinkle p-4 md:p-6 rounded-b-3xl bg-petzy-mint-light shadow-soft">
        {getNextAvailableSlots(slots).map((slot, i) => (
          <div
            key={i}
            className="border-2 border-petzy-coral my-3 md:my-4 rounded-pill text-zinc-800 bg-white p-3 md:p-4 flex flex-row justify-between items-center hover:bg-petzy-coral hover:text-white transition-colors cursor-pointer text-sm md:text-base px-4 md:px-8"
            onClick={() =>
              router.push(
                `/vets/${id}?day=${slot.day.toLowerCase()}&time=${slot.time}`
              )
            }
          >
            <div>
              <span className="font-bold">{slot.day}</span> at {slot.time}
            </div>
            <div className="text-base md:text-lg font-bold transition-colors">
              &#2547;{price || 0}
            </div>
          </div>
        ))}
        <div className="text-petzy-coral text-center text-sm md:text-base font-bold mt-2">
          See your prefer {type.toLowerCase()} timeslot
        </div>
      </div>
    </div>
  );
};

export default VetProfile;

// export default class VetProfile extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     return (
//       <div
//         className="flex flex-col md:w-1/3 w-full p-2 group cursor-pointer"
//         key={this.props.id}
//         onClick={() => this.props.router.push(`/vet/${this.props.id}`)}
//       >
//         <div className="basis-1/2 border p-6 rounded-tr-lg rounded-tl-lg group-hover:bg-gray-50">
//           <div className="flex flex-row items-center gap-4" key={this.props.id}>
//             <img
//               src={this.props.src}
//               className="w-[100px] h-[100px] rounded-full"
//               alt={this.props.name}
//             />
//             <div className="basis-full">
//               <div className="text-2xl font-bold text-zinc-800">
//                 {this.props.name}
//               </div>
//               <div className="text-lg mb-3">{this.props.designation}</div>
//               <div className="flex flex-row justify-between text-lg">
//                 <div>
//                   <div className="flex flex-row gap-2 items-center">
//                     <FaStar size="1em" />
//                     <div>{this.props.star}</div>
//                     <div>&#183;</div>
//                     <div>{this.props.reviews} reviews</div>
//                   </div>
//                 </div>
//                 <PiGreaterThan size="1em" />
//               </div>
//             </div>
//           </div>
//           {this.props.verified ? (
//             <div className="flex mt-5">
//               <Tippy
//                 content="This vet has passed an extensive verification process with their ENG veterinarian license"
//                 className="bg-zinc-900 text-white text-center px-4 py-2 rounded-3xl text-sm"
//               >
//                 <div className="flex flex-row items-center gap-2 bg-green-100 px-4 py-2 text-sm rounded-2xl">
//                   <FaCheck size="1em" className="text-emerald-800" />
//                   <div className="text-emerald-800">License verified</div>
//                 </div>
//               </Tippy>
//             </div>
//           ) : null}
//         </div>
//         <div className="basis-1/2 border p-6 rounded-br-lg rounded-bl-lg bg-gray-50">
//           {this.props.slots.map((slot, i) => (
//             <div
//               key={i}
//               className="border-black border my-3 rounded-lg text-black bg-white p-4 flex flex-row justify-between items-center hover:bg-gray-100 cursor-pointer text-lg"
//             >
//               <div>
//                 <span className="font-bold">Today</span> at {slot}
//               </div>
//               <div className="text-xl">&#2547;{this.props.price}</div>
//             </div>
//           ))}
//           <div className="text-lg underline text-center mt-5">
//             See more timeslots
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
