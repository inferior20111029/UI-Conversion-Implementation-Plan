import { Button } from "./button";
import { ArrowRight } from "lucide-react";

interface ActionCTAProps {
  primaryText: string;
  secondaryText?: string;
  onClick: () => void;
  variant?: "default" | "success" | "premium";
  size?: "default" | "lg" | "xl";
  icon?: React.ReactNode;
}

export function ActionCTA({
  primaryText,
  secondaryText,
  onClick,
  variant = "default",
  size = "lg",
  icon,
}: ActionCTAProps) {
  const variantStyles = {
    default: "bg-[#4CAF50] hover:bg-[#45a049] text-white shadow-lg hover:shadow-xl",
    success: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl",
    premium: "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl",
  };

  const sizeStyles = {
    default: "h-10 px-6",
    lg: "h-12 px-8 text-base",
    xl: "h-14 px-10 text-lg",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={onClick}
        className={`${variantStyles[variant]} ${sizeStyles[size]} transition-all duration-200 transform hover:scale-105 font-semibold`}
      >
        {primaryText}
        {icon || <ArrowRight className="w-5 h-5 ml-2" />}
      </Button>
      
      {secondaryText && (
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          {secondaryText}
        </p>
      )}
    </div>
  );
}
