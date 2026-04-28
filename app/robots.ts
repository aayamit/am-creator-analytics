import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/features", "/pricing", "/contact", "/blog"],
        disallow: [
          "/dashboard",
          "/api",
          "/auth",
          "/notifications",
          "/settings",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: ["/dashboard", "/api", "/auth"],
      },
    ],
    sitemap: "https://amcreatoranalytics.com/sitemap.xml",
  };
}
