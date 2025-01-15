import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // domain images
  },

  async redirects() {
    return [
      // redirect URL
      // {
      //   source: "/",
      //   destination: "/sign-in",
      //   permanent: true,
      // },
    ];
  },
};

export default nextConfig;
