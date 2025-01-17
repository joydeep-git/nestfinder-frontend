import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils.ts';
import { MotionWrapperProps } from '@/types/index.ts';



export const MotionDiv = ({
  className,
  children,
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  transition = { duration: 0.5 },
}: MotionWrapperProps): ReactNode => {
  return (
    <motion.div
      layout
      initial={initial}
      animate={animate}
      transition={transition}
      className={cn(
        "flex flex-col space-y-6 mx-auto px-2.5 md:px-20 gap-6 items-center justify-center max-w-screen-xl min-h-screen overflow-y-auto overflow-x-hidden",
        className
      )}
    >
      {children}
    </motion.div>
  );
};




export const MotionHeading = ({
  children,
  className,
  initial = { opacity: 0, scale: 0.9 },
  animate = { opacity: 1, scale: 1 },
  transition = { delay: 0.2 },
}: MotionWrapperProps): ReactNode => {
  return (
    <motion.h1
      initial={initial}
      animate={animate}
      transition={transition}
      className={cn("font-bold text-xl md:text-2xl text-center ", className)}
    >
      {children}
    </motion.h1>
  )
};




export const MotionText = ({
  className,
  children,
  initial = { opacity: 0, scale: 0.9 },
  animate = { opacity: 1, scale: 1 },
  transition = { delay: 0.2 },
}: MotionWrapperProps): ReactNode => {
  return (
    <motion.p
      initial={initial}
      animate={animate}
      transition={transition}
      className={cn("text-base font-normal text-muted-foreground", className)}
    >
      {children}
    </motion.p>
  )
};


export const MotionImage = ({
  className,
  children,
  initial = { opacity: 0, y: 50 },
  animate = { opacity: 1, x: 0, y: 0 },
  transition = { delay: 0.5 }
}: MotionWrapperProps): ReactNode => {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      className={cn("relative hidden bg-muted md:block", className)}
    >
      {children}
    </motion.div>
  )
};
