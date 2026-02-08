import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaXTwitter,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
} from "react-icons/fa6";
import { WavyDivider } from "./ui/dividers";

const Footer = () => {
  return (
    <>
      {/* Wavy divider at the top of footer */}
      <div className="text-petzy-periwinkle-light -mb-1">
        <WavyDivider flip={true} />
      </div>
      
      <div className="pt-20 pb-10 md:px-0 px-5 bg-petzy-periwinkle-light">
        <div className="container mx-auto">
        <div className="flex flex-row justify-between md:gap-y-0 gap-y-5 flex-wrap">
          <div className="md:w-1/4 w-1/2">
            <h2 className="text-lg md:text-xl lg:text-2xl mb-4 md:mb-5 font-bold text-petzy-slate">Services</h2>
            <ul className="flex flex-col gap-2 text-sm md:text-base lg:text-lg text-petzy-slate-light">
                <li className="hover:text-petzy-coral transition-colors duration-300 cursor-pointer">Cats</li>
                <li className="hover:text-petzy-coral transition-colors duration-300 cursor-pointer">Dogs</li>
                <li className="hover:text-petzy-coral transition-colors duration-300 cursor-pointer">Birds</li>
                <li className="hover:text-petzy-coral transition-colors duration-300 cursor-pointer">Pet Shop</li>
                <li className="hover:text-petzy-coral transition-colors duration-300 cursor-pointer">Consult a Vet</li>
                <li className="hover:text-petzy-coral transition-colors duration-300 cursor-pointer">Pet Adoption</li>
              </ul>
            </div>
            <div className="md:w-1/4 w-1/2">
              <h2 className="text-lg md:text-xl lg:text-2xl mb-4 md:mb-5 font-bold text-petzy-slate">Partner</h2>
              <ul className="flex flex-col gap-2 text-sm md:text-base lg:text-lg text-petzy-slate-light">
                <li className="hover:text-petzy-coral transition-colors duration-300 cursor-pointer">Become Seller</li>
                <li className="hover:text-petzy-coral transition-colors duration-300 cursor-pointer">Join As Vetenary</li>
                <li className="hover:text-petzy-coral transition-colors duration-300 cursor-pointer">Spotlight</li>
                <li className="hover:text-petzy-coral transition-colors duration-300 cursor-pointer">Affiliates</li>
              </ul>
            </div>
            <div className="md:w-1/4 w-1/2">
              <h2 className="text-lg md:text-xl lg:text-2xl mb-4 md:mb-5 font-bold text-petzy-slate">Quick Links</h2>
              <ul className="flex flex-col gap-2 text-sm md:text-base lg:text-lg text-petzy-slate-light">
                <li className="hover:text-petzy-coral transition-colors duration-300 cursor-pointer">My Account</li>
                <li className="hover:text-petzy-coral transition-colors duration-300 cursor-pointer">Refund Policy</li>
                <li className="hover:text-petzy-coral transition-colors duration-300 cursor-pointer">Return Policy</li>
                <li className="hover:text-petzy-coral transition-colors duration-300 cursor-pointer">Terms & Use</li>
                <li className="hover:text-petzy-coral transition-colors duration-300 cursor-pointer">Privacy Policy</li>
              </ul>
            </div>
            <div className="md:w-1/4 w-1/2">
              <h2 className="text-lg md:text-xl lg:text-2xl mb-4 md:mb-5 font-bold text-petzy-slate">Get In Touch</h2>
              <div className="text-sm md:text-base lg:text-lg text-petzy-slate-light">
                <div className="flex flex-row items-center gap-4 py-2">
                  <FaPhone size="1.2em" className="text-petzy-coral" />
                  <div>01816884963</div>
                </div>
                <div className="flex flex-row items-center gap-4 py-2">
                  <FaEnvelope size="1.2em" className="text-petzy-coral" />
                  <div>info@biluibaba.com</div>
                </div>
                <h2 className="text-lg md:text-xl lg:text-2xl my-4 md:my-5 font-bold text-petzy-slate">Follow Us On:</h2>
                <div className="flex flex-row items-center gap-3 md:gap-5">
                  <FaFacebook size="1.5em" className="text-petzy-slate hover:text-petzy-coral transition-colors duration-300 cursor-pointer" />
                  <FaXTwitter size="1.5em" className="text-petzy-slate hover:text-petzy-coral transition-colors duration-300 cursor-pointer" />
                  <FaLinkedin size="1.5em" className="text-petzy-slate hover:text-petzy-coral transition-colors duration-300 cursor-pointer" />
                  <FaInstagram size="1.5em" className="text-petzy-slate hover:text-petzy-coral transition-colors duration-300 cursor-pointer" />
                  <FaYoutube size="1.5em" className="text-petzy-slate hover:text-petzy-coral transition-colors duration-300 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
          <div className="py-8 md:py-10">
            <h2 className="text-lg md:text-xl lg:text-2xl uppercase font-bold mb-6 md:mb-10 text-petzy-slate">
              Popular Searches
            </h2>
            <p className="text-sm md:text-base lg:text-lg font-medium text-petzy-slate-light">
              Dog Food | Dog Collars Leashes Harnesses | Me-O | Cat Clothes | Cat
              Litter | Dog Raincoat | Dog Toys | Dog Beds | Veg Dog Food Dog
              Biscuits Cookies | Cat Dry Food | Cat Food | Pet Pharmacy | Pedigree
              | Cat Toys | Drools | Royal Canin | Dog Grooming Dog Carrier | Dogs
              Bones | Chews Pedigree Pro | Sheba | Whiskas | Cat Collars | Leashes
              Harnesses | Cat Wet Food | Cat Treats Dog Shampoos & Conditioners |
              Cat Carriers Travel Supplies | Dog Accessories | Cat Accessories |
              Cat Litter Boxes
            </p>
          </div>
          <div className="py-8 md:py-10">
            <h2 className="text-lg md:text-xl lg:text-2xl uppercase font-bold mb-6 md:mb-10 text-petzy-slate">
              Biluibaba.com Head Office
            </h2>
            <p className="text-sm md:text-base lg:text-lg font-medium text-petzy-slate-light">Dhaka Bangladesh, 1216</p>
          </div>
        <div className="my-8 md:my-10">
          <div className="bg-petzy-coral rounded-pill py-4 md:py-5 text-center text-sm md:text-base lg:text-lg text-white font-bold shadow-soft">
            &copy; {new Date().getFullYear()} Biluibaba.com. All Rights Reserved
          </div>
          <div className="text-center text-sm md:text-base font-bold pt-4 md:pt-5 text-petzy-slate-light">
              Developed by Fractal
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
