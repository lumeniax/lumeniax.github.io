import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-primary text-primary-foreground border border-primary/30 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:border-primary/60 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm border border-destructive/30 hover:shadow-md hover:border-destructive/60 hover:-translate-y-0.5 transition-all duration-300",
        outline:
          "border border-primary/30 bg-transparent text-foreground hover:bg-primary/5 hover:border-primary/60 hover:shadow-md hover:shadow-primary/10 transition-all duration-300",
        secondary:
          "bg-gradient-to-r from-secondary to-secondary text-secondary-foreground border border-secondary/30 shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 hover:border-secondary/60 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md",
        accent:
          "bg-accent text-accent-foreground border border-accent/40 shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:border-accent/70 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md",
        ghost: "border border-transparent text-foreground hover:bg-foreground/10 hover:border-foreground/20 transition-all duration-300",
        link: "text-primary underline-offset-4 hover:underline hover:text-accent transition-colors duration-300",
        premium:
          "relative bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 bg-pos-0 text-white border border-primary/50 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:bg-pos-100 hover:-translate-y-1 active:translate-y-0 font-semibold",
      },
      size: {
        default: "min-h-10 px-6 py-2.5",
        sm: "min-h-9 rounded-md px-3 text-xs",
        lg: "min-h-12 rounded-lg px-8 py-3 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
