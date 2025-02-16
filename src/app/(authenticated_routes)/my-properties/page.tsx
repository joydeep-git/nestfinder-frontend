"use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MotionDiv, MotionHeading, MotionText } from '@/components/utils/motionWrapper';
import { useAppSelector } from '@/redux/store';
import { productService } from '@/services/productService';
import { AxiosErrorResponseType, MyProductsSuccessType } from '@/types/index';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import PropertyCardMenu from "@/app/(authenticated_routes)/my-properties/PropertyCardMenu";
import DeleteProperty from '@/app/(authenticated_routes)/my-properties/DeleteProperty';



const MyProperties = () => {

  const router = useRouter();


  // States
  const { user } = useAppSelector(state => state.auth);



  // mutation function
  const { refetch, data: allProperties } = useQuery<MyProductsSuccessType, AxiosErrorResponseType>(
    ['ownerAllProducts', user!._id],
    async () => await productService.getOwnerAllProducts(user!._id.toString()),
    {
      onError: (err) => {
        toast.error(err.message);
      },
    }
  );



  // run on component load
  useEffect(() => {
    refetch();
  }, [refetch]);


  // send user to property-details page
  const redirect = (id: string) => {
    router.push(`property-details/${id}`)
  }
  


  return (
    <MotionDiv className='pt-6 pb-12 max-w-screen-2xl'>

      <MotionHeading>My Properties</MotionHeading>

      {
        allProperties && allProperties?.data.length > 0
          ? (
            <div className='flex-1 w-full '>
              <div className='mx-auto flex flex-wrap items-start justify-start gap-6 w-fit'>
                {
                  allProperties?.data.map((val) => {
                    return (
                      <Card className='p-1' key={val._id}>

                        <div className='w-80 h-52 flex items-center justify-center overflow-hidden rounded-sm'>
                          <Image className='rounded-md' src={val.imageUrls[0]} height={500} width={500} alt={val.name} priority={true} />
                        </div>

                        <div className='p-4 flex flex-col cursor-pointer' onClick={() => redirect(val._id)}>

                          <MotionHeading className='text-left' >{val.name}</MotionHeading>
                          <MotionText>{val.address}</MotionText>

                        </div>

                        <div className='flex items-center justify-between py-1 px-4'>
                          <DeleteProperty userId={user!._id} productId={val._id} refetch={refetch} />
                          <PropertyCardMenu product={val} />
                        </div>

                      </Card>
                    )
                  })
                }
              </div>
            </div>
          )
          : <div className='flex-1'>
            <MotionText className='flex flex-col gap-6'>
              <span>You have not registered any property! </span>
              <Button size={'sm'} onClick={() => router.push("register-property")}>Create One <ChevronRight /> </Button>
            </MotionText>
          </div>
      }

    </MotionDiv>
  )
}

export default MyProperties;
