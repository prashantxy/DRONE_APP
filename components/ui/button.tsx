"use client"
import * as React from "react";
import { cn } from "./lib/utils"; // Assuming you have a utility for classNames

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "outline";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, variant = "default", ...props }, ref) => {
    // Render a button element by default, but support asChild for other components
    const Component = asChild ? "span" : "button";
    return (
      <Component
        ref={ref}
        className={cn(
          "px-4 py-2 rounded text-white font-semibold transition",
          variant === "outline" ? "border border-white bg-transparent" : "bg-blue-500 hover:bg-blue-600",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };