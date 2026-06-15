import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't let the bundler inline the Prisma client. It's required fresh from
  // node_modules at runtime, so a `prisma generate` (e.g. after adding the
  // Bookmark / HomeBanner / RolePermission / SiteConfig / RevokedToken models)
  // is picked up without a stale build-cache copy missing the new models.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg"],
};

export default nextConfig;
