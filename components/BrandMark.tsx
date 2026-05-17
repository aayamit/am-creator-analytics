import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  alt?: string;
  className?: string;
  priority?: boolean;
  variant?: "auto" | "dark" | "light";
};

export default function BrandMark({
  alt = "AM Creator Analytics",
  className,
  priority = false,
  variant = "auto",
}: BrandMarkProps) {
  if (variant === "dark") {
    return (
      <div className={cn("relative shrink-0", className)}>
        <Image
          src="/assets/black_AM_mark.png"
          alt={alt}
          fill
          priority={priority}
          sizes="64px"
          className="object-contain"
        />
      </div>
    );
  }

  if (variant === "light") {
    return (
      <div className={cn("relative shrink-0", className)}>
        <Image
          src="/assets/white_AM_mark.png"
          alt={alt}
          fill
          priority={priority}
          sizes="64px"
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div className={cn("relative shrink-0", className)}>
      <Image
        src="/assets/black_AM_mark.png"
        alt={alt}
        fill
        priority={priority}
        sizes="64px"
        className="object-contain dark:hidden"
      />
      <Image
        src="/assets/white_AM_mark.png"
        alt={alt}
        fill
        priority={priority}
        sizes="64px"
        className="hidden object-contain dark:block"
      />
    </div>
  );
}
