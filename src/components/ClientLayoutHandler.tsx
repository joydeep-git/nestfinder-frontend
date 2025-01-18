"use client";

import React, { ReactNode, useEffect } from "react";
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
    if (user && (pathname === "/signin" || pathname === "/signup")) {
      router.push("/profile");
    }

    if (!user && (pathname === "/profile")) {
      router.back();
    }
  }, [pathname, router, user]);



  // Checking Loading states
  if (isLoading || globalLoadingState) {
    return <LoadingAnimation />;
  }

  return (
    <>
      {!(pathname === "/signin" || pathname === "/signup" ) && <Navbar /> }
      {children}
    </>
  );
};

export default ClientLayoutHandler;
