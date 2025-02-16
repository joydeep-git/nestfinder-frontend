// import React from "react";
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
// import Image from "next/image";

// const ImageCarousal = ({ images }: { images: string[] }) => {
//   if (!images.length) return <p className="text-center text-gray-500">No images available</p>;

//   return (
//     <Carousel className="w-2/5 h-1/2 mx-auto overflow-hidden object-cover ">
//       <CarouselContent className="h-full">
//         {images.map((val, index) => (
//           <CarouselItem key={index} className="relative w-full h-full">
//             <Image
//               src={val}
//               alt={`Property Image ${index + 1}`}
//               className="object-cover w-full h-full"
//               height={500}
//               width={1000}
//               priority
//             />
//           </CarouselItem>
//         ))}
//       </CarouselContent>
//       <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10" />
//       <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10" />
//     </Carousel>
//   );
// };

// export default ImageCarousal;


import React from 'react';
import PhotoGallery from 'react-photo-gallery';

const ImageGallery = ({ images }: { images:string[] }) => {
  return (
    <PhotoGallery
      id="gallery"
      items={images.map((image) => ({ id: image, src: image, alt: `Image ${image}` }))}
      showThumbs={true}
      showFullscreen={true}
      showZoom={true}
    />
  );
};

export default ImageGallery;


