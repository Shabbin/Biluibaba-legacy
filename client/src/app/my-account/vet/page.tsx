// [FUTURE] My vet bookings page — uncomment below and remove ComingSoon export to restore
/*
import { Suspense } from "react";
import { PageLoader } from "@/src/components/ui";
import Vet from "./vet";

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Vet />
    </Suspense>
  );
}
*/

import ComingSoon from "@/src/components/coming-soon";
export default function Page() {
  return <ComingSoon title="Vet Bookings — Coming Soon" description="Your vet bookings will appear here soon!" />;
}
