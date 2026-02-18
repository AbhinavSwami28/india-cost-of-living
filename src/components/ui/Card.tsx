import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

const PADDING = { sm: "p-4", md: "p-5 sm:p-6", lg: "p-6 sm:p-8" };

export default function Card({ children, className = "", padding = "md" }: CardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${PADDING[padding]} ${className}`}>
      {children}
    </div>
  );
}
