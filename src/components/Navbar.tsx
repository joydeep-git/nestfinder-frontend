import { ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import SearchModal from '@/components/SearchModal';
import DropdownMenu from '@/components/DropdownMenu';
import { Dialog } from '@/components/ui/dialog';
import { NestFinderIcon } from '@/assets/Icons/NestFinderIcon';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/redux/store';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useRouter } from 'next/navigation';
import { motion } from "motion/react";



const Navbar = () => {


  const router = useRouter();

  // States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { darkMode, user } = useAppSelector(state => state.auth);

  return (
    <>
      <nav className="w-full border-b px-4 md:px-8 py-3 flex items-center justify-between shadow-md">


        {/* Logo / Icon */}
        <div className='cursor-pointer'>
          <NestFinderIcon
            color={darkMode ? "#ffffff" : "#000000"}
            className='w-[80px] md:w-[120px] h-[20px] md:h-[30px]' />
        </div>


        <motion.div className='flex items-center space-x-4'>


          <Search className='h-8 w-8' />

          {/* <Button variant="ghost" size="icon">
            {darkMode ? <Sun /> : <Moon />}
          </Button> */}

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



      {isSearchOpen &&
        <Dialog>
          <SearchModal onClose={() => setIsSearchOpen(false)} />
        </Dialog>}
    </>
  );
};

export default Navbar;
