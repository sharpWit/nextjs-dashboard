/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    ppr: "incremental",
  },
  images: {
    domains: ["https://olszbfyezfjkxvmwqlys.supabase.co"],
  },
};

export default nextConfig;
