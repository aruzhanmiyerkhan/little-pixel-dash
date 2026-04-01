import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "danger";
  size?: "sm" | "md" | "lg";
}

const variantClasses = {
  primary: "bg-primary text-primary-foreground hover:brightness-125 neon-box",
  secondary: "bg-secondary text-secondary-foreground hover:brightness-125",
  accent: "bg-accent text-accent-foreground hover:brightness-125",
  danger: "bg-destructive text-destructive-foreground hover:brightness-125",
};

const sizeClasses = {
  sm: "px-3 py-2 text-[8px]",
  md: "px-6 py-3 text-[10px]",
  lg: "px-8 py-4 text-xs",
};

const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "font-pixel pixel-border uppercase tracking-wider transition-all active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
PixelButton.displayName = "PixelButton";

export default PixelButton;
