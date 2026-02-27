"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

import axios from "@/lib/axios";
import { formatDate } from "@/lib/time";

import {
  Loader2,
  Stethoscope,
  MapPin,
  Landmark,
  GraduationCap,
  Star,
  Calendar,
  Phone,
  Mail,
  IdCard,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Vet() {
  const search = useSearchParams();
  const vetId = search.get("id");

  const [loading, setLoading] = useState<boolean>(true);
  const [vet, setVet] = useState<any>(null);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const fetchVet = async () => {
    try {
      const { data } = await axios.get(`/api/admin/vets/${vetId}`);
      setVet(data.vet);
    } catch (error) {
      toast({
        title: "Error fetching vet",
        description: "Could not fetch veterinarian details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    setStatusLoading(true);
    try {
      const { data } = await axios.post("/api/admin/vets/status", {
        status,
        vetId: vet._id,
      });

      if (data.success) {
        toast({
          title: "Vet status updated",
          description: `Veterinarian is now ${status === "approved" ? "approved" : "rejected"}`,
          variant: "default",
        });
        fetchVet();
      }
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "Could not update veterinarian status",
        variant: "destructive",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchVet();
  }, []);

  return (
    <div className="dashboard-content">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !vet ? (
        <div className="empty-state">
          <Stethoscope className="h-12 w-12 text-muted-foreground/50" />
          <h3>Vet not found</h3>
          <p>The veterinarian profile could not be found.</p>
        </div>
      ) : (
        <div>
          {/* Page Header */}
          <div className="page-header">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-4 flex-1">
                <Avatar className="w-14 h-14 ring-2 ring-primary/10">
                  <AvatarImage src={vet.profilePicture} alt={vet.name} />
                  <AvatarFallback className="bg-gradient-to-br from-[#FF8A80] to-[#FF6B61] text-white text-lg font-bold">
                    {vet.name?.charAt(0)?.toUpperCase() || "V"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2>{vet.name}</h2>
                  <p>
                    #{vetId} · Joined {formatDate(vet.createdAt)}
                  </p>
                </div>
              </div>
              <div>
                {vet.status === true ? (
                  <span className="status-badge status-badge--success">
                    Approved
                  </span>
                ) : (
                  <span className="status-badge status-badge--warning">
                    Pending
                  </span>
                )}
              </div>
            </div>
            <div className="header-accent" />
          </div>

          <div className="flex md:flex-row flex-col gap-6">
            {/* Left Column */}
            <div className="basis-2/3 space-y-6">
              {/* Basic Information */}
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    Veterinarian Information
                  </h3>
                </div>
                <div className="p-4">
                  <InfoRow label="Name" value={vet.name} />
                  <InfoRow label="Email" value={vet.email} />
                  <InfoRow label="Phone" value={vet.phoneNumber} />
                  <InfoRow label="Gender" value={vet.gender} />
                  <InfoRow label="Degree" value={vet.degree} />
                  <InfoRow label="License" value={vet.license} />
                  <InfoRow label="Hospital" value={vet.hospital} />
                  {vet.bio && <InfoRow label="Bio" value={vet.bio} />}
                </div>
              </div>

              {/* Address */}
              {vet.address && (
                <div className="rounded-xl border bg-card overflow-hidden">
                  <div className="p-4 border-b bg-muted/30">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Address
                    </h3>
                  </div>
                  <div className="p-4">
                    <InfoRow label="State" value={vet.address.state} />
                    <InfoRow label="District" value={vet.address.district} />
                    <InfoRow label="Postcode" value={vet.address.postcode} />
                    <InfoRow label="Full Address" value={vet.address.fullAddress} />
                  </div>
                </div>
              )}

              {/* Appointment Settings */}
              {vet.appointments && (
                <div className="rounded-xl border bg-card overflow-hidden">
                  <div className="p-4 border-b bg-muted/30">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Appointment Settings
                    </h3>
                  </div>
                  <div className="p-4">
                    {vet.appointments.online?.status !== undefined && (
                      <InfoRow
                        label="Online Consultation"
                        value={
                          vet.appointments.online.status
                            ? `Active — ৳${vet.appointments.online.fee}`
                            : "Inactive"
                        }
                      />
                    )}
                    {vet.appointments.physical?.status !== undefined && (
                      <InfoRow
                        label="Physical Visit"
                        value={
                          vet.appointments.physical.status
                            ? `Active — ৳${vet.appointments.physical.fee}`
                            : "Inactive"
                        }
                      />
                    )}
                    {vet.appointments.emergency?.status !== undefined && (
                      <InfoRow
                        label="Emergency"
                        value={
                          vet.appointments.emergency.status
                            ? `Active — ৳${vet.appointments.emergency.fee}`
                            : "Inactive"
                        }
                      />
                    )}
                    {vet.appointments.homeService?.status !== undefined && (
                      <InfoRow
                        label="Home Service"
                        value={
                          vet.appointments.homeService.status
                            ? `Active — ৳${vet.appointments.homeService.fee}`
                            : "Inactive"
                        }
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Specialized Zone */}
              {vet.specializedZone && vet.specializedZone.length > 0 && (
                <div className="rounded-xl border bg-card overflow-hidden">
                  <div className="p-4 border-b bg-muted/30">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      Specializations
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {vet.specializedZone.map((zone: any, index: number) => (
                      <div key={index} className="border-b last:border-0 pb-2 last:pb-0">
                        <span className="text-sm font-medium">{zone.pet}</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {zone.concerns?.map((concern: string, i: number) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 rounded-full bg-[#FFF0EE] text-[#FF6B61] font-medium"
                            >
                              {concern}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="basis-1/3 space-y-6">
              {/* Stats */}
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Ratings & Reviews
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                    <span className="text-sm font-bold">{vet.ratings?.toFixed(1) || "0.0"} / 5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Ratings</span>
                    <span className="text-sm font-bold">{vet.totalRatings || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Reviews</span>
                    <span className="text-sm font-bold">{vet.totalReviews || 0}</span>
                  </div>
                </div>
              </div>

              {/* NID Info */}
              {vet.nid && (
                <div className="rounded-xl border bg-card overflow-hidden">
                  <div className="p-4 border-b bg-muted/30">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <IdCard className="h-5 w-5 text-primary" />
                      Identity Document
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {vet.nid.number && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">NID Number</span>
                        <span className="text-sm font-mono">{vet.nid.number}</span>
                      </div>
                    )}
                    {vet.nid.front && (
                      <div>
                        <span className="text-sm text-muted-foreground">Front</span>
                        <img
                          src={vet.nid.front}
                          alt="NID Front"
                          className="mt-1 rounded-lg border w-full object-cover"
                        />
                      </div>
                    )}
                    {vet.nid.back && (
                      <div>
                        <span className="text-sm text-muted-foreground">Back</span>
                        <img
                          src={vet.nid.back}
                          alt="NID Back"
                          className="mt-1 rounded-lg border w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bank Information */}
              {vet.bank && (
                <div className="rounded-xl border bg-card overflow-hidden">
                  <div className="p-4 border-b bg-muted/30">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Landmark className="h-5 w-5 text-primary" />
                      Bank Information
                    </h3>
                  </div>
                  <div className="p-4">
                    <InfoRow label="Account Type" value={vet.bank.accountType} />
                    <InfoRow label="Account Name" value={vet.bank.accountName} />
                    <InfoRow label="Account Number" value={vet.bank.accountNumber} />
                  </div>
                </div>
              )}

              {/* Tax Info */}
              {vet.tax?.tin && (
                <div className="rounded-xl border bg-card overflow-hidden">
                  <div className="p-4 border-b bg-muted/30">
                    <h3 className="text-lg font-semibold">Tax Information</h3>
                  </div>
                  <div className="p-4">
                    <InfoRow label="TIN" value={vet.tax.tin} />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="text-lg font-semibold">Actions</h3>
                </div>
                <div className="p-4 space-y-3">
                  {vet.status !== true && (
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      disabled={statusLoading}
                      onClick={() => updateStatus("approved")}
                    >
                      {statusLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Approve Vet
                    </Button>
                  )}
                  {vet.status === true && (
                    <Button
                      variant="destructive"
                      className="w-full"
                      disabled={statusLoading}
                      onClick={() => updateStatus("rejected")}
                    >
                      {statusLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Reject Vet
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-3 gap-1 py-2 border-b last:border-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="col-span-2 text-sm font-medium">{value || "—"}</span>
    </div>
  );
}
