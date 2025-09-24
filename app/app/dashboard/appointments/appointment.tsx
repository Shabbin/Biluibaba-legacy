"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialogBox } from "@/components/alert-dialog";

import axios from "@/lib/axios";

interface Prescription {
  medication: string;
  dose: string;
  instruction: string;
}

import { Loader2 } from "lucide-react";

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-screen">
          <p>No appointment found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="border-b pb-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Appointment Details
            </h1>
            {appointment.status == "confirmed" ? (
              <span className="px-4 py-1 bg-green-100 text-green-900 rounded">
                Confirmed
              </span>
            ) : appointment.status === "pending" ? (
              <span className="px-4 py-1 bg-yellow-100 text-yellow-900 rounded">
                Pending
              </span>
            ) : appointment.status === "completed" ? (
              <span className="px-4 py-1 bg-blue-100 text-blue-900 rounded">
                Completed
              </span>
            ) : appointment.status === "cancelled" ? (
              <span className="px-4 py-1 bg-red-100 text-red-900 rounded">
                Cancelled
              </span>
            ) : (
              <span className="px-4 py-1 bg-gray-100 text-gray-900 rounded">
                {appointment.status}
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-2">ID: {appointment.appointmentId}</p>
        </div>

        {/* Pet Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pet Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Pet Name</p>
              <p className="font-medium">{appointment.petName}</p>
            </div>
            <div>
              <p className="text-gray-600">Species</p>
              <p className="font-medium uppercase">{appointment.species}</p>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-medium">{appointment.date}</p>
            </div>
            <div>
              <p className="text-gray-600">Time</p>
              <p className="font-medium">{appointment.time}</p>
            </div>
            <div>
              <p className="text-gray-600">Type</p>
              <p className="font-medium capitalize">{appointment.type}</p>
            </div>
            {appointment.type === "homeService" && (
              <div>
                <p className="text-gray-600">Home Address</p>
                <p className="font-medium capitalize">
                  {appointment.homeAddress}
                </p>
              </div>
            )}
            <div>
              <p className="text-gray-600">Total Amount</p>
              <p className="font-medium">
                {appointment.totalAmount.toLocaleString()} BDT
              </p>
            </div>
          </div>
        </div>

        {/* Concerns */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Health Concerns</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Issues</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {appointment.petConcern.map(
                  (concern: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {concern}
                    </span>
                  )
                )}
              </div>
            </div>
            <div>
              <p className="text-gray-600">Detailed Concern</p>
              <p className="mt-2">{appointment.detailedConcern}</p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Payment Status</p>
              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                  appointment.paymentStatus
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {appointment.paymentStatus ? "Paid" : "Pending"}
              </span>
            </div>
            <div>
              <p className="text-gray-600">Payment Reference</p>
              <p className="font-medium">{appointment.paymentSessionKey}</p>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pet Owner Information</h2>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <img
                src={appointment.user.avatar}
                alt={appointment.user.name}
                className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
            <div>
              <h3 className="font-medium text-lg">{appointment.user.name}</h3>
              <p className="text-gray-600">{appointment.user.email}</p>
            </div>
          </div>
        </div>

        {/* Prescription Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Prescriptions</h2>
            {appointment.status === "confirmed" && (
              <Button
                onClick={() => setIsAddingPrescription(!isAddingPrescription)}
                variant="outline"
              >
                {isAddingPrescription ? "Cancel" : "Add Prescription"}
              </Button>
            )}
          </div>

          {/* Add Prescription Form */}
          {isAddingPrescription && appointment.status === "confirmed" && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    placeholder="Enter instructions"
                    className="mt-1"
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
                  Add to List
                </Button>
              </div>
            </div>
          )}

          {/* New Prescriptions List */}
          {newPrescriptions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">New Prescriptions</h3>
              <div className="space-y-3">
                {newPrescriptions.map((prescription, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-white shadow-sm relative"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">Medication</p>
                        <p className="font-medium">{prescription.medication}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Dose</p>
                        <p className="font-medium">{prescription.dose}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-600">Instructions</p>
                        <p className="font-medium">
                          {prescription.instruction}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFromList(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Existing Prescriptions List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-3">Saved Prescriptions</h3>
            {appointment.prescription.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No prescriptions saved yet
              </p>
            ) : (
              appointment.prescription.map(
                (prescription: Prescription, index: number) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-white shadow-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">Medication</p>
                        <p className="font-medium">{prescription.medication}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Dose</p>
                        <p className="font-medium">{prescription.dose}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-600">Instructions</p>
                        <p className="font-medium">
                          {prescription.instruction}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Created At</p>
              <p className="font-medium">
                {new Date(appointment.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Last Updated</p>
              <p className="font-medium">
                {new Date(appointment.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
      {appointment.status === "confirmed" && (
        <div className="flex md:flex-row flex-col justify-end py-5 gap-5">
          <Button
            variant="destructive"
            size="lg"
            onClick={() => setCancelAlert(true)}
          >
            {loading && <Loader2 className="mr-2" />}
            Cancel Appointment
          </Button>
          <Button
            size="lg"
            onClick={() => handleSubmit("completed")}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2" />}
            Complete Appointment
          </Button>
        </div>
      )}

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
