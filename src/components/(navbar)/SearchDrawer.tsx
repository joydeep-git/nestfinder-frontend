"use client";

import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';

import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from 'lucide-react';
import { FilterReduxState } from '@/types/index';
import { useState } from 'react';


const filterSchema = z.object({
  search: z.string().optional(),
  furnished: z.boolean(),
  parking: z.boolean(),
  order: z.enum(["default", "asc", "desc"]),
  sort: z.enum(["default", "createdAt", "regularPrice"]),
  type: z.enum(["all", "rent", "sale"]),
});

const SearchModal = () => {


  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);


  // form values
  const { register, handleSubmit, setValue, watch, reset: resetForm } = useForm<FilterReduxState>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      furnished: false,
      parking: false,
      order: "default",
      sort: "default",
      type: "all",
    },
  });



  // reset form
  const handleReset = () => {
    resetForm();
  };


  // submit form
  const onSubmit = (data: FilterReduxState) => {

    const queryParams: URLSearchParams = new URLSearchParams();

    if (data.search.length > 0) queryParams.append("search", data.search);
    if (data.furnished) queryParams.append("furnished", data.furnished.toString());
    if (data.parking) queryParams.append("parking", data.parking.toString());
    if (data.order !== "default") queryParams.append("order", data.order);
    if (data.sort !== "default") queryParams.append("sort", data.sort);
    if (data.type !== "all") queryParams.append("type", data.type);

    router.push(`/products?${queryParams}`);

    setIsOpen(false);
  };



  // all products router
  const handleAllProducts = () => {
    router.push("/products");
    setIsOpen(false);
  };




  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >

      <DialogTrigger asChild>
        <Search className='h-5 w-5 cursor-pointer hover:text-orange-500' strokeWidth={2} onClick={() => setIsOpen(true)} />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px]">

        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
          <DialogDescription>
            Adjust the filters to find the best listings.
          </DialogDescription>
        </DialogHeader>


        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="search">Search</Label>
              <Input {...register("search")} placeholder="Enter keyword..." className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Furnished</Label>
              <Switch checked={watch("furnished")} onCheckedChange={(checked) => setValue("furnished", checked)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Parking</Label>
              <Switch checked={watch("parking")} onCheckedChange={(checked) => setValue("parking", checked)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Sort By</Label>
              <Select onValueChange={(val) => setValue("sort", val as "default" | "createdAt" | "regularPrice")} defaultValue={watch("sort")}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="createdAt">Date</SelectItem>
                  <SelectItem value="regularPrice">Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Order</Label>
              <Select onValueChange={(val) => setValue("order", val as "default" | "asc" | "desc")} defaultValue={watch("order")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Type</Label>
              <Select onValueChange={(val) => setValue("type", val as "all" | "rent" | "sale")} defaultValue={watch("type")}>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>


          <DialogFooter className='flex flex-row items-center justify-between sm:justify-between sm:space-x-2 w-full'>
            <Button type="button" variant={'secondary'} onClick={() => handleReset()}>Reset</Button>

            <div className='flex items-center space-x-2'>
              <Button type="button" variant={'secondary'} onClick={() => handleAllProducts()}>All Products</Button>

              <Button type="submit">Search</Button>
            </div>
          </DialogFooter>


        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
