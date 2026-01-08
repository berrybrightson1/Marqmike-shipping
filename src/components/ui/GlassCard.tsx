import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "light" | "dark";
}

export function GlassCard({ 
  children, 
  className, 
  variant = "light",
  ...props 
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border shadow-xl backdrop-blur-lg transition-all duration-300",
        variant === "light" 
          ? "bg-white/70 border-white/20" 
          : "bg-slate-900/60 border-white/10 text-white",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
