"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

import axios from "@/lib/axios";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/time";

import { Loader2, User } from "lucide-react";

export default function Page() {
  const search = useSearchParams();
  const productId = search.get("id");

  const [loading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<any>(null);

  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/admin/products/${productId}`);
      setProduct(data.product);
    } catch (error) {
      toast({
        title: "Error fetching product",
        description: "Could not fetch product details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: boolean) => {
    setStatusLoading(true);
    try {
      const { data } = await axios.post(`/api/admin/products/status`, {
        status,
        productId: product.productId,
      });

      if (data.success) {
        toast({
          title: "Product status updated successfully",
          description: `Product is now ${status ? "approved" : "rejected"}.`,
        });
        fetchProduct();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error updating product status",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProduct();
  }, []);

  return (
    <div className="p-5">
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <div>
          <h2 className="text-2xl mb-4">Product Details: #{productId}</h2>
          <p>{formatDate(product.createdAt)}</p>

          <div className="flex md:flex-row flex-col gap-5">
            <div className="basis-2/3">
              <div className="p-4 border rounded-xl my-2">
                <p className="mb-2">
                  <strong>Product Name:</strong> {product.name}
                </p>
                <p className="mb-2">
                  <strong>Categories: </strong>
                  <span>
                    {product.categories
                      .map((c: any) => `${c.parent} | ${c.category} | ${c.sub}`)
                      .join(", ")}
                  </span>
                </p>
                <p className="mb-2">
                  <strong>Original Price:</strong> {formatCurrency(product.price)}{" "}
                  BDT
                </p>
                <p className="mb-2">
                  <strong>Discount:</strong> {product.discount}%
                </p>
                <p className="mb-2">
                  <strong>Quantity:</strong> {product.quantity}
                </p>
                <p className="mb-2">
                  <strong>Featured: </strong> {product.featured ? "Yes" : "No"}
                </p>
                <p className="mb-2">
                  <strong>Shop Name: </strong> {product.vendorName}
                </p>
                <p className="mb-2">
                  <strong>Vendor: </strong> {product.vendorId.name} |{" "}
                  {product.vendorId.email} | {product.vendorId._id}
                </p>
                <p className="mb-2">
                  <strong>Product Description:</strong>{" "}
                  <p
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </p>
                <p className="mb-2">
                  <strong>Product Tags: </strong>
                  {product.tags.map((tag: any) => (
                    <span key={tag} className="mr-2">
                      {tag},
                    </span>
                  ))}
                </p>
                <p className="mb-2">
                  <strong>Reviews: </strong> {product.reviews.length}
                </p>
                <p className="mb-2">
                  <strong>Average Rating: </strong> {product.ratings}
                </p>
              </div>

              <div className="p-4 border rounded-xl my-2">
                <h2 className="text-xl font-semibold mb-2">Images</h2>
                <div className="flex flex-row flex-wrap">
                  {product.images.map((image: any) => (
                    <img
                      key={image.path}
                      src={image.path}
                      alt={product.name}
                      className="rounded-lg m-2 w-auto h-auto basis-1/4"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="basis-1/3">
              <div className="px-4 rounded-xl border divide-y-2 my-2">
                <h2 className="flex flex-row items-center gap-2 text-lg mb-2">
                  <User /> <div>Posted by</div>
                </h2>
                <div className="text-xl py-4 mb-2">{product.vendorName}</div>
                <p className="mb-2 py-4">
                  <strong>Created at: </strong> {formatDate(product.createdAt)}
                </p>
              </div>

              <div className="my-5 flex flex-col gap-2">
                {product.status === true ? (
                  <Button
                    className="w-full"
                    onClick={() => updateStatus(false)}
                    disabled={statusLoading}
                  >
                    {statusLoading && <Loader2 className="mr-2" />}
                    Reject Product
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => updateStatus(true)}
                    disabled={statusLoading}
                  >
                    {statusLoading && <Loader2 className="mr-2" />}
                    Approve Product
                  </Button>
                )}
                <Button className="w-full" variant="destructive">
                  Delete Product
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
