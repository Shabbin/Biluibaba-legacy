import Link from "next/link";
import { FaChevronDown } from "react-icons/fa6";
import { GiRabbit, GiTropicalFish } from "react-icons/gi";

const MorePetsDropdown = () => (
  <div className="group relative py-2">
    <button className="flex items-center gap-2 text-sm font-bold text-petzy-slate hover:text-petzy-coral transition-colors">
      <GiRabbit className="text-lg" />
      <span>More Pets</span>
      <FaChevronDown className="text-[10px] opacity-50 group-hover:opacity-100 transition-opacity" />
    </button>
    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-soft-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:-translate-y-1 z-50 p-2">
       <Link href="/products?pet=rabbit" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-petzy-mint-light text-petzy-slate text-sm font-medium transition-colors">
          <GiRabbit /> Rabbit
       </Link>
       <Link href="/products?pet=fish" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-petzy-mint-light text-petzy-slate text-sm font-medium transition-colors">
          <GiTropicalFish /> Fish
       </Link>
    </div>
  </div>
);

export default MorePetsDropdown;
