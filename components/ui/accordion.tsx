"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Renders a Radix Accordion root element and forwards all received props to it.
 *
 * @param props - Props accepted by `AccordionPrimitive.Root`; all props are passed through to the underlying root element.
 * @returns The rendered Accordion root element with a `data-slot="accordion"` attribute.
 */
function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

/**
 * Renders a styled Accordion item wrapper around Radix's AccordionPrimitive.Item.
 *
 * @param className - Optional additional CSS classes to merge with the default "border-b last:border-b-0" styles.
 * @returns The configured Accordion item element with a `data-slot="accordion-item"` attribute and merged class names.
 */
function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  )
}

/**
 * Renders an accordion trigger wrapped in a header and includes a chevron icon that rotates when open.
 *
 * @param className - Additional CSS classes to merge with the component's default classes
 * @param children - Content displayed inside the trigger (typically the trigger label)
 * @returns The rendered Accordion trigger element with built-in styling and open/close indicator
 */
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

/**
 * Render an accordion content panel that animates on open/close and wraps children with vertical padding.
 *
 * @param className - Additional class names applied to the inner content wrapper
 * @param children - Elements to display inside the accordion content
 * @returns The rendered AccordionPrimitive.Content element containing the provided children
 */
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }