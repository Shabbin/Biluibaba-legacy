"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FaStar, 
  FaHeart, 
  FaRegHeart, 
  FaShareNodes, 
  FaCartPlus, 
  FaBolt, 
  FaStore, 
  FaCheck
} from "react-icons/fa6";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Pagination } from "@heroui/pagination";

// Components
import {Button} from "@/src/components/ui/button";
import { Quantity } from "@/src/components/ui";
import { ReviewSkeleton, NoReviews } from "@/src/components/ui";
import ImageSlider from "@/src/components/image-slider"; // Ensure this component is also updated for modern looks
import ProductRatings from "@/src/components/produc-rating"; // Ensure this component handles the progress bars
import MoreProducts from "@/src/app/_components/products/MoreProducts";
import { Textarea } from "@/src/components/ui";

import axios from "@/src/lib/axiosInstance";
import { formatCurrency } from "@/src/lib/currency";
import { formatDate } from "@/src/utils/formatDate";
import { useAuth } from "@/src/components/providers/AuthProvider";
import type { Product as ProductType } from "@/src/types";

interface CartItem {
  id: string;
  name: string;
  src: string;
  price: number;
  size?: string;
  discount: number;
  quantity: number;
  vendorId: string;
  slug: string;
}

export default function ProductDetail() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // State
  const [loading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<ProductType[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false);

  // Review State
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [reviewStatus, setReviewStatus] = useState<boolean>(false);
  const [reviewPage, setReviewPage] = useState<number>(1);
  const reviewsPerPage = 3;

  // Derived Values
  const price = product ? Math.floor(product.price - (product.discount > 0 ? (product.price * product.discount) / 100 : 0)) : 0;
  
  // Review Pagination Logic
  const reviews = product?.reviews ? [...product.reviews].reverse() : [];
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const currentReviews = reviews.slice((reviewPage - 1) * reviewsPerPage, reviewPage * reviewsPerPage);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/product/get/${params.slug}`);
      if (data.success) {
        setProduct(data.product);
        setFeaturedProducts(data.products);
        // Check wishlist status here if you have that endpoint
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProduct();
  }, [params.slug]);

  const handleAddToCart = (action: "add" | "buy") => {
    if (!product) return;
    // Basic Cart Logic (Ideally move this to a CartContext)
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const item: CartItem = {
      id: product._id,
      name: product.name,
      src: product.images[0].path,
      price: price,
      size: product.size,
      discount: product.discount,
      quantity: quantity,
      vendorId: product.vendorId?._id || "",
      slug: product.slug,
    };

    const existingIndex = cart.findIndex((c: CartItem) => c.id === item.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage")); // Update Navbar Cart Count
    
    toast.success(`${product?.name} added to cart!`);
    
    if (action === "buy") {
      router.push("/checkout");
    }
  };

  const submitReview = async (onClose: () => void) => {
    if (rating < 1 || comment.length < 5) return toast.error("Please provide a rating and a short comment.");
    if (!product) return toast.error("Product not found");
    
    setReviewStatus(true);
    try {
      const { data } = await axios.post("/api/product/rating", {
        productId: product.productId,
        comment,
        rating,
      });
      if (data.success) {
        toast.success("Review submitted!");
        setComment("");
        setRating(0);
        onClose();
        fetchProduct();
      }
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setReviewStatus(false);
    }
  };

  if (loading || !product) return <div className="min-h-screen bg-white" />; // Or a skeleton loader

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* --- BREADCRUMBS (Optional) --- */}
      <div className="container mx-auto px-5 py-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-petzy-coral">Home</Link> / 
        <Link href="/products" className="hover:text-petzy-coral mx-1">Products</Link> / 
        <span className="text-petzy-slate font-medium mx-1">{product.name}</span>
      </div>

      <div className="container mx-auto px-5">
        
        {/* --- MAIN PRODUCT SECTION --- */}
        <div className="bg-white rounded-[2rem] shadow-sm p-6 md:p-10 lg:flex gap-12 mb-12">
          
          {/* Left: Images */}
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <div className="sticky top-24">
               <ImageSlider images={product.images} />
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:w-1/2 flex flex-col">
            
            {/* Header */}
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl md:text-4xl font-bold text-petzy-slate mb-2 leading-tight">{product.name}</h1>
                <button 
                  onClick={() => setIsInWishlist(!isInWishlist)}
                  className="p-3 rounded-full bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                >
                  {isInWishlist ? <FaHeart size="1.5em" /> : <FaRegHeart size="1.5em" />}
                </button>
              </div>
              
              <div className="flex items-center gap-4 text-sm mt-2">
                <div className="flex items-center gap-1 text-yellow-400">
                   <FaStar /> <span className="font-bold text-petzy-slate text-base">{product.ratings || 0}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-petzy-slate-light font-medium">{product.totalReviews} Reviews</span>
                <span className="text-gray-300">|</span>
                <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md">In Stock</span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
               <span className="text-4xl font-bold text-petzy-coral">৳{formatCurrency(price)}</span>
               {product.discount > 0 && (
                 <div className="flex flex-col">
                    <span className="text-lg text-gray-400 line-through">৳{formatCurrency(product.price)}</span>
                    <span className="text-xs font-bold text-white bg-petzy-coral px-2 py-0.5 rounded-full w-fit">
                       -{product.discount}% OFF
                    </span>
                 </div>
               )}
            </div>

            {/* Variants / Info */}
            <div className="space-y-6 mb-8">
               <div className="flex items-center gap-4">
                  <span className="w-20 font-bold text-petzy-slate">Size:</span>
                  <span className="px-4 py-2 border-2 border-petzy-slate rounded-lg font-bold text-petzy-slate bg-gray-50">{product.size}</span>
               </div>
               
               <div className="flex items-center gap-4">
                  <span className="w-20 font-bold text-petzy-slate">Quantity:</span>
                  <Quantity 
                     value={quantity} 
                     onChange={(v) => setQuantity(Math.min(v, product.quantity || 0))} 
                  />
                  <span className="text-xs text-gray-400">{product.quantity} available</span>
               </div>
            </div>

            {/* Vendor Info (Mini) */}
            <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl mb-8 border border-blue-100">
               <div className="bg-white p-2 rounded-full shadow-sm text-blue-500">
                  <FaStore />
               </div>
               <div className="text-sm">
                  <span className="text-gray-500">Sold by </span>
                  <Link href={`/store/${product.vendorId?._id}`} className="font-bold text-petzy-slate hover:underline">
                     {product.vendorId?.storeName || "Official Store"}
                  </Link>
               </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-auto">
               <Button 
                  type="outline" 
                  icon={<FaCartPlus />} 
                  iconAlign="left"
                  className="flex-1 py-4 text-lg"
                  onClick={() => handleAddToCart("add")}
                  >
                  Add to Cart
                  </Button>
               <Button 
                  text="Buy Now" 
                  type="default" 
                  icon={<FaBolt />} 
                  className="flex-1 py-4 text-lg shadow-lg shadow-petzy-coral/30"
                  onClick={() => handleAddToCart("buy")}
               />
            </div>

          </div>
        </div>

        {/* --- DESCRIPTION & REVIEWS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
           
           {/* Left Column: Description */}
           <div className="lg:col-span-8 space-y-8">
              <div className="bg-white rounded-[2rem] shadow-sm p-8 md:p-10">
                 <h2 className="text-2xl font-bold text-petzy-slate mb-6">Product Description</h2>
                 <article 
                    className="prose prose-slate max-w-none prose-img:rounded-xl prose-headings:text-petzy-slate prose-a:text-petzy-coral"
                    dangerouslySetInnerHTML={{ __html: product.description || "" }}
                 />
              </div>

              {/* Reviews List */}
              <div className="bg-white rounded-[2rem] shadow-sm p-8 md:p-10" id="reviews">
                 <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-petzy-slate">Customer Reviews ({product.totalReviews})</h2>
                    {user ? (
                       <button onClick={onOpen} className="text-petzy-coral font-bold hover:underline">Write a Review</button>
                    ) : (
                       <Link href={`/login?from=/products/${product.slug}`} className="text-petzy-coral font-bold hover:underline">Login to Review</Link>
                    )}
                 </div>

                 {currentReviews.length === 0 ? (
                    <NoReviews />
                 ) : (
                    <div className="space-y-6">
                       {currentReviews.map((review, i) => (
                          <div key={i} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                             <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                      <img src={review.userId?.avatar || "/default-avatar.png"} alt="User" className="w-full h-full object-cover" />
                                   </div>
                                   <div>
                                      <h4 className="font-bold text-petzy-slate text-sm">{review.userId?.name}</h4>
                                      <div className="flex text-yellow-400 text-xs mt-0.5">
                                         {[...Array(5)].map((_, idx) => (
                                            <FaStar key={idx} className={idx < review.rating ? "" : "text-gray-200"} />
                                         ))}
                                      </div>
                                   </div>
                                </div>
                                <span className="text-xs text-gray-400">{formatDate(review.date)}</span>
                             </div>
                             <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                          </div>
                       ))}
                    </div>
                 )}

                 {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                       <Pagination 
                          total={totalPages} 
                          page={reviewPage} 
                          onChange={setReviewPage} 
                          color="danger" // Matches your coral theme usually
                       />
                    </div>
                 )}
              </div>
           </div>

           {/* Right Column: Ratings Summary & Vendor */}
           <div className="lg:col-span-4 space-y-8">
              
              {/* Ratings Card */}
              <div className="bg-white rounded-[2rem] shadow-sm p-8">
                 <h3 className="text-xl font-bold text-petzy-slate mb-6">Rating Overview</h3>
                 <div className="flex items-center gap-4 mb-6 bg-yellow-50 p-4 rounded-xl">
                    <div className="text-4xl font-bold text-yellow-500">{product.ratings?.toFixed(1)}</div>
                    <div>
                       <div className="flex text-yellow-400 text-sm mb-1">
                          {[...Array(5)].map((_, i) => (
                             <FaStar key={i} className={i < Math.round(product.ratings || 0) ? "" : "text-gray-300"} />
                          ))}
                       </div>
                       <p className="text-xs text-yellow-700 font-medium">Based on {product.totalReviews} reviews</p>
                    </div>
                 </div>
                 {/* Rating Breakdown Bar Component */}
                 <ProductRatings 
                    ratings={product.ratings || 0}
                    totalRatings={product.totalRatings || 0}
                    totalReviews={product.totalReviews || 0} 
                    ratingBreakdown={product.ratingBreakdown || { excellent: 0, veryGood: 0, good: 0, average: 0, poor: 0 }}
                 />
              </div>

              {/* Delivery Info (Static for now) */}
              <div className="bg-white rounded-[2rem] shadow-sm p-8 space-y-4">
                 <h3 className="text-lg font-bold text-petzy-slate mb-2">Delivery & Returns</h3>
                 <div className="flex items-start gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg text-gray-500"><FaStore /></div>
                    <div>
                       <p className="text-sm font-bold text-petzy-slate">Standard Delivery</p>
                       <p className="text-xs text-gray-500">3-5 working days</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg text-gray-500"><FaCheck /></div>
                    <div>
                       <p className="text-sm font-bold text-petzy-slate">7 Days Return</p>
                       <p className="text-xs text-gray-500">Change of mind applicable</p>
                    </div>
                 </div>
              </div>

           </div>
        </div>

        {/* --- RELATED PRODUCTS --- */}
        <div className="mb-20">
           <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-petzy-slate">You Might Also Like</h2>
           </div>
           <MoreProducts products={featuredProducts} type="featured" />
        </div>

      </div>

      {/* --- REVIEW MODAL --- */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Write a Review</ModalHeader>
              <ModalBody>
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => setRating(star)} 
                      className={`text-3xl transition-colors ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
                <Textarea 
                  placeholder="Share your experience with this product..." 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)} 
                  rows={4}
                />
              </ModalBody>
              <ModalFooter>
                <Button text="Cancel" type="outline" onClick={onClose} />
                <Button text="Submit Review" type="default" onClick={() => submitReview(onClose)} disabled={reviewStatus} />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  );
}