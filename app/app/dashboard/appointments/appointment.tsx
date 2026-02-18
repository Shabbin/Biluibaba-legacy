"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialogBox } from "@/components/alert-dialog";

import axios from "@/lib/axios";
import { formatCurrency } from "@/lib/currency";

interface Prescription {
  medication: string;
  dose: string;
  instruction: string;
}

import {
  Loader2,
  ArrowLeft,
  PawPrint,
  Calendar,
  Clock,
  Video,
  Home,
  Stethoscope,
  CreditCard,
  User,
  FileText,
  Plus,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function AppointmentDetailsPage() {
  const search = useSearchParams();
  const appointmentId = search.get("id");

  const [loading, setLoading] = useState<boolean>(true);
  const [appointment, setAppointment] = useState<null | any>(null);
  const [prescriptionForm, setPrescriptionForm] = useState<Prescription>({
    medication: "",
    dose: "",
    instruction: "",
  });
  const [newPrescriptions, setNewPrescriptions] = useState<Prescription[]>([]);
  const [isAddingPrescription, setIsAddingPrescription] = useState(false);
  const [openCancelAlert, setCancelAlert] = useState(false);

  const fetchAppointment = async () => {
    try {
      const { data } = await axios.get(
        `/api/vet/appointment?id=${appointmentId}`
      );

      if (data.success) setAppointment(data.appointment);
      else {
        toast({
          title: "Error",
          description: "Failed to fetch appointment details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong while fetching appointment details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToList = () => {
    setNewPrescriptions([...newPrescriptions, prescriptionForm]);
    setPrescriptionForm({
      medication: "",
      dose: "",
      instruction: "",
    });
    toast({
      title: "Added to list",
      description: "Prescription added to the list. Don't forget to save!",
    });
  };

  const handleRemoveFromList = (index: number) => {
    setNewPrescriptions(newPrescriptions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (status: string) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/vet/appointment/update`, {
        prescription: newPrescriptions,
        id: appointment._id,
        status,
      });

      if (data.success) {
        toast({
          title: "Success",
          description:
            status === "completed"
              ? "Appointment completed successfully"
              : "Appointment cancelled successfully",
        });
        fetchAppointment();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin h-8 w-8 text-[#FF8A80]" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="empty-state">
        <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="text-lg font-semibold mt-4">Appointment Not Found</h3>
        <p className="text-muted-foreground mt-1">
          The appointment you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/dashboard/appointments/all">
          <Button className="mt-4" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Appointments
          </Button>
        </Link>
      </div>
    );
  }

  const statusBadge = () => {
    switch (appointment.status) {
      case "confirmed":
        return <span className="status-badge--success">Confirmed</span>;
      case "pending":
        return <span className="status-badge--warning">Pending</span>;
      case "completed":
        return <span className="status-badge--info">Completed</span>;
      case "cancelled":
        return <span className="status-badge--danger">Cancelled</span>;
      default:
        return <span className="status-badge--default">{appointment.status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <Link
            href="/dashboard/appointments/all"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Appointments
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 rounded-full bg-[#FF8A80]" />
              <h1 className="text-2xl font-bold tracking-tight">Appointment Details</h1>
            </div>
            <span className="font-mono text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {appointment.appointmentId}
            </span>
            {statusBadge()}
          </div>
        </div>
        {appointment.status === "confirmed" && (
          <div className="flex items-center gap-3">
            <Button
              variant="destructive"
              onClick={() => setCancelAlert(true)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={() => handleSubmit("completed")}
              disabled={loading}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pet Information */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <PawPrint className="h-5 w-5 text-[#FF8A80]" />
              <h2 className="text-lg font-semibold">Pet Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pet Name</p>
                <p className="font-medium mt-1">{appointment.petName}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Species</p>
                <p className="font-medium mt-1 uppercase">{appointment.species}</p>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="h-5 w-5 text-[#FF8A80]" />
              <h2 className="text-lg font-semibold">Appointment Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{appointment.date}</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Time</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{appointment.time}</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</p>
                <p className="font-medium mt-1 capitalize">{appointment.type}</p>
              </div>
              {appointment.type === "homeService" && (
                <div className="p-3 rounded-xl bg-muted/30">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Home Address</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium capitalize">{appointment.homeAddress}</p>
                  </div>
                </div>
              )}
              {appointment.type === "online" && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Room Link</p>
                  <a
                    href={`${process.env.NEXT_PUBLIC_ROOM_URL}?room=${appointment.roomLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    <Video className="h-4 w-4" />
                    Join Video Room
                  </a>
                </div>
              )}
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Amount</p>
                <p className="font-semibold mt-1 text-[#FF6B61]">
                  {formatCurrency(appointment.totalAmount)} BDT
                </p>
              </div>
            </div>
          </div>

          {/* Health Concerns */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-[#FF8A80]" />
              <h2 className="text-lg font-semibold">Health Concerns</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Issues</p>
                <div className="flex flex-wrap gap-2">
                  {appointment.petConcern.map(
                    (concern: string, index: number) => (
                      <span
                        key={index}
                        className="bg-[#FF8A80]/10 text-[#FF6B61] px-3 py-1.5 rounded-full text-sm font-medium"
                      >
                        {concern}
                      </span>
                    )
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Detailed Concern</p>
                <p className="text-sm leading-relaxed p-3 rounded-xl bg-muted/30">{appointment.detailedConcern}</p>
              </div>
            </div>
          </div>

          {/* Prescriptions */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#FF8A80]" />
                <h2 className="text-lg font-semibold">Prescriptions</h2>
              </div>
              {appointment.status === "confirmed" && (
                <Button
                  onClick={() => setIsAddingPrescription(!isAddingPrescription)}
                  variant="outline"
                  size="sm"
                >
                  {isAddingPrescription ? (
                    <>
                      <X className="mr-1.5 h-3.5 w-3.5" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                      Add Prescription
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Add Prescription Form */}
            {isAddingPrescription && appointment.status === "confirmed" && (
              <div className="bg-muted/30 p-4 rounded-xl mb-4 border border-border/40">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                      Medication
                    </label>
                    <Input
                      value={prescriptionForm.medication}
                      onChange={(e) =>
                        setPrescriptionForm({
                          ...prescriptionForm,
                          medication: e.target.value,
                        })
                      }
                      placeholder="Enter medication name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                      Dose
                    </label>
                    <Input
                      value={prescriptionForm.dose}
                      onChange={(e) =>
                        setPrescriptionForm({
                          ...prescriptionForm,
                          dose: e.target.value,
                        })
                      }
                      placeholder="Enter dosage"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                      Instructions
                    </label>
                    <Textarea
                      value={prescriptionForm.instruction}
                      onChange={(e) =>
                        setPrescriptionForm({
                          ...prescriptionForm,
                          instruction: e.target.value,
                        })
                      }
                      placeholder="Enter instructions for the patient"
                    />
                  </div>
                  <Button
                    onClick={handleAddToList}
                    className="w-full"
                    disabled={
                      !prescriptionForm.medication ||
                      !prescriptionForm.dose ||
                      !prescriptionForm.instruction
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add to List
                  </Button>
                </div>
              </div>
            )}

            {/* New Prescriptions List */}
            {newPrescriptions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  New Prescriptions ({newPrescriptions.length})
                </h3>
                <div className="space-y-2">
                  {newPrescriptions.map((prescription, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 relative"
                    >
                      <button
                        onClick={() => handleRemoveFromList(index)}
                        className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                        <div>
                          <p className="text-xs text-muted-foreground">Medication</p>
                          <p className="font-medium text-sm">{prescription.medication}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Dose</p>
                          <p className="font-medium text-sm">{prescription.dose}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-xs text-muted-foreground">Instructions</p>
                          <p className="font-medium text-sm">{prescription.instruction}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Prescriptions */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Saved Prescriptions
              </h3>
              {appointment.prescription.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No prescriptions saved yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {appointment.prescription.map(
                    (prescription: Prescription, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl bg-muted/30 border border-border/40"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Medication</p>
                            <p className="font-medium text-sm">{prescription.medication}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Dose</p>
                            <p className="font-medium text-sm">{prescription.dose}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-xs text-muted-foreground">Instructions</p>
                            <p className="font-medium text-sm">{prescription.instruction}</p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Payment */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-[#FF8A80]" />
              <h3 className="font-semibold">Payment</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                {appointment.paymentStatus ? (
                  <span className="status-badge--success">Paid</span>
                ) : (
                  <span className="status-badge--warning">Pending</span>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Reference</p>
                <p className="text-xs font-mono bg-muted/30 rounded-lg px-2 py-1.5 break-all">
                  {appointment.paymentSessionKey}
                </p>
              </div>
            </div>
          </div>

          {/* Pet Owner */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-[#FF8A80]" />
              <h3 className="font-semibold">Pet Owner</h3>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <img
                src={appointment.user.avatar}
                alt={appointment.user.name}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow"
              />
              <div>
                <h4 className="font-medium">{appointment.user.name}</h4>
                <p className="text-sm text-muted-foreground">{appointment.user.email}</p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5">
            <h3 className="font-semibold mb-3">Timeline</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="font-medium">
                  {new Date(appointment.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {new Date(appointment.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialogBox
        open={openCancelAlert}
        onOpenChange={setCancelAlert}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment?"
        onConfirm={() => handleSubmit("cancelled")}
      />
    </div>
  );
}
