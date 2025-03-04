import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import Image from 'next/image';
import { BrickWall, Info, Loader, LogOut, PlusCircle, TableOfContents, User } from 'lucide-react';
import { useMutation } from "react-query";
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';
import { AuthSuccessType, AxiosErrorResponseType, DropdownOptionType } from '@/types/index';
import { logoutState } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import { Separator } from '../ui/separator';


const UserDropdownMenu = () => {

  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector(state => state.auth);


  // Handler Logout
  const { mutate: logout, isLoading } = useMutation<AuthSuccessType, AxiosErrorResponseType, void>(
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
      onError: (err: AxiosErrorResponseType) => {
        toast.error(err?.message);
      },
    }
  );



  // Dynamically generated dropdown options
  const dropdownOptions: DropdownOptionType[] = [
    {
      icon: <User />,
      title: 'Profile',
      url: '/profile',
    },
    {
      icon: <PlusCircle />,
      title: 'Register new Property',
      url: '/register-property',
    },
    {
      icon: <BrickWall />,
      title: 'My Properties',
      url: '/my-properties',
    },
    {
      icon: <Info />,
      title: 'About Us',
      url: '/about',
    },
    {
      icon: <TableOfContents />,
      title: 'FAQs',
      url: '/faqs',
    },
  ];



  return (
    <>
      {
        user &&
        <DropdownMenu>
          <DropdownMenuTrigger asChild className='cursor-pointer flex items-center justify-center overflow-hidden'>
            <Image src={user.avatar} alt={user?.firstName ?? "Image"} width={35} height={35} className='rounded-full overflow-hidden h-[35px] w-[35px] object-cover' priority />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 cursor-pointer gap-8" >

            {
              dropdownOptions.map((option) => {
                return (
                  <React.Fragment key={option.title}>
                    <DropdownMenuItem className='py-3 pl-3 gap-3' onClick={() => router.push(option.url)}>
                      {option.icon} {option.title}
                    </DropdownMenuItem>
                    <Separator />
                  </ React.Fragment>
                )
              })
            }

            <DropdownMenuItem onClick={() => logout()} className='py-3 pl-3 gap-3'>
              {isLoading ? <Loader className='animate-spin' /> : <LogOut />} Logout
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      }
    </>
  )

};

export default UserDropdownMenu;
