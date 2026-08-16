import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async redirects() {
    return [
      // El form viejo se consolidó en la landing de demos.
      {
        source: "/waitlist",
        destination: "https://demos.felipesalazar.cl/solicitar",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
