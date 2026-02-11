import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/src/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-pill text-sm font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-petzy-coral text-white hover:bg-petzy-coral-dark shadow-soft hover:shadow-soft-lg",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-petzy-coral bg-transparent text-petzy-coral hover:bg-petzy-coral hover:text-white",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-10 md:px-12 py-3 md:py-4",
        sm: "px-6 py-2",
        lg: "px-14 py-4 md:py-5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const ShadcnButton = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
ShadcnButton.displayName = "Button"

/**
 * Legacy Button wrapper for backward compatibility
 * Old API: <Button text="Click me" type="default|outline" onClick={...} />
 * New shadcn Button uses: <Button variant="default|outline">Click me</Button>
 */
const Button = ({
  text,
  onClick,
  icon,
  className,
  type = "default",
  disabled,
  iconAlign = "right",
  ...props
}) => {
  // Map old "type" prop to new "variant" prop
  const variant = type === "default" ? "default" : type === "outline" ? "outline" : "default";

  return (
    <ShadcnButton
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {iconAlign === "left" && icon && <span className="mr-2">{icon}</span>}
      {text}
      {iconAlign !== "left" && icon && <span className="ml-2">{icon}</span>}
    </ShadcnButton>
  );
};

export default Button;
export { ShadcnButton as Button, buttonVariants };
