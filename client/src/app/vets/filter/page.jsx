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
