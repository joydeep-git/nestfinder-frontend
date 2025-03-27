"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from "react-query";
import { AxiosErrorResponseType, ProductDataType, ProductSuccessType } from '@/types/index';
import { productService } from '@/services/productService';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Armchair, Bath, BedDouble, CircleParking, MapPin, Share2, SquareArrowLeft } from 'lucide-react';
import ImageCarousal from '../imageCarousal';
import { Button } from '@/components/ui/button';
import LoadingAnimation from '@/components/utils/LoadingAnimation';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/redux/store';
import PropertyOwnerDetails from '@/components/propertyOwnerDetails';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const PropertyDetails = () => {
  const router = useRouter();

  // Get property ID
  const { id } = useParams<{ id: string }>();

  // Current user data
  const { user } = useAppSelector(state => state.auth);

  // States
  const [images, setImages] = useState<{ url: string }[]>([]);
  const [property, setProperty] = useState<ProductDataType>();



  // share property
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  }



  // get property Details
  const { isLoading, refetch } = useQuery<ProductSuccessType, AxiosErrorResponseType>(
    ['propertyDetails', id],
    () => productService.getProductDetails(id?.toString() || ''),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: false,
      onSuccess: (data) => {
        setProperty(data.data);
        setImages(data.data.imageUrls.map(url => ({ url })));
      },
      onError: (err) => {
        toast.error(err.message);
        router.push("/");
      },
    }
  );

  // fetch property on page load
  useEffect(() => {
    refetch();
  }, [id, refetch]);

  // checking if user is property owner
  const isOwner = property?.userRef === user?._id;

  if (isLoading || !property) return <LoadingAnimation />;


  // Calculate discounted price
  const finalPrice: number = ( property.discountAmount && property.discountAmount > 0) ? property.regularPrice - property.discountAmount : property.regularPrice;


  return (
    <div className='flex flex-col lg:flex-row max-w-screen-2xl mx-auto h-full overflow-auto justify-start gap-8 p-8'>

      <SquareArrowLeft className="cursor-pointer hover:opacity-60"
        height={30} width={30}
        onClick={() => router.back()} />

      <div className='w-full lg:w-2/5'>
        {/* Property Images */}
        {images.length > 0 && (
          <div className='sticky top-20'>
            <ImageCarousal
              images={images}
              className='w-full relative p-0 m-0 object-contain h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] rounded-lg shadow-md'
            />

            {/* Quick action buttons */}
            <div className='flex justify-between mt-4 gap-2'>
              <Button variant="outline" className='flex-1' onClick={() => handleShare()}>
                <Share2 size={16} className='mr-2' /> Share
              </Button>
            </div>
          </div>
        )}
      </div>

      <Card className='w-full lg:w-3/5 h-fit border-none shadow-lg rounded-xl overflow-hidden'>
        <div className=' p-1'>
          <CardHeader className='pb-2'>
            {/* Property Type Badge */}
            <div className='flex justify-between items-center mb-2'>
              <Badge className={`${property.type === "rent" ? "bg-blue-600" : "bg-green-600"} text-white px-3 py-1`}>
                For {property.type === "rent" ? "Rent" : "Sale"}
              </Badge>

              {property.offer && (
                <Badge className='bg-red-500 text-white'>Special Offer</Badge>
              )}
            </div>

            {/* Property Name */}
            <CardTitle className='text-2xl font-bold'>
              {property.name}
            </CardTitle>

            {/* Property Address */}
            <div className='flex items-center gap-2 text-sm mt-2'>
              <MapPin size={16} />
              <span>{property.address}</span>
            </div>

            {/* Price Section */}
            <div className='mt-4 p-4 rounded-lg shadow-sm'>
              <div className='flex items-center gap-3'>
                <div>
                  <p className='text-sm'>
                    {property.type === "rent" ? "Rental Price" : "Sale Price"}
                  </p>
                  <div className='flex items-center'>
                    <span className='text-3xl font-bold text-blue-700'>
                      ${finalPrice}
                    </span>
                    {property.type === "rent" && (
                      <span className='text-gray-500 ml-1'>/month</span>
                    )}
                  </div>
                </div>

                {property.discountAmount > 0 && (
                  <div className='ml-4'>
                    <p className='text-sm text-gray-500'>Original Price</p>
                    <span className='text-lg line-through text-gray-400'>
                      ${property.regularPrice}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <Separator className='my-2' />

          <CardContent className='pt-4'>
            {/* Property Description */}
            <div className='mb-6'>
              <h3 className='text-lg font-semibold mb-2'>Description</h3>
              <CardDescription className='leading-relaxed'>
                {property.description}
              </CardDescription>
            </div>

            <Separator className='my-4' />

            {/* Property Features */}
            <div className='mb-6'>
              <h3 className='text-lg font-semibold mb-4'>Property Features</h3>

              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>

                <div className='flex flex-col items-center justify-center p-4 rounded-lg shadow-sm border'>
                  <BedDouble size={26} className='text-blue-600 mb-2' />
                  <span className=' font-medium'>{property.bedrooms}</span>
                  <span className=' text-sm'>{property.bedrooms > 1 ? "Bedrooms" : "Bedroom"}</span>
                </div>

                <div className='flex flex-col items-center justify-center p-4 rounded-lg shadow-sm border'>
                  <Bath size={26} className='text-blue-600 mb-2' />
                  <span className=' font-medium'>{property.bathrooms}</span>
                  <span className=' text-sm'>{property.bathrooms > 1 ? "Bathrooms" : "Bathroom"}</span>
                </div>

                <div className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-sm border`}>
                  <Armchair size={26} className={property.furnished ? 'text-blue-600 mb-2' : ' mb-2'} />
                  <span className={property.furnished ? ' font-medium' : 'font-medium'}>
                    {property.furnished ? "Furnished" : "Not Furnished"}
                  </span>
                </div>

                <div className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-sm border`}>
                  <CircleParking size={26} className={property.parking ? 'text-blue-600 mb-2' : 'text-gray-400 mb-2'} />
                  <span className={property.parking ? 'font-medium' : 'font-medium'}>
                    {property.parking ? "Parking" : "No Parking"}
                  </span>
                </div>
              </div>
            </div>

            <Separator className='my-4' />

            {/* Contact Section */}
            <div className='mt-6 border p-5 rounded-lg shadow-sm'>
              <h3 className='text-lg font-semibold mb-4'>Contact Information</h3>

              {!user ? (
                <div className='text-center p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50'>
                  <p className='text-gray-600 mb-3'>Sign in to view contact information</p>
                  <Button
                    className='w-full bg-blue-600 hover:bg-blue-700 transition-colors'
                    onClick={() => router.push("/sign-in")}
                  >
                    Login to see owner details
                  </Button>
                </div>
              ) : (
                isOwner ? (
                  <div className='space-y-4'>
                    <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                      <p className='text-yellow-800 font-medium'>You are the owner of this property</p>
                    </div>
                    <Button
                      className='w-full bg-blue-600 hover:bg-blue-700 transition-colors'
                      onClick={() => router.push(`/edit-property/${property._id}`)}
                    >
                      Edit Property
                    </Button>
                  </div>
                ) : (
                  <PropertyOwnerDetails id={property.userRef} />
                )
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default PropertyDetails;