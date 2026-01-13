import { Suspense } from "react";

import Status from "./status";

export default function Page(): JSX.Element {
  return (
    <Suspense>
      <Status />
    </Suspense>
  );
}
