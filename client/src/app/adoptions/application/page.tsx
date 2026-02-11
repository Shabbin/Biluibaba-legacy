import { Suspense } from "react";

import Application from "./application";

export default function Page() {
  return (
    <Suspense>
      <Application />
    </Suspense>
  );
}
