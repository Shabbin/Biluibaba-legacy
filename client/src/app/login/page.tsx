import { Suspense } from 'react';

import Login from './login';

export default function Page(): JSX.Element {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
}
