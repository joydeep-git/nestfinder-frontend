"use client";

import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productService } from "@/services/productService";
import { useQuery } from "@tanstack/react-query";
import { MoveRight, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";



const Page = () => {

  const router = useRouter();

  const [propertyType, setPropertyType] = useState<"all" | "sell" | "rent">("all");
  const [searchStr, setSearchStr] = useState<string>("");


  // search function
  const handleSearch = () => {
    const queryParams: URLSearchParams = new URLSearchParams();

    if (propertyType !== "all") {
      queryParams.append("type", propertyType);
    }
    if (searchStr) {
      queryParams.append("search", searchStr);
    }
    router.push(`products?${queryParams.toString()}`);
  }



  // get properties
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => await productService.getProducts(""),
    enabled: true,
  });


  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero Section */}
      <section className="relative text-primary-foreground py-16 md:py-24">
        {/* <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-90"></div> */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Property</h1>
            <p className="text-lg mb-8 text-primary-foreground/90">Discover thousands of properties for sale and rent across the country.</p>

            <div className="bg-card p-4 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <Select onValueChange={(val) => setPropertyType(val as "all" | "sell" | "rent")} defaultValue={propertyType}>
                  <SelectTrigger className="w-fit bg-primary">
                    <SelectValue placeholder="all" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="sell">Buy</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    onChange={(e) => setSearchStr(e.target.value)}
                    value={searchStr}
                    placeholder="Search for properties"
                    className="pl-10 w-full text-primary"
                  />
                </div>

                <Button size="lg" className="w-full md:w-auto" onClick={() => handleSearch()}>
                  Search
                </Button>

                <Button size="lg" type="button" variant={"outline"} className="w-full md:w-auto text-primary" onClick={() => router.push("/products")}>
                  All Products
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Properties</h2>
            <Link href="/products" className="text-primary hover:underline flex items-center">
              View All <MoveRight width={12} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
              isLoading
                ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
                : data?.data.slice(0, 3).map((property) => {
                  return (
                    <ProductCard property={property} key={property._id} />
                  )
                })
            }
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who found their perfect property with HomeFindr.
          </p>
          <div className="">
            <Button onClick={() => router.push("/products")} variant="secondary" size="lg">Browse All Properties</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Page;