import { Suspense } from 'react';

import Order from './order';

export default function Page(): JSX.Element {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Order />
    </Suspense>
  );
}
