"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ProductUploadForm from "@/app/_components/products/upload";
import { AlertDialogBox } from "@/components/alert-dialog";

import axios from "@/lib/axios";
import { formatDate } from "@/lib/time";

import { Loader2, ArrowLeft, Trash2, EyeOff, Calendar } from "lucide-react";
import Link from "next/link";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin h-8 w-8 text-[#FF8A80]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <Link
            href="/dashboard/products"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 rounded-full bg-[#FF8A80]" />
              <h1 className="text-2xl font-bold tracking-tight">Product Details</h1>
            </div>
            <span className="font-mono text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
              #{productId}
            </span>
            {product.status == true ? (
              <span className="status-badge--success">Published</span>
            ) : (
              <span className="status-badge--warning">Pending</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 ml-5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(product.createdAt)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {product.status ? (
            <Button
              variant="outline"
              onClick={() => setIsOpenStatusAlert(true)}
              disabled={statusLoading}
            >
              {statusLoading ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <EyeOff className="mr-2 h-4 w-4" />
              )}
              Unpublish
            </Button>
          ) : null}
          <Button
            variant="destructive"
            onClick={() => setIsOpenDeleteAlert(true)}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete
          </Button>
        </div>
      </div>

      {/* Product Form */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm">
        <ProductUploadForm product={product} />
      </div>

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
  );
}
