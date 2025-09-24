// import React, { useEff }
import { useRouter } from "next/navigation";

const withRouter = (ComposedComponent) => {
  return (props) => {
    const router = useRouter();

    return <ComposedComponent {...props} router={router} />;
  };
};

export default withRouter;
