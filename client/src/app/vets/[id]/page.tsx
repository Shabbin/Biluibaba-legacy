import { Suspense } from "react";
import { PageLoader } from "@/src/components/ui";

import Profile from "./vet";

// Use dynamic rendering for vet profiles since they require API data
export const dynamic = "force-dynamic";

const VetProfile = ({ params }: { params: { id: string } }) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Profile params={params} />
    </Suspense>
  );
};

export default VetProfile;
