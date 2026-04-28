import Link from "next/link";
import { BarChart3 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/10 py-6">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold">AM Creator Analytics</span>
          </div>
          <p className="text-[10px] text-muted-foreground/40 font-mono">
            © {new Date().getFullYear()} • Bloomberg × McKinsey Executive Style • Open-Source Powered
          </p>
        </div>
      </div>
    </footer>
  );
}
