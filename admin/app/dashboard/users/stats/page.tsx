import { Suspense } from "react";

import User from "./user";

import { Loader2 } from "lucide-react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <User />
    </Suspense>
  );
}
