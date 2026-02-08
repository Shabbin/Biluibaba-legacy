"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import axios from "@/src/lib/axiosInstance";

import MyCart from "@/src/components/cart";
import Button from "@/src/components/ui/button";
import Input from "@/src/components/ui/input";

import { useAuth } from "@/src/components/providers/AuthProvider";

import { productCategories } from "@/src/lib/categories";

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
} from "@/src/components/svg";
import { LiaDonateSolid } from "react-icons/lia";
import { RxHamburgerMenu } from "react-icons/rx";

import Logo from "@/public/logo-black.png";

const Navbar = () => {
  const router = useRouter();
  const [cart, toggleCart] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  const getUserCoordinates = async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => reject(error.message)
      );
    });
  };

  const getLocation = async () => {
    const { lat, lng } = await getUserCoordinates();
    console.log(lat, lng, "coordinates");
    const { data } = await axios.get(`/location?lat=${lat}&lng=${lng}`);

    console.log(data, "hi");

    if (data.success) {
      localStorage.setItem("location", JSON.stringify(data));
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("cart")) localStorage.setItem("cart", "[]");
    getLocation();
  }, []);

  return (
    <div className="relative w-full top-0 z-50 transition-all ease-in-out duration-300 bg-white shadow-soft">
      <div className="px-5">
        <div className="flex flex-row gap-3 items-center justify-between md:px-0 px-5">
          <div className="pe-3 flex items-center py-8">
            <Link href="/">
              <Image src={Logo} className="md:w-[220px] w-[250px]" alt="logo" />
            </Link>
          </div>

          <div className="flex flex-row w-full flex-grow justify-between items-center">
            <div className="basis-1/8 md:block hidden">
              <h2 className="font-bold text-[10px] lg:text-xs text-petzy-slate">Your delivery location</h2>
              <div className="flex flex-row items-center gap-1">
                <LocationDot className="w-3 h-3 lg:w-4 lg:h-4 text-petzy-coral" />
                <span className="text-[10px] lg:text-xs text-petzy-slate-light">West Shewrapara, Dhaka</span>
              </div>
            </div>
            <div className="relative md:block hidden basis-1/2">
              <Search className="text-3xl pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3 text-petzy-slate-light" />
              <Input
                className="ps-12 !bg-white !border-gray-200 !rounded-pill !shadow-soft"
                placeholder={'Search "Pet Carrier Bag"'}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.trim() === "") return router.push("/");
                  router.push(`/search?query=${e.target.value}`);
                }}
              />
            </div>
            <div className="flex flex-row gap-2 items-center font-medium z-[20]">
              <User
                className="text-3xl text-petzy-slate hover:text-petzy-coral transition-colors duration-300"
                onClick={() =>
                  user
                    ? (window.location.href = "/my-account")
                    : (window.location.href = "/login")
                }
              />
              <div className="hidden md:block">
                {user ? (
                  <Link href="/my-account" className="text-xs lg:text-sm text-petzy-slate hover:text-petzy-coral transition-colors duration-300">
                    My Account
                  </Link>
                ) : (
                  <Link href="/login" className="text-xs lg:text-sm text-petzy-slate hover:text-petzy-coral transition-colors duration-300">
                    Login
                  </Link>
                )}
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center font-medium">
              <HeartOutline className="text-3xl text-petzy-slate hover:text-petzy-coral transition-colors duration-300" />
              <Link href="/wishlist" className="hidden md:block text-xs lg:text-sm text-petzy-slate hover:text-petzy-coral transition-colors duration-300">
                Wishlist
              </Link>
            </div>
            <Cart
              onClick={() => toggleCart(true)}
              className="md:hidden text-4xl text-petzy-slate hover:text-petzy-coral transition-colors duration-300"
            />
            <div className="relative">
              <Button
                icon={<Cart className="text-3xl" />}
                text="My Cart"
                type="default"
                iconAlign="left"
                onClick={() => toggleCart(true)}
                className="hidden md:flex px-3 !py-3"
              />
              <MyCart toggle={cart} toggler={toggleCart} />
              <RxHamburgerMenu
                size="2em"
                onClick={() => setIsOpen(true)}
                className="inline-flex md:hidden text-petzy-slate"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 md:py-4 bg-white">
        <div className="px-5">
          <div
            className={
              "fixed w-full h-full top-0 left-0 bg-petzy-slate transition-opacity ease-in-out duration-400 " +
              (isOpen ? "opacity-50 z-[100]" : "opacity-50 hidden")
            }
            onClick={() => setIsOpen(false)}
          ></div>
          <div
            className={
              "flex md:flex-row bg-white z-[101] flex-col gap-5 md:items-center items-start md:justify-between justify-start fixed md:static md:w-auto md:h-auto w-3/4 h-full top-0 transform transition-all duration-300 ease-out md:p-0 p-3 text-base md:text-base lg:text-lg md:overflow-y-visible overflow-y-auto rounded-r-3xl shadow-soft-lg " +
              (isOpen
                ? "left-0 translate-x-0"
                : "-left-full md:-translate-x-0 -translate-x-full")
            }
          >
            <Link
              href="/best-deals"
              className="flex flex-row gap-2 items-center text-petzy-slate hover:text-petzy-coral transition-colors duration-300 font-bold"
            >
              <Percentage className="text-2xl" />
              <div>Best Deals</div>
            </Link>
            <DropdownItem
              parent="Cats"
              icon={<Cat className="text-2xl" />}
              category={productCategories.find((value) => value.name === "Cat")}
            />
            <DropdownItem
              parent="Dogs"
              icon={<Dog className="text-2xl" />}
              category={productCategories.find((value) => value.name === "Dog")}
            />
            <DropdownItem
              parent="Birds"
              icon={<Bird className="text-2xl" />}
              category={productCategories.find(
                (value) => value.name === "Bird"
              )}
            />
            <MorePetsDropdown />

            <Link href="/vets" className="flex flex-row gap-2 items-center text-petzy-slate hover:text-petzy-coral transition-colors duration-300 font-bold">
              <Vet className="text-2xl" />
              <div>Vet Care</div>
            </Link>
            <Link
              href="/adoptions"
              className="flex flex-row gap-2 items-center text-petzy-slate hover:text-petzy-coral transition-colors duration-300 font-bold"
            >
              <Adoption className="text-2xl" />
              <div>Adoptions</div>
            </Link>
            <Link href="/" className="flex flex-row gap-2 items-center text-petzy-slate hover:text-petzy-coral transition-colors duration-300 font-bold">
              <LiaDonateSolid className="text-2xl" />
              <div>Donate</div>
            </Link>
            <Link href="/" className="flex flex-row gap-2 items-center text-petzy-slate hover:text-petzy-coral transition-colors duration-300 font-bold">
              <Crown className="text-2xl" />
              <div>Pro</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const MorePetsDropdown = () => {
  return (
    <div className="group relative cursor-pointer md:w-auto w-full">
      <div className="flex flex-row gap-2 items-center text-petzy-slate hover:text-petzy-coral transition-colors duration-300 font-bold">
        <Rabbit className="text-2xl" />
        <div>More Pets</div>
        <svg width="10" height="6" xmlns="http://www.w3.org/2000/svg">
          <polygon points="5,5 1,1 9,1" fill="currentColor" />
        </svg>
      </div>

      <div className="group-hover:block md:absolute hidden left-0 h-auto rounded-3xl">
        <ul className="top-0 md:my-0 my-2 md:py-0 py-2 md:border-t-0 border-t-petzy-coral border-t-2 md:w-52 w-full text-base md:shadow-soft md:border-2 md:border-gray-200 bg-white rounded-3xl overflow-hidden">
          <li className="bg-white md:hover:bg-petzy-mint-light transition-colors duration-300">
            <div
              className="px-4 py-3 cursor-pointer text-petzy-slate font-medium"
              onClick={() => (window.location.href = "/products?pet=rabbit")}
            >
              Rabbits
            </div>
          </li>
          <li className="bg-white md:hover:bg-petzy-mint-light transition-colors duration-300">
            <div
              className="px-4 py-3 cursor-pointer text-petzy-slate font-medium"
              onClick={() => (window.location.href = "/products?pet=fish")}
            >
              Fish
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

const DropdownItem = ({ parent, category, icon }) => {
  const [activeSubCategory, setActiveSubCategory] = useState(null);

  return (
    <div className="group relative cursor-pointer md:w-auto w-full">
      <div
        className="flex flex-row gap-2 items-center text-petzy-slate hover:text-petzy-coral transition-colors duration-300 font-bold"
        onClick={() =>
          activeSubCategory &&
          activeSubCategory.length > 0 &&
          setActiveSubCategory(null)
        }
      >
        {icon}
        <div>{parent}</div>
        <svg width="10" height="6" xmlns="http://www.w3.org/2000/svg">
          <polygon points="5,5 1,1 9,1" fill="currentColor" />
        </svg>
      </div>

      <div className="group-hover:block md:absolute hidden left-0 h-auto rounded-3xl">
        {category && (
          <ul className="top-0 md:my-0 my-2 md:py-0 py-2 md:border-t-0 border-t-petzy-coral border-t-2 md:w-52 w-full text-base md:shadow-soft md:border-2 md:border-gray-200 bg-white rounded-3xl overflow-hidden">
            {category.categories.map((subCategory, i) => (
              <li
                key={i}
                className="relative bg-white md:hover:bg-petzy-mint-light transition-colors duration-300"
                onMouseEnter={() =>
                  window.innerWidth >= 768 &&
                  setActiveSubCategory(subCategory.items)
                }
                onMouseLeave={() =>
                  window.innerWidth >= 768 && setActiveSubCategory(null)
                }
                onClick={() =>
                  activeSubCategory === subCategory.items
                    ? setActiveSubCategory(null)
                    : setActiveSubCategory(subCategory.items)
                }
              >
                <div className="flex flex-row justify-between items-center px-4 py-3 text-petzy-slate font-medium">
                  {subCategory.name}
                  {subCategory.items && <ArrowRight className="text-petzy-coral"></ArrowRight>}
                </div>
                {activeSubCategory === subCategory.items && (
                  <div className="md:absolute md:px-0 px-5 md:border-b-0 border-b-petzy-coral border-b-2 top-0 left-full h-auto text-base md:w-52 w-full md:border-2 md:border-gray-200 md:shadow-soft bg-white rounded-3xl overflow-hidden">
                    <ul>
                      {activeSubCategory.map((item, j) => (
                        <li
                          key={j}
                          className="bg-white px-4 hover:bg-petzy-mint-light md:py-3 py-2 md:border-l-0 border-l-1 text-petzy-slate font-medium transition-colors duration-300"
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
