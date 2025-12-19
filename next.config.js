/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/gst-financial-ai-calculator',
  assetPrefix: '/gst-financial-ai-calculator/',
}

module.exports = nextConfig
