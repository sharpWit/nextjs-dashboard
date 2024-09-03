const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";

/** @type {import('next').NextConfig} */

const nextConfig = {
  // assetPrefix: isGitHubPages ? "https://<Account-name>/<Repository-name>" : "",
  basePath: "/nextjs-dashboard",
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
