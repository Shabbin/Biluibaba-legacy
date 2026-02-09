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
