/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
  experimental: {
    ppr: "incremental",
  },
  images: {
    domains: ["https://olszbfyezfjkxvmwqlys.supabase.co"],
  },
};

export default nextConfig;
