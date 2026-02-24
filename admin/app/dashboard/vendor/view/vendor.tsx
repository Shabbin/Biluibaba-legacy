"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

import axios from "@/lib/axios";
import { formatDate } from "@/lib/time";

import {
  Loader2,
  Store,
  MapPin,
  Landmark,
  FileText,
  IdCard,
} from "lucide-react";

export default function Page() {
  const search = useSearchParams();
  const vendorId = search.get("id");

  const [loading, setLoading] = useState<boolean>(true);
  const [vendor, setVendor] = useState<any>(null);

  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const fetchVendor = async () => {
    try {
      const { data } = await axios.get(`/api/admin/vendors/${vendorId}`);
      setVendor(data.vendor);
    } catch (error) {
      toast({
        title: "Error fetching vendor",
        description: "Could not fetch vendor details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    setStatusLoading(true);
    try {
      const { data } = await axios.post("/api/admin/vendors/status", {
        status,
        vendorId: vendor._id,
      });

      if (data.success) {
        toast({
          title: "Vendor status updated",
          description: `Vendor is now ${
            status === "approved" ? "approved" : "rejected"
          }`,
          variant: "default",
        });
        fetchVendor();
      }
    } catch (error) {
      toast({
        title: "Error updating vendor status",
        description: "Could not update vendor status",
        variant: "destructive",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchVendor();
  }, []);

  return (
    <div className="dashboard-content">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div>
          {/* Page Header */}
          <div className="page-header">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <h2>Vendor Details</h2>
                <p>
                  #{vendorId} · Joined {formatDate(vendor.createdAt)}
                </p>
              </div>
              <div>
                {vendor.status === "approved" ? (
                  <span className="status-badge status-badge--success">
                    Approved
                  </span>
                ) : vendor.status === "pending" ? (
                  <span className="status-badge status-badge--warning">
                    Pending
                  </span>
                ) : (
                  <span className="status-badge status-badge--danger">
                    Rejected
                  </span>
                )}
              </div>
            </div>
            <div className="header-accent" />
          </div>

          <div className="flex md:flex-row flex-col gap-6">
            {/* Left Column */}
            <div className="basis-2/3 space-y-6">
              {/* Vendor Information Card */}
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Store className="h-5 w-5 text-primary" />
                    Vendor Information
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-1 py-2 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">Vendor Name</span>
                    <span className="col-span-2 text-sm font-medium">{vendor.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">Vendor Type</span>
                    <span className="col-span-2 text-sm font-medium">{vendor.type}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">Phone Number</span>
                    <span className="col-span-2 text-sm font-medium">{vendor.phoneNumber}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">Email</span>
                    <span className="col-span-2 text-sm font-medium">{vendor.email}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">Store Name</span>
                    <span className="col-span-2 text-sm font-medium">{vendor.storeName}</span>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Address
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-1 py-2 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">Store Address</span>
                    <span className="col-span-2 text-sm font-medium">{vendor.address.store}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">State</span>
                    <span className="col-span-2 text-sm font-medium">{vendor.address.state}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">Area</span>
                    <span className="col-span-2 text-sm font-medium">{vendor.address.area}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">District</span>
                    <span className="col-span-2 text-sm font-medium">{vendor.address.district}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">Postcode</span>
                    <span className="col-span-2 text-sm font-medium">{vendor.address.postcode}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">Full Address</span>
                    <span className="col-span-2 text-sm font-medium">{vendor.address.fullAddress}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">Pickup Address</span>
                    <span className="col-span-2 text-sm font-medium">{vendor.address.pickupAddress}</span>
                  </div>
                </div>
              </div>

              {/* Bank Information Card */}
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-primary" />
                    Bank Information
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-1 py-2 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">Account Type</span>
                    <span className="col-span-2 text-sm font-medium">{vendor.bank.accountType}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">Account Name</span>
                    <span className="col-span-2 text-sm font-medium">{vendor.bank.accountName}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">Account Number</span>
                    <span className="col-span-2 text-sm font-medium">{vendor.bank.accountNumber}</span>
                  </div>
                </div>
              </div>

              {/* Tax Information Card */}
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Tax Information
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-1 py-2 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">TIN</span>
                    <span className="col-span-2 text-sm font-medium">{vendor.tax.tin}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 py-2 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">Trade License</span>
                    <span className="col-span-2 text-sm font-medium">{vendor.tax.tradeLicense}</span>
                  </div>
                </div>
              </div>

              {/* NID / Identity Card */}
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <IdCard className="h-5 w-5 text-primary" />
                    Identity Documents
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-3 gap-1 py-2 border-b last:border-0">
                    <span className="text-muted-foreground text-sm">NID Number</span>
                    <span className="col-span-2 text-sm font-medium">{vendor.nid.number}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">NID Front</p>
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/vendor/${vendor.nid.front}`}
                        alt={vendor.nid.number}
                        className="rounded-xl border w-[300px]"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">NID Back</p>
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/vendor/${vendor.nid.back}`}
                        alt={vendor.nid.number}
                        className="rounded-xl border w-[300px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="basis-1/3">
              <div className="rounded-xl border bg-card overflow-hidden sticky top-6">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="text-lg font-semibold">Update Status</h3>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  {vendor.status === "approved" ? (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => updateStatus("rejected")}
                      disabled={statusLoading}
                    >
                      {statusLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Reject Vendor
                    </Button>
                  ) : vendor.status === "pending" ? (
                    <Button
                      className="w-full"
                      onClick={() => updateStatus("approved")}
                      disabled={statusLoading}
                    >
                      {statusLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Approve Vendor
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => updateStatus("approved")}
                      disabled={statusLoading}
                    >
                      {statusLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Reactivate Vendor
                    </Button>
                  )}
                  <Button className="w-full" variant="destructive">
                    Delete Vendor
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
