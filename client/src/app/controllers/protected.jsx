import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withProtectedRoute = (ComposedComponent) => {
  return (props) => {
    const router = useRouter();
    let auth = false;

    useEffect(() => {
      const token = localStorage.getItem("token");

      console.log(token);

      if (!token) router.push("/signin");
      else auth = true;
    }, []);

    if (!auth) return null;
    return <ComposedComponent {...props} />;
  };
};

export default withProtectedRoute;
