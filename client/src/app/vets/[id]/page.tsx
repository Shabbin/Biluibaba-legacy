import { Suspense } from "react";
import { PageLoader } from "@/src/components/ui";

import Profile from "./vet";

// Use dynamic rendering for vet profiles since they require API data
export const dynamic = "force-dynamic";

const VetProfile = async ({ params }: { params: Promise<{ id: string }> }) => {
  await params; // Ensure params are resolved for dynamic routing
  return (
    <Suspense fallback={<PageLoader />}>
      <Profile />
    </Suspense>
  );
};

export default VetProfile;
