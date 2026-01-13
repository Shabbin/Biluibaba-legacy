import { Suspense } from "react";

import Filter from "./filter";

export default function Page(): JSX.Element {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Filter />
    </Suspense>
  );
}
