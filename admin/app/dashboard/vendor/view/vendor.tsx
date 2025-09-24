"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

import axios from "@/lib/axios";
import { formatDate } from "@/lib/time";

import { Loader2, User } from "lucide-react";

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
      console.log(data);
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
    <div className="p-5">
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <div>
          <div className="flex md:flex-row flex-col items-center gap-5">
            <h2 className="text-2xl">Vendor Details: #{vendorId}</h2>
            <p>
              {vendor.status === "approved" ? (
                <span className="px-4 py-1 bg-green-100 text-green-900 rounded">
                  Approved
                </span>
              ) : vendor.status === "pending" ? (
                <span className="px-4 py-1 bg-yellow-100 text-yellow-900  rounded">
                  Pending
                </span>
              ) : (
                <span className="px-4 py-1 bg-red-100 text-red-900 rounded">
                  Rejected
                </span>
              )}
            </p>
          </div>

          <p className="my-2">{formatDate(vendor.createdAt)}</p>

          <div className="flex md:flex-row flex-col gap-5">
            <div className="basis-2/3">
              <div className="p-4 border rounded-xl my-2">
                <p className="mb-2">
                  <strong>Vendor name:</strong> {vendor.name}
                </p>
                <p className="mb-2">
                  <strong>Vendor type:</strong> {vendor.type}
                </p>
                <p className="mb-2">
                  <strong>Phone Number: </strong> {vendor.phoneNumber}
                </p>
                <p className="mb-2">
                  <strong>Email: </strong> {vendor.email}
                </p>
                <p className="mb-2">
                  <strong>Store name: </strong> {vendor.storeName}
                </p>
                <h2 className="text-lg font-bold my-2">Address</h2>
                <p className="mb-2">
                  <strong>Store address: </strong> {vendor.address.store}
                </p>
                <p className="mb-2">
                  <strong>Store state: </strong> {vendor.address.state}
                </p>
                <p className="mb-2">
                  <strong>Store area: </strong> {vendor.address.area}
                </p>
                <p className="mb-2">
                  <strong>Store district: </strong> {vendor.address.district}
                </p>
                <p className="mb-2">
                  <strong>Store postcode: </strong> {vendor.address.postcode}
                </p>
                <p className="mb-2">
                  <strong>Full address: </strong> {vendor.address.fullAddress}
                </p>
                <p className="mb-2">
                  <strong>Pickup address: </strong>{" "}
                  {vendor.address.pickupAddress}
                </p>

                <h2 className="text-lg font-bold my-2">Bank Information</h2>
                <p className="mb-2">
                  <strong>Account type: </strong> {vendor.bank.accountType}
                </p>
                <p className="mb-2">
                  <strong>Account name: </strong> {vendor.bank.accountName}
                </p>
                <p className="mb-2">
                  <strong>Account number: </strong> {vendor.bank.accountNumber}
                </p>

                <h2 className="text-lg font-bold my-2">Tax Information</h2>
                <p className="mb-2">
                  <strong>TIN: </strong> {vendor.tax.tin}
                </p>
                <p className="mb-2">
                  <strong>Trade license: </strong> {vendor.tax.tradeLicense}
                </p>
              </div>

              <div className="p-4 border rounded-xl my-2">
                <h2 className="text-xl font-semibold mb-2">
                  Other Informations
                </h2>
                <p className="mb-2">
                  <strong>NID Number: </strong> {vendor.nid.number}
                </p>
                <p className="mb-2 font-bold">NID front</p>
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/vendor/${vendor.nid.front}`}
                  alt={vendor.nid.number}
                  className="rounded-lg m-2 w-[300px]"
                />
                <p className="mb-2 font-bold">NID back</p>
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/vendor/${vendor.nid.back}`}
                  alt={vendor.nid.number}
                  className="rounded-lg m-2 w-[300px]"
                />

                <p className="mb-2">
                  <strong></strong>
                </p>
              </div>
            </div>

            <div className="basis-1/3">
              <h2 className="text-xl font-semibold mb-2">Update Status</h2>
              <div className="my-5 flex flex-col gap-2">
                {vendor.status === "approved" ? (
                  <Button
                    className="w-full"
                    onClick={() => updateStatus("rejected")}
                    disabled={statusLoading}
                  >
                    {statusLoading && <Loader2 className="mr-2" />}
                    Reject Vendor
                  </Button>
                ) : vendor.status === "pending" ? (
                  <Button
                    className="w-full"
                    onClick={() => updateStatus("approved")}
                    disabled={statusLoading}
                  >
                    {statusLoading && <Loader2 className="mr-2" />}
                    Approve Vendor
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => updateStatus("approved")}
                    disabled={statusLoading}
                  >
                    {statusLoading && <Loader2 className="mr-2" />}
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
      )}
    </div>
  );
}
