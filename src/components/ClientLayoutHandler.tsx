"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { authService } from "@/services/authService";
import { AuthSuccessType, AxiosErrorResponseType } from "@/types/index";
import LoadingAnimation from "@/components/utils/LoadingAnimation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { logoutState, setUserState, setDarkMode } from "@/redux/slices/authSlice";
import cookies from "browser-cookies";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./(navbar)/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const ClientLayoutHandler = ({ children }: { children: ReactNode }) => {


  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();


  // Global Loading State
  const { user, isLoading: globalLoadingState, darkMode } = useAppSelector(state => state.auth);

  // used for checking current page category
  const [isAuthPages, setIsAuthPages] = useState(false);


  // Verify token on every reload
  const { refetch, isLoading } = useQuery<AuthSuccessType, AxiosErrorResponseType>(
    ["verifyToken"],
    () => authService.verifyAuthToken(),
    {
      enabled: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: false,
      onSuccess: (data: AuthSuccessType) => {
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

  // call function on page load
  useEffect(() => { refetch() }, [refetch]);



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
    return (
      <div className={`relative h-screen w-screen ${darkMode ? "bg-[#121212]" : "bg-white"}`}>
        <LoadingAnimation />
      </div>
    )
  }


  const client: QueryClient = new QueryClient();


  return (
    <QueryClientProvider client={client}>
    <main className="flex flex-col h-screen">

      {!isAuthPages && <Navbar />}

      <div className={`flex-1 ${!isAuthPages && "pt-14"}`}>
        {children}
      </div>
      </main>
    </QueryClientProvider>
  );
};

export default ClientLayoutHandler;
