import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import cookie from "browser-cookies";

import { Button } from '@/components/ui/button';
import { useMutation } from "react-query";
import { userService } from '@/services/userService';
import { useAppDispatch } from '@/redux/store';
import { logoutState } from '@/redux/slices/authSlice';
import { AxiosErrorResponseType, AuthSuccessType } from '@/types/index';
import toast from 'react-hot-toast';



const DeleteAccount = ({ id }: { id: string }) => {

  const dispatch = useAppDispatch();

  // Run Delete Account
  const { mutate } = useMutation<AuthSuccessType, AxiosErrorResponseType>(
    () => userService.deleteProfile(id),
    {
      onSuccess: (data) => {
        cookie.erase("token");
        toast.success(data.message);
        dispatch(logoutState());
      },
      onError: (err) => {
        toast.error(err.message);
      }
    }
  )

  return (
    <AlertDialog>

      <AlertDialogTrigger asChild>
        <Button variant="destructive" className='w-full' type='button'>Delete Account</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className='font-semibold text-lg text-red-500'>
            This will permanently delete your ACCOUNT and all your REGISTERED PROPERTIES.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutate()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>

    </AlertDialog>
  )
}

export default DeleteAccount;