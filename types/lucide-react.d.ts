import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { SVGProps } from 'react';

type LucideIcon = ForwardRefExoticComponent<
  Partial<SVGProps<SVGSVGElement>> & RefAttributes<SVGSVGElement>
>;

export const Instagram: LucideIcon;
export const Twitter: LucideIcon;
export const Facebook: LucideIcon;
export const Youtube: LucideIcon;
export const Linkedin: LucideIcon;
export const X: LucideIcon;

// Re-export all other exports from lucide-react
export * from 'lucide-react';
