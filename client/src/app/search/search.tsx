"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import axiosInstance from "@/src/lib/axiosInstance";
import Product from "@/src/components/product";

interface ProductData {
  _id: string;
  id: string;
  name: string;
  images: { path: string }[];
  price: number;
  discount: number;
  category: string;
  description: string;
  slug: string;
  size: string;
}

export default function Search(): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

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
        <div className="text-center py-10">
          <p>Searching for &quot;{query}&quot;...</p>
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="text-center py-10">
          <p>No results found for &quot;{query}&quot;</p>
        </div>
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
