"use client";

import Footer from "@/components/Footer";
import SkeletonCard from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productService } from "@/services/productService";
import { useQuery } from "@tanstack/react-query";
import { MoveRight, Search, Share2 } from "lucide-react";
import Image from "next/image";
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      {/* <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Browse by Property Type</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center">
                <Home className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium">Houses</h3>
                <p className="text-muted-foreground text-center mt-2">Explore standalone houses with yards and privacy</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center">
                <Building2 className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium">Apartments</h3>
                <p className="text-muted-foreground text-center mt-2">Find modern apartments in prime locations</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center">
                <Map className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium">Land</h3>
                <p className="text-muted-foreground text-center mt-2">Buy land and build your own custom home</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center">
                <Home className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium">Commercial</h3>
                <p className="text-muted-foreground text-center mt-2">Office spaces and retail locations</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Link href="/properties">
              <Button variant="outline" size="lg">
                View All Properties
                <span className="ml-2">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </section> */}

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
                    <Link href={`/products/${property._id}`} key={property._id}>
                      <Card className="overflow-hidden hover:shadow-lg transition">
                        <div className="aspect-video relative bg-muted">
                          <div className="absolute top-2 left-2 bg-primary px-2 py-1 rounded text-xs text-primary-foreground font-medium">
                            FOR {property.type.toUpperCase()}
                          </div>
                          <Image height={500} width={500} priority src={property.imageUrls[0]} alt={property.name} className="w-full h-full object-cover" />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg">${property.regularPrice - property.discountAmount}</h3>
                              <p className="text-card-foreground">{property.name}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-muted-foreground text-sm mt-2">{property.address}</p>
                          <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                            <div>{property.bedrooms} Beds</div>
                            <div>{property.bathrooms} Baths</div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
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