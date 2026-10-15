import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true, // Enables Gzip / Brotli compression for all components
  poweredByHeader: false, // Security & bandwidth reduction
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
  },
  async headers() {
    return [
      {
        // Add Expires & Cache-Control headers for all static assets and images
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2|ttf|css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
