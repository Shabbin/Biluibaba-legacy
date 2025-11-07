import { Suspense } from "react";
import Order from "./order";

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Order />
    </Suspense>
  );
}
