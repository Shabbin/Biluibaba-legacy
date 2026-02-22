// [FUTURE] Adoption application page — uncomment below and remove ComingSoon export to restore
/*
import { Suspense } from "react";

import Application from "./application";

export default function Page() {
  return (
    <Suspense>
      <Application />
    </Suspense>
  );
}
*/

import ComingSoon from "@/src/components/coming-soon";
export default function Page() {
  return <ComingSoon title="Pet Adoption — Coming Soon" description="Adoption applications will be available soon!" />;
}
