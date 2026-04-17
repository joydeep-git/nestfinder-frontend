import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Info, Menu } from 'lucide-react';
import { ProductDataType, UserDataType } from '@/types/index';
import { useRouter } from 'next/navigation';
import DeleteProperty from './DeleteProperty';

const PropertyCardMenu = ({ product, user, refetch }: { product: ProductDataType; user: UserDataType; refetch: () => void; }) => {

  const router = useRouter();


  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost"><Menu /></Button>
      </DropdownMenuTrigger>


      <DropdownMenuContent className="w-fit">


        <DropdownMenuItem onClick={() => router.push(`property-details/${product._id}`)}>
          <Info /> View Details
        </DropdownMenuItem>


        <DropdownMenuItem>
          <Edit /> Edit
          <DeleteProperty userId={user!._id} productId={product._id} refetch={refetch} />
        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>

  )
}

export default PropertyCardMenu;