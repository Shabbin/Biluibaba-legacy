import React, { Suspense } from "react";
import Order from "./order";

const OrdersPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Order />
    </Suspense>
  );
};

export default OrdersPage;
