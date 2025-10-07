"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import { CiShoppingCart, CiHeart, CiShop } from "react-icons/ci";
import { IoEyeOutline, IoCloseOutline } from "react-icons/io5";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { Cart } from "./svg";

import Button from "@/src/components/ui/button";
import Quantity from "@/src/components/ui/quantity";

import { convertSize } from "@/src/utils/sizeConverter";

const Product = ({
  id,
  src,
  name,
  slug,
  price,
  discount,
  category,
  description,
  review,
  totalReview,
}) => {
  // const [productSize, setProductSize] = useState(sizes[0]);

  const [toggle, setToggle] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleClick = () => {
    const wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (wishlistItems.some((item) => item.slug === slug)) {
      const updatedWishlist = wishlistItems.filter(
        (item) => item.slug !== slug
      );
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setIsInWishlist(false);
    } else {
      wishlistItems.push({ name, slug, src, price, discount });
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
      setIsInWishlist(true);
    }
    return toast.success(
      isInWishlist ? "Removed from wishlist" : "Added to wishlist"
    );
  };

  useEffect(() => {
    const wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsInWishlist(wishlistItems.some((item) => item.slug === slug));
  }, [slug]);

  return (
    <div className="md:max-w-[350px] max-w-full h-full min-h-full border rounded-2xl shadow-sm">
      <div className="relative overflow-hidden">
        <img
          src={src}
          alt={name}
          className="md:w-[500px] w-[500px] h-[300px] rounded-2xl rounded-b-none"
        />
        <div className="top-3 right-3 absolute group cursor-pointer">
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
      </div>
      <div
        className="border-t rounded-2xl rounded-t-none p-6 cursor-pointer h-[350px] flex flex-col justify-between"
        onClick={() => (window.location.href = `/products/${slug}`)}
      >
        <div>
          <div className="flex flex-row items-center gap-3 mb-4">
            <div className="px-3 py-1 rounded bg-green-600 text-white flex flex-row items-center gap-1">
              <FaStar size="1em" />
              <div>5.0</div>
            </div>
            <div>(500)</div>
          </div>
          <div className="font-bold mb-4">{name}</div>
          <div className="flex flex-row items-center gap-3">
            <div className="text-3xl font-bold text-red-600">
              &#2547;{" "}
              {Math.floor(
                price - (discount > 0 ? (price * discount) / 100 : 0)
              )}
            </div>
            <div className="text-xs">(&#2547;5/100 gm)</div>
          </div>
          {discount > 0 && (
            <div className="flex flex-row items-center gap-2 mb-4">
              <div className="text-xl text-gray-400 line-through">
                &#2547; {price}
              </div>
              <div className="bg-lime-100 text-green-600 font-medium px-2 text-xs py-1 rounded">
                {discount}% off
              </div>
            </div>
          )}
        </div>
        <div className="my-4">
          <Button
            type="default"
            text="Add to cart"
            icon={<Cart className="text-[1.5em]" />}
            iconAlign="left"
            className="w-full !py-3"
          />
        </div>
      </div>
    </div>
  );
};

class ProductModal extends React.Component {
  constructor() {
    super();

    this.state = {
      quantity: 1,
    };

    this.addToCart = this.addToCart.bind(this);
  }

  addToCart() {
    let cart = JSON.parse(localStorage.getItem("cart"));

    if (cart.length === 0) {
      cart.push({
        id: this.props.id,
        name: this.props.name,
        src: this.props.src,
        price: this.props.newPrice,
        size: this.props.size,
        quantity: this.state.quantity,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success(`${this.props.name} added to cart!`);
      return setTimeout(() => window.location.reload(), 2000);
    }

    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === this.props.id) {
        cart[i].quantity += this.state.quantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        toast.success(`${this.props.name} added to cart!`);
        return setTimeout(() => window.location.reload(), 2000);
      }
    }

    cart.push({
      id: this.props.id,
      name: this.props.name,
      src: this.props.src,
      price: this.props.newPrice,
      size: this.props.size,
      quantity: this.state.quantity,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`${this.props.name} added to cart!`);
    setTimeout(() => window.location.reload(), 2000);
  }

  render() {
    return (
      <div className="transition-opacity ease-in duration-100 fixed w-full h-full top-0 left-0 flex items-center md:flex-row flex-col justify-center z-50">
        <div
          className="absolute w-full h-full bg-stone-900 opacity-50"
          onClick={() => this.props.handler(false)}
        ></div>

        <div className="bg-white z-20 md:w-8/12 w-full mx-auto md:rounded-3xl shadow-lg overflow-y-auto">
          <div className="flex md:flex-row flex-col">
            <div className="basis-1/2 overflow-hidden inline-block rounded-lg cursor-pointer">
              <img
                src={this.props.src}
                alt={this.props.name}
                className="w-full h-full transition-transform duration-500 hover:scale-110"
              />
            </div>

            <div className="basis-1/2 px-5 py-5">
              <div className="flex justify-end">
                <IoCloseOutline
                  size="3em"
                  className="cursor-pointer"
                  onClick={() => this.props.handler(false)}
                />
              </div>
              <div>
                <div className="my-5 text-3xl font-bold">{this.props.name}</div>
                <div className="mb-5 text-lg">{this.props.description}</div>

                <div className="flex gap-10 font-bold mb-5">
                  <div>
                    <h1 className="text-xl mb-2">Price</h1>
                    <p className="text-2xl font-medium">
                      &#2547;{this.props.newPrice}{" "}
                      <span className="text-lg ms-1 line-through text-gray-500">
                        &#2547;{this.props.oldPrice}
                      </span>
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl mb-2">Quantity</div>
                    <Quantity
                      value={this.state.quantity}
                      onChange={(value) => this.setState({ quantity: value })}
                    />
                  </div>
                </div>

                <Button
                  text="ADD TO CART"
                  type="default"
                  onClick={() => this.addToCart()}
                ></Button>

                <div className="mt-10 border border-t-gray-500 border-r-0 border-l-0 border-b-0 py-8 font-bold text-lg">
                  <div className="mt-5">SKU: {this.props.id}</div>
                  <div className="mt-5">Category: {this.props.category}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Product;
