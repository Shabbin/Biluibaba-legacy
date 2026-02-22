// [FUTURE] Vet payment status page — uncomment when enabling vet features
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
  return <ComingSoon title="Vet Care — Coming Soon" description="This feature will be available soon!" />;
}
