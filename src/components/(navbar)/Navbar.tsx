import SearchModal from '@/components/(navbar)/SearchDrawer';
import DropdownMenu from '@/components/(navbar)/DropdownMenu';
import { NestFinderIcon } from '@/assets/Icons/NestFinderIcon';
import { useAppSelector } from '@/redux/store';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useRouter } from 'next/navigation';
import { motion } from "motion/react";
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';



const Navbar = () => {


  const router = useRouter();

  // States
  const { darkMode, user } = useAppSelector(state => state.auth);

  return (
    <nav className="w-full border-b px-4 md:px-8 py-3 flex items-center justify-between shadow-md fixed top-0 left-0 z-50 bg-primary-foreground">


      {/* Logo / Icon */}
      <div className='cursor-pointer' onClick={() => router.push("/")}>
        <NestFinderIcon
          color={darkMode ? "#ffffff" : "#000000"}
          className='w-[80px] md:w-[120px] h-[20px] md:h-[30px]' />
      </div>


      <motion.div className='flex items-center space-x-4'>


        <SearchModal />


        <ThemeSwitcher />

        {
          user
            ? <DropdownMenu />
            : <Link href="/sign-in" className='inline-flex h-8 px-3 items-center justify-center gap-0 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90'>
              Login <ChevronRight className='h-4 w-4' />
            </Link>
        }
      </motion.div>

    </nav>
  );
};

export default Navbar;
