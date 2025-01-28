"use client";

import React, { ReactNode, useEffect } from "react";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/components/utils/LoadingAnimation";

const AuthenticatedLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  // states
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    }
  }, [user, router]);

  
  if (!user) {
    return <LoadingAnimation />;
  }

  return <>{children}</>;
};

export default AuthenticatedLayout;
