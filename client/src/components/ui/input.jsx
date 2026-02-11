import * as React from "react"

import { cn } from "@/src/lib/utils"

const Input = React.forwardRef(({ className, type, error, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full rounded-3xl border-2 border-input bg-white px-4 md:px-6 py-3 md:py-4 text-sm md:text-base shadow-soft ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-petzy-slate-light/50 focus-visible:outline-none focus-visible:border-petzy-coral focus-visible:ring-2 focus-visible:ring-petzy-coral/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
        error && "border-destructive focus-visible:ring-destructive/20",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
export default Input
