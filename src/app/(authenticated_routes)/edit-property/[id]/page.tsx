"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import LoadingAnimation from "@/components/utils/LoadingAnimation";
import { MotionDiv, MotionHeading } from "@/components/utils/motionWrapper";
import { useAppSelector } from "@/redux/store";
import { storageService } from "@/services/supabaseService";
import { productService } from "@/services/productService";
import { AxiosErrorResponseType, ProductDataType, ProductSuccessType } from "@/types/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, SquareArrowLeft, Upload, X } from "lucide-react";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import { z } from "zod";


// schema
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


const EditProperty = () => {

  const router = useRouter();
  const pathname = usePathname();

  // property id from param
  const { id: propertyId } = useParams<{ id: string }>();


  // state to store images with File and URL
  const [selectedImages, setSelectedImages] = useState<{ file?: File; url: string; }[]>([]);


  // User data
  const { user } = useAppSelector(state => state.auth);



  // fetch property details from db
  const { data: existingPropertyData, isLoading: fetchLoading, refetch: fetchProperty } = useQuery<ProductDataType, AxiosErrorResponseType>(
    ["edit-property", propertyId],
    async () => {
      const res = await productService.getProductDetails(propertyId);
      return res.data;
    },
    {
      retry: false,
      enabled: false,
      onSuccess: (data) => {
        if (user?._id !== data.userRef) {
          toast.error("Unauthorized Access!");
          setTimeout(() => router.back(), 500);
        }
      },
      onError: (err) => {
        toast.error(err.message);
        router.back();
      }
    }
  );


  // run on component load
  useEffect(() => {
    if (pathname.includes("edit-property")) fetchProperty();
  }, [fetchProperty, pathname]);



  // default form state
  const {
    control,
    register,
    handleSubmit,
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



  // update form and image state on existingPropertyData fetch
  useEffect(() => {

    if (existingPropertyData) {

      // set form data
      resetForm({
        name: existingPropertyData.name,
        description: existingPropertyData.description,
        address: existingPropertyData.address,
        regularPrice: existingPropertyData.regularPrice,
        discountAmount: existingPropertyData.discountAmount,
        bathrooms: existingPropertyData.bathrooms,
        bedrooms: existingPropertyData.bedrooms,
        furnished: existingPropertyData.furnished,
        parking: existingPropertyData.parking,
        type: existingPropertyData.type === "rent" ? "rent" : "sell",
        offer: existingPropertyData.offer,
        imageUrls: existingPropertyData.imageUrls,
      });

      // store into selected Images
      setSelectedImages(
        existingPropertyData?.imageUrls.map(
          val => ({ url: val })
        )
      );
    }

  }, [existingPropertyData, resetForm]);



  // handle image upload
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = Array.from(files)
      .filter(file => !selectedImages.some(img => img.file?.name === file.name)) // Prevent duplicate file selection
      .map(file => ({ file, url: URL.createObjectURL(file) }));

    setSelectedImages(prev => [...prev, ...newImages]);
  };


  // handle image remove
  const handleRemoveImage = (url: string) => {
    setSelectedImages(prev => prev.filter(img => img.url !== url));
  };



  // submit data
  const { mutate, isLoading: editLoading } = useMutation<ProductSuccessType, AxiosErrorResponseType, PropertyFormValues>(
    async (data) => {

      const loadingToast = toast.loading("Updating property...");

      try {

        // upload new images to supabase
        const uploadedImageUrls = await Promise.all(
          selectedImages
            .filter(img => img.file) // Only upload new images
            .map(async img => await storageService.getDownloadUrl({ file: img.file!, folder: "property" }))
        );


        // Create final image list
        const finalImageUrls = [
          ...selectedImages.filter(img => !img.file).map(img => img.url), // Keep old images
          ...uploadedImageUrls, // Add newly uploaded images
        ];

        // edit product on backend
        const res = await productService.editProduct({
          data: { ...data, imageUrls: finalImageUrls, userRef: user!._id! },
          userId: user!._id!,
          productId: propertyId,
        });

        toast.dismiss(loadingToast);

        // refetch data after 500ms
        setTimeout(() => { fetchProperty() }, 500);

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



  // submit data
  const onSubmit = (data: PropertyFormValues) => {
    mutate(data);
  };



  // show loading page
  if (fetchLoading || !existingPropertyData) return <LoadingAnimation />


  return (
    <MotionDiv className="overflow-y-auto max-h-full my-2">

      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader className="relative">
          <SquareArrowLeft className="absolute top-4 left-4 cursor-pointer hover:opacity-60" height={30} width={30} onClick={() => router.replace("/my-properties")} />
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
                    <Image key={url} src={url} alt="Preview" width={200} height={200} className="h-24 w-24 object-cover border rounded-sm" priority={true} />
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
              <Button disabled={editLoading} type="button" variant="outline" onClick={() => router.back()}> <ChevronLeft /> Back </Button>
              <Button disabled={editLoading} type="submit"> Publish <Upload /> </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </MotionDiv>
  )


};

export default EditProperty;