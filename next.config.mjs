/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",
  experimental: {
    ppr: "incremental",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "olszbfyezfjkxvmwqlys.supabase.co",
      },
    ],
  },
};

export default nextConfig;
