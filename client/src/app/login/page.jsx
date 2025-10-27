import { Suspense } from "react";

import Login from "./login.jsx";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
}
