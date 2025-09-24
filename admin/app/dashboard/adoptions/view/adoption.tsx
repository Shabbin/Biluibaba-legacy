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
  const adoptionId = search.get("id");

  const [loading, setLoading] = useState<boolean>(true);
  const [adoption, setAdoption] = useState<any>(null);

  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const fetchAdoption = async () => {
    try {
      const { data } = await axios.get(`/api/adoptions/get/${adoptionId}`);

      if (data.success) setAdoption(data.adoption);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error fetching adoption",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: boolean) => {
    setStatusLoading(true);
    try {
      const { data } = await axios.post(
        `/api/admin/adoptions/status/${adoption._id}`,
        {
          status,
        }
      );

      if (data.success) {
        toast({
          title: "Adoption status updated successfully",
          description: `Adoption is now ${status ? "approved" : "rejected"}.`,
        });
        fetchAdoption();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error updating adoption status",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAdoption();
  }, []);

  return (
    <div className="py-5">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="">
          <h2 className="text-2xl mb-4">Adoption Details: #{adoptionId}</h2>
          <p>{formatDate(adoption.createdAt)}</p>

          <div className="flex md:flex-row flex-col gap-5">
            <div className="basis-2/3">
              <div className="p-4 border rounded-xl my-2">
                <p className="mb-2">
                  <strong>Pet Name:</strong> {adoption.name}
                </p>
                <p className="mb-2">
                  <strong>Species:</strong> {adoption.species}
                </p>
                <p className="mb-2">
                  <strong>Breed:</strong> {adoption.breed}
                </p>
                <p className="mb-2">
                  <strong>Gender:</strong> {adoption.gender}
                </p>
                <p className="mb-2">
                  <strong>Size:</strong> {adoption.size}
                </p>
                <p className="mb-2">
                  <strong>Age:</strong> {adoption.age}
                </p>
                <p className="mb-2">
                  <strong>Vaccinated:</strong>{" "}
                  {adoption.vaccinated ? "Yes" : "No"}
                </p>
                <p className="mb-2">
                  <strong>Neutered:</strong> {adoption.neutered ? "Yes" : "No"}
                </p>
                <p className="mb-2">
                  <strong>Contact Information:</strong> {adoption.phoneNumber}
                </p>
                <p className="mb-2">
                  <strong>Location:</strong> {adoption.location}
                </p>
                <h2 className="text-xl mb-2 font-semibold">Description</h2>
                <p className="break-all">{adoption.description}</p>
              </div>

              <div className="p-4 border rounded-xl my-2">
                <h2 className="text-xl font-semibold mb-2">Images</h2>
                <div className="flex flex-row flex-wrap">
                  {adoption.images.map((image: any) => (
                    <img
                      key={image.path}
                      src={image.path}
                      alt={adoption.name}
                      className="rounded-lg m-2 w-auto h-auto basis-1/4"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="basis-1/3">
              <div className="px-4 rounded-xl border divide-y-2 my-2">
                <h2 className="flex flex-row items-center gap-2 text-lg mb-2 py-2">
                  <User /> <div>Posted by</div>
                </h2>

                <div className="flex flex-row items-center gap-2 mb-2 py-4">
                  <img
                    src={adoption.userId.avatar}
                    alt={adoption.userId.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="text-xl">{adoption.userId.name}</div>
                </div>

                <p className="mb-2 py-4">
                  <strong>Created at:</strong> {formatDate(adoption.createdAt)}
                </p>
              </div>

              <div className="my-5 flex flex-col gap-2">
                {adoption.status === "approved" ? (
                  <Button
                    className="w-full"
                    onClick={() => updateStatus(false)}
                    disabled={statusLoading}
                  >
                    {loading && <Loader2 className="animate-spin" />}
                    Reject Adoption
                  </Button>
                ) : adoption.status === "rejected" ? (
                  <Button
                    className="w-full"
                    onClick={() => updateStatus(true)}
                    disabled={statusLoading}
                  >
                    {loading && <Loader2 className="animate-spin" />}
                    Approve Adoption
                  </Button>
                ) : (
                  <>
                    <Button
                      className="w-full"
                      onClick={() => updateStatus(true)}
                      variant="outline"
                      disabled={statusLoading}
                    >
                      {loading && <Loader2 className="animate-spin" />}
                      Approve Adoption
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => updateStatus(false)}
                      disabled={statusLoading}
                    >
                      {loading && <Loader2 className="animate-spin" />}
                      Reject Adoption
                    </Button>
                  </>
                )}
                <Button
                  className="w-full"
                  variant="destructive"
                  disabled={deleteLoading}
                >
                  {loading && <Loader2 className="animate-spin" />}
                  Delete Adoption
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
