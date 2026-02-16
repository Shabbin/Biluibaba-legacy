"use client"

import React, { ComponentProps } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/src/lib/utils"


const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        custom: ""
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        xl: "h-12 px-10 text-base"
      },
      pill: {
        true: "rounded-full",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      pill: false
    },
  }
)

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  type?: "submit" | "reset" | "button" | "default" | "outline" | "custom" | string
  text?: React.ReactNode
  icon?: React.ReactNode
  iconAlign?: "left" | "right"
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, pill, asChild = false, text, icon, iconAlign = "right", loading, type, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    let finalVariant: VariantProps<typeof buttonVariants>["variant"] = variant
    let finalType: any = type

    // Legacy "type" as style handling
    if (!variant && (type === "default" || type === "outline" || type === "custom")) {
       finalVariant = type as any
       finalType = "button"
    } else if (!finalType && !asChild) {
       finalType = "button"
    }

    // Attempt to detect if it's a valid HTML type, otherwise default to "button"
    if (finalType !== "submit" && finalType !== "reset" && finalType !== "button") {
        finalType = "button"
    }

    const renderChildren = () => {
       if (asChild) return children
       
       if (!text && !icon && !loading) return children

       return (
         <>
           {iconAlign === "left" && (loading ? <Loader2 className="animate-spin" /> : icon)}
           {loading && iconAlign !== "left" && <Loader2 className="animate-spin" />}
           {!loading && iconAlign !== "left" && iconAlign === "right" && loading && null} 
           
           {/* Complex loading logic simplification: */}
           {/* If loading and no icon, show spinner left. If icon, replace icon with spinner or show next to it? */}
           {/* Let's simplify: Standard shadcn button usually shows spinner on left. */}
           
           {/* Rewriting render logic for clarity */}
         </>
       )
    }

    const content = (
         <>
           {/* Left side */}
           {loading && iconAlign === "left" ? <Loader2 className="animate-spin" /> : (iconAlign === "left" && icon)}
           
           {/* Text content */}
           {text ? text : children}

           {/* Right side */}
           {loading && iconAlign !== "left" ? <Loader2 className="animate-spin" /> : (iconAlign !== "left" && icon)}
         </>
    )

    return (
      <Comp
        className={cn(
            buttonVariants({ variant: finalVariant, size, pill, className }),
            // Add legacy pill class support if 'rounded-pill' is in className? No, use pill variant if needed, 
            // but for now, rely on standard shadcn look unless we want to map legacy classes.
            // The legacy button had 'rounded-pill'. Let's assume we want to keep that look if possible, 
            // but 'pill' variant is added above.
            // If the user passes className="rounded-pill", tailwind-merge might handle it if defined, 
            // but standard tailwind is 'rounded-full'.
        )}
        ref={ref}
        type={asChild ? undefined : finalType}
        disabled={props.disabled || loading}
        {...props}
      >
        {asChild ? children : content}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
