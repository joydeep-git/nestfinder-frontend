"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import { AxiosErrorResponseType, ProductDataType, ProductSuccessType } from '@/types/index';
import { productService } from '@/services/productService';



import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Armchair, Bath, BedDouble, CircleParking, DollarSign, MapPin } from 'lucide-react';
import ImageCarousal from '../imageCarousal';
import { Button } from '@/components/ui/button';
import LoadingAnimation from '@/components/utils/LoadingAnimation';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/redux/store';


const PropertyDetails = () => {


  const router = useRouter();

  // Get property ID
  const { id } = useParams<{ id: string }>(); 


  // Current user data
  const { user } = useAppSelector(state => state.auth);


  // States
  const [images, setImages] = useState<{ url: string }[]>([]);
  const [property, setProperty] = useState<ProductDataType>();


  // get property Details
  const { isLoading } = useQuery<ProductSuccessType, AxiosErrorResponseType>(
    ['propertyDetails', id],
    () => productService.getProductDetails(id?.toString() || ''),
    {
      enabled: !!id,
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


  // checking if user is property owner
  const isOwner = property?.userRef === user?._id;

  if (isLoading || !property) return <LoadingAnimation />;

  return (
    <div className='flex flex-col lg:flex-row max-w-screen-2xl mx-auto h-full overflow-auto justify-start gap-4 p-8'>

      {
        images.length > 0 && <ImageCarousal images={images} className='w-full lg:w-2/5 relative p-0 m-0 object-contain h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] ' />
      }

      <Card className='w-3/5 h-fit'>

        <CardHeader>
          <CardTitle>{property?.name}</CardTitle>

          <CardDescription>{property?.description}</CardDescription>

          <CardDescription className='flex items-center gap-2 text-sm'>
            <MapPin size={16} />
            <span>{property?.address}</span>
          </CardDescription>
        </CardHeader>


        <CardContent className='flex flex-col flex-wrap gap-6'>

          <div className='flex flex-col gap-3'>
            <div className='flex gap-2 items-center'>

              <p className='text-lg font-bold'>
                {property?.type === "rent" ? "Rent" : "Sale"} :
              </p>

              <Button variant="secondary" className='cursor-auto bg-green-600 hover:bg-green-400 px-3'>
                <DollarSign size={16} />
                <span>{property?.discountAmount > 0 ? (property?.regularPrice - property?.discountAmount) : property?.regularPrice} {property?.type === "rent" && " / Month"}</span>
              </Button>

              {
                property?.discountAmount > 0 && <Button variant="ghost" className='text-sm line-through text-red-500'>${property?.regularPrice}</Button>
              }
            </div>
            {
              property.offer && <span className='text-md text-green-600'>*Offer Available</span>
            }
          </div>


          <div className='flex items-center gap-2 text-md'>
            <BedDouble size={24} />
            <span>{property?.bedrooms} {property?.bedrooms > 1 ? "Bedrooms" : "Bedroom"}</span>
          </div>


          <div className='flex items-center gap-2 text-md'>
            <Bath size={24} />
            <span>{property?.bathrooms} {property?.bathrooms > 1 ? "Bathrooms" : "Bathroom"}</span>
          </div>


          <div className='flex items-center gap-4'>
            <Button size={'lg'} variant={'secondary'} disabled={!property.furnished}
              className={property.furnished ? "" : "line-through opacity-50 cursor-not-allowed"}>
              <Armchair /> Furnished
            </Button>
            <Button size={'lg'} variant={'secondary'} disabled={!property.parking} className={!property.parking ? "line-through" : ""}> <CircleParking /> Parking </Button>
          </div>


          {
            !user
              ? <Button className='w-fit' onClick={() => router.push("/sign-in")}>Login to see owner details</Button>
              : <Button className='w-fit'
                onClick={() => router.push( isOwner ? `/edit-property/${property._id}` : `/contact-owner/${property.userRef}`)}>
                {isOwner ? "Edit Property" : "Contact Owner"}
              </Button>
          }

        </CardContent>

      </Card>

    </div>
  )
}


export default PropertyDetails;