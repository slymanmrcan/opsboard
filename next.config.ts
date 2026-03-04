import type { NextConfig } from "next"

const isStaticExport = process.env.NEXT_STATIC_EXPORT === "true"
const repository = process.env.GITHUB_REPOSITORY ?? ""
const repositoryName = repository.split("/")[1] ?? ""
const isUserOrOrgPages = repositoryName.endsWith(".github.io")
const useRepositoryBasePath = Boolean(
  isStaticExport && process.env.GITHUB_ACTIONS === "true" && repositoryName && !isUserOrOrgPages
)

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: isStaticExport ? "export" : "standalone",
  images: isStaticExport ? { unoptimized: true } : undefined,
  trailingSlash: isStaticExport,
  basePath: useRepositoryBasePath ? `/${repositoryName}` : undefined,
  assetPrefix: useRepositoryBasePath ? `/${repositoryName}/` : undefined,
  ...(isStaticExport
    ? {}
    : {
        // Security headers
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                {
                  key: "X-DNS-Prefetch-Control",
                  value: "on",
                },
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
                {
                  key: "X-Frame-Options",
                  value: "SAMEORIGIN",
                },
                {
                  key: "X-Content-Type-Options",
                  value: "nosniff",
                },
                {
                  key: "X-XSS-Protection",
                  value: "1; mode=block",
                },
                {
                  key: "Referrer-Policy",
                  value: "origin-when-cross-origin",
                },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(), geolocation=()",
                },
              ],
            },
          ]
        },
      }),
}

export default nextConfig
