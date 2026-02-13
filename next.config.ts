import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    rules: {
      '*.{vert,frag}': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: 'javascript/auto',
      use: ['raw-loader'],
    });
    return config;
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
