import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: ['m.media-amazon.com'], // Add the Amazon images domain here
  },
};

module.exports = nextConfig;

export default nextConfig;
