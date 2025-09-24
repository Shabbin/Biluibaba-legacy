"use client";

import { useAuth } from "@/context/AuthProvider";

export default function () {
  let user = useAuth();

  return <h1 className="text-4xl my-5">Welcome back, {user.name}</h1>;
}
