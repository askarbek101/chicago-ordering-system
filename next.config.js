/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.immediate.co.uk',
        pathname: '/production/volatile/sites/**',
      },
      // Add other image domains as needed
    ],
  },
};

module.exports = nextConfig;
