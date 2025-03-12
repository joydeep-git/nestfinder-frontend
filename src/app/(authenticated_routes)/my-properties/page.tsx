"use client";

import { Button } from '@/components/ui/button';
import { MotionDiv, MotionHeading, MotionText } from '@/components/utils/motionWrapper';
import { useAppSelector } from '@/redux/store';
import { productService } from '@/services/productService';
import { AxiosErrorResponseType, multipleProductsSuccessType, ProductDataType } from '@/types/index';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from "react-query";
import PropertyCardMenu from "@/app/(authenticated_routes)/my-properties/PropertyCardMenu";
import DeleteProperty from '@/app/(authenticated_routes)/my-properties/DeleteProperty';
import ProductCard from '@/components/ProductCard';
import LoadingAnimation from '@/components/utils/LoadingAnimation';



const MyProperties = () => {

  const router = useRouter();


  // States
  const { user } = useAppSelector(state => state.auth);



  // mutation function
  const { refetch, data: allProperties, isLoading } = useQuery<multipleProductsSuccessType, AxiosErrorResponseType>(
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


  if(isLoading) return <LoadingAnimation />

  return (
    <MotionDiv className='pt-6 pb-12 max-w-screen-2xl'>
      <MotionHeading>My Properties</MotionHeading>

      {allProperties && allProperties?.data.length > 0 ? (
        <div className='flex-1 w-full'>
          <div className='mx-auto flex flex-wrap items-start justify-start gap-6 w-fit'>
            {allProperties?.data.map((property: ProductDataType) => (
              <ProductCard
                key={property._id}
                property={property}
              >

                {/* passing del and menu */}
                
                <DeleteProperty userId={user!._id} productId={property._id} refetch={refetch} />
                <PropertyCardMenu product={property} />
              </ProductCard>
            ))}
          </div>
        </div>
      ) : (
        <div className='flex-1'>
          <MotionText className='flex flex-col gap-6'>
            <span>You have not registered any property! </span>
            <Button size={'sm'} onClick={() => router.push("register-property")}>
              Create One <ChevronRight />
            </Button>
          </MotionText>
        </div>
      )}
    </MotionDiv>
  )
}

export default MyProperties;
