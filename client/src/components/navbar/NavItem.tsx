import React from "react";
import Link from "next/link";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  highlight?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, highlight }) => (
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

export default NavItem;
