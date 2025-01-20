"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import authImage from "@/assets/Images/auth-page.jpg";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { MotionDiv, MotionHeading, MotionImage, MotionText } from "@/components/utils/motionWrapper";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { AxiosResponseType } from "@/types/index";
import { authService } from "@/services/authService";
import { axiosErrorHandler } from "@/utils/helperFunctions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setUserState } from "@/redux/slices/authSlice";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";


// Icons
import { EyeOff, Eye, SquareArrowLeft } from "lucide-react";



// Login Schema using Zod for validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, { message: "Email is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Page = ({ className }: { className?: string }) => {

  const dispatch = useAppDispatch();

  const router = useRouter();

  // Display password
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { user } = useAppSelector(state => state.auth);


  // Redirect user to dashboard if user exists
  useEffect(() => {
    if (user) {
      router.back();
    }
  }, [user, router]);



  const { handleSubmit, formState: { errors }, register } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  // Mutation function
  const { mutate, isLoading } = useMutation<AxiosResponseType, AxiosError, LoginFormData>(
    async (data) => {
      try {
        return await authService.signIn(data);
      } catch (err) {
        throw err;
      }
    },
    {
      onSuccess: (data: AxiosResponseType) => {
        toast.success(data?.data?.firstName ? `Welcome  ${data?.data?.firstName}` : "Logged in...");
        dispatch(setUserState(data.data));
        router.push("/");
      },
      onError: (err: AxiosError) => {
        const message = axiosErrorHandler(err);
        toast.error(message);
      },
    }
  );


  // send code
  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    mutate(data);
  };



  return (
    <MotionDiv className="h-full items-center justify-center overflow-y-auto relative">

      <div className={cn("flex flex-col gap-6 w-full max-w-sm md:max-w-3xl", className)}>
        <Card className="overflow-hidden shadow-xl">
          <CardContent className="grid gap-4 p-4 sm:p-6 md:grid-cols-2 md:p-0">
            <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col items-center justify-center text-center">

                  <Link href="/" className="absolute self-start">
                    <SquareArrowLeft className="h-6 w-6" />
                  </Link>

                  <MotionHeading>Welcome Back</MotionHeading>
                  <MotionText>Login to NestFinder</MotionText>
                </div>

                {/* Email Field */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="email@example.com"
                    {...register("email")}
                    className={`border ${errors.email ? "border-red-500" : "border-gray-300"} p-2 rounded-md`}
                  />
                  <p className="text-red-500 text-sm h-3">{errors.email ? errors.email.message : ""}</p>
                </div>

                {/* Password */}
                <div className="grid gap-2 relative">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`border ${errors.password ? "border-red-500" : "border-gray-300"} p-2 rounded-md`}
                  />
                  <p className="text-red-500 text-sm h-3">{errors.password?.message}</p>

                  {/* Visibility icon */}
                  <Button
                    size="sm"
                    variant="link"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0.5 top-6"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>

                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Login"}
                  </Button>
                </motion.div>

                {/* Signup Link */}
                <div>
                  Don&apos;t have an account?{" "}
                  <Button type="button" disabled={isLoading} variant="link" onClick={() => router.push("/sign-up")}>
                    Sign Up
                  </Button>
                </div>
              </div>
            </form>

            {/* Right Side Image */}
            <MotionImage>
              <div className="relative h-full overflow-hidden">
                <Image
                  src={authImage}
                  alt="Image"
                  fill
                  className="object-cover"
                  priority={true}
                />
              </div>
            </MotionImage>

          </CardContent>
        </Card>

        {/* Footer */}
        <motion.div
          className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          By clicking continue, you agree to our Terms of Service and Privacy Policy.
        </motion.div>
      </div>
    </MotionDiv>
  );
};

export default Page;
