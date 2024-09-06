/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
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
