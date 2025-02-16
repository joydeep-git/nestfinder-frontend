"use client";

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { useQuery } from 'react-query';
import { AxiosErrorResponseType, ProductSuccessType } from '@/types/index';
import { productService } from '@/services/productService';

import ImageCarousal from '@/app/(unauthenticated_routes)/property-details/imageCarousal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';


const PropertyDetails = () => {


  // Get property ID
  const { id } = useParams();


  // States
  const [images, setImages] = useState<string[]>([]);


  // get property Details
  const { refetch, data } = useQuery<ProductSuccessType, AxiosErrorResponseType>(
    [id],
    () => productService.getProductDetails(id!.toString()),
    {
      enabled: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: false,
      onSuccess: (data) => {
        setImages(data.data.imageUrls);
      },
      onError: (err) => {
        console.log(err)
      },
    }
  );




  // fetch data on page load
  useEffect(() => {
    refetch();
  }, [refetch]);



  return (
    <div className='flex -md:flex-col max-w-screen-2xl mx-auto h-full overflow-auto justify-start gap-4 p-8'>

      <ImageCarousal images={images} />

      <Card className='w-3/5 h-fit'>

        <CardHeader>
          <CardTitle>{data?.data.name}</CardTitle>

          <CardDescription>{data?.data.description}</CardDescription>
        </CardHeader>


        <CardContent className='flex flex-wrap gap-4'>


          <div className='flex flex-col gap-2'>
            <p className='flex items-center'><MapPin className='h-5' /><span>Address</span></p>
            <p>{data?.data.address}</p>
          </div>

          <div className='flex flex-col gap-2'>
            <p className='flex items-center gap-2 text-xs'><MapPin className='h-5' /><span>{data?.data.address}</span></p>
            <p></p>
          </div>

        </CardContent>

      </Card>

    </div>
  )
}

export default PropertyDetails;