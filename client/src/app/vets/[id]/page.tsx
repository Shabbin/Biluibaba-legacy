// [FUTURE] Vet profile page — uncomment when enabling vet features
/*
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
*/

import ComingSoon from "@/src/components/coming-soon";
export default function Page() {
  return <ComingSoon title="Vet Care — Coming Soon" description="Vet profiles will be available soon!" />;
}
