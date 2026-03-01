"use client";

import { useEffect, useState } from "react";

import Button from "@/src/components/ui/button";
import { CardSkeleton, EmptyWishlist } from "@/src/components/ui";
import { formatCurrency } from "@/src/lib/currency";

import { Delete, AddCart } from "@/src/components/svg";
import type { WishlistItem } from "@/src/types";

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const Checkbox = ({ checked, indeterminate = false, onChange, className = "" }: CheckboxProps) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      ref={(el) => {
        if (el) el.indeterminate = indeterminate;
      }}
      onChange={(e) => onChange(e.target.checked)}
      className={`w-5 h-5 accent-black cursor-pointer ${className}`}
    />
  );
};

export default function Page() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? wishlist.map((item) => item.slug) : [];
    setSelectedItems(newSelected);
  };

  const handleSelectItem = (slug: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedItems, slug]
      : selectedItems.filter((itemSlug) => itemSlug !== slug);
    setSelectedItems(newSelected);
  };

  const handleDelete = (slug: string) => {
    // Remove from wishlist
    const newWishlist = wishlist.filter((item) => item.slug !== slug);
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));

    // Remove from selected items
    const newSelected = selectedItems.filter((itemSlug) => itemSlug !== slug);
    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;

    // Remove all selected items from wishlist
    const newWishlist = wishlist.filter(
      (item) => !selectedItems.includes(item.slug)
    );
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));

    // Clear selected items
    setSelectedItems([]);
  };

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
    setLoading(false);
  }, []);

  const isAllSelected =
    wishlist.length > 0 && selectedItems.length === wishlist.length;
  const isPartiallySelected =
    selectedItems.length > 0 && selectedItems.length < wishlist.length;

  return (
    <div>
      {loading ? (
        <div className="bg-neutral-100 py-8 px-5">
          <div className="container mx-auto">
            <div className="flex md:flex-row flex-col flex-wrap gap-y-10 items-center justify-start">
              <CardSkeleton count={8} type="product" />
            </div>
          </div>
        </div>
      ) : wishlist.length > 0 ? (
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
                <div
                  key={product.slug}
                  className="p-6 bg-white py-10 rounded-xl "
                >
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
                        onChange={(checked) =>
                          handleSelectItem(product.slug, checked)
                        }
                      />

                      {/* Product Image */}
                      <img
                        src={product.src}
                        alt={product.name}
                        className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' fill='%23e5e7eb'%3E%3Crect width='80' height='80'/%3E%3Ctext x='50%25' y='50%25' fill='%23999' font-size='10' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"; }}
                      />

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-base mb-1">
                          {product.name}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">
                          Size - {product.size}
                        </p>

                        {/* Price Section */}
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-gray-900">
                            &#2547;{" "}
                            {formatCurrency(
                              Math.floor(
                                product.price -
                                  (product.price * product.discount) / 100
                              )
                            )}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            TK {formatCurrency(product.price)}
                          </span>
                          <span className="text-sm text-green-600 font-medium">
                            &#2547; {product.discount}% Saved
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center  ml-4">
                      <Button
                        type="default"
                        text="Add to cart"
                        icon={<AddCart className="h-4 w-4" />}
                        onClick={() =>
                          (window.location.href = `/products/${product.slug}`)
                        }
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
        <EmptyWishlist />
      )}
    </div>
  );
}
