/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['platform.slack-edge.com'],
  },
};

module.exports = nextConfig;
