"use client";

import React, { useEffect, useState, useRef } from "react";

import Button from "@/src/components/ui/button";

import { Delete, AddCart } from "@/src/components/svg";

interface WishlistItem {
  slug: string;
  name: string;
  src: string;
  price: number;
  discount: number;
  size: string;
}

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  indeterminate = false,
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div
        className={`w-5 h-5 border-2 rounded cursor-pointer flex items-center justify-center transition-all duration-200 ${
          checked || indeterminate
            ? "bg-black border-black"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {indeterminate && !checked && <div className="w-2 h-0.5 bg-white"></div>}
      </div>
    </div>
  );
};

const Page: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean): void => {
    const newSelected = checked ? wishlist.map((item) => item.slug) : [];
    setSelectedItems(newSelected);
  };

  const handleSelectItem = (slug: string, checked: boolean): void => {
    const newSelected = checked
      ? [...selectedItems, slug]
      : selectedItems.filter((itemSlug) => itemSlug !== slug);
    setSelectedItems(newSelected);
  };

  const handleDelete = (slug: string): void => {
    // Remove from wishlist
    const newWishlist = wishlist.filter((item) => item.slug !== slug);
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));

    // Remove from selected items
    const newSelected = selectedItems.filter((itemSlug) => itemSlug !== slug);
    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = (): void => {
    if (selectedItems.length === 0) return;

    // Remove all selected items from wishlist
    const newWishlist = wishlist.filter((item) => !selectedItems.includes(item.slug));
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));

    // Clear selected items
    setSelectedItems([]);
  };

  useEffect(() => {
    const storedWishlist: WishlistItem[] = JSON.parse(
      localStorage.getItem("wishlist") || "[]"
    );
    setWishlist(storedWishlist);
  }, []);

  const isAllSelected = wishlist.length > 0 && selectedItems.length === wishlist.length;
  const isPartiallySelected =
    selectedItems.length > 0 && selectedItems.length < wishlist.length;

  return (
    <div>
      {wishlist.length > 0 ? (
        <div className="bg-neutral-100 py-8 px-5">
          <div className="container mx-auto">
            <div className="border-b bg-white p-6 my-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isPartiallySelected}
                    onChange={handleSelectAll}
                  />
                  <span className="text-gray-600 font-medium">
                    Select All ({selectedItems.length} Items)
                  </span>
                </div>
                <Button
                  type="default"
                  text="Delete"
                  icon={<Delete className="h-4 w-4" />}
                  iconAlign="left"
                  onClick={handleDeleteSelected}
                />
              </div>
            </div>

            <div className="space-y-5">
              {wishlist.map((product) => (
                <div key={product.slug} className="p-6 bg-white py-10 rounded-xl">
                  <div>
                    <div
                      className="flex justify-end items-center gap-4 text-xl text-gray-400 hover:text-red-500 p-2 cursor-pointer"
                      onClick={() => handleDelete(product.slug)}
                    >
                      <Delete className="h-6 w-6" /> Delete
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Checkbox */}
                      <Checkbox
                        checked={selectedItems.includes(product.slug)}
                        onChange={(checked) => handleSelectItem(product.slug, checked)}
                      />

                      {/* Product Image */}
                      <img
                        src={product.src}
                        alt={product.name}
                        className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0"
                      />

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-base mb-1">
                          {product.name}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">Size - {product.size}</p>

                        {/* Price Section */}
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-gray-900">
                            &#2547;{" "}
                            {Math.floor(
                              product.price - (product.price * product.discount) / 100
                            )}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            TK {product.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-green-600 font-medium">
                            &#2547; {product.discount}% Saved
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center ml-4">
                      <Button
                        type="default"
                        text="Add to cart"
                        icon={<AddCart className="h-4 w-4" />}
                        onClick={() => (window.location.href = `/products/${product.slug}`)}
                        iconAlign="left"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-5 container mx-auto flex flex-col items-center justify-center gap-5">
          <img src="/wishlist.png" alt="Wishlist" />
          <h2 className="text-3xl font-bold">Your Wishlist is Empty</h2>
          <p>Tap heart button to start saving your favourite items.</p>
          <Button text="Add Now" type="outline" />
        </div>
      )}
    </div>
  );
};

export default Page;
