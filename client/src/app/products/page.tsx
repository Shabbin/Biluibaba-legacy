import { Suspense } from "react";

import Product from "@/src/app/products/product";

export default function Page() {
  return (
    <Suspense>
      <Product />
    </Suspense>
  );
}
