import { Suspense } from "react";

import Pro from "@/src/app/pro/pro";

export default function Page() {
  return (
    <Suspense>
      <Pro />
    </Suspense>
  );
}
