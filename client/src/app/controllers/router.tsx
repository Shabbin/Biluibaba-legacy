import { useRouter } from "next/navigation";
import { ComponentType } from "react";

function withRouter<P extends object>(
  ComposedComponent: ComponentType<P & { router: ReturnType<typeof useRouter> }>
): ComponentType<P> {
  return function WithRouterComponent(props: P) {
    const router = useRouter();

    return <ComposedComponent {...props} router={router} />;
  };
}

export default withRouter;
