import { Suspense } from "react";

import Order from "./order";

export default function Page() {
  return (
    <Suspense>
      <Order />
    </Suspense>
  );
}
