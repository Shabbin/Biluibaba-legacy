"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/components/providers/AuthProvider";
import axios from "@/src/lib/axiosInstance";
import { productCategories } from "@/src/lib/categories";

// Components
import MyCart from "@/src/components/cart";
import Button from "@/src/components/ui/button";

// Icons (Using React Icons for consistency and modern look)
import { 
  FaMagnifyingGlass, 
  FaCartShopping, 
  FaUser, 
  FaHeart, 
  FaLocationDot, 
  FaBars, 
  FaXmark, 
  FaCat, 
  FaDog, 
  FaDove, 
  FaChevronDown, 
  FaChevronRight,
  FaArrowRight
} from "react-icons/fa6";
import { GiRabbit, GiTropicalFish } from "react-icons/gi";
import { MdLocalOffer, MdHealthAndSafety, MdVolunteerActivism } from "react-icons/md";
import { RiVipCrownFill } from "react-icons/ri";

import Logo from "@/public/logo-black.png";

const Navbar = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  // State
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [locationName, setLocationName] = useState("Dhaka, Bangladesh");

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Location Logic
  const getUserCoordinates = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) reject(new Error("Geolocation not supported"));
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err.message)
      );
    });
  };

  const getLocation = async () => {
    try {
      const { lat, lng } = await getUserCoordinates();
      // Mocking the call for UI demo purposes, replace with your actual API
      // const { data } = await axios.get(`/location?lat=${lat}&lng=${lng}`);
      // if (data.success) localStorage.setItem("location", JSON.stringify(data));
      setLocationName("Current Location"); 
    } catch (error) {
      console.error("Location Error:", error);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("cart")) localStorage.setItem("cart", "[]");
    getLocation();
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (query.trim() === "") return router.push("/");
      router.push(`/search?query=${query}`);
    }
  };

  return (
    <>
      {/* Spacer to prevent content jump when fixed */}
      <div className="h-[140px] md:h-[160px] hidden" /> 

      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-md py-2" : "bg-white py-4"
        }`}
      >
        {/* --- TOP ROW: Logo, Search, Actions --- */}
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between gap-6">
            
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image 
                src={Logo} 
                className={`transition-all duration-300 ${isScrolled ? "w-[160px]" : "w-[180px] md:w-[220px]"}`} 
                alt="Biluibaba Logo" 
                priority
              />
            </Link>

            {/* Search Bar (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-auto relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-petzy-slate-light group-focus-within:text-petzy-coral transition-colors">
                <FaMagnifyingGlass />
              </div>
              <input 
                type="text"
                className="w-full bg-gray-50 border border-gray-200 text-petzy-slate text-sm rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-petzy-coral/20 focus:border-petzy-coral transition-all shadow-sm group-hover:shadow-md"
                placeholder="Search for 'Royal Canin' or 'Cat Toys'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              <button 
                onClick={handleSearch}
                className="absolute right-2 top-1.5 bottom-1.5 bg-petzy-slate hover:bg-petzy-coral text-white px-5 rounded-full text-sm font-bold transition-colors"
              >
                Search
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 md:gap-6">
              
              {/* Location (Hidden on small screens) */}
              <div className="hidden xl:flex flex-col items-end text-right">
                <span className="text-[10px] font-bold text-petzy-slate-light uppercase tracking-wide">Delivering To</span>
                <div className="flex items-center gap-1 text-xs font-bold text-petzy-slate cursor-pointer hover:text-petzy-coral transition-colors">
                  <FaLocationDot className="text-petzy-coral" />
                  <span className="truncate max-w-[120px]">{locationName}</span>
                </div>
              </div>

              {/* Icons */}
              <div className="flex items-center gap-3">
                <Link href="/wishlist" className="hidden md:flex flex-col items-center group">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-petzy-slate group-hover:bg-petzy-coral group-hover:text-white transition-all duration-300">
                    <FaHeart size="1.1em" />
                  </div>
                </Link>

                <div 
                  className="hidden md:flex flex-col items-center group cursor-pointer"
                  onClick={() => user ? router.push("/my-account") : router.push("/login")}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-petzy-slate group-hover:bg-petzy-coral group-hover:text-white transition-all duration-300">
                    <FaUser size="1.1em" />
                  </div>
                </div>

                <div className="relative">
                   <Button
                      icon={<FaCartShopping />}
                      text={isScrolled ? "" : "Cart"}
                      onClick={() => setCartOpen(true)}
                      className={`rounded-full flex items-center text-sm font-semibold py-2.5 ${isScrolled ? "!px-3" : "!px-5"}`}
                   />
                   {/* Cart Badge Placeholder if needed */}
                   {/* <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white text-[10px] text-white flex items-center justify-center font-bold">2</span> */}
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                  className="lg:hidden text-petzy-slate hover:text-petzy-coral transition-colors p-2"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <FaBars size="1.5em" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM ROW: Navigation (Desktop) --- */}
        <div className={`hidden lg:block border-t border-gray-100 mt-4 ${isScrolled ? "hidden" : "block"}`}>
          <div className="container mx-auto px-6">
            <nav className="flex items-center justify-center gap-8 py-3">
               <NavItem href="/best-deals" icon={<MdLocalOffer />} label="Best Deals" highlight />
               
               <Dropdown 
                  label="Cats" 
                  icon={<FaCat />} 
                  category={productCategories.find(c => c.name === "Cat")} 
               />
               
               <Dropdown 
                  label="Dogs" 
                  icon={<FaDog />} 
                  category={productCategories.find(c => c.name === "Dog")} 
               />
               
               <Dropdown 
                  label="Birds" 
                  icon={<FaDove />} 
                  category={productCategories.find(c => c.name === "Bird")} 
               />

               <MorePetsDropdown />

               <div className="w-px h-6 bg-gray-200 mx-2"></div>

               <NavItem href="/vets" icon={<MdHealthAndSafety />} label="Vet Care" />
               <NavItem href="/adoptions" icon={<MdVolunteerActivism />} label="Adoptions" />
               <NavItem href="/pro" icon={<RiVipCrownFill />} label="Pro Access" />
            </nav>
          </div>
        </div>
      </header>

      {/* --- MOBILE SEARCH BAR (Visible below header on mobile) --- */}
      <div className="lg:hidden fixed top-[70px] left-0 w-full px-4 z-40 bg-white pb-3 shadow-sm">
        <div className="relative">
            <input 
                type="text"
                className="w-full bg-gray-100 border-none text-petzy-slate text-sm rounded-xl py-3 pl-10 focus:ring-2 focus:ring-petzy-coral/50"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
            />
            <FaMagnifyingGlass className="absolute left-3.5 top-3.5 text-gray-400" />
        </div>
      </div>

      {/* --- CART DRAWER --- */}
      <MyCart toggle={cartOpen} toggler={setCartOpen} />

      {/* --- MOBILE MENU DRAWER --- */}
      <MobileMenu 
         isOpen={mobileMenuOpen} 
         onClose={() => setMobileMenuOpen(false)} 
         user={user} 
      />
    </>
  );
};

// --- SUB-COMPONENTS ---

const NavItem = ({ href, icon, label, highlight }) => (
  <Link 
    href={href} 
    className={`flex items-center gap-2 text-sm font-bold transition-colors duration-300 ${
       highlight ? "text-petzy-coral hover:text-petzy-slate" : "text-petzy-slate hover:text-petzy-coral"
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </Link>
);

