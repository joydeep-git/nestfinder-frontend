import SearchModal from '@/components/SearchDrawer';
import DropdownMenu from '@/components/DropdownMenu';
import { NestFinderIcon } from '@/assets/Icons/NestFinderIcon';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/redux/store';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useRouter } from 'next/navigation';
import { motion } from "motion/react";
import { ChevronRight } from 'lucide-react';



const Navbar = () => {


  const router = useRouter();

  // States
  const { darkMode, user } = useAppSelector(state => state.auth);

  return (
    <>
      <nav className="w-full border-b px-4 md:px-8 py-3 flex items-center justify-between shadow-md">


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
              : <Button size={"sm"} onClick={() => router.push("/signin")}>
                Login <ChevronRight />
              </Button>
          }
        </motion.div>

      </nav>
    </>
  );
};

export default Navbar;
