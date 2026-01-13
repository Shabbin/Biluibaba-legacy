import { Suspense } from "react";

import Application from "./application";

export default function Page(): JSX.Element {
  return (
    <Suspense>
      <Application />
    </Suspense>
  );
}
