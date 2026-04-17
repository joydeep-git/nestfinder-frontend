"use client";

import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MotionDiv, MotionHeading } from "@/components/utils/motionWrapper";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload, X } from "lucide-react";
import { useMutation } from "react-query";
import { AxiosErrorResponseType, ProductSuccessType } from "@/types/index";
import { storageService } from "@/services/supabaseService";
import { productService } from "@/services/productService";
import { useAppSelector } from "@/redux/store";




const propertySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  regularPrice: z.coerce.number().min(1, "Price must be greater than 0"),
  discountAmount: z.coerce.number().min(0, "Discount cannot be negative"),
  bathrooms: z.coerce.number().min(1, "Must have at least 1 bathroom"),
  bedrooms: z.coerce.number().min(1, "Must have at least 1 bedroom"),
  furnished: z.boolean(),
  parking: z.boolean(),
  type: z.enum(["rent", "sell"]),
  offer: z.boolean(),
  imageUrls: z.array(z.string().url()).min(1, { message: "Minimum 1 image is required!" }),
}).refine((data) => data.discountAmount < data.regularPrice, {
  message: "Discount amount should be less than the regular price",
  path: ["discountAmount"],
});



type PropertyFormValues = z.infer<typeof propertySchema>;

const CreateProperty = () => {

  const router = useRouter();



  // States
  const { user } = useAppSelector(state => state.auth);


  const [selectedImages, setSelectedImages] = useState<{ file: File; url: string; }[]>([]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset: resetForm,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      regularPrice: 0,
      discountAmount: 0,
      bathrooms: 1,
      bedrooms: 1,
      furnished: false,
      parking: false,
      type: "rent",
      offer: false,
      imageUrls: [],
    },
  });



  // store values in imageUrls
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    for (const file of files) {
      if (file.size > 2000000) { // 2MB
        toast.error("Images should be less than 2 MB.");
        e.target.value = "";
        return;
      }
    }

    const newImages = Array.from(files).map(file => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setSelectedImages(prev => [...prev, ...newImages]);
    setValue("imageUrls", newImages.map(img => img.url), { shouldValidate: true });
  };




  // Remove Image
  const handleRemoveImage = (url: string) => {
    setSelectedImages(prev => prev.filter(img => img.url !== url));
    setValue(
      "imageUrls",
      selectedImages.filter(img => img.url !== url).map(img => img.url),
      { shouldValidate: true }
    );
  };



  // mutation function
  const { mutate, isLoading } = useMutation<ProductSuccessType, AxiosErrorResponseType, PropertyFormValues>(
    async (data) => {

      const loadingToast = toast.loading("Registration in progress...");

      try {
        const imageUrls: string[] = await Promise.all(
          selectedImages.map((val) => storageService.getDownloadUrl({ file: val.file, folder: "property" }))
        );

        const res = await productService.createProduct({ data: { ...data, imageUrls: imageUrls, userRef: user!._id! }, id: user!._id! });

        toast.dismiss(loadingToast);

        // clear the form
        resetForm();
        setSelectedImages([]);

        return res;

      } catch (err) {
        toast.dismiss(loadingToast);
        throw err;
      }
    },
    {
      onSuccess: (data) => {
        toast.success(data.message);
      },
      onError: (err) => {
        toast.error(err.message);
      }
    }
  );



  const onSubmit = (data: PropertyFormValues) => {
    mutate(data);
  };



  return (
    <MotionDiv className="overflow-y-auto max-h-full my-2">

      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <MotionHeading>Register New Property</MotionHeading>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Name */}
            <div>
              <Label htmlFor="name">Property Name</Label>
              <Input id="name" {...register("name")} placeholder="Enter property name" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} placeholder="Write a short description..." />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} placeholder="Enter property address" />
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between w-full">
                <Label htmlFor="imageUrls">Upload Images</Label>
                <Label className="text-xs md:text-sm text-red-500">*First image will be in thumbnail</Label>
              </div>
              <Input id="imageUrls" type="file" accept="image/*" multiple onChange={(e) => handleImageSelect(e)} />
              {errors.imageUrls && <p className="text-red-500 text-sm">{errors.imageUrls.message}</p>}
              {/* Image Previews */}
              <div className="flex flex-wrap items-center mt-2 space-x-2">
                {selectedImages.map(({ url }) => (
                  <div key={url} className="relative">
                    <Image key={url} src={url} alt="Preview" width={200} height={200} className="h-24 w-24 object-cover border rounded-sm" />
                    <X onClick={() => handleRemoveImage(url)}
                      className="absolute size-7 top-0 right-0 text-red-500 bg-black hover:text-red-300 hoveer:bg-black/50 p-1 rounded-sm cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>

            {/* Regular Price & Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="regularPrice">Price</Label>
                <Input id="regularPrice" type="number" {...register("regularPrice")} />
                {errors.regularPrice && <p className="text-red-500 text-sm">{errors.regularPrice.message}</p>}
              </div>
              <div>
                <Label htmlFor="discountAmount">Discount</Label>
                <Input id="discountAmount" type="number" defaultValue="$" {...register("discountAmount")} />
                {errors.discountAmount && <p className="text-red-500 text-sm">{errors.discountAmount.message}</p>}
              </div>
            </div>

            {/* Bathrooms & Bedrooms */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input id="bathrooms" type="number" {...register("bathrooms")} />
                {errors.bathrooms && <p className="text-red-500 text-sm">{errors.bathrooms.message}</p>}
              </div>
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input id="bedrooms" type="number" {...register("bedrooms")} />
                {errors.bedrooms && <p className="text-red-500 text-sm">{errors.bedrooms.message}</p>}
              </div>
            </div>

            {/* Furnished & Parking */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Controller
                  control={control}
                  name="furnished"
                  render={({ field }) => (
                    <Checkbox
                      id="furnished"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      value={field.value ? "true" : "false"}
                    />
                  )} />
                <Label htmlFor="furnished">Furnished</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Controller
                  control={control}
                  name="parking"
                  render={({ field }) => (
                    <Checkbox
                      id="parking"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      value={field.value ? "true" : "false"}
                    />
                  )} />
                <Label htmlFor="parking">Parking</Label>
              </div>
            </div>

            {/* Type */}
            <div>
              <Label htmlFor="type">Property Type</Label>

              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
            </div>

            {/* Offer */}
            <div className="flex items-center space-x-2">
              <Controller
                control={control}
                name="offer"
                render={({ field }) => (
                  <Checkbox
                    id="offer"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                    value={field.value ? "true" : "false"}
                  />
                )} />
              <Label htmlFor="offer">Offer Available</Label>
            </div>

            {/* Submit */}
            <CardFooter className="flex justify-between w-full">
              <Button disabled={isLoading} type="button" variant="outline" onClick={() => router.back()}> <ChevronLeft /> Back </Button>
              <Button disabled={isLoading} type="submit"> Publish <Upload /> </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </MotionDiv>
  );
};

export default CreateProperty;
