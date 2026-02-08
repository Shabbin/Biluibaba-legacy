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
    <div className="bg-white rounded-3xl shadow-soft hover:shadow-soft-lg transition-all ease-in-out duration-300 w-full overflow-hidden group">
      <div
        className="bg-cover bg-no-repeat bg-center md:h-[350px] h-[250px] rounded-t-3xl overflow-hidden relative"
        style={{ backgroundImage: `url(${pic})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="px-4 md:px-5 py-6 md:py-8">
        <div className="flex flex-row items-center justify-between">
          <div className="bg-gradient-to-r from-petzy-periwinkle to-petzy-periwinkle-light text-petzy-slate font-semibold px-4 md:px-6 py-1.5 rounded-pill tracking-wider uppercase text-xs md:text-sm shadow-soft">
            {pet}
          </div>
          {isInWishlist ? (
            <div className="cursor-pointer bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-110">
              <AiFillHeart
                size="1.8em"
                className="text-petzy-coral cursor-pointer"
                onClick={handleClick}
              />
            </div>
          ) : (
            <div className="cursor-pointer bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-110">
              <AiOutlineHeart
                size="1.8em"
                className="text-petzy-slate-light cursor-pointer hover:text-petzy-coral transition-colors"
                onClick={handleClick}
              />
            </div>
          )}
        </div>
        <div className="text-xl md:text-2xl font-bold my-3 text-petzy-slate group-hover:text-petzy-coral transition-colors">{name}</div>
        <div className="flex flex-row gap-2 items-center text-petzy-slate-light">
          <FaLocationDot size="1em" className="text-petzy-coral" />
          <div className="text-sm md:text-base font-semibold">{location}</div>
        </div>
        <div className="my-4 md:my-5 text-xs md:text-sm space-y-2">
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
