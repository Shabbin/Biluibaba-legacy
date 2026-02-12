import React from "react";
import { useRouter } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface WithRouterProps {
  router: AppRouterInstance;
}

const withRouter = <P extends WithRouterProps>(ComposedComponent: React.ComponentType<P>) => {
  return (props: Omit<P, keyof WithRouterProps>) => {
    const router = useRouter();

    return <ComposedComponent {...(props as P)} router={router} />;
  };
};

export default withRouter;
