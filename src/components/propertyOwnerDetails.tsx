"use client";

import { useQuery } from "react-query";
import { AuthSuccessType, AxiosErrorResponseType } from "../types";
import toast from "react-hot-toast";
import { userService } from "@/services/userService";
import { useEffect } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import Link from "next/link";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";


const PropertyOwnerDetails = ({ id }: { id: string }) => {


  // selected close  btn
  const closeBtn = document.getElementById('closeBtn');


  // checks for user ID
  useEffect(() => {
    if (!id) toast.error("No User ID! Please refresh the page.");
  }, [id]);


  // data fetch
  const { data, refetch } = useQuery<AuthSuccessType, AxiosErrorResponseType>(
    ['propertyOwnerDetails', id],
    async () => await userService.getUserDetails(id),
    {
      enabled: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: false,
      onError: (err) => {
        toast.error("Wrong User ID");
        toast.error(err.message);
        closeBtn?.click();
      }
    }
  );


  // run on btn click
  const handleFetch = () => {
    refetch();
  }


  return (
    <AlertDialog>

      <AlertDialogTrigger asChild>
        <Button className="w-fit" onClick={() => handleFetch()}>Contact Owner</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>

          <AlertDialogTitle className="mb-4">Contact Details</AlertDialogTitle>

          {/* DONT REMOVE  IT, SHOWING ERROR FOR NOT USING THIS */}
          <AlertDialogDescription></AlertDialogDescription>


          <div className="flex items-center gap-3">
            <span>Name: </span>
            <h2>{data?.data.firstName + " " + data?.data.lastName}</h2>
          </div>

          <div className="flex items-center gap-3">
            <span>Name:</span>
            <Link className="underline" target="_blank" href={`mailto:${data?.data.email}`}>{data?.data.email}</Link>
          </div>

          <div className="flex items-center gap-3">
            <span>Name:</span>
            <Link className="underline" target="_blank" href={`tel:+91${data?.data.number}`}>+91 {data?.data.number}</Link>
          </div>


        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel id="closeBtn">Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>

    </AlertDialog>
  );
}

export default PropertyOwnerDetails;