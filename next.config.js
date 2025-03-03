/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.temu.com', 'images.unsplash.com'],
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to resolve these server-only modules on the client
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
        'pg-native': false,
      };
    }
    return config;
  },
}

module.exports = nextConfig 