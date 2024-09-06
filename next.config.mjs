/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "server",
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
