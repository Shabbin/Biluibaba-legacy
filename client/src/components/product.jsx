"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import { CiShoppingCart, CiHeart, CiShop } from "react-icons/ci";
import { IoEyeOutline, IoCloseOutline } from "react-icons/io5";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { AddCart } from "./svg";

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
    <div className="md:max-w-[350px] max-w-full h-full min-h-full bg-white rounded-3xl shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden rounded-3xl rounded-b-none">
        <img
          src={src}
          alt={name}
          className="md:w-[500px] w-[500px] md:h-[300px] h-[200px] rounded-3xl rounded-b-none object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <div className="bg-gradient-to-r from-petzy-coral to-pink-400 text-white font-bold px-3 py-1 rounded-pill text-xs shadow-glow">
              {discount}% OFF
            </div>
          )}
          {Math.random() > 0.7 && (
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold px-3 py-1 rounded-pill text-xs shadow-soft">
              NEW
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="top-3 right-3 absolute">
          {isInWishlist ? (
            <div className="cursor-pointer bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-110">
              <AiFillHeart
                size="1.5em"
                className="text-petzy-coral cursor-pointer"
                onClick={handleClick}
              />
            </div>
          ) : (
            <div className="cursor-pointer bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-110">
              <AiOutlineHeart
                size="1.5em"
                className="text-petzy-slate-light cursor-pointer hover:text-petzy-coral transition-colors"
                onClick={handleClick}
              />
            </div>
          )}
        </div>

        {/* Quick View Overlay - Shows on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <button 
            onClick={() => (window.location.href = `/products/${slug}`)}
            className="bg-white text-petzy-coral font-bold px-6 py-2 rounded-pill text-sm shadow-soft hover:shadow-glow transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          >
            <IoEyeOutline className="inline mr-2" size="1.2em" />
            Quick View
          </button>
        </div>
      </div>
      <div
        className="rounded-3xl rounded-t-none p-4 md:p-6 cursor-pointer min-h-[280px] md:h-[350px] flex flex-col justify-between hover:bg-petzy-blue-light/30 transition-colors duration-300"
        onClick={() => (window.location.href = `/products/${slug}`)}
      >
        <div>
          <div className="flex flex-row items-center justify-between gap-2 mb-3">
            <div className="px-2.5 py-1 rounded-pill bg-gradient-to-r from-petzy-coral to-pink-400 text-white flex flex-row items-center gap-1.5 shadow-soft text-xs font-bold">
              <FaStar size="0.9em" />
              <div>5.0</div>
            </div>
            <div className="text-xs text-petzy-slate-light font-semibold">(500 reviews)</div>
          </div>
          <div className="font-bold mb-3 min-h-[60px] text-sm md:text-base text-petzy-slate line-clamp-2 group-hover:text-petzy-coral transition-colors">
            {name}
          </div>
          <div className="flex flex-row items-end gap-2 mb-2">
            <div className="text-2xl md:text-3xl font-extrabold text-petzy-coral">
              &#2547;{Math.floor(price - (discount > 0 ? (price * discount) / 100 : 0))}
            </div>
            {discount > 0 && (
              <div className="text-sm md:text-base text-petzy-slate-light line-through mb-1">
                &#2547;{price}
              </div>
            )}
          </div>
          <div className="text-xs text-petzy-slate-light mb-3">
            {category} • In Stock
          </div>
        </div>
        <div className="my-3 md:my-4">
          <Button
            type="default"
            text="Add to Cart"
            icon={<AddCart className="text-[1.2em] md:text-[1.5em]" />}
            iconAlign="left"
            className="w-full !py-2.5 md:!py-3 !px-4 md:!px-6 group-hover:shadow-glow"
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
