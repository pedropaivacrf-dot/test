import type React from "react"
// Additional button variant for consistent styling
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VariantButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive"
}

export const VariantButton = ({ className, ...props }: VariantButtonProps) => {
  return <Button className={cn("transition-all", className)} {...props} />
}
