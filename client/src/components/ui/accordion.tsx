"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/src/lib/utils"

// --- Standard Shadcn Accordion Components ---

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

// --- Legacy Wrapper ---

interface FAQItem {
  question: string;
  answer: string; // Assuming based on usage
}

interface LegacyAccordionProps {
  items: FAQItem[];
  className?: string;
  type?: "single" | "multiple"; // Radix requires type
  collapsible?: boolean;
}

const LegacyAccordionWrapper = ({ items, className, ...props }: LegacyAccordionProps) => {
    // Legacy mapping: items -> AccordionItem
    // Legacy didn't have type prop, so default to standard behavior (multiple open allowed? Legacy code: useState<Set> means multiple allowed).
    // Radix default type="single" unless specified "multiple". 
    // Legacy implementation: toggleItem adds/removes from Set, so MULTIPLE is default.
    return (
        <Accordion type="multiple" className={className} {...props}>
            {items.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent> 
                </AccordionItem>
            ))}
        </Accordion>
    )
}

// Default export wrapper
const AccordionWrapper = (props: (React.ComponentProps<typeof AccordionPrimitive.Root> & { items?: FAQItem[] }) | { items: FAQItem[], className?: string }) => {
    if ('items' in props && props.items) {
        return <LegacyAccordionWrapper {...(props as any)} />
    }
    // Cast to any to avoid strict type checking on 'type' which is required for Root but handled by spreading
    return <AccordionPrimitive.Root {...(props as any)} />
}

export {
  AccordionWrapper as Accordion, 
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
}

export default AccordionWrapper
