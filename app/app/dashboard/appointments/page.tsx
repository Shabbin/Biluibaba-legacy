import { Suspense } from "react";

import Appointment from "./appointment";

import { Loader2 } from "lucide-react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin h-8 w-8 text-[#FF8A80]" />
        </div>
      }
    >
      <Appointment />
    </Suspense>
  );
}
