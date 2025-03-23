import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;


module.exports = {
  // experimental: {
  //   appDir: true, // This must be true for the app router
  // },
  images: {
    domains: ['assets.aceternity.com','uttarakhandtourism.net',"img.freepik.com","res.cloudinary.com"], // Add the domain here
  },
};