"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { authService } from "@/services/authService";
import { AxiosError } from "axios";
import { AxiosSuccessResponseType } from "@/types/index";
import LoadingAnimation from "@/components/utils/LoadingAnimation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { logoutState, setUserState, setDarkMode } from "@/redux/slices/authSlice";
import cookies from "browser-cookies";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./(navbar)/Navbar";


const ClientLayoutHandler = ({ children }: { children: ReactNode }) => {


  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();


  // Global Loading State
  const { user, isLoading: globalLoadingState, darkMode } = useAppSelector(state => state.auth);

  const [isAuthPages, setIsAuthPages] = useState(false);


  // Verify token on every reload
  const { mutate, isLoading } = useMutation<AxiosSuccessResponseType, AxiosError>(
    () => authService.verifyAuthToken(),
    {
      onSuccess: (data: AxiosSuccessResponseType) => {
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



  // Check User Theme
  useEffect(() => {
    const isDarkMode: boolean = localStorage.getItem("isDarkMode") === "true";
    dispatch(setDarkMode(isDarkMode));
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("isDarkMode", darkMode.toString());
  }, [darkMode]);



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
