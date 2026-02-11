import { Suspense } from "react";
import { PageLoader } from "@/src/components/ui";

import Login from "./login";

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Login />
    </Suspense>
  );
}
