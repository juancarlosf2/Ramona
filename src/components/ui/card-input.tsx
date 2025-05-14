"use client";

import * as React from "react";
import { cn } from "~/lib/utils";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface CardInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label: string;
  error?: string;
}

export function CardInput({
  className,
  icon,
  label,
  id,
  error,
  required,
  ...props
}: CardInputProps) {
  const inputId = React.useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <Input
          id={inputId}
          className={cn(
            icon && "pl-10",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
