/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/d-id/:path*',
        destination: 'https://api.d-id.com/:path*',
      },
    ]
  },
  env: {
    DID_API_KEY: process.env.DID_API_KEY,
  },
}

module.exports = nextConfig 