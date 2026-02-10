import Link from "next/link";
import Image from "next/image";
import { FaXmark, FaUser, FaHeart } from "react-icons/fa6";
import { FaCat, FaDog, FaDove } from "react-icons/fa6";
import { GiRabbit } from "react-icons/gi";
import { MdLocalOffer, MdHealthAndSafety, MdVolunteerActivism } from "react-icons/md";

import Logo from "@/public/logo-black.png";

const MobileMenu = ({ isOpen, onClose, user }) => (
  <>
    {/* Overlay */}
    <div 
      className={`fixed inset-0 bg-petzy-slate/60 backdrop-blur-sm z-[90] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      onClick={onClose}
    />
    
    {/* Side Sheet */}
    <div className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-[100] shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
       <div className="p-5 flex items-center justify-between border-b border-gray-100">
          <Image src={Logo} width={140} alt="Logo" />
          <button onClick={onClose} className="text-petzy-slate hover:text-petzy-coral p-2">
             <FaXmark size="1.5em" />
          </button>
       </div>

       <div className="p-5 overflow-y-auto h-[calc(100vh-80px)]">
          {/* User Section Mobile */}
          <div className="mb-6 p-4 bg-petzy-blue-light/20 rounded-2xl flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-petzy-coral shadow-sm">
                <FaUser />
             </div>
             <div>
                {user ? (
                   <>
                     <div className="font-bold text-petzy-slate">Hello, User</div>
                     <Link href="/my-account" className="text-xs text-petzy-coral font-bold hover:underline">My Account</Link>
                   </>
                ) : (
                   <Link href="/login" className="font-bold text-petzy-slate hover:text-petzy-coral">Login / Register</Link>
                )}
             </div>
          </div>

          <nav className="flex flex-col gap-2">
             <MobileLink href="/best-deals" icon={<MdLocalOffer />} label="Best Deals" />
             <div className="my-2 border-t border-gray-100" />
             
             {/* Simple Expandable logic can be added here, for now linear list */}
             <div className="text-xs font-bold text-petzy-slate-light uppercase tracking-wider mb-2 mt-2">Categories</div>
             <MobileLink href="/products?pet=cat" icon={<FaCat />} label="Cat Supplies" />
             <MobileLink href="/products?pet=dog" icon={<FaDog />} label="Dog Supplies" />
             <MobileLink href="/products?pet=bird" icon={<FaDove />} label="Bird Supplies" />
             <MobileLink href="/products?pet=rabbit" icon={<GiRabbit />} label="Small Pets" />

             <div className="my-2 border-t border-gray-100" />
             <div className="text-xs font-bold text-petzy-slate-light uppercase tracking-wider mb-2 mt-2">Services</div>
             <MobileLink href="/vets" icon={<MdHealthAndSafety />} label="Vet Consultation" />
             <MobileLink href="/adoptions" icon={<MdVolunteerActivism />} label="Adoptions" />
             <MobileLink href="/wishlist" icon={<FaHeart />} label="My Wishlist" />
          </nav>
       </div>
    </div>
  </>
);

const MobileLink = ({ href, icon, label }) => (
  <Link href={href} className="flex items-center gap-4 p-3 rounded-xl text-petzy-slate hover:bg-gray-50 hover:text-petzy-coral transition-colors font-medium">
     <span className="text-lg opacity-70">{icon}</span>
     {label}
  </Link>
);

export default MobileMenu;
