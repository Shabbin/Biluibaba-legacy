"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import axiosInstance from "@/src/lib/axiosInstance";
import Product from "@/src/components/product";
import { CardSkeleton, NoSearchResults } from "@/src/components/ui";

export default function Search() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef(null);

  // Extract and decode query from URL parameters
  useEffect(() => {
    const urlQuery = searchParams.get("q") || searchParams.get("query") || "";
    const decodedQuery = decodeURIComponent(urlQuery);
    setQuery(decodedQuery);
  }, [searchParams]);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (query.trim() === "") {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    debounceTimer.current = setTimeout(async () => {
      console.log("Searching for:", query);
      try {
        const response = await axiosInstance.get(
          `/api/product/search?query=${encodeURIComponent(query)}`
        );

        if (response.data.success) {
          setResults(response.data.products);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        toast.error("Failed to fetch search results");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query]);

  return (
    <div className="p-5">
      {loading && (
        <div className="flex md:flex-row flex-col flex-wrap gap-y-10 items-center justify-start">
          <CardSkeleton count={8} type="product" />
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <NoSearchResults query={query} />
      )}

      {!loading && results.length > 0 && (
        <div className="flex md:flex-row flex-col flex-wrap gap-y-10 items-center justify-start">
          {results.map((product) => (
            <div className="md:basis-1/4 basis-full" key={product._id}>
              <Product
                id={product.id}
                name={product.name}
                src={product.images[0]?.path}
                price={product.price}
                discount={product.discount}
                category={product.category}
                description={product.description}
                slug={product.slug}
                router={router}
                size={product.size}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
