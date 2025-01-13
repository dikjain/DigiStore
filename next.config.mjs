/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    turbo: false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/**', // Allow all paths
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**', // Allow all paths
      },
    ],
  },
};

export default nextConfig;
