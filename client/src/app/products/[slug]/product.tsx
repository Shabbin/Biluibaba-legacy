"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FaStar, 
  FaHeart, 
  FaRegHeart, 
  FaCartPlus, 
  FaBolt, 
  FaStore, 
  FaCheck,
  FaChevronRight
} from "react-icons/fa6";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Pagination } from "@heroui/pagination";

// Components
import { Button } from "@/src/components/ui/button";
import { Quantity } from "@/src/components/ui";
import { NoReviews } from "@/src/components/ui";
import ImageSlider from "@/src/components/image-slider";
import ProductRatings from "@/src/components/produc-rating";
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

  const [loading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<ProductType[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false);

  // Review State
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [reviewStatus, setReviewStatus] = useState<boolean>(false);
  const [reviewPage, setReviewPage] = useState<number>(1);
  const reviewsPerPage = 4;

  const price = product ? Math.floor(product.price - (product.discount > 0 ? (product.price * product.discount) / 100 : 0)) : 0;
  
  const reviews = product?.reviews ? [...product.reviews].reverse() : [];
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const currentReviews = reviews.slice((reviewPage - 1) * reviewsPerPage, reviewPage * reviewsPerPage);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/product/get/${params.slug}`);
        if (data.success) {
          setProduct(data.product);
          setFeaturedProducts(data.products);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.slug]);

  const handleAddToCart = (action: "add" | "buy") => {
    if (!product) return;
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // Safety check in case images array is empty
    const imageSrc = product.images && product.images.length > 0 ? product.images[0].path : "/placeholder.png";

    const item: CartItem = {
      id: product._id,
      name: product.name,
      src: imageSrc,
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
    window.dispatchEvent(new Event("storage")); 
    
    toast.success(`${product.name} added to cart!`);
    
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
        productId: product.productId, // Double check if your API expects _id or productId here
        comment,
        rating,
      });
      if (data.success) {
        toast.success("Review submitted!");
        setComment("");
        setRating(0);
        onClose();
        // Optimistically reload product to show new review
        const updatedRes = await axios.get(`/api/product/get/${params.slug}`);
        if(updatedRes.data.success) setProduct(updatedRes.data.product);
      }
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setReviewStatus(false);
    }
  };

  if (loading || !product) {
    return (
       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
             <div className="w-12 h-12 border-4 border-petzy-coral border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-gray-400 font-medium">Loading product details...</p>
          </div>
       </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      
      {/* --- BREADCRUMBS --- */}
      <div className="container mx-auto px-5 py-6">
        <div className="flex items-center text-sm font-medium text-gray-500 gap-2">
          <Link href="/" className="hover:text-petzy-coral transition-colors">Home</Link>
          <FaChevronRight className="text-[10px] text-gray-400" />
          <Link href="/products" className="hover:text-petzy-coral transition-colors">Products</Link>
          <FaChevronRight className="text-[10px] text-gray-400" />
          <span className="text-petzy-slate truncate max-w-[200px] md:max-w-md">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-5">
        
        {/* --- HERO: PRODUCT OVERVIEW --- */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-10 lg:flex gap-12 xl:gap-16 mb-12">
          
          {/* Left: Images */}
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <div className="sticky top-32 bg-gray-50/50 rounded-3xl p-4 border border-gray-50">
               <ImageSlider images={product.images || []} />
            </div>
          </div>

          {/* Right: Details & Purchase */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            
            <div className="mb-8">
              <div className="flex justify-between items-start gap-4 mb-3">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-petzy-slate leading-[1.1] tracking-tight">
                  {product.name}
                </h1>
                <button 
                  onClick={() => setIsInWishlist(!isInWishlist)}
                  className="p-3 mt-1 rounded-full bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all shrink-0"
                  aria-label="Add to Wishlist"
                >
                  {isInWishlist ? <FaHeart size="1.2em" /> : <FaRegHeart size="1.2em" />}
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-md text-yellow-600 font-bold">
                   <FaStar /> <span>{product.ratings?.toFixed(1) || "0.0"}</span>
                </div>
                <span className="text-gray-300">|</span>
                <a href="#reviews" className="text-petzy-slate-light hover:text-petzy-coral hover:underline font-medium transition-colors">
                  {product.totalReviews || 0} Reviews
                </a>
                <span className="text-gray-300">|</span>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                   In Stock
                </span>
              </div>
            </div>

            <div className="mb-10 p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 flex items-center gap-6">
               <span className="text-4xl lg:text-5xl font-extrabold text-petzy-coral">
                 ৳{formatCurrency(price)}
               </span>
               {product.discount > 0 && (
                 <div className="flex flex-col gap-1">
                    <span className="text-lg text-gray-400 line-through decoration-gray-300">৳{formatCurrency(product.price)}</span>
                    <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded uppercase tracking-wider w-fit shadow-sm shadow-red-500/30">
                       Save {product.discount}%
                    </span>
                 </div>
               )}
            </div>

            <div className="space-y-6 mb-10">
               {product.size && (
                 <div className="flex items-center gap-6">
                    <span className="w-16 text-sm font-bold text-gray-500 uppercase tracking-wide">Size</span>
                    <span className="px-4 py-2 border-2 border-gray-200 rounded-xl font-bold text-petzy-slate bg-white shadow-sm">
                      {product.size}
                    </span>
                 </div>
               )}
               
               <div className="flex items-center gap-6">
                  <span className="w-16 text-sm font-bold text-gray-500 uppercase tracking-wide">Qty</span>
                  <div className="flex items-center gap-4">
                    <Quantity 
                       value={quantity} 
                       onChange={(v) => setQuantity(Math.min(v, product.quantity || 1))} 
                    />
                    <span className="text-xs font-medium text-gray-400">
                      {product.quantity || 0} units available
                    </span>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-petzy-blue-light/10 rounded-2xl mb-10 border border-petzy-blue-light/20">
               <div className="bg-white p-2.5 rounded-full shadow-sm text-petzy-slate">
                  <FaStore />
               </div>
               <div>
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Sold & Shipped by</p>
                  <Link href={`/store/${product.vendorId?._id}`} className="font-bold text-petzy-slate hover:text-petzy-coral hover:underline transition-colors">
                     {product.vendorId?.storeName || "Biluibaba Official Store"}
                  </Link>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
               <Button 
                  text="Add to Cart" 
                  type="outline" 
                  icon={<FaCartPlus />} 
                  iconAlign="left"
                  className="flex-1 !py-4 text-lg bg-white"
                  onClick={() => handleAddToCart("add")}
               />
               <Button 
                  text="Buy Now" 
                  type="default" 
                  icon={<FaBolt />} 
                  className="flex-1 !py-4 text-lg shadow-xl shadow-petzy-coral/20 hover:shadow-petzy-coral/40"
                  onClick={() => handleAddToCart("buy")}
               />
            </div>
          </div>
        </div>

        {/* --- TWO COLUMN LAYOUT: DESCRIPTION & REVIEWS vs SIDEBAR --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
           
           {/* Left: Main Content */}
           <div className="lg:col-span-8 space-y-8">
              
              {/* Description */}
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 md:p-12">
                 <h2 className="text-2xl font-bold text-petzy-slate mb-8 flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-petzy-coral rounded-full"></div>
                   Product Details
                 </h2>
                 <article 
                    className="prose prose-slate max-w-none prose-img:rounded-2xl prose-img:shadow-sm prose-headings:text-petzy-slate prose-a:text-petzy-coral leading-relaxed text-gray-600"
                    dangerouslySetInnerHTML={{ __html: product.description || "<p>No description provided for this product.</p>" }}
                 />
              </div>

              {/* Reviews Section */}
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 md:p-12 scroll-mt-24" id="reviews">
                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10">
                    <div>
                      <h2 className="text-2xl font-bold text-petzy-slate flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-6 bg-petzy-yellow rounded-full"></div>
                        Customer Reviews
                      </h2>
                      <p className="text-sm text-gray-500 font-medium">Read what other pet parents think.</p>
                    </div>
                    {user ? (
                       <button 
                          onClick={onOpen} 
                          className="px-6 py-2.5 bg-petzy-slate text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors shadow-md"
                       >
                          Write a Review
                       </button>
                    ) : (
                       <Link 
                          href={`/login?from=/products/${product.slug}`} 
                          className="px-6 py-2.5 border-2 border-gray-200 text-petzy-slate text-sm font-bold rounded-full hover:border-petzy-slate transition-colors"
                       >
                          Login to Review
                       </Link>
                    )}
                 </div>

                 {currentReviews.length === 0 ? (
                    <div className="py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <NoReviews />
                    </div>
                 ) : (
                    <div className="space-y-8">
                       {currentReviews.map((review, i) => (
                          <div key={i} className="border-b border-gray-100 last:border-0 pb-8 last:pb-0">
                             <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden shrink-0">
                                      <img src={review.userId?.avatar || `https://ui-avatars.com/api/?name=${review.userId?.name}&background=f3f4f6`} alt={review.userId?.name || "User"} className="w-full h-full object-cover" />
                                   </div>
                                   <div>
                                      <h4 className="font-bold text-petzy-slate">{review.userId?.name || "Anonymous User"}</h4>
                                      <span className="text-xs text-gray-400 font-medium">{formatDate(review.date)}</span>
                                   </div>
                                </div>
                                <div className="flex text-yellow-400 text-sm bg-yellow-50 px-2 py-1 rounded-md">
                                    {[...Array(5)].map((_, idx) => (
                                      <FaStar key={idx} className={idx < review.rating ? "" : "text-gray-200"} />
                                    ))}
                                </div>
                             </div>
                             <p className="text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-xl text-sm md:text-base">
                               "{review.comment}"
                             </p>
                          </div>
                       ))}
                    </div>
                 )}

                 {totalPages > 1 && (
                    <div className="flex justify-center mt-12 pt-8 border-t border-gray-50">
                       <Pagination 
                          total={totalPages} 
                          page={reviewPage} 
                          onChange={setReviewPage} 
                          color="danger" 
                          variant="flat"
                       />
                    </div>
                 )}
              </div>
           </div>

           {/* Right: Sticky Sidebar */}
           <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-6">
                
                {/* Ratings Overview Card */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                   <h3 className="font-bold text-petzy-slate mb-6 uppercase tracking-wider text-sm">Rating Summary</h3>
                   
                   <div className="flex items-center gap-5 mb-8">
                      <div className="w-20 h-20 bg-petzy-slate text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-md">
                         {product.ratings?.toFixed(1) || "0.0"}
                      </div>
                      <div>
                         <div className="flex text-yellow-400 text-lg mb-1.5">
                            {[...Array(5)].map((_, i) => (
                               <FaStar key={i} className={i < Math.round(product.ratings || 0) ? "" : "text-gray-200"} />
                            ))}
                         </div>
                         <p className="text-sm text-gray-500 font-medium">{product.totalReviews || 0} Total Reviews</p>
                      </div>
                   </div>
                   
                   <ProductRatings 
                      ratings={product.ratings || 0}
                      totalRatings={product.totalRatings || 0}
                      totalReviews={product.totalReviews || 0} 
                      ratingBreakdown={product.ratingBreakdown}
                      simple={true} 
                   />
                </div>

                {/* Guarantees */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                   <h3 className="font-bold text-petzy-slate mb-6 uppercase tracking-wider text-sm">Our Guarantees</h3>
                   <div className="space-y-5">
                      <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                           <FaStore />
                         </div>
                         <div>
                            <p className="font-bold text-petzy-slate text-sm">Secure Delivery</p>
                            <p className="text-xs text-gray-500 mt-0.5">Tracked shipping on all orders</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                           <FaCheck />
                         </div>
                         <div>
                            <p className="font-bold text-petzy-slate text-sm">Quality Checked</p>
                            <p className="text-xs text-gray-500 mt-0.5">100% genuine pet products</p>
                         </div>
                      </div>
                   </div>
                </div>

              </div>
           </div>
        </div>

        {/* --- RELATED PRODUCTS --- */}
        {featuredProducts && featuredProducts.length > 0 && (
          <div className="mb-12 border-t border-gray-200 pt-16">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-petzy-slate mb-2">More from this Seller</h2>
                <p className="text-gray-500">Other products you might be interested in.</p>
             </div>
             <MoreProducts products={featuredProducts} type="featured" />
          </div>
        )}

      </div>

      {/* --- REVIEW MODAL --- */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent className="rounded-3xl p-2">
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-bold text-petzy-slate pb-2">
                Share Your Experience
              </ModalHeader>
              <ModalBody className="pt-2">
                <p className="text-sm text-gray-500 mb-4">How would you rate this product?</p>
                <div className="flex justify-center gap-3 mb-8 bg-gray-50 py-4 rounded-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star}
                      type="button"
                      onClick={() => setRating(star)} 
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className={`text-4xl transition-all transform hover:scale-110 ${
                        (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
                
                <div className="space-y-2">
                   <label className="text-sm font-bold text-petzy-slate ml-1">Your Review</label>
                   <Textarea 
                     placeholder="What did you like or dislike? How did your pet react to it?" 
                     value={comment} 
                     onChange={(e) => setComment(e.target.value)} 
                     rows={4}
                     className="bg-gray-50 border-gray-200 focus:bg-white"
                   />
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-gray-100 mt-6 pt-6">
                <Button text="Cancel" type="outline" onClick={onClose} className="px-6" />
                <Button 
                  text={reviewStatus ? "Submitting..." : "Submit Review"} 
                  type="default" 
                  onClick={() => submitReview(onClose)} 
                  disabled={reviewStatus || rating === 0 || comment.length < 5} 
                  className="px-8"
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  );
}