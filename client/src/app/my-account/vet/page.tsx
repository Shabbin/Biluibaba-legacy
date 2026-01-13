import React, { Suspense } from "react";
import Vet from "./vet";

const Page: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Vet />
    </Suspense>
  );
};

export default Page;
