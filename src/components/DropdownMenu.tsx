import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import Image from 'next/image';
import { BrickWall, Loader, LogOut, User } from 'lucide-react';
import { useMutation } from 'react-query';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';
import { AxiosResponseType } from '../types';
import { logoutState } from '@/redux/slices/authSlice';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';


const UserDropdownMenu = () => {

  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector(state => state.auth);


  // Handler Logout
  const { mutate: logout, isLoading } = useMutation<AxiosResponseType, AxiosError, void>(
    async () => {
      return await authService.signOut();
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          dispatch(logoutState());
          toast.success(data.message || 'Logged out successfully.');
        }
      },
      onError: (err: AxiosError) => {
        console.log(err); 
        toast.error(err?.message);
      },
    }
  );



  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='cursor-pointer flex items-center justify-center'>
        <Image src={user?.avatar ?? ""} alt={user?.firstName ?? "Image"} width={30} height={30} className='rounded-full' />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 cursor-pointer">

        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User /> Profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/myProperties")}>
          <BrickWall /> My Properties
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => logout()}>
          {isLoading ? <Loader className='animate-spin' /> : <LogOut /> } Logout
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdownMenu;
