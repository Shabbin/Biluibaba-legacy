// [FUTURE] Vet filter page — uncomment when enabling vet features
/*
import { Suspense } from "react";
import { PageLoader } from "@/src/components/ui";

import Filter from "./filter";

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Filter />
    </Suspense>
  );
}
*/

import ComingSoon from "@/src/components/coming-soon";
export default function Page() {
  return <ComingSoon title="Vet Care — Coming Soon" description="This feature will be available soon!" />;
}
