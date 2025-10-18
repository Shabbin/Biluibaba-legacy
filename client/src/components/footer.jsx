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

const Footer = () => {
  return (
    <div className="pt-20 pb-10 border-t md:px-0 px-5">
      <div className="container mx-auto">
        <div className="flex flex-row justify-between md:gap-y-0 gap-y-5 flex-wrap">
          <div className="md:w-1/4 w-1/2">
            <h2 className="text-2xl mb-5 font-bold">Services</h2>
            <ul className="flex flex-col gap-2 text-xl">
              <li>Cats</li>
              <li>Dogs</li>
              <li>Birds</li>
              <li>Pet Shop</li>
              <li>Consult a Vet</li>
              <li>Pet Adoption</li>
            </ul>
          </div>
          <div className="md:w-1/4 w-1/2">
            <h2 className="text-2xl mb-5 font-bold">Partner</h2>
            <ul className="flex flex-col gap-2 text-xl">
              <li>Become Seller</li>
              <li>Join As Vetenary</li>
              <li>Spotlight</li>
              <li>Affiliates</li>
            </ul>
          </div>
          <div className="md:w-1/4 w-1/2">
            <h2 className="text-2xl mb-5 font-bold">Quick Links</h2>
            <ul className="flex flex-col gap-2 text-xl">
              <li>My Account</li>
              <li>Refund Policy</li>
              <li>Return Policy</li>
              <li>Terms & Use</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div className="md:w-1/4 w-1/2">
            <h2 className="text-2xl mb-5 font-bold">Get In Touch</h2>
            <div className="md:text-xl">
              <div className="flex flex-row items-center gap-4 py-2">
                <FaPhone size="1.2em" />
                <div>01816884963</div>
              </div>
              <div className="flex flex-row items-center gap-4 py-2">
                <FaEnvelope size="1.2em" />
                <div>info@biluibaba.com</div>
              </div>
              <h2 className="text-2xl my-5 font-bold">Follow Us On:</h2>
              <div className="flex flex-row items-center gap-5">
                <FaFacebook size="1.5em" />
                <FaXTwitter size="1.5em" />
                <FaLinkedin size="1.5em" />
                <FaInstagram size="1.5em" />
                <FaYoutube size="1.5em" />
              </div>
            </div>
          </div>
        </div>
        <div className="py-10">
          <h2 className="text-2xl uppercase font-bold mb-10">
            Popular Searches
          </h2>
          <p className="text-xl font-medium">
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
        <div className="py-10">
          <h2 className="text-2xl uppercase font-bold mb-10">
            Biluibaba.com Head Office
          </h2>
          <p className="text-xl font-medium">Dhaka Bangladesh, 1216</p>
        </div>
        <div className="my-10">
          <div className="bg-black rounded-full py-5 text-center md:text-xl text-lg text-white font-bold">
            &copy; {new Date().getFullYear()} Biluibaba.com. All Rights Reserved
          </div>
          <div className="text-center text-lg font-bold pt-5 text-gray-500">
            Developed by Fractal
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
