import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/nest-finder-da0f4.appspot.com/o/**',
      },
    ],
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
