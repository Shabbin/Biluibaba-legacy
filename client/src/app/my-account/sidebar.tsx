"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button"; // Importing YOUR component

import {
  FaUser,
  FaMapLocationDot,
  FaBoxOpen,
  FaBan,
  FaRotateLeft,
  FaUserDoctor,
  FaHouseMedical,
  FaTruckMedical,
  FaKitMedical,
  FaSyringe,
  FaPaw,
  FaHeart,
  FaHandHoldingDollar,
  FaBell,
  FaCrown,
  FaRightFromBracket,
  FaFileCirclePlus
} from "react-icons/fa6";

interface SidebarItem {
  title: string;
  items?: {
    href: string;
    label: string;
    icon: React.ReactNode;
  }[];
  href?: string;
  icon?: React.ReactNode;
}

const sidebarNav: SidebarItem[] = [
  {
    title: "My Account",
    items: [
      { href: "/my-account", label: "My Profile", icon: <FaUser /> },
      { href: "/my-account/address", label: "Address Book", icon: <FaMapLocationDot /> },
    ],
  },
  {
    title: "My Orders",
    items: [
      { href: "/my-account/orders?type=all", label: "All Orders", icon: <FaBoxOpen /> },
      { href: "/my-account/orders?type=cancelled", label: "Cancellations", icon: <FaBan /> },
      { href: "/my-account/orders?type=returns", label: "Returns", icon: <FaRotateLeft /> },
    ],
  },
  // [FUTURE] Vet Bookings — uncomment when enabling vet features
  // {
  //   title: "My Bookings",
  //   items: [
  //     { href: "/my-account/vet?type=online", label: "Online Vet", icon: <FaUserDoctor /> },
  //     { href: "/my-account/vet?type=physical", label: "Clinic Visit", icon: <FaHouseMedical /> },
  //     { href: "/my-account/vet?type=homeService", label: "Home Service", icon: <FaTruckMedical /> },
  //     { href: "/my-account/vet?type=emergency", label: "Emergency", icon: <FaKitMedical /> },
  //     { href: "/my-account/vet?type=vaccine", label: "Vaccination", icon: <FaSyringe /> },
  //     { href: "/my-account/vet?type=neutered", label: "Spay/Neuter", icon: <FaPaw /> },
  //   ],
  // },
  // [FUTURE] Adoptions — uncomment when enabling adoption features
  // {
  //   title: "Adoptions",
  //   items: [
  //     { href: "/adoptions/post", label: "Create Post", icon: <FaFileCirclePlus /> },
  //     { href: "/my-account/adoptions", label: "My Adoptions", icon: <FaPaw /> },
  //     { href: "/my-account/adoptions/wishlist", label: "Adoption Wishlist", icon: <FaHeart /> },
  //   ],
  // },
  // Single Link Groups
  // [FUTURE] Non-ecommerce single links — uncomment when enabling these features
  // { title: "Donations", href: "/my-account/donations", icon: <FaHandHoldingDollar /> },
  // { title: "Subscription", href: "/my-account/subscription", icon: <FaCrown /> },
  { title: "Notifications", href: "/my-account/notifications", icon: <FaBell /> },
  { title: "Wishlist", href: "/wishlist", icon: <FaHeart /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Helper to determine active styles
  const getButtonClass = (isActive: boolean) => {
    // We override justify-center (default in your button) to justify-start for sidebar alignment
    // We override rounded-pill to rounded-xl for better list stacking
    const base = "w-full !justify-start !rounded-xl mb-1 !text-sm !py-3 transition-all duration-200";
    
    if (isActive) {
      return `${base} bg-petzy-coral text-white shadow-md`;
    }
    return `${base} text-gray-500 bg-transparent hover:bg-gray-50 hover:text-petzy-coral`;
  };

  return (
    <div className="pb-12 min-h-screen border-r border-slate-200 bg-white">
      <div className="space-y-6 py-6 px-4">
        
        {sidebarNav.map((section, i) => (
          <div key={i}>
            {/* If it's a group with items */}
            {section.items ? (
              <>
                <h2 className="mb-3 px-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                  {section.title}
                </h2>
                <div className="flex flex-col">
                  {section.items.map((item) => (
                    <Button
                      key={item.href}
                      text={item.label}
                      icon={item.icon}
                      iconAlign="left"
                      
                      // Passing "custom" or any string not "default"/"outline" allows us to fully control style via className
                      type="custom" 
                      onClick={() => router.push(item.href)}
                      className={`${getButtonClass(pathname === item.href)} flex items-center justify-center px-3`}
                    />
                  ))}
                </div>
              </>
            ) : (
              /* If it's a single link section (like Notifications) */
              <div className="mt-2">
                 <Button
                    text={section.title}
                    icon={section.icon}
                    iconAlign="left"
                    type="custom"
                    onClick={() => router.push(section.href!)}
                    className={`${getButtonClass(pathname === section.href)} flex items-center justify-center px-3`}
                  />
              </div>
            )}
          </div>
        ))}

        {/* Logout Section */}
        <div className="pt-4 border-t border-gray-100">
          <Button
            text="Logout"
            icon={<FaRightFromBracket />}
            iconAlign="left"
            type="custom"
            onClick={() => router.push("/logout")}
            className="w-full !justify-start !rounded-xl !text-sm !py-3 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center px-3"
          />
        </div>

      </div>
    </div>
  );
}