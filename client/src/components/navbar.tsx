"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/components/providers/AuthProvider";
import { productCategories } from "@/src/lib/categories";

// Components
import MyCart from "@/src/components/cart";
import NavItem from "@/src/components/navbar/NavItem";
import Dropdown from "@/src/components/navbar/Dropdown";
import MorePetsDropdown from "@/src/components/navbar/MorePetsDropdown";
import MobileMenu from "@/src/components/navbar/MobileMenu";

// Icons (Using React Icons for consistency and modern look)
import { 
  FaMagnifyingGlass, 
  FaCartShopping, 
  FaHeart, 
  FaLocationDot, 
  FaBars, 
  FaCat, 
  FaDog, 
  FaDove,
  FaArrowRightToBracket,
  FaUser,
  FaArrowRightFromBracket,
} from "react-icons/fa6";
import { MdLocalOffer } from "react-icons/md";
// [FUTURE] Non-ecommerce icon imports — uncomment when enabling vet, adoption & pro features
// import { MdHealthAndSafety, MdVolunteerActivism } from "react-icons/md";
// import { RiVipCrownFill } from "react-icons/ri";

import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

import Logo from "@/public/logo-black.png";
import { Button } from "./ui/button";

const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  // State
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("cart")) localStorage.setItem("cart", "[]");
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (query.trim() === "") return;
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
                  <span className="truncate max-w-[120px]">Dhaka, Bangladesh</span>
                </div>
              </div>

              {/* Icons */}
              <div className="flex items-center gap-3">
                <Link href="/wishlist" className="hidden md:flex flex-col items-center group">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-petzy-slate group-hover:bg-petzy-coral group-hover:text-white transition-all duration-300">
                    <FaHeart size="1.1em" />
                  </div>
                </Link>

                {user ? (
                  <div className="hidden md:block">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="focus:outline-none">
                          <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-transparent hover:ring-petzy-coral/30 transition-all duration-300">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-gradient-to-br from-petzy-coral to-petzy-coral/70 text-white text-sm font-bold">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg">
                        <div className="px-3 py-2">
                          <p className="text-sm font-semibold text-petzy-slate truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="cursor-pointer rounded-lg"
                          onClick={() => router.push("/my-account")}
                        >
                          <FaUser className="mr-2 h-3.5 w-3.5" />
                          My Account
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer rounded-lg"
                          onClick={() => router.push("/wishlist")}
                        >
                          <FaHeart className="mr-2 h-3.5 w-3.5" />
                          Wishlist
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="cursor-pointer rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50"
                          onClick={() => logout()}
                        >
                          <FaArrowRightFromBracket className="mr-2 h-3.5 w-3.5" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <Link 
                    href="/login"
                    className="hidden md:flex flex-col items-center group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-petzy-slate group-hover:bg-petzy-coral group-hover:text-white transition-all duration-300">
                      <FaArrowRightToBracket size="1.1em" />
                    </div>
                  </Link>
                )}

                <div className="relative">
                   <Button
                      icon={<FaCartShopping />}
                      onClick={() => setCartOpen(true)}
                      className={`rounded-full flex items-center text-sm font-semibold py-2.5 ${isScrolled ? "!px-3" : "!px-5"}`}
                   >
                    {isScrolled ? "" : "Cart"} 
                   </Button>
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

               {/* [FUTURE] Non-ecommerce nav items — uncomment when enabling vet, adoption & pro features */}
               {/* <NavItem href="/vets" icon={<MdHealthAndSafety />} label="Vet Care" /> */}
               {/* <NavItem href="/adoptions" icon={<MdVolunteerActivism />} label="Adoptions" /> */}
               {/* <NavItem href="/pro" icon={<RiVipCrownFill />} label="Pro Access" /> */}
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

export default Navbar;