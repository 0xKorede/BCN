import React, { forwardRef } from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
  id: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, error, id, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        <label
          htmlFor={id}
          className="block text-xs sm:text-sm font-medium text-[#EAE6DF] tracking-wide"
        >
          {label}
        </label>
        <div className="relative flex items-center">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-bcn-orange/70 pointer-events-none transition-colors group-focus-within:text-bcn-orange">
            <Icon className="w-5 h-5" />
          </div>
          <input
            ref={ref}
            id={id}
            className={`w-full bg-[#1A1A1A] text-[#F5F1E8] placeholder-[#8C857B] text-sm sm:text-base rounded-xl pl-11 pr-4 py-3.5 border border-[#2A2A2A] transition-all duration-200 outline-none focus:border-bcn-orange focus:ring-2 focus:ring-bcn-orange/30 ${
              error ? "border-bcn-burgundy focus:border-bcn-burgundy focus:ring-bcn-burgundy/30" : ""
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs font-medium text-[#FF5533] mt-1 flex items-center gap-1.5 animate-fadeIn">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5533] inline-block" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
