"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  FaStar, 
  FaStore, 
  FaChevronRight,
  FaLocationDot,
  FaCalendarDays,
  FaBoxesStacked,
  FaArrowDownWideShort
} from "react-icons/fa6";
import { Pagination } from "@heroui/pagination";

import Product from "@/src/components/product";
import { CardSkeleton, NoProductsFound } from "@/src/components/ui";
import Select from "@/src/components/ui/select";

import axios from "@/src/lib/axiosInstance";
import { formatDate } from "@/src/utils/formatDate";
import type { Product as ProductType } from "@/src/types";

interface VendorInfo {
  _id: string;
  storeName: string;
  name: string;
  address?: {
    store?: string;
    state?: string;
    district?: string;
  };
  ratings?: number;
  totalListedProducts?: number;
  createdAt?: string;
}

export default function StorePage() {
  const params = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [vendor, setVendor] = useState<VendorInfo | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sort, setSort] = useState<string>("-createdAt");

  const fetchStore = async (page: number = 1, sortValue: string = sort) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/vendor/store/${params.id}?page=${page}&sort=${sortValue}`);
      if (data.success) {
        setVendor(data.vendor);
        setProducts(data.products);
        setTotalProducts(data.totalProducts);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      }
    } catch (error: any) {
      console.error(error);
      if (error?.response?.status === 404) {
        toast.error("Store not found");
      } else {
        toast.error("Failed to load store");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStore();
  }, [params.id]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchStore(page, sort);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = event.target.value;
    setSort(newSort);
    setCurrentPage(1);
    fetchStore(1, newSort);
  };

  // Loading state
  if (loading && !vendor) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Skeleton Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-5 py-12">
            <div className="animate-pulse flex flex-col md:flex-row items-center gap-8">
              <div className="w-28 h-28 bg-gray-200 rounded-3xl"></div>
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="h-8 bg-gray-200 rounded-xl w-64 mx-auto md:mx-0"></div>
                <div className="h-4 bg-gray-200 rounded w-48 mx-auto md:mx-0"></div>
                <div className="flex gap-6 justify-center md:justify-start">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Skeleton Products */}
        <div className="container mx-auto px-5 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <CardSkeleton count={8} type="product" />
          </div>
        </div>
      </div>
    );
  }

  // Store not found
  if (!loading && !vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <FaStore className="text-3xl text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-petzy-slate mb-2">Store Not Found</h1>
          <p className="text-gray-500 mb-6">The store you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link 
            href="/products" 
            className="inline-block px-6 py-3 bg-petzy-coral text-white font-bold rounded-full hover:bg-petzy-coral/90 transition-colors shadow-md"
          >
            Browse Products
          </Link>
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
          <span className="text-petzy-slate truncate max-w-[200px] md:max-w-md">{vendor?.storeName}</span>
        </div>
      </div>

      {/* --- STORE HEADER --- */}
      <div className="container mx-auto px-5 mb-10">
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            
            {/* Store Avatar */}
            <div className="w-28 h-28 bg-gradient-to-br from-petzy-coral/10 to-petzy-blue-light/10 rounded-3xl flex items-center justify-center border-2 border-white shadow-lg shrink-0">
              <FaStore className="text-4xl text-petzy-coral" />
            </div>

            {/* Store Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-petzy-slate mb-2 tracking-tight">
                {vendor?.storeName}
              </h1>
              <p className="text-gray-500 font-medium mb-5">by {vendor?.name}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-sm">
                {/* Rating */}
                <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg text-yellow-600 font-bold">
                  <FaStar /> 
                  <span>{vendor?.ratings?.toFixed(1) || "0.0"}</span>
                </div>

                {/* Location */}
                {(vendor?.address?.district || vendor?.address?.state) && (
                  <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                    <FaLocationDot className="text-petzy-coral" />
                    <span>
                      {[vendor?.address?.district, vendor?.address?.state].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}

                {/* Products Count */}
                <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                  <FaBoxesStacked className="text-petzy-blue-light" />
                  <span>{totalProducts} Products</span>
                </div>

                {/* Member Since */}
                {vendor?.createdAt && (
                  <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                    <FaCalendarDays className="text-emerald-500" />
                    <span>Since {formatDate(vendor.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- PRODUCTS SECTION --- */}
      <div className="container mx-auto px-5">
        
        {/* Toolbar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-petzy-coral rounded-full"></div>
            <h2 className="text-xl font-bold text-petzy-slate">
              All Products
            </h2>
            <span className="text-sm text-gray-400 font-medium">({totalProducts})</span>
          </div>

          <div className="flex items-center gap-2">
            <FaArrowDownWideShort className="text-gray-400" />
            <Select
              data={[
                { text: "Newest First", value: "-createdAt" },
                { text: "Oldest First", value: "createdAt" },
                { text: "Price (Low → High)", value: "price" },
                { text: "Price (High → Low)", value: "-price" },
                { text: "Top Rated", value: "-ratings" },
              ]}
              className="!w-auto"
              value={sort}
              onChange={handleSortChange}
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <CardSkeleton count={8} type="product" />
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-12">
            <NoProductsFound onReset={() => fetchStore(1)} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Product
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  src={product.images?.[0]?.path || "/placeholder.png"}
                  price={product.price}
                  discount={product.discount}
                  category={product.category}
                  description={product.description}
                  slug={product.slug}
                  review={product.ratings}
                  totalReview={product.totalReviews}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 pt-8 border-t border-gray-100">
                <Pagination 
                  total={totalPages} 
                  page={currentPage} 
                  onChange={handlePageChange} 
                  color="danger" 
                  variant="flat"
                  showControls
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
