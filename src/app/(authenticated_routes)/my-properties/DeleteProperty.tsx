import { useMutation } from 'react-query';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { productService } from '@/services/productService';
import { AxiosErrorResponseType, ProductSuccessType } from '@/types/index';
import { Trash } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';

const DeleteProperty = ({ userId, productId, refetch }: { userId: string; productId: string; refetch: () => void;  }) => {
  

  // delete function
  const { mutate, isLoading } = useMutation<ProductSuccessType, AxiosErrorResponseType>(
    async () => await productService.deleteProduct({ userId, productId }),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        console.log(data);
        refetch();
      },
      onError: (err) => {
        toast.error(err.message);
      }
    }
  );



  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size={'icon'} variant={'destructive'}><Trash /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} >Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutate()} disabled={isLoading} >Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteProperty;