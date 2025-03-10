"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { MotionLayoutDiv } from '@/components/utils/motionWrapper';

const Products = () => {

  // get search params
  const searchParams = useSearchParams();

  // fetch products
  const { data } = useQuery({
    queryKey: ['products', searchParams.toString()],
    queryFn: async () => await productService.getProducts(searchParams.toString()),
    enabled: !!searchParams,
  });



  return (
    <MotionLayoutDiv className='items-center md:items-start justify-start flex-wrap flex-row w-full flex-1 mx-auto flex gap-6'>
      {
        data?.data.map((product) => { return (<ProductCard property={product} key={product._id} /> ) } )
      }
    </MotionLayoutDiv>
  )
}

export default Products;
