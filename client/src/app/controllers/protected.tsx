import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withProtectedRoute = <P extends Record<string, unknown>>(ComposedComponent: React.ComponentType<P>) => {
  return (props: P) => {
    const router = useRouter();
    const [auth, setAuth] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) router.push("/signin");
      else setAuth(true);
    }, [router]);

    if (!auth) return null;
    return <ComposedComponent {...props} />;
  };
};

export default withProtectedRoute;
