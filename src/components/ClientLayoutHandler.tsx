"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { authService } from "@/services/authService";
import { AxiosError } from "axios";
import { AxiosResponseType } from "@/types/index";
import LoadingAnimation from "@/components/utils/LoadingAnimation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { logoutState, setUserState } from "@/redux/slices/authSlice";
import cookies from "browser-cookies";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./Navbar";


const ClientLayoutHandler = ({ children }: { children: ReactNode }) => {


  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();


  // Global Loading State
  const { user, isLoading: globalLoadingState } = useAppSelector(state => state.auth);

  const [isAuthPages, setIsAuthPages] = useState(false);


  // Verify token on every reload
  const { mutate, isLoading } = useMutation<AxiosResponseType, AxiosError>(
    () => authService.verifyAuthToken(),
    {
      onSuccess: (data: AxiosResponseType) => {
        if (data.success) {
          dispatch(setUserState(data.data));
        } else {
          dispatch(logoutState());
        }
      },
      onError: () => {
        dispatch(logoutState());
        cookies.erase("token", { path: "/" });
      },
    }
  );


  // run verification token
  useEffect(() => {
    mutate();
  }, [mutate]);



  // check current routes
  useEffect(() => {
    if (user && (pathname === "/sign-in" || pathname === "/sign-up")) {
      router.push("/profile");
    }

    setIsAuthPages(pathname === "/sign-in" || pathname === "/sign-up");

  }, [pathname, router, user]);



  // Checking Loading states
  if (isLoading || globalLoadingState) {
    return <LoadingAnimation />;
  }

  return (
    <main className="flex flex-col h-screen">
      
      {!isAuthPages && <Navbar />}
      
      <div className={`flex-1 ${!isAuthPages && "pt-14"}`}>
        {children}
      </div>
    </main>
  );
};

export default ClientLayoutHandler;
