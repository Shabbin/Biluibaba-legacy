import { Suspense } from "react";
import Vet from "./vet";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Vet />
    </Suspense>
  );
}
