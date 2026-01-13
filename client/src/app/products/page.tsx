import { Suspense } from 'react';

import Product from '@/src/app/products/product';

export default function Page(): JSX.Element {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Product />
    </Suspense>
  );
}
