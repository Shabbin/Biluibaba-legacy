"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pagination } from "@heroui/pagination";
import toast from "react-hot-toast";

import Button from "@/src/components/ui/button";
import Select from "@/src/components/ui/select";

import Product from "@/src/components/product";

import axios from "@/src/lib/axiosInstance";

import { GiSettingsKnobs } from "react-icons/gi";

export default function Page() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [bestDeals, setBestDeals] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [targetTimestamp, setTargetTimestamp] = useState(null);
  const [filter, setFilter] = useState("popularity");
  const [count, setCount] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [timestampInitialized, setTimestampInitialized] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 40; // Fixed number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  const [isExpired, setIsExpired] = useState(false);

  const fetchDeals = async (pageCount) => {
    try {
      const { data } = await axios.get(
        `/api/product/best-deals?&count=${pageCount}`
      );

      if (data.success) {
        setBestDeals(data.products || []);

        // Ensure data.duration is a number
        const duration = Number(data.duration);
        setTargetTimestamp(duration);

        setProductCount(data.totalProducts);

        const calculatedTotalPages = Math.ceil(
          data.totalProducts / itemsPerPage
        );

        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        setCount(pageCount);
      }
    } catch (error) {
      console.error("Error fetching best deals:", error);
      toast.error("Failed to fetch best deals. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const newCount = page - 1;

    console.log(newCount);

    setCount(newCount);
    fetchDeals(newCount);
    window.scrollTo({ top: 1000, behavior: "smooth" });
  };

  useEffect(() => {
    fetchDeals(count);
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Only calculate if targetTimestamp is valid
      if (targetTimestamp === null) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const now = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
      const difference = targetTimestamp - now;

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(difference / (24 * 60 * 60));
      const hours = Math.floor((difference % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((difference % (60 * 60)) / 60);
      const seconds = difference % 60;

      return { days, hours, minutes, seconds };
    };

    // Calculate initial time
    setTimeLeft(calculateTimeLeft());

    // Set up interval to update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTimestamp]);

  useEffect(() => {
    // Ensure targetTimestamp is valid before setting up the timer
    if (targetTimestamp !== null && !timestampInitialized) {
      setTimestampInitialized(true);
    }
  }, [targetTimestamp, timestampInitialized]);

  const formatNumber = (num) => {
    return num.toString().padStart(2, "0");
  };

  return (
    <div>
      <div>
        <img src="/best_deals.png" alt="Best Deals" />
      </div>

      {isExpired ? (
        <div></div>
      ) : (
        <>
          <div className="py-10 px-5">
            <div className="flex md:flex-row flex-col items-center justify-between py-8 border-b-2 text-xl md:gap-0 gap-5">
              <div className="flex flex-row items-center gap-2 font-medium basis-1/4 justify-center md:text-xl text-3xl">
                <GiSettingsKnobs size="1.2em" /> Filter
              </div>
              <div className="basis-1/2 text-center md:border-r-2 md:border-l-2 border-t-2 border-b-2 md:border-t-0 md:border-b-0 md:text-xl text-3xl">
                {productCount} Products
              </div>
              <div className="basis-1/4 text-center">
                <Select
                  data={[
                    { text: "Popularity", value: "popularity" },
                    { text: "Price (Low > High)", value: "price-low" },
                    { text: "Price (High > Low)", value: "price-high" },
                  ]}
                  className="!w-auto"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                ></Select>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between p-8 rounded-xl">
            {/* Title Section */}
            <div className="text-center lg:text-left mb-6 lg:mb-0 lg:w-1/2">
              <h2 className="text-2xl lg:text-6xl font-bold text-gray-800 leading-tight">
                Flat 25% Off - Grab the Best Deals Now!
              </h2>
            </div>

            {/* Countdown Section */}
            <div className="flex items-end space-x-4 lg:w-1/2 justify-center lg:justify-end">
              {/* Days */}
              <div className="text-center">
                <div className="text-sm font-medium text-gray-400 mb-1">
                  Days
                </div>
                <div className="text-3xl lg:text-6xl text-gray-800">
                  {formatNumber(timeLeft.days)}
                </div>
              </div>

              <div className="text-3xl lg:text-6xl text-gray-800">:</div>

              {/* Hours */}
              <div className="text-center">
                <div className="text-sm font-medium text-gray-400 mb-1">
                  Hours
                </div>
                <div className="text-3xl lg:text-6xl text-gray-800">
                  {formatNumber(timeLeft.hours)}
                </div>
              </div>

              <div className="text-3xl lg:text-6xl text-gray-800">:</div>

              {/* Minutes */}
              <div className="text-center">
                <div className="text-sm font-medium text-gray-400 mb-1">
                  Minutes
                </div>
                <div className="text-3xl lg:text-6xl text-gray-800">
                  {formatNumber(timeLeft.minutes)}
                </div>
              </div>

              <div className="text-3xl lg:text-6xl text-gray-800">:</div>

              {/* Seconds */}
              <div className="text-center">
                <div className="text-sm font-medium text-gray-400 mb-1">
                  Seconds
                </div>
                <div className="text-3xl lg:text-6xl text-gray-800">
                  {formatNumber(timeLeft.seconds)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col m-4 gap-4 py-10">
            <div className="flex md:flex-row flex-col flex-wrap gap-y-10 items-center justify-between basis-full">
              {loading ? (
                <div>Loading...</div>
              ) : (
                bestDeals.map(({ id: product }) => (
                  <div className="md:basis-1/4 basis-full" key={product._id}>
                    <Product
                      id={product.id}
                      name={product.name}
                      src={product.images[0].path}
                      price={product.price}
                      discount={product.discount}
                      category={product.category}
                      description={product.description}
                      slug={product.slug}
                      router={router}
                      size={product.size}
                    />
                  </div>
                ))
              )}
              {bestDeals.length <= 0 && (
                <div className="text-xl font-bold text-gray-500 text-center uppercase mx-auto py-5">
                  No Products
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row items-center justify-center py-5">
            {!loading && totalPages > 1 && (
              <Pagination
                total={totalPages}
                initialPage={currentPage}
                page={currentPage}
                variant="flat"
                classNames={{
                  cursor: "bg-zinc-950 border-zinc-950 ",
                }}
                showControls
                onChange={handlePageChange}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
