"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { MotionDiv, MotionHeading, MotionImage } from "@/components/utils/motionWrapper";
import { authService } from "@/services/authService";
import { AxiosResponseType } from "@/types/index";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import authImage from "@/assets/Images/auth-page.jpg";
import { AxiosError } from "axios";
import { axiosErrorHandler } from "@/utils/helperFunctions";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch } from "@/redux/store";
import { setUserState } from "@/redux/slices/authSlice";

// Zod Schema Form Validation
const signupSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  number: z.string().length(10, "Enter valid Phone Number"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

const Page = () => {


  const router = useRouter();
  const dispatch = useAppDispatch();


  // Formstates
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });



  // Mutation function
  const { mutate, isLoading } = useMutation<AxiosResponseType, AxiosError, SignupFormData>(
    (data) => authService.signUp(data),
    {
      onSuccess: (data) => {
        toast.success(`Account created Successfully!`);
        dispatch(setUserState(data.data));

        router.push("/");
      },
      onError: (err: AxiosError) => {
        const message = axiosErrorHandler(err);
        toast.error(message);
      },
    }
  );



  // Form Handler
  const onSubmit: SubmitHandler<SignupFormData> = (data: SignupFormData) => {
    mutate(data);
  };



  // Password Toggle State
  const [showPassword, setShowPassword] = useState(false);



  return (
    <MotionDiv className="flex flex-col gap-0 items-center justify-center min-h-screen overflow-hidden my-4 md:my-auto">
      <Card className="overflow-hidden shadow-lg rounded-lg max-w-full md:max-w-4xl w-full">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-8 overflow-hidden">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-2 w-full p-6 rounded-md"
          >
            <MotionHeading className="text-center mb-4 whitespace-nowrap w-full md:mb-8">
              Welcome to NestFinder
            </MotionHeading>

            <div className="flex gap-3">
              <div className="gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  {...register("firstName")}
                  className={`border ${errors.firstName ? "border-red-500" : "border-gray-300"} p-2 rounded-md focus:outline-none`}
                />
                <p className="text-red-500 text-xs md:text-sm h-2 md:h-3 w-full text-right">{errors.firstName?.message}</p>
              </div>

              <div className="gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  {...register("lastName")}
                  className={`border ${errors.lastName ? "border-red-500" : "border-gray-300"} p-2 rounded-md focus:outline-none`}
                />
                <p className="text-red-500 text-xs md:text-sm h-2 md:h-3 w-full text-right">{errors.lastName?.message}</p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="number"
                placeholder="987654210"
                {...register("number")}
                className={`border ${errors.number ? "border-red-500" : "border-gray-300"} p-2 rounded-md focus:outline-none`}
              />
              <p className="text-red-500 text-xs md:text-sm h-2 md:h-3 w-full text-right">{errors.number?.message}</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="email@example.com"
                {...register("email")}
                className={`border ${errors.email ? "border-red-500" : "border-gray-300"} p-2 rounded-md focus:outline-none`}
              />
              <p className="text-red-500 text-xs md:text-sm h-2 md:h-3 w-full text-right">{errors.email?.message}</p>
            </div>

            <div className="relative grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`border ${errors.password ? "border-red-500" : "border-gray-300"} p-2 rounded-md focus:outline-none`}
              />
              <p className="text-red-500 text-xs md:text-sm h-2 md:h-3 w-full text-right">{errors.password?.message}</p>
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

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                className="p-2 rounded-md focus:outline-none w-full mt-1"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Sign Up"}
              </Button>
            </motion.div>

            <div className="text-center text-sm">
              Already have an account? {" "}
              <Button
                type="button"
                disabled={isLoading}
                variant="link"
                onClick={() => router.push("/signin")}
              >
                Sign In
              </Button>
            </div>
          </form>

          <MotionImage className="relative hidden md:block">
            <Image
              src={authImage}
              alt="Auth Image"
              className="w-full h-full object-cover rounded-md"
            />
          </MotionImage>
        </CardContent>
      </Card>

      <div className="text-center text-xs md:text-sm text-muted-foreground">
        By clicking continue, you agree to our Terms of Service and Privacy Policy.
      </div>
    </MotionDiv>
  );
};

export default Page;
