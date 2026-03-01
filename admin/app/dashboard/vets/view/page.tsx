import { Suspense } from "react";

import Vet from "./vet";

import { Loader2 } from "lucide-react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <Vet />
    </Suspense>
  );
}
