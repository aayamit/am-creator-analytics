// Add to the top of page.tsx imports
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Counter animation hook
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!startOnView);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!isVisible) return;
    let startTime: number | null = null;
    let animationFrame: number;
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min(timestamp - startTime, duration);
      const eased = 1 - Math.pow(1 - progress / duration, 3); // ease-out cubic
      setCount(Math.floor(eased * end));
      if (progress < duration) {
        animationFrame = requestAnimationFrame(step);
      }
    };
    
    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);

  return { count, ref };
}

// Fade-in component
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const metrics = [
    { value: 500, suffix: "+", label: "Active Creators" },
    { value: 2, prefix: "$", suffix: "M+", label: "ROI Tracked" },
    { value: 73, suffix: "%", label: "Avg. ROI Lift" }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground font-sans antialiased relative overflow-hidden">
      {/* Subtle gradient orb - Bloomberg terminal glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-accent/2 to-transparent rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Bloomberg Terminal Bar */}
      <div className="border-b border-border/10 bg-foreground/[0.02] relative z-10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between font-mono text-sm">
            <div className="flex items-center gap-6">
              <span className="text-muted-foreground/60">AM CREATOR INDEX</span>
              <span><span className="text-accent font-bold">500+</span> <span className="text-muted-foreground/60">Creators</span></span>
              <span><span className="text-accent font-bold">$2M+</span> <span className="text-muted-foreground/60">ROI</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground/60 tracking-widest">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Report Style - Single Column, McKinsey Minimal */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Executive Header */}
        <FadeIn>
        <div className="py-20 md:py-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-0.5 bg-accent" />
            <span className="text-[10px] font-mono text-muted-foreground/50 tracking-widest uppercase">
              Executive Briefing • AM Creator Analytics
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-heading mb-6 leading-[0.95]">
            Stop<br />
            <span className="text-accent">Wasting</span><br />
            Ad Spend
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed">
            Replace vanity metrics with <span className="text-foreground font-semibold">verifiable, real-time data</span>. 
            Self-hosted Nango saves <span className="text-accent font-mono font-bold">$500–2000</span>/month vs paid SaaS.
          </p>

          {/* Bloomberg-Style Data Row with animated counters */}
          <div className="flex justify-between py-6 border-y border-border/8 mb-10">
            {metrics.map((metric, i) => (
              <AnimatedMetric key={i} {...metric} />
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8 h-12 text-base"
            >
              <Link href="/api/auth/signin?role=brand">
                Start Brand Trial
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="font-semibold px-8 h-12 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              <Link href="/api/auth/signin?role=creator">
                Join as Creator
              </Link>
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground/40 tracking-wide">
            No credit card • 14-day trial • Cancel anytime
          </p>
        </div>
        </FadeIn>

        {/* Problem - McKinsey Style */}
        <FadeIn delay={100}>
        <div className="py-12 border-t border-border/8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-0.5 bg-accent/50" />
            <span className="text-[10px] font-mono text-muted-foreground/50 tracking-widest uppercase">
              Market Problem
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-10">
            The Influencer Marketing Gap
          </h2>
          
          <div className="space-y-0">
            {[
              { stat: "40%", title: "Fake Followers", desc: "Industry Report 2025: Up to 40% of followers are bots or inactive accounts." },
              { stat: "63%", title: "No Attribution", desc: "Gartner 2025: 63% of brands cannot attribute campaign revenue to creators." },
              { stat: "72h", title: "Data Decay", desc: "Static media kits become stale within 72 hours of creation." }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6 py-6 border-b border-border/5 last:border-0">
                <div className="text-4xl font-bold font-mono text-accent/70">{item.stat}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </FadeIn>

        {/* Solution */}
        <FadeIn delay={200}>
        <div className="py-12 border-t border-border/8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-0.5 bg-accent/50" />
            <span className="text-[10px] font-mono text-muted-foreground/50 tracking-widest uppercase">
              Solution Architecture
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-10">
            Get Results in 4 Steps
          </h2>
          
          <div className="space-y-0">
            {[
              { step: "01", title: "Sign Up", desc: "30 seconds. No credit card required." },
              { step: "02", title: "Connect", desc: "Sync platforms via Nango API." },
              { step: "03", title: "Analyze", desc: "Real-time Bloomberg-style dashboards." },
              { step: "04", title: "Scale", desc: "Cut waste 60%+. 2x more deals." }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6 py-6 border-b border-border/5 last:border-0">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-sm flex items-center justify-center">
                  <span className="text-accent font-bold font-mono text-sm">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </FadeIn>

        {/* Benefits */}
        <FadeIn delay={300}>
        <div className="py-12 border-t border-border/8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-0.5 bg-accent/50" />
            <span className="text-[10px] font-mono text-muted-foreground/50 tracking-widest uppercase">
              Value Proposition
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-10">
            What You Get — Brands & Creators
          </h2>
          
          <div className="space-y-0">
            {[
              { num: "01", title: "Eliminate Fake Followers", stat: "60% less waste", desc: "Proprietary fraud algorithm flags bots immediately. Save 40%+ in wasted spend." },
              { num: "02", title: "Prove Real ROI", stat: "73% higher ROI", desc: "Track conversions with Bloomberg-terminal precision. Show stakeholders exactly what works." },
              { num: "03", title: "Dynamic Media Kits", stat: "2x more deals", desc: "Auto-updating dashboards sync via API. Always current, always professional." },
              { num: "04", title: "Open-Source Integration", stat: "$500+/mo saved", desc: "Self-hosted Nango replaces $2000/month SaaS tools. Full control, no lock-in." }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6 py-6 border-b border-border/5 last:border-0">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-sm flex items-center justify-center">
                  <span className="text-accent font-bold font-mono text-sm">{item.num}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <span className="text-[9px] font-mono bg-accent/10 text-accent/80 px-2 py-1">{item.stat}</span>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </FadeIn>

        {/* Testimonials */}
        <FadeIn delay={400}>
        <div className="py-12 border-t border-border/8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-0.5 bg-accent/50" />
            <span className="text-[10px] font-mono text-muted-foreground/50 tracking-widest uppercase">
              Client Testimonials
            </span>
          </div>

          <div className="space-y-8 mb-10">
            {[
              { quote: "Cut wasted spend by 60% in 3 months. Replaced our entire influencer vetting process.", author: "Sarah Chen", role: "Director of Marketing" },
              { quote: "Landed 3x more brand deals at 2x my old rates. Dynamic media kits changed everything.", author: "Marcus Rivera", role: "Tech Creator, 200K+" },
              { quote: "Saved thousands by not paying $2000/month for integrations. Nango is brilliant.", author: "Emily Watson", role: "VP of Growth" }
            ].map((item, i) => (
              <blockquote key={i} className="border-l-2 border-accent/30 pl-6 py-3">
                <p className="text-base text-muted-foreground leading-relaxed mb-4">"{item.quote}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-accent font-bold text-sm">{item.author.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.author}</p>
                    <p className="text-[10px] text-muted-foreground">{item.role}</p>
                  </div>
                </div>
              </blockquote>
            ))}
          </div>

          {/* Stats */}
          <div className="flex justify-between py-6 border-t border-border/8">
            {[
              { value: "120+", label: "Enterprise Brands" },
              { value: "500+", label: "Premium Creators" },
              { value: "98%", label: "Retention Rate" }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold font-mono text-foreground">{item.value}</div>
                <div className="text-[10px] text-muted-foreground/60 font-medium tracking-widest uppercase mt-2">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        </FadeIn>

        {/* Final CTA */}
        <FadeIn delay={500}>
        <div className="py-12 border-t border-border/8 bg-accent/[0.03] -mx-6 md:-mx-8 px-6 md:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4">
              Ready to Transform Your Strategy?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Join 500+ brands and creators. Start your 14-day free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button 
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8 h-12 text-base"
              >
                <Link href="/api/auth/signin?role=brand">
                  Start Brand Trial
                </Link>
              </Button>
              <Button 
                asChild
                size="lg"
                variant="outline"
                className="font-semibold px-8 h-12 text-base border-border/50 hover:border-accent hover:text-accent"
              >
                <Link href="/api/auth/signin?role=creator">
                  Join as Creator
                </Link>
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground/40 tracking-wide">
              No credit card • 14-day trial • Cancel anytime
            </p>
          </div>
        </div>
        </FadeIn>
      </div>
    </main>
  );
}

// Animated Metric Component
function AnimatedMetric({ value, prefix = "", suffix = "", label }: { value: number, prefix?: string, suffix?: string, label: string }) {
  const { count, ref } = useCountUp(value, 2000, true);
  
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold font-mono text-foreground">
        {prefix}{count}{suffix}
      </div>
      <div className="text-[10px] text-muted-foreground/60 font-medium tracking-widest uppercase mt-2">{label}</div>
    </div>
  );
}
