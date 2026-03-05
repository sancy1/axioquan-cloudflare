/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Required for proper Docker/Render deployment
  output: 'standalone',

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  productionBrowserSourceMaps: false,
};

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