const Dropdown = ({ label, icon, category }) => {
  return (
    <div className="group relative py-2">
      <button className="flex items-center gap-2 text-sm font-bold text-petzy-slate hover:text-petzy-coral transition-colors">
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
        <FaChevronDown className="text-[10px] opacity-50 group-hover:opacity-100 transition-opacity" />
      </button>
      
      {/* Dropdown Card */}
      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-soft-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:-translate-y-1 z-50 overflow-hidden">
         <div className="p-2">
           {category?.categories.map((sub, idx) => (
             <div key={idx} className="group/item relative">
               <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-petzy-mint-light cursor-pointer text-petzy-slate text-sm font-medium transition-colors">
                  {sub.name}
                  {sub.items && <FaChevronRight className="text-xs text-petzy-coral opacity-0 group-hover/item:opacity-100" />}
               </div>
               
               {/* Nested Sub-Menu */}
               {sub.items && (
                 <div className="absolute top-0 left-full ml-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-gray-100 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-300 z-50 p-2">
                    {sub.items.map((item, j) => (
                      <Link 
                        key={j}
                        href={`/products?pet=${category.slug}&category=${sub.slug}&sub=${item.slug}`}
                        className="block px-4 py-2.5 rounded-xl hover:bg-petzy-mint-light text-petzy-slate-light hover:text-petzy-slate text-sm transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                 </div>
               )}
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};

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

export default Navbar;