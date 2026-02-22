// [FUTURE] Vet browse page — uncomment when enabling vet features
/*
import { Suspense } from "react";

import Vet from "@/src/app/vets/browse/vet";

export default function Page() {
  return (
    <Suspense>
      <Vet></Vet>
    </Suspense>
  );
}
*/

import ComingSoon from "@/src/components/coming-soon";
export default function Page() {
  return <ComingSoon title="Vet Care — Coming Soon" description="Browse veterinarians will be available soon!" />;
}
