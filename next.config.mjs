/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignore test files in pdf-parse
      config.externals = config.externals || [];
      config.externals.push({
        'canvas': 'canvas',
        'pdf-parse': 'commonjs pdf-parse'
      });
    }
    return config;
  },
}

export default nextConfig
