"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Renders a styled avatar root element and forwards all props to Radix's AvatarPrimitive.Root.
 *
 * @param className - Additional CSS class names to merge with the component's default avatar classes
 * @param props - Other props are forwarded to the underlying AvatarPrimitive.Root
 * @returns The configured AvatarPrimitive.Root element
 */
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

/**
 * Renders an avatar image element with default square sizing and forwarded props.
 *
 * @param className - Additional CSS classes to append to the default image classes.
 * @param props - Remaining props forwarded to the underlying AvatarPrimitive.Image component.
 * @returns The AvatarPrimitive.Image element with composed classes and forwarded props.
 */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

/**
 * Renders a circular fallback avatar used when the avatar image is unavailable.
 *
 * @returns A React element displaying centered fallback content inside a circular, muted background.
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };