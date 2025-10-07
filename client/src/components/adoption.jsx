import React, { useState, useEffect } from "react";

import Button from "@/src/components/ui/button";

import { FaLocationDot } from "react-icons/fa6";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import toast from "react-hot-toast";

const Adoption = ({
  pic,
  pet,
  name,
  location,
  age,
  gender,
  breed,
  id,
  router,
}) => {
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Check if item is in wishlist on initial render and when localStorage changes
  useEffect(() => {
    const wishlistItems =
      JSON.parse(localStorage.getItem("adoption-wishlist")) || [];
    setIsInWishlist(wishlistItems.some((item) => item.id === id));
  }, [id]);

  const handleClick = () => {
    const wishlistItems =
      JSON.parse(localStorage.getItem("adoption-wishlist")) || [];

    if (wishlistItems.some((item) => item.id === id)) {
      // Remove from wishlist
      const updatedWishlist = wishlistItems.filter((item) => item.id !== id);
      localStorage.setItem(
        "adoption-wishlist",
        JSON.stringify(updatedWishlist)
      );
      setIsInWishlist(false);
    } else {
      // Add to wishlist
      wishlistItems.push({ age, breed, gender, id, location, name, pet, pic });
      localStorage.setItem("adoption-wishlist", JSON.stringify(wishlistItems));
      setIsInWishlist(true);
    }
    return toast.success(
      isInWishlist ? "Removed from wishlist" : "Added to wishlist"
    );
  };

  return (
    <div className="border rounded-xl shadow hover:shadow-lg transition-all ease-in-out duration-300 w-full">
      <div
        className={
          "bg-cover bg-no-repeat bg-top h-[350px] rounded-tr-xl rounded-tl-xl"
        }
        style={{ backgroundImage: `url(${pic})` }}
      ></div>
      <div className="px-5 py-8">
        <div className="flex flex-row items-center justify-between">
          <div className="bg-gray-100 text-gray-500 font-light px-8 py-1 rounded-3xl tracking-wider uppercase">
            {pet}
          </div>
          {isInWishlist ? (
            <div className="group cursor-pointer">
              <AiFillHeart
                size="2.5em"
                className="group-hover:hidden block transition-all ease-in-out duration-300 cursor-pointer"
                onClick={handleClick}
              />
              <AiOutlineHeart
                size="2.5em"
                className="group-hover:block hidden transition-all ease-in-out duration-300 cursor-pointer"
                onClick={handleClick}
              />
            </div>
          ) : (
            <div className="group cursor-pointer">
              <AiFillHeart
                size="2.5em"
                className="group-hover:block hidden transition-all ease-in-out duration-300 cursor-pointer"
                onClick={handleClick}
              />
              <AiOutlineHeart
                size="2.5em"
                className="group-hover:hidden block transition-all ease-in-out duration-300 cursor-pointer"
                onClick={handleClick}
              />
            </div>
          )}
        </div>
        <div className="text-xl font-bold my-2">{name}</div>
        <div className="flex flex-row gap-1 items-center">
          <FaLocationDot size="0.8em" />
          <div className="text-sm font-bold">{location}</div>
        </div>
        <div className="my-5 text-sm space-y-2">
          <div className="font-bold">
            Age: <span className="font-normal">{age}</span>
          </div>
          <div className="font-bold">
            Gender: <span className="font-normal">{gender}</span>
          </div>
          <div className="font-bold">
            Breed: <span className="font-normal">{breed}</span>
          </div>
        </div>
        <Button
          type="default"
          text="Take me home"
          className="w-full"
          onClick={() => (window.location.href = `/adoptions/${id}`)}
        />
      </div>
    </div>
  );
};

export default Adoption;
