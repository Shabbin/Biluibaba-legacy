import { Suspense } from "react";
import { PageLoader } from "@/src/components/ui";
import Order from "./order";

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Order />
    </Suspense>
  );
}
