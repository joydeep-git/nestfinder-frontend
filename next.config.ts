import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'caircqiavqtvychzxayf.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
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
