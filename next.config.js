/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's11.gifyu.com',
      },
      {
        protocol: 'https',
        hostname: 's1.gifyu.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
      {
        protocol: 'https',
        hostname: 's3-eu-west-1.amazonaws.com',
      },
    ],
  },
}

module.exports = nextConfig