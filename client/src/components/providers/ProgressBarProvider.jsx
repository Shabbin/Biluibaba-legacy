"use client";

import { AppProgressBar } from "next-nprogress-bar";

const ProgressBarProvider = ({ children }) => {
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
