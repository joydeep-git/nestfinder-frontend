"use client";

import React, { ReactNode } from 'react';

const AuthenticatedLayout = ({children}: {children: ReactNode}) => {

  return (
    <div>{children}</div>
  )
}

export default AuthenticatedLayout;