// [FUTURE] Adoption status page — uncomment below and remove ComingSoon export to restore
/*
import { Suspense } from "react";

import Status from "./status";

export default function Page() {
  return (
    <Suspense>
      <Status />
    </Suspense>
  );
}
*/

import ComingSoon from "@/src/components/coming-soon";
export default function Page() {
  return <ComingSoon title="Pet Adoption — Coming Soon" description="Adoption status tracking will be available soon!" />;
}
