"use client";

import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { MotionHeading, MotionText } from '@/components/utils/motionWrapper';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath } from 'lucide-react';
import { ProductDataType } from '../types';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

const ProductCard = ({ property, children }: { property: ProductDataType; children?: ReactNode; }) => {
  const router = useRouter();

  // get discounted price
  const getPrice = (): number => {
    return (property.discountAmount && property.discountAmount > 0) ? property.regularPrice - property.discountAmount : property.regularPrice;
  };


  // send to property details page
  const routerFn = () => {
    router.push(`/property-details/${property._id}`);
  };



  return (
    <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100" key={property._id}>
      {/* Property Image with Gradient Overlay */}
      <div className="relative w-80 h-56 overflow-hidden group">
        <Image
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={property.imageUrls[0]}
          height={500}
          width={500}
          alt={property.name}
          priority={true}
        />
        {/* Gradient overlay for better badge visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Property Type Badge */}
        <Badge className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 text-xs font-medium cursor-default shadow-md">
          {property.type === "rent" ? "For Rent" : "For Sale"}
        </Badge>

        {/* Discount Badge */}
        {property.discountAmount > 0 && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 text-xs font-medium shadow-md">
            Save ${property.discountAmount}
          </Badge>
        )}
      </div>

      {/* Property Details */}
      <div className="p-5 flex flex-col cursor-pointer space-y-3" onClick={routerFn}>
        <MotionHeading
          className="text-left text-xl font-bold truncate"
          whileHover={{ x: 3 }}
          transition={{ duration: 0.2 }}
        >
          {property.name}
        </MotionHeading>

        <div className="flex items-center text-gray-500">
          <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
          <MotionText className="text-sm truncate">{property.address}</MotionText>
        </div>

        {/* Property Features with better spacing and styling */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1">
          <div className="flex items-center gap-4">
            {property.bedrooms > 0 && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1 text-blue-500" />
                <span className="text-sm font-medium">{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
              </div>
            )}

            {property.bathrooms > 0 && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1 text-blue-500" />
                <span className="text-sm font-medium">{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
              </div>
            )}
          </div>

          {/* Furnished and Parking icons */}
          <div className="flex gap-2">
            {property.furnished && (
              <Badge variant="outline" className="bg-blue-50 text-blue-600 text-xs border-blue-100">
                Furnished
              </Badge>
            )}
            {property.parking && (
              <Badge variant="outline" className="bg-green-50 text-green-600 text-xs border-green-100">
                Parking
              </Badge>
            )}
          </div>
        </div>

        {/* Price Display with improved styling */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-500 text-xs">Price</span>
            <div className="flex items-center">
              <span className="text-xl font-bold">${getPrice()}</span>
              {property.type === "rent" && <span className="text-xs text-gray-500 ml-1">/month</span>}

              {property.discountAmount > 0 && (
                <span className="ml-2 text-sm text-gray-400 line-through">
                  ${property.regularPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card menu & action buttons with better styling */}
      <div className="px-5 pb-4">
        {children ? (
          <div className="flex items-center justify-between">{children}</div>
        ) : (
          <Button
            onClick={routerFn}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            variant="default"
          >
            View Details
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;