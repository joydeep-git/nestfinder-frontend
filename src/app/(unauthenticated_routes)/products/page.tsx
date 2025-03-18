"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { MotionLayoutDiv, MotionText } from '@/components/utils/motionWrapper';
import LoadingAnimation from '@/components/utils/LoadingAnimation';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

const Products = () => {

  // get search params
  const searchParams = useSearchParams();
  const router = useRouter();

  // fetch products
  const { data, isLoading } = useQuery({
    queryKey: ['products', searchParams.toString()],
    queryFn: async () => await productService.getProducts(searchParams.toString()),
    enabled: !!searchParams,
  });


  if (isLoading) return <LoadingAnimation />

  return (
    <MotionLayoutDiv className='items-center md:items-start justify-start flex-wrap flex-row w-full flex-1 mx-auto flex gap-6'>
      {
        (data?.data && data?.data.length > 0)
          ? data?.data.map((product) => { return (<ProductCard property={product} key={product._id} />) })
          : (
            <div className='flex-1 pt-16'>
              <MotionText className='flex flex-col gap-6 text-center items-center'>
                <span>No Property available!</span>
                <Button className='w-fit' size={'sm'} onClick={() => router.push("/products")}>
                  Reset Filter <RefreshCcw />
                </Button>
              </MotionText>
            </div>
          )
      }
    </MotionLayoutDiv>
  )
}

export default Products;
