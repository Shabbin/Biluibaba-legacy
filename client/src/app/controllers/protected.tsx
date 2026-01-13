"use client";

import { useEffect, useState, ComponentType } from "react";
import { useRouter } from "next/navigation";

function withProtectedRoute<P extends object>(
  ComposedComponent: ComponentType<P>
): ComponentType<P> {
  return function ProtectedRouteComponent(props: P) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      const token = localStorage.getItem("token");

      console.log(token);

      if (!token) {
        router.push("/signin");
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    }, [router]);

    if (isLoading) return null;
    if (!isAuthenticated) return null;
    
    return <ComposedComponent {...props} />;
  };
}

export default withProtectedRoute;
