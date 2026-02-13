import { Suspense } from "react";

import Vet from "@/src/app/vets/browse/vet";

export default function Page() {
  return (
    <Suspense>
      <Vet></Vet>
    </Suspense>
  );
}
