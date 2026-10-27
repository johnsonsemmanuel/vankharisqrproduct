"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500/70 disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-brand-700 text-white shadow-xs hover:bg-brand-800 dark:bg-brand-600 dark:text-white dark:hover:bg-brand-500",
        primary:
          "bg-brand-700 text-white shadow-xs hover:bg-brand-800 dark:bg-brand-600 dark:text-white dark:hover:bg-brand-500",
        destructive:
          "bg-red-600 text-white shadow-xs hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-500",
        outline:
          "border border-neutral-300 bg-white text-neutral-800 shadow-xs hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 dark:hover:text-white",
        secondary:
          "bg-brand-50 text-brand-800 border border-brand-200 shadow-xs hover:bg-brand-100 dark:bg-brand-900 dark:text-brand-100 dark:border-brand-700 dark:hover:bg-brand-800",
        ghost:
          "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-white",
        link: "text-brand-700 underline-offset-4 hover:underline dark:text-brand-400",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-lg px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
