import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Info, Menu } from 'lucide-react';
import { ProductDataType } from '@/types/index';
import { useRouter } from 'next/navigation';

const PropertyCardMenu = ({ product }: { product: ProductDataType; }) => {

  const router = useRouter();


  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost"><Menu /></Button>
      </DropdownMenuTrigger>


      <DropdownMenuContent className="w-fit">

        <DropdownMenuItem onClick={() => router.push(`edit-property/${product._id}`)}>
          <Edit /> Edit
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push(`property-details/${product._id}`)}>
          <Info /> View Details
        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>

  )
}

export default PropertyCardMenu;