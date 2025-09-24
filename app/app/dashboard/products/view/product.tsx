"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ProductUploadForm from "@/app/_components/products/upload";
import { AlertDialogBox } from "@/components/alert-dialog";

import axios from "@/lib/axios";
import { formatDate } from "@/lib/time";

import { Loader2, User } from "lucide-react";

export default function Page() {
  const search = useSearchParams();
  const productId = search.get("id");

  const [loading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<any>(null);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [openStatusAlert, setIsOpenStatusAlert] = useState<boolean>(false);
  const [openDeleteAlert, setIsOpenDeleteAlert] = useState<boolean>(false);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/vendor/products/${productId}`);
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

  const deleteProduct = async (id: string) => {
    setDeleteLoading(true);
    try {
      const { data } = await axios.delete(`/api/product/delete/${id}`);
      if (data.success) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
        return window.location.reload();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again!",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const updateStatus = async (id: string) => {
    setStatusLoading(true);
    try {
      const { data } = await axios.post(`/api/product/status/${id}`);
      if (data.success) {
        toast({
          title: "Success",
          description: "Product unpublished successfully",
        });
        return window.location.reload();
      } else {
        toast({
          title: "Error",
          description: "Failed to unpublish product",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again!",
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
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center  gap-2">
              <h2 className="text-2xl">Product Details: #{productId}</h2>
              <div>
                {product.status == true ? (
                  <span className="px-4 py-1 bg-green-100 text-green-900 font-bold rounded">
                    Published
                  </span>
                ) : (
                  <span className="px-4 py-1 bg-yellow-100 text-yellow-900 font-bold rounded">
                    Pending
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-row gap-4">
              {product.status ? (
                <Button
                  onClick={() => setIsOpenStatusAlert(true)}
                  disabled={statusLoading}
                >
                  {statusLoading && <Loader2 className="animate-spin" />}
                  Unpublish Product
                </Button>
              ) : null}
              <Button
                variant="destructive"
                onClick={() => setIsOpenDeleteAlert(true)}
                disabled={deleteLoading}
              >
                {deleteLoading && <Loader2 className="animate-spin" />}
                Delete Product
              </Button>
            </div>
          </div>
          <p>{formatDate(product.createdAt)}</p>

          <ProductUploadForm product={product} />

          <AlertDialogBox
            open={openStatusAlert}
            onOpenChange={setIsOpenStatusAlert}
            title="Confirm Unpublish"
            description="Are you sure you want to unpublish this product?"
            onConfirm={(e) => {
              e.preventDefault();
              updateStatus(product.productId);
            }}
          />

          <AlertDialogBox
            open={openDeleteAlert}
            onOpenChange={setIsOpenDeleteAlert}
            title="Confirm Deletion"
            description="Are you sure you want to delete this product? This can not be undone."
            onConfirm={(e) => {
              e.preventDefault();
              deleteProduct(product.productId);
            }}
          />
        </div>
      )}
    </div>
  );
}
