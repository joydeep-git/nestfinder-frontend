"use client";

import React, { ReactNode } from 'react';
import { useAppSelector } from '@/redux/store';
import { useRouter } from 'next/navigation';


const AuthenticatedLayout = ({ children }: { children: ReactNode }) => {

  const router = useRouter();

  // States
  const { user } = useAppSelector(state => state.auth);

  if (user) {
    return <>{children}</>
  } else {
    router.push("/sign-in")
  }
}

export default AuthenticatedLayout;