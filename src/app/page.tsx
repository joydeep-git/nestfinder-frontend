"use client";


import LoadingAnimation from "@/components/utils/LoadingAnimation";


const Homepage = () => {

  const isLoading = false;

  if (isLoading) {
    return <LoadingAnimation />
  }
  
  return (
    <>
    Page
    </>
  )
}

export default Homepage;