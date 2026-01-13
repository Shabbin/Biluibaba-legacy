import Link from 'next/link';
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaXTwitter,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
} from 'react-icons/fa6';

interface FooterLink {
  label: string;
  href: string;
}

const SERVICES: FooterLink[] = [
  { label: 'Cats', href: '/products?pet=cat' },
  { label: 'Dogs', href: '/products?pet=dog' },
  { label: 'Birds', href: '/products?pet=bird' },
  { label: 'Pet Shop', href: '/products' },
  { label: 'Consult a Vet', href: '/vets' },
  { label: 'Pet Adoption', href: '/adoptions' },
];

const PARTNER: FooterLink[] = [
  { label: 'Become Seller', href: '/become-seller' },
  { label: 'Join As Veterinary', href: '/become-vet' },
  { label: 'Spotlight', href: '/spotlight' },
  { label: 'Affiliates', href: '/affiliates' },
];

const QUICK_LINKS: FooterLink[] = [
  { label: 'My Account', href: '/my-account' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Return Policy', href: '/return-policy' },
  { label: 'Terms & Use', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
];

const SOCIAL_LINKS = [
  { icon: FaFacebook, href: 'https://facebook.com/biluibaba', label: 'Facebook' },
  { icon: FaXTwitter, href: 'https://twitter.com/biluibaba', label: 'Twitter' },
  { icon: FaLinkedin, href: 'https://linkedin.com/company/biluibaba', label: 'LinkedIn' },
  { icon: FaInstagram, href: 'https://instagram.com/biluibaba', label: 'Instagram' },
  { icon: FaYoutube, href: 'https://youtube.com/biluibaba', label: 'YouTube' },
];

const POPULAR_SEARCHES = [
  'Dog Food',
  'Dog Collars Leashes Harnesses',
  'Me-O',
  'Cat Clothes',
  'Cat Litter',
  'Dog Raincoat',
  'Dog Toys',
  'Dog Beds',
  'Veg Dog Food Dog Biscuits Cookies',
  'Cat Dry Food',
  'Cat Food',
  'Pet Pharmacy',
  'Pedigree',
  'Cat Toys',
  'Drools',
  'Royal Canin',
  'Dog Grooming Dog Carrier',
  'Dogs Bones',
  'Chews Pedigree Pro',
  'Sheba',
  'Whiskas',
  'Cat Collars',
  'Leashes Harnesses',
  'Cat Wet Food',
  'Cat Treats Dog Shampoos & Conditioners',
  'Cat Carriers Travel Supplies',
  'Dog Accessories',
  'Cat Accessories',
  'Cat Litter Boxes',
];

const FooterSection = ({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}): JSX.Element => (
  <div className="md:w-1/4 w-1/2">
    <h2 className="text-2xl mb-5 font-bold">{title}</h2>
    <ul className="flex flex-col gap-2 text-xl">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className="hover:text-gray-600 transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = (): JSX.Element => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-20 pb-10 border-t md:px-0 px-5">
      <div className="container mx-auto">
        <div className="flex flex-row justify-between md:gap-y-0 gap-y-5 flex-wrap">
          <FooterSection title="Services" links={SERVICES} />
          <FooterSection title="Partner" links={PARTNER} />
          <FooterSection title="Quick Links" links={QUICK_LINKS} />

          <div className="md:w-1/4 w-1/2">
            <h2 className="text-2xl mb-5 font-bold">Get In Touch</h2>
            <div className="md:text-xl">
              <a
                href="tel:01816884963"
                className="flex flex-row items-center gap-4 py-2 hover:text-gray-600 transition-colors"
              >
                <FaPhone size="1.2em" />
                <span>01816884963</span>
              </a>
              <a
                href="mailto:info@biluibaba.com"
                className="flex flex-row items-center gap-4 py-2 hover:text-gray-600 transition-colors"
              >
                <FaEnvelope size="1.2em" />
                <span>info@biluibaba.com</span>
              </a>

              <h2 className="text-2xl my-5 font-bold">Follow Us On:</h2>
              <div className="flex flex-row items-center gap-5">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <Icon size="1.5em" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="py-10">
          <h2 className="text-2xl uppercase font-bold mb-10">Popular Searches</h2>
          <p className="text-xl font-medium">{POPULAR_SEARCHES.join(' | ')}</p>
        </div>

        <div className="py-10">
          <h2 className="text-2xl uppercase font-bold mb-10">
            Biluibaba.com Head Office
          </h2>
          <address className="text-xl font-medium not-italic">
            Dhaka Bangladesh, 1216
          </address>
        </div>

        <div className="my-10">
          <div className="bg-black rounded-full py-5 text-center md:text-xl text-lg text-white font-bold">
            &copy; {currentYear} Biluibaba.com. All Rights Reserved
          </div>
          <div className="text-center text-lg font-bold pt-5 text-gray-500">
            Developed by Fractal
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
