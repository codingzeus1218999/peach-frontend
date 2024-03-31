/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

// const ContentSecurityPolicy = `
//   default-src 'self';
//   script-src 'self' 'unsafe-inline';
//   style-src 'self' 'unsafe-inline';
//   font-src 'self' https://fonts.googleapis.com;
//   object-src 'none'
// `;

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
  i18n,
  compiler: {
    emotion: true,
  },
  transpilePackages: ["@mui/material/"],
  env: {
    NEXT_PUBLIC_SETTINGS: process.env.NEXT_PUBLIC_SETTINGS,
    NEXT_PUBLIC_API_BASEURL: process.env.NEXT_PUBLIC_API_BASEURL,
    NEXT_PUBLIC_MAXIMUM_ACTIVE_UPLOADS: process.env.NEXT_PUBLIC_MAXIMUM_ACTIVE_UPLOADS
  },
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
    "@mui/lab": {
      transform: "@mui/lab/{{member}}",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // {
          //   key: "Content-Security-Policy",
          //   value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
          // },
        ],
      },
    ];
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({ ...nextConfig });
