import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-bcn-orange/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer";

  const sizeStyles = {
    sm: "px-4 py-2 text-xs sm:text-sm",
    md: "px-6 py-3 text-sm sm:text-base",
    lg: "px-8 py-4 text-base sm:text-lg font-bold",
  };

  const variantStyles = {
    primary:
      "bg-bcn-gradient text-bcn-black shadow-[0_4px_20px_rgba(255,132,0,0.35)] hover:shadow-[0_6px_28px_rgba(255,132,0,0.5)] hover:opacity-95 font-bold",
    secondary:
      "border-2 border-bcn-orange text-bcn-orange bg-transparent hover:bg-bcn-orange/10 hover:border-bcn-amber hover:text-bcn-amber shadow-[0_2px_12px_rgba(255,132,0,0.1)]",
    outline:
      "border border-bcn-orange/60 text-bcn-orange bg-black/50 backdrop-blur-sm hover:border-bcn-orange hover:bg-bcn-orange/10",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
