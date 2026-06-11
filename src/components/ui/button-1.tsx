"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

type GeistType = "primary" | "secondary" | "tertiary";
type GeistSize = "small" | "medium" | "large";

const typeStyles: Record<GeistType, string> = {
  primary: "bg-kharis-green-700 text-white hover:bg-kharis-green-800 shadow-sm",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200",
  tertiary: "bg-transparent text-gray-600 hover:bg-gray-100",
};

const sizeStyles: Record<GeistSize, string> = {
  small: "h-8 px-2 text-xs rounded-lg",
  medium: "h-10 px-4 text-sm rounded-xl",
  large: "h-12 px-6 text-base rounded-xl",
};

const svgOnlySizes: Record<GeistSize, string> = {
  small: "h-8 w-8 p-1.5",
  medium: "h-10 w-10 p-2",
  large: "h-12 w-12 p-3",
};

export interface Button1Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  type?: GeistType;
  size?: GeistSize;
  svgOnly?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, Button1Props>(
  ({ className, type = "secondary", size = "medium", svgOnly, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50",
          typeStyles[type],
          svgOnly ? svgOnlySizes[size] : sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
