import { Suspense } from 'react';

import Vet from '@/src/app/vets/browse/vet';

export default function Page(): JSX.Element {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Vet />
    </Suspense>
  );
}
