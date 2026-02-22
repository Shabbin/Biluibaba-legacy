import React from "react";
import Link from "next/link";
import { IconType } from "react-icons";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaXTwitter,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaArrowRight,
  FaLocationDot,
} from "react-icons/fa6";
import { WavyDivider } from "./ui";

interface FooterLinkProps {
  href?: string;
  children: React.ReactNode;
}

interface SocialIconProps {
  Icon: IconType;
  href?: string;
}

// Helper component for consistent, animated links
const FooterLink: React.FC<FooterLinkProps> = ({ href = "#", children }) => (
  <Link 
    href={href} 
    className="group flex items-center text-petzy-slate-light hover:text-petzy-coral transition-all duration-300 py-1"
  >
    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 opacity-0 group-hover:opacity-100 text-petzy-coral">
      <FaArrowRight className="text-xs mr-2" />
    </span>
    <span className="group-hover:translate-x-1 transition-transform duration-300">
      {children}
    </span>
  </Link>
);

const SocialIcon: React.FC<SocialIconProps> = ({ Icon, href = "#" }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-full bg-white text-petzy-slate hover:bg-petzy-coral hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
  >
    <Icon size="1.2em" />
  </a>
);

const Footer = () => {
  const popularSearches = [
    "Dog Food", "Collars & Leashes", "Me-O", "Cat Clothes", "Cat Litter", 
    "Dog Raincoat", "Dog Toys", "Dog Beds", "Veg Dog Food", "Cat Dry Food", 
    "Pet Pharmacy", "Pedigree", "Royal Canin", "Dog Grooming", "Whiskas", 
    "Cat Wet Food", "Travel Supplies"
  ];

  return (
    <footer className="relative bg-petzy-periwinkle-light overflow-hidden">
      {/* Decorative Wavy Divider */}
      <div className="absolute top-0 left-0 w-full text-petzy-periwinkle-light -mt-1 z-10">
        <div className="text-petzy-periwinkle-light translate-y-[-99%]">
             <WavyDivider flip={true} />
        </div>
      </div>

      <div className="pt-24 pb-10 px-6 md:px-12 lg:px-20 container mx-auto relative z-20">
        
        {/* Top Section: Newsletter & Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 border-b border-petzy-slate/10 pb-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-bold text-petzy-slate mb-4">Biluibaba<span className="text-petzy-coral">.</span></h2>
            <p className="text-petzy-slate-light mb-6 max-w-md leading-relaxed">
              Your one-stop destination for all pet needs. We bring happiness to your pets with premium products and expert care services.
            </p>
            <div className="flex gap-3">
              <SocialIcon Icon={FaFacebook} />
              <SocialIcon Icon={FaXTwitter} />
              <SocialIcon Icon={FaInstagram} />
              <SocialIcon Icon={FaLinkedin} />
              <SocialIcon Icon={FaYoutube} />
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center bg-white/50 backdrop-blur-sm rounded-2xl p-6 lg:p-10 shadow-sm border border-white">
            <h3 className="text-xl font-bold text-petzy-slate mb-2">Join our Pet Community</h3>
            <p className="text-petzy-slate-light mb-4 text-sm">Subscribe for latest products, deals, and exclusive offers.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-5 py-3 rounded-xl bg-white border border-petzy-slate/10 focus:outline-none focus:border-petzy-coral/50 focus:ring-2 focus:ring-petzy-coral/20 transition-all text-petzy-slate"
              />
              <button className="px-8 py-3 bg-petzy-coral text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-lg shadow-petzy-coral/30 hover:shadow-petzy-coral/40 active:scale-95">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-16">
          
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-bold text-petzy-slate mb-6 relative inline-block">
              Our Services
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-petzy-coral rounded-full"></span>
            </h3>
            <div className="flex flex-col gap-1">
              {[
                'Cats', 'Dogs', 'Birds', 'Pet Shop',
                // [FUTURE] Non-ecommerce footer links — uncomment when enabling vet & adoption features
                // 'Consult a Vet', 'Pet Adoption'
              ].map((item) => (
                <FooterLink key={item}>{item}</FooterLink>
              ))}
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-bold text-petzy-slate mb-6 relative inline-block">
              For Partners
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-petzy-coral rounded-full"></span>
            </h3>
            <div className="flex flex-col gap-1">
              <FooterLink>Become Seller</FooterLink>
              {/* [FUTURE] Non-ecommerce partner links — uncomment when enabling vet features */}
              {/* <FooterLink>Join As Veterinary</FooterLink> */}
              <FooterLink>Spotlight</FooterLink>
              <FooterLink>Affiliates</FooterLink>
            </div>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-bold text-petzy-slate mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-petzy-coral rounded-full"></span>
            </h3>
            <div className="flex flex-col gap-1">
              <FooterLink href="/my-account">My Account</FooterLink>
              <FooterLink href="/refund-policy">Refund Policy</FooterLink>
              <FooterLink href="/return-policy">Return Policy</FooterLink>
              <FooterLink href="/terms-of-use">Terms of Use</FooterLink>
              <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-bold text-petzy-slate mb-6 relative inline-block">
              Get In Touch
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-petzy-coral rounded-full"></span>
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 p-3 bg-white/60 rounded-xl border border-white/50 hover:bg-white transition-colors">
                 <div className="bg-petzy-coral/10 p-2 rounded-lg text-petzy-coral">
                    <FaPhone />
                 </div>
                 <div>
                    <div className="text-xs font-bold text-petzy-slate uppercase tracking-wide">Call Us</div>
                    <div className="text-petzy-slate-light font-medium">01816884963</div>
                 </div>
              </div>
              <div className="flex items-start gap-4 p-3 bg-white/60 rounded-xl border border-white/50 hover:bg-white transition-colors">
                 <div className="bg-petzy-coral/10 p-2 rounded-lg text-petzy-coral">
                    <FaEnvelope />
                 </div>
                 <div>
                    <div className="text-xs font-bold text-petzy-slate uppercase tracking-wide">Email Us</div>
                    <div className="text-petzy-slate-light font-medium break-all">info@biluibaba.com</div>
                 </div>
              </div>
              <div className="flex items-start gap-4 p-3 bg-white/60 rounded-xl border border-white/50 hover:bg-white transition-colors">
                 <div className="bg-petzy-coral/10 p-2 rounded-lg text-petzy-coral">
                    <FaLocationDot />
                 </div>
                 <div>
                    <div className="text-xs font-bold text-petzy-slate uppercase tracking-wide">Head Office</div>
                    <div className="text-petzy-slate-light font-medium">Dhaka, Bangladesh, 1216</div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Searches (Tags Style) */}
        <div className="mb-12">
          <h4 className="text-sm font-bold text-petzy-slate uppercase tracking-widest mb-4 opacity-70">Popular Searches</h4>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-white border border-petzy-slate/5 rounded-full text-xs md:text-sm text-petzy-slate-light hover:bg-petzy-coral hover:text-white hover:border-petzy-coral cursor-pointer transition-all duration-300">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-petzy-slate/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-petzy-slate-light text-sm font-medium">
            &copy; {new Date().getFullYear()} <span className="text-petzy-slate font-bold">Biluibaba.com</span>. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-petzy-slate-light">
            <span>Developed by</span>
            <span className="font-bold text-petzy-coral bg-petzy-coral/10 px-3 py-1 rounded-md">Fractal</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;