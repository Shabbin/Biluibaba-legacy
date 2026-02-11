import { Suspense } from "react";

import Contact from "@/src/app/contact/contact";

export default function Page() {
  return (
    <Suspense>
      <Contact />
    </Suspense>
  );
}
