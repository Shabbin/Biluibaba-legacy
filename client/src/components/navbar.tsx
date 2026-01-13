'use client';

import { useEffect, useState, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import axios from '@/lib/axiosInstance';

import MyCart from '@/components/cart';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

import { useAuth } from '@/components/providers/AuthProvider';
import { productCategories, ProductCategoryData, CategoryItem } from '@/lib/categories';

import {
  HeartOutline,
  Search,
  Cart,
  User,
  Cat,
  Dog,
  Bird,
  Rabbit,
  Vet,
  Crown,
  Percentage,
  Adoption,
  ArrowRight,
  LocationDot,
} from '@/components/svg';
import { LiaDonateSolid } from 'react-icons/lia';
import { RxHamburgerMenu } from 'react-icons/rx';

import Logo from '@/public/logo-black.png';

interface LocationResponse {
  city?: string;
  state?: string;
  country?: string;
  success?: boolean;
}

interface Coordinates {
  lat: number;
  lng: number;
}

const Navbar = (): JSX.Element => {
  const router = useRouter();
  const [cart, toggleCart] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState<string>('Loading...');

  const getUserCoordinates = async (): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => reject(new Error(error.message))
      );
    });
  };

  const getLocation = async (): Promise<void> => {
    try {
      const { lat, lng } = await getUserCoordinates();
      const { data } = await axios.get<LocationResponse>(
        `/location?lat=${lat}&lng=${lng}`
      );

      if (data.city) {
        localStorage.setItem('location', JSON.stringify(data));
        setLocation(`${data.city}, ${data.state || data.country}`);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setLocation('Set location');
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('cart')) {
      localStorage.setItem('cart', '[]');
    }

    const savedLocation = localStorage.getItem('location');
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation) as LocationResponse;
        if (parsed.city) {
          setLocation(`${parsed.city}, ${parsed.state || parsed.country}`);
        }
      } catch {
        getLocation();
      }
    } else {
      getLocation();
    }
  }, []);

  const handleSearch = (value: string): void => {
    setQuery(value);
    if (value.trim() === '') {
      router.push('/');
      return;
    }
    router.push(`/search?query=${encodeURIComponent(value)}`);
  };

  return (
    <div className="relative w-full top-0 z-50 transition-all ease-in-out duration-300 border-b border">
      <div className="px-5">
        <div className="flex flex-row gap-3 items-center justify-between md:px-0 px-5">
          <div className="pe-3 flex items-center border-r py-8">
            <Link href="/">
              <Image src={Logo} className="md:w-[220px] w-[250px]" alt="Biluibaba Logo" />
            </Link>
          </div>

          <div className="flex flex-row w-full flex-grow justify-between items-center">
            <div className="basis-1/8 md:block hidden">
              <h2 className="font-bold text-xs">Your delivery location</h2>
              <div className="flex flex-row items-center gap-1">
                <LocationDot className="w-4 h-4" />
                <span className="text-xs">{location}</span>
              </div>
            </div>
            <div className="relative md:block hidden basis-1/2">
              <Search className="text-3xl pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3" />
              <Input
                className="ps-12 !bg-[#f8f8f8] !border-[#dddddd] rounded-xl"
                placeholder='Search "Pet Carrier Bag"'
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-2 items-center font-medium z-[20]">
              <User
                className="text-3xl cursor-pointer"
                onClick={() => {
                  window.location.href = user ? '/my-account' : '/login';
                }}
              />
              <div className="hidden md:block">
                {user ? (
                  <Link href="/my-account" className="text-sm">
                    My Account
                  </Link>
                ) : (
                  <Link href="/login" className="text-sm">
                    Login
                  </Link>
                )}
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center font-medium">
              <HeartOutline className="text-3xl" />
              <Link href="/wishlist" className="hidden md:block text-sm">
                Wishlist
              </Link>
            </div>
            <Cart
              onClick={() => toggleCart(true)}
              className="md:hidden text-4xl cursor-pointer"
            />
            <div className="relative">
              <Button
                icon={<Cart className="text-3xl" />}
                text="My Cart"
                variant="default"
                iconAlign="left"
                onClick={() => toggleCart(true)}
                className="hidden md:flex px-3 !py-3"
              />
              <MyCart toggle={cart} toggler={toggleCart} />
              <RxHamburgerMenu
                size="2em"
                onClick={() => setIsOpen(true)}
                className="inline-flex md:hidden cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t md:py-4">
        <div className="px-5">
          {/* Overlay */}
          <div
            className={`fixed w-full h-full top-0 left-0 bg-stone-900 transition-opacity ease-in-out duration-400 ${
              isOpen ? 'opacity-50 z-[100]' : 'opacity-50 hidden'
            }`}
            onClick={() => setIsOpen(false)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
            aria-label="Close menu"
          />
          {/* Navigation Menu */}
          <div
            className={`flex md:flex-row bg-white z-[101] flex-col gap-5 md:items-center items-start md:justify-between justify-start fixed md:static md:w-auto md:h-auto w-3/4 h-full top-0 transform transition-all duration-300 ease-out md:p-0 p-3 md:text-xl md:overflow-y-visible overflow-y-auto ${
              isOpen
                ? 'left-0 translate-x-0'
                : '-left-full md:-translate-x-0 -translate-x-full'
            }`}
          >
            <Link href="/best-deals" className="flex flex-row gap-2 items-center">
              <Percentage className="text-2xl" />
              <div>Best Deals</div>
            </Link>
            <DropdownItem
              parent="Cats"
              icon={<Cat className="text-2xl" />}
              category={productCategories.find((value) => value.name === 'Cat')}
            />
            <DropdownItem
              parent="Dogs"
              icon={<Dog className="text-2xl" />}
              category={productCategories.find((value) => value.name === 'Dog')}
            />
            <DropdownItem
              parent="Birds"
              icon={<Bird className="text-2xl" />}
              category={productCategories.find((value) => value.name === 'Bird')}
            />
            <MorePetsDropdown />

            <Link href="/vets" className="flex flex-row gap-2 items-center">
              <Vet className="text-2xl" />
              <div>Vet Care</div>
            </Link>
            <Link href="/adoptions" className="flex flex-row gap-2 items-center">
              <Adoption className="text-2xl" />
              <div>Adoptions</div>
            </Link>
            <Link href="/" className="flex flex-row gap-2 items-center">
              <LiaDonateSolid className="text-2xl" />
              <div>Donate</div>
            </Link>
            <Link href="/" className="flex flex-row gap-2 items-center">
              <Crown className="text-2xl" />
              <div>Pro</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const MorePetsDropdown = (): JSX.Element => {
  return (
    <div className="group relative cursor-pointer md:w-auto w-full">
      <div className="flex flex-row gap-2 items-center">
        <Rabbit className="text-2xl" />
        <div>More Pets</div>
        <svg width="10" height="6" xmlns="http://www.w3.org/2000/svg">
          <polygon points="5,5 1,1 9,1" fill="black" />
        </svg>
      </div>

      <div className="group-hover:block md:absolute hidden left-0 h-auto rounded">
        <ul className="top-0 md:my-0 my-2 md:py-0 py-2 md:border-t-0 border-t-black border-t-2 md:w-52 w-full text-base md:shadow md:border bg-white">
          <li className="bg-white md:hover:bg-gray-100">
            <div
              className="px-3 py-1 cursor-pointer"
              onClick={() => (window.location.href = '/products?pet=rabbit')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && (window.location.href = '/products?pet=rabbit')}
            >
              Rabbits
            </div>
          </li>
          <li className="bg-white md:hover:bg-gray-100">
            <div
              className="px-3 py-1 cursor-pointer"
              onClick={() => (window.location.href = '/products?pet=fish')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && (window.location.href = '/products?pet=fish')}
            >
              Fish
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

interface DropdownItemProps {
  parent: string;
  icon: ReactNode;
  category?: ProductCategoryData;
}

const DropdownItem = ({ parent, category, icon }: DropdownItemProps): JSX.Element => {
  const [activeSubCategory, setActiveSubCategory] = useState<CategoryItem[] | null>(null);

  return (
    <div className="group relative cursor-pointer md:w-auto w-full">
      <div
        className="flex flex-row gap-2 items-center"
        onClick={() =>
          activeSubCategory && activeSubCategory.length > 0 && setActiveSubCategory(null)
        }
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          e.key === 'Enter' &&
          activeSubCategory &&
          activeSubCategory.length > 0 &&
          setActiveSubCategory(null)
        }
      >
        {icon}
        <div>{parent}</div>
        <svg width="10" height="6" xmlns="http://www.w3.org/2000/svg">
          <polygon points="5,5 1,1 9,1" fill="black" />
        </svg>
      </div>

      <div className="group-hover:block md:absolute hidden left-0 h-auto rounded">
        {category && (
          <ul className="top-0 md:my-0 my-2 md:py-0 py-2 md:border-t-0 border-t-black border-t-2 md:w-52 w-full text-base md:shadow md:border bg-white">
            {category.categories.map((subCategory, i) => (
              <li
                key={i}
                className="relative bg-white md:hover:bg-gray-100"
                onMouseEnter={() =>
                  window.innerWidth >= 768 && setActiveSubCategory(subCategory.items)
                }
                onMouseLeave={() => window.innerWidth >= 768 && setActiveSubCategory(null)}
                onClick={() =>
                  activeSubCategory === subCategory.items
                    ? setActiveSubCategory(null)
                    : setActiveSubCategory(subCategory.items)
                }
              >
                <div className="flex flex-row justify-between items-center px-3 py-1">
                  {subCategory.name}
                  {subCategory.items && <ArrowRight />}
                </div>
                {activeSubCategory === subCategory.items && (
                  <div className="md:absolute md:px-0 px-5 md:border-b-0 border-b-black border-b-2 top-0 left-full h-auto text-base md:w-52 w-full md:border md:shadow bg-white">
                    <ul>
                      {activeSubCategory.map((item, j) => (
                        <li
                          key={j}
                          className="bg-white px-3 hover:bg-gray-100 md:py-1 py-2 md:border-l-0 border-l-1 cursor-pointer"
                          onClick={() =>
                            (window.location.href = `/products?pet=${category.slug}&category=${subCategory.slug}&sub=${item.slug}`)
                          }
                        >
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;
