import { Suspense } from "react";

import Status from "./status";

export default function Page() {
  return (
    <Suspense>
      <Status />
    </Suspense>
  );
}
