"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setDarkMode } from "@/redux/slices/authSlice";


const ThemeSwitcher = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.auth.darkMode);

  // Toggle Dark Mode
  const handleToggle = () => {
    dispatch(setDarkMode(!darkMode));
  };


  // change theme
    React.useEffect(() => {
      if (darkMode) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    }, [darkMode]);

  
  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 hover:border-orange-500 border-transparent transition-colors focus-visible:outline-none cursor-pointer",
        darkMode ? "bg-white" : "bg-input",
        className
      )}
      checked={darkMode}
      onCheckedChange={handleToggle}
      ref={ref}
      {...props}
    >
      <SwitchPrimitives.Thumb
        asChild
        className="pointer-events-none cursor-pointer block h-3 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform"
      >
        <motion.div
          initial={false}
          animate={{ x: darkMode ? 20 : 0 }}
          className="flex items-center justify-center h-full w-4"
        >
          {darkMode ? (
            <Moon className="h-3 w-3 text-primary cursor-pointer" />
          ) : (
            <Sun className="h-3 w-3 text-primary" />
          )}
        </motion.div>
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
});

ThemeSwitcher.displayName = SwitchPrimitives.Root.displayName;

export { ThemeSwitcher };
