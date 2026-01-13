'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { ReactNode } from 'react';

interface ProgressBarProviderProps {
  children: ReactNode;
}

const ProgressBarProvider = ({ children }: ProgressBarProviderProps): JSX.Element => {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#000"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default ProgressBarProvider;
