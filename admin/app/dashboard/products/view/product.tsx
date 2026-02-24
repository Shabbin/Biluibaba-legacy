"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

import axios from "@/lib/axios";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/time";

import {
  Loader2,
  Package,
  Store,
  Tag,
  Star,
  ImageIcon,
} from "lucide-react";

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
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div>
          <div className="page-header">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">Product Details</h2>
              {product.status === true ? (
                <span className="status-badge status-badge-approved">
                  Published
                </span>
              ) : (
                <span className="status-badge status-badge-pending">
                  Unpublished
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              #{productId} &middot; {formatDate(product.createdAt)}
            </p>
          </div>

          <div className="flex md:flex-row flex-col gap-5 mt-6">
            {/* Left Column */}
            <div className="basis-2/3 space-y-4">
              {/* Product Information Card */}
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Product Information
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-1 py-2.5 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">
                      Product Name
                    </span>
                    <span className="col-span-2 text-sm font-medium">
                      {product.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2.5 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">
                      Categories
                    </span>
                    <span className="col-span-2 text-sm font-medium">
                      {product.categories
                        .map(
                          (c: any) =>
                            `${c.parent} | ${c.category} | ${c.sub}`
                        )
                        .join(", ")}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2.5 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">
                      Original Price
                    </span>
                    <span className="col-span-2 text-sm font-medium">
                      {formatCurrency(product.price)} BDT
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2.5 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">
                      Discount
                    </span>
                    <span className="col-span-2 text-sm font-medium">
                      {product.discount}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2.5 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">
                      Quantity
                    </span>
                    <span className="col-span-2 text-sm font-medium">
                      {product.quantity}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2.5 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">
                      Featured
                    </span>
                    <span className="col-span-2 text-sm font-medium">
                      {product.featured ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2.5 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">
                      Shop Name
                    </span>
                    <span className="col-span-2 text-sm font-medium">
                      {product.vendorName}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2.5 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">
                      Vendor
                    </span>
                    <span className="col-span-2 text-sm font-medium">
                      {product.vendorId.name} | {product.vendorId.email} |{" "}
                      {product.vendorId._id}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2.5 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">
                      Description
                    </span>
                    <div className="col-span-2 text-sm font-medium">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product.description,
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2.5 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">
                      Tags
                    </span>
                    <div className="col-span-2 flex flex-wrap gap-1.5">
                      {product.tags.map((tag: any) => (
                        <span
                          key={tag}
                          className="inline-flex px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2.5 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">
                      Reviews
                    </span>
                    <span className="col-span-2 text-sm font-medium">
                      {product.reviews.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2.5 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">
                      Average Rating
                    </span>
                    <span className="col-span-2 text-sm font-medium flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      {product.ratings}
                    </span>
                  </div>
                </div>
              </div>

              {/* Images Card */}
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    Images
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
                  {product.images.map((image: any) => (
                    <img
                      key={image.path}
                      src={image.path}
                      alt={product.name}
                      className="rounded-xl border object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='%23ddd'%3E%3Crect width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' fill='%23999' font-size='14' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"; }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="basis-1/3 space-y-4">
              {/* Posted By Card */}
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Store className="h-5 w-5 text-primary" />
                    Posted by
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="text-lg font-semibold">
                    {product.vendorName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Created at: {formatDate(product.createdAt)}
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    Actions
                  </h3>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  {product.status === true ? (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => updateStatus(false)}
                      disabled={statusLoading}
                    >
                      {statusLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Reject Product
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => updateStatus(true)}
                      disabled={statusLoading}
                    >
                      {statusLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
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
        </div>
      )}
    </div>
  );
}
