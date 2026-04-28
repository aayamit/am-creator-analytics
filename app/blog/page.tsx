import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, TrendingUp, BarChart3, Users } from "lucide-react";
import JsonLd from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Blog | AM Creator Analytics",
  description:
    "Insights on creator marketing, data analytics, and industry trends. Learn how to move beyond vanity metrics and build authentic partnerships.",
  openGraph: {
    title: "Blog - AM Creator Analytics",
    description: "Insights on creator marketing, data analytics, and industry trends.",
  },
};

const blogPosts = [
  {
    slug: "beyond-vanity-metrics",
    title: "Beyond Vanity Metrics: The Future of Creator Marketing",
    excerpt:
      "Why follower counts and likes are misleading indicators. Discover the metrics that actually drive ROI for brands and creators.",
    date: "2026-04-15",
    author: "Amit Kumar",
    category: "Industry Trends",
    readTime: "8 min read",
    image: "/blog/vanity-metrics.jpg",
  },
  {
    slug: "dynamic-media-kits",
    title: "Dynamic Media Kits: Replace Static PDFs with Live Data",
    excerpt:
      "Static PDF media kits are outdated the moment they're sent. Learn how API-connected dashboards transform creator partnerships.",
    date: "2026-04-08",
    author: "Amit Kumar",
    category: "Creator Tools",
    readTime: "6 min read",
    image: "/blog/media-kits.jpg",
  },
  {
    slug: "fraud-detection-algorithms",
    title: "How Our Fraud Detection Algorithm Flags Fake Followers",
    excerpt:
      "A deep dive into the proprietary algorithms we use to identify bot networks, engagement pods, and suspicious follower patterns.",
    date: "2026-04-01",
    author: "Amit Kumar",
    category: "Technology",
    readTime: "12 min read",
    image: "/blog/fraud-detection.jpg",
  },
  {
    slug: "audience-demographics",
    title: "Deep Audience Demographics: The Key to Authentic Partnerships",
    excerpt:
      "Go beyond age and gender. Learn how understanding income brackets and professional interests transforms campaign ROI.",
    date: "2026-03-25",
    author: "Amit Kumar",
    category: "Brand Strategy",
    readTime: "10 min read",
    image: "/blog/audience-demo.jpg",
  },
  {
    slug: "campaign-roi-tracking",
    title: "Campaign ROI Tracking: From Spend to Attribution",
    excerpt:
      "How to track every dollar spent and measure true campaign impact with Bloomberg-terminal precision.",
    date: "2026-03-18",
    author: "Amit Kumar",
    category: "Analytics",
    readTime: "9 min read",
    image: "/blog/roi-tracking.jpg",
  },
  {
    slug: "creator-economy-trends-2026",
    title: "Creator Economy Trends to Watch in 2026",
    excerpt:
      "From AI-generated content to regulation changes — what brands and creators need to know to stay ahead.",
    date: "2026-03-10",
    author: "Amit Kumar",
    category: "Industry Trends",
    readTime: "11 min read",
    image: "/blog/trends-2026.jpg",
  },
];

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "AM Creator Analytics Blog",
  description: "Insights on creator marketing, data analytics, and industry trends.",
  url: "https://amcreatoranalytics.com/blog",
  blogPost: blogPosts.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      name: post.author,
    },
    url: `https://amcreatoranalytics.com/blog/${post.slug}`,
  })),
};

const categories = ["All", "Industry Trends", "Creator Tools", "Technology", "Brand Strategy", "Analytics"];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={blogSchema} />

      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-heading mb-6">
              Insights & Analysis
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Expert perspectives on creator marketing, data analytics, and
              building authentic partnerships that drive real ROI.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
                className={category === "All" ? "bg-accent text-accent-foreground" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <Card
                key={post.slug}
                className="border-border/50 bg-card overflow-hidden hover:border-accent/50 transition-colors group"
              >
                {/* Image placeholder */}
                <div className="h-48 bg-muted/50 flex items-center justify-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground/30" />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="outline">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                      <span>•</span>
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-accent hover:underline flex items-center space-x-1"
                    >
                      <span>Read</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="border-t border-border bg-muted/30 py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <TrendingUp className="h-12 w-12 text-accent mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground font-heading mb-4">
            Stay Ahead of the Curve
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Subscribe to our newsletter for weekly insights on creator marketing
            trends, data analytics tips, and platform updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-border rounded-md bg-background text-foreground"
            />
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
