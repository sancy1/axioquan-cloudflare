
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  // Disable browser source maps
  productionBrowserSourceMaps: false,
};

// Setup Cloudflare dev platform for local development only
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

export default nextConfig;





// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,

//   typescript: {
//     ignoreBuildErrors: true,
//   },

//   images: {
//     unoptimized: true,
//   },

//   // Disable browser source maps (prevents source map warnings)
//   productionBrowserSourceMaps: false,
// };

// export default nextConfig;





