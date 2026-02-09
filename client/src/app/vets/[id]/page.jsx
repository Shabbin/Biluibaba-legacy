import { Suspense } from "react";
import { PageLoader } from "@/src/components/ui";

import axios from "@/src/lib/axiosInstance";

import Profile from "./vet";

export async function generateStaticParams() {
  try {
    const { data } = await axios.get("/api/vet/get-all-id");

    if (!data.success) return [];
    else
      return data.vets.map((vet) => ({
        id: vet._id.toString(),
      }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

const VetProfile = ({ params }) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Profile params={params} />
    </Suspense>
  );
};

export default VetProfile;
