import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript:{
    ignoreBuildErrors:true
   },
   eslint:{
     ignoreDuringBuilds:true
   }, 
   images: {
    domains: ['assets.aceternity.com','uttarakhandtourism.net',"img.freepik.com","res.cloudinary.com"], // Add the domain here
  },
};

export default nextConfig;

