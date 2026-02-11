"use client";

import { AppProgressBar } from "next-nprogress-bar";
import type { ReactNode } from "react";

interface ProgressBarProviderProps {
  children: ReactNode;
}

const ProgressBarProvider = ({ children }: ProgressBarProviderProps) => {
  return (
    <>
      {children}
      <AppProgressBar
        height="5px"
        color="#000000"
        options={{ showSpinner: true }}
        shallowRouting
      />
    </>
  );
};

export default ProgressBarProvider;
