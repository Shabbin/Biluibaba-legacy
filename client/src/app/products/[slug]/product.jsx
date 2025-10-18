"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "next/navigation";

import { Pagination } from "@heroui/pagination";

import Textarea from "@/src/components/ui/textarea";
import Button from "@/src/components/ui/button";
import Quantity from "@/src/components/ui/quantity";
import ImageSlider from "@/src/components/image-slider";
import ProductRatings from "@/src/components/produc-rating";

import MoreProducts from "@/src/app/_components/products/MoreProducts";

import axios from "@/src/lib/axiosInstance";

import { formatDate } from "@/src/utils/formatDate";

import { LuShoppingCart } from "react-icons/lu";

import { useAuth } from "@/src/components/providers/AuthProvider";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  ModalBody,
} from "@heroui/modal";
import Link from "next/link";
import { Star, Share, HeartOutline, AddCart } from "@/src/components/svg";

export default function Page() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({});
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [reviewStatus, setReviewStatus] = useState(false);

  const [reviewCurrentPage, setReviewCurrentPage] = useState(1);
  const reviewsPerPage = 2;

  const indexOfLastReview = reviewCurrentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = product.reviews
    ?.reverse()
    .slice(indexOfFirstReview, indexOfLastReview);

  const price = Math.floor(
    product.price -
      (product.discount > 0 ? (product.price * product.discount) / 100 : 0)
  );

  const params = useParams();

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/product/get/${params.slug}`);

      if (data.success) {
        setProduct(data.product);
        setFeaturedProducts(data.products);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (onClose) => {
    if (!rating || rating < 1) {
      return toast.error(
        "Please provide a valid rating (1-5) and a comment with at least 10 characters."
      );
    }

    setReviewStatus(true);
    try {
      const { data } = await axios.post("/api/product/rating", {
        productId: product.productId,
        comment,
        rating,
      });

      if (data.success) {
        toast.success("Review submitted successfully!");
        setComment("");
        setRating(1);
        onClose();
        fetchProduct();
      } else {
        toast.error("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting your review.");
    } finally {
      setReviewStatus(false);
    }
  };

  const addToCart = (type) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      cart.push({
        id: product._id,
        name: product.name,
        src: product.images[0].path,
        price: price,
        size: product.size,
        discount: product.discount,
        originalPrice: product.price,
        quantity: quantity,
        vendorId: product.vendorId._id,
        slug: product.slug,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success(`${product.name} added to cart!`);
      return setTimeout(
        () =>
          type === "add"
            ? (window.location.href = `/products/${product.slug}`)
            : (window.location.href = "/checkout"),
        2000
      );
    }

    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === product._id) {
        cart[i].quantity += quantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        toast.success(`${product.name} added to cart!`);
        return setTimeout(
          () =>
            type === "add"
              ? (window.location.href = `/products/${product.slug}`)
              : (window.location.href = "/checkout"),
          2000
        );
      }
    }

    cart.push({
      id: product._id,
      name: product.name,
      src: product.images[0].path,
      price: price,
      size: product.size,
      discount: product.discount,
      originalPrice: product.price,
      quantity: quantity,
      vendorId: product.vendorId._id,
      product: product.slug,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`${product.name} added to cart!`);
    setTimeout(
      () =>
        type === "add"
          ? (window.location.href = `/products/${product.slug}`)
          : (window.location.href = "/checkout"),
      1000
    );
  };

  useEffect(() => {
    setLoading(true);
    fetchProduct();
  }, []);

  return (
    <div className="py-20">
      {loading ? null : (
        <div className="container mx-auto">
          <div className="flex md:flex-row flex-col gap-10 justify-between">
            <div className="basis-1/2 border overflow-hidden inline-block rounded-3xl cursor-pointer">
              <ImageSlider images={product.images} />
            </div>
            <div className="basis-1/2 md:mx-0 mx-5 flex flex-col justify-between">
              <div>
                <div className="my-5 text-xl font-bold">{product.name}</div>

                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-600 text-white px-3 text-xs py-2 rounded-full inline-flex items-center justify-center gap-1">
                      <Star className="text-[1em]" /> {product.ratings}
                    </div>

                    <div className="divide-x-3 text-gray-400 inline-flex items-center justify-center font-semibold">
                      <div className="px-2">{product.totalRatings} Ratings</div>
                      <div className="px-2">{product.totalReviews} Reviews</div>
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-2">
                    <Share className="text-[2em]" />
                    <HeartOutline className="text-[2em]" />
                  </div>
                </div>

                <div className="border-t-2 border-b-2 py-5 my-5 text-xl">
                  <div className="flex flex-row items-center gap-5">
                    <div className="text-4xl font-semibold text-red-500">
                      &#2547; {price}
                    </div>
                    {product.discount > 0 && (
                      <>
                        <div className="line-through text-2xl">
                          &#2547; {product.price}
                        </div>
                        <div className="text-green-500 uppercase font-bold">
                          save {product.discount}%
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="py-5">
                  <h2 className="text-2xl">
                    <span className="font-bold">Size: </span> {product.size}
                  </h2>
                </div>
                <div className="py-5">
                  <h2 className="text-2xl">
                    <span className="font-bold">Quantity: </span>{" "}
                    {product.quantity} left
                  </h2>
                </div>
              </div>

              <div>
                <div className="flex flex-row items-center py-5 gap-5">
                  <div className="text-2xl">Quantity</div>
                  <Quantity
                    value={quantity}
                    onChange={(value) => {
                      if (product.quantity < value)
                        return toast.error(`Not enough quantity available`);
                      else setQuantity(value);
                    }}
                  />
                </div>

                <div className="flex md:flex-row flex-col gap-5 items-center justify-between">
                  <Button
                    text="ADD TO CART"
                    type="outline"
                    onClick={() => addToCart("add")}
                    icon={<AddCart className="text-[1.5em]" />}
                    iconAlign={"left"}
                    className="basis-1/2 md:w-auto w-full"
                  ></Button>
                  <Button
                    text="BUY NOW"
                    onClick={() => addToCart("buy")}
                    type="default"
                    className="basis-1/2 md:w-auto w-full"
                  ></Button>
                </div>
              </div>
            </div>
          </div>

          <div className="py-5 border my-14 shadow rounded-lg">
            <ProductRatings
              ratings={product.ratings}
              totalRatings={product.totalRatings}
              totalReviews={product.totalReviews}
              ratingBreakdown={product.ratingBreakdown}
            />

            <div className="border-b border-t flex md:flex-row flex-col items-center justify-between gap-10 p-10 shadow">
              <h2 className="text-4xl font-bold">What's on your mind?</h2>

              {user && user.id ? (
                <>
                  <Button
                    text="Write a Review"
                    type="outline"
                    className="text-lg md:w-auto w-full"
                    onClick={onOpen}
                  />

                  <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
                    <ModalContent>
                      {(onClose) => (
                        <>
                          <ModalHeader className="flex flex-col gap-1">
                            Write a review
                          </ModalHeader>
                          <ModalBody>
                            <div className="flex flex-row gap-5 items-center justify-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <div
                                  key={star}
                                  className="flex flex-row items-center gap-2 cursor-pointer py-5"
                                  onClick={() => setRating(star)}
                                >
                                  <span
                                    className={`text-5xl ${
                                      rating >= star
                                        ? "text-yellow-500"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    ★
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div>Your Comment</div>
                            <Textarea
                              placeholder="Write your review here..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              rows="5"
                            />
                          </ModalBody>
                          <ModalFooter>
                            <Button
                              onClick={onClose}
                              text="Close"
                              type="outline"
                            ></Button>
                            <Button
                              onClick={() => submitReview(onClose)}
                              text="Submit"
                              type="default"
                              disabled={reviewStatus}
                            ></Button>
                          </ModalFooter>
                        </>
                      )}
                    </ModalContent>
                  </Modal>
                </>
              ) : (
                <div className="text-2xl">
                  <Link href="/login" className="text-blue-500 underline">
                    Login
                  </Link>{" "}
                  to write a review.
                </div>
              )}
            </div>

            <div className="px-10 py-14">
              <h2 className="text-4xl font-bold mb-5">
                All Reviews ({product.totalReviews})
              </h2>

              {currentReviews.length === 0 && (
                <div className="text-gray-500 text-center py-10">
                  No reviews yet. Be the first to write a review!
                </div>
              )}

              {currentReviews.map((review, index) => (
                <div key={review.id}>
                  <div className="py-4 border-b flex flex-col gap-4">
                    <div className="flex items-center gap-4 mb-2">
                      <img
                        src={review.userId.avatar}
                        alt={review.userId.name}
                        className="w-[50px] h-[50px] rounded-full"
                      />
                      <h3 className="text-xl text-gray-600">
                        {review.userId.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 font-bold">
                        <Star className="text-[1em]" />
                        {review.rating.toFixed(1)}
                      </div>
                      <span className="text-gray-500">
                        Posted on {formatDate(review.date)}
                      </span>
                    </div>

                    <p className="my-2 text-xl">{review.comment}</p>
                  </div>
                </div>
              ))}

              <div className="flex justify-center mt-8">
                {!loading && product.reviews.length > 2 && (
                  <Pagination
                    total={Math.ceil(product.reviews.length / reviewsPerPage)}
                    initialPage={1}
                    page={reviewCurrentPage}
                    onChange={setReviewCurrentPage}
                    classNames={{
                      cursor: "bg-zinc-950 border-zinc-950 ",
                    }}
                    variant="flat"
                    showControls
                  />
                )}
              </div>
            </div>

            <div className="px-10 py-14 border rounded-lg">
              <div className="text-2xl py-5 text-center">Description</div>
              <article
                className="prose-xl my-5"
                dangerouslySetInnerHTML={{ __html: product.description }}
              ></article>
            </div>

            <div className="px-10 py-14 border rounded-xl">
              <h2 className="py-5 text-2xl">Posted by</h2>
              <div className="flex flex-row gap-5 items-center">
                <div className="bg-gray-200 w-[100px] h-[100px] rounded-full"></div>
                <p className="text-3xl">{product.vendorId.storeName}</p>
              </div>
            </div>
          </div>
          <div className="py-14">
            <h2 className="text-5xl py-5 text-center font-bold">
              More Things Your Pet Will Like
            </h2>

            <MoreProducts products={featuredProducts} />
          </div>
        </div>
      )}
    </div>
  );
}
