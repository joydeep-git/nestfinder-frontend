"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { AxiosError } from "axios";

// Redux and Services
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { userService } from "@/services/userService";
import { firebaseService } from "@/services/firebaseService";
import { setUserState } from "@/redux/slices/authSlice";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import DeleteAccount from "@/app/(authenticated_routes)/profile/DeleteAccount";
import { MotionHeading } from "@/components/utils/motionWrapper";
import { AuthSuccessType } from "@/types/index";

// Zod Schema
const profileSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  number: z.string().length(10, "Enter valid Phone Number"),
  username: z.string().min(3, "Username should be at least 3 characters"),
});

// Infer the type
type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage = () => {

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...user,
    },
  });

  // Profile update mutation
  const { mutate: profileMutate, isLoading: profileLoading } = useMutation(
    (data: ProfileFormData) =>
      userService.updateDetails({ id: user?._id ?? "", user: data }),
    {
      onSuccess: (data) => {
        toast.success("Profile updated successfully!");
        dispatch(setUserState(data?.data));
        setIsEditing(false);
      },
      onError: (err: AxiosError) => {
        const message = err?.message;
        toast.error(message);
      },
    }
  );




  // Image upload mutation
  const { mutate: imageMutate, isLoading: isImageLoading } = useMutation(
    async (file: File) => {
      const imageUrl = await firebaseService.getDownloadUrl({ file, folder: "profile" });
      const userData: AuthSuccessType = await userService.updateProfilePicture({ avatar: imageUrl, id: user!._id });
      dispatch(setUserState(userData.data));
    },
    {
      onSuccess: (data) => {
        toast.success("Profile picture updated!");
        console.log(data);
        // dispatch(setUserState(data));
      },
      onError: () => {
        toast.error("Failed to change Image");
      },
    }
  );




  // Handle Image change
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) imageMutate(e.target.files[0]);
  };




  // Form submission handler
  const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
    profileMutate(data);
  };




  return (
    <>
      {
        user &&
        <div className="flex flex-col items-center justify-center h-full">
          <Card className="max-w-lg w-full p-6">
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <MotionHeading>{isEditing ? "Edit Profile" : "Your Profile"}</MotionHeading>

                <div className="relative w-full h-60 mx-auto rounded-md overflow-hidden flex flex-col items-center justify-center">
                  {isImageLoading ? (
                    <Loader className="animate-spin" width={24} height={24} />
                  ) : (
                    <Image
                      src={user.avatar}
                      alt={user?.firstName}
                      height={500}
                      width={500}
                      priority={true}
                      className="cursor-pointer h-auto w-full self-center object-cover rounded-md"
                      onClick={() => document.getElementById("avatarInput")?.click()}
                    />
                  )}

                </div>

                <div className="flex justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    id="avatarInput"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={() => document.getElementById("avatarInput")?.click()}
                  >
                    Change Image
                  </Button>
                </div>



                <div className="flex w-full gap-4 justify-between">
                  <div className="w-full">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      disabled={!isEditing}
                      className={`border ${errors.firstName && "border-red-500"}`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="w-full">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      disabled={!isEditing}
                      className={`border ${errors.lastName && "border-red-500"}`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="number">Phone Number</Label>
                  <Input
                    id="number"
                    {...register("number")}
                    disabled={!isEditing}
                    className={`border ${errors.number && "border-red-500"}`}
                  />
                  {errors.number && (
                    <p className="text-red-500">{errors.number.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email}
                    readOnly
                    disabled
                    className={` ${isEditing && "cursor-not-allowed"}`}
                    title="Email can not be changed!"
                  />
                </div>

                {isEditing ? (
                  <>
                    <Button className="w-full" type="submit" disabled={profileLoading}>
                      {profileLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      className="w-full"
                      type="button"
                      variant={"outline"}
                      onClick={() => setIsEditing(false)}
                      disabled={profileLoading}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      className="w-full"
                      disabled={profileLoading}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEditing(true);
                      }}
                    >
                      Edit Profile
                    </Button>
                    <DeleteAccount id={user?._id || ""} />
                  </>
                )}

              </form>
            </CardContent>
          </Card>
        </div>
      }
    </>
  );
};

export default ProfilePage;
