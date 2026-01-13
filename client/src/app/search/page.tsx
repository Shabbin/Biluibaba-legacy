import { Suspense } from "react";
import Search from "./search";

export default function Page(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="py-10 text-center">Loading search results...</div>
      }
    >
      <Search />
    </Suspense>
  );
}
