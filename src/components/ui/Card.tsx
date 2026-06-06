import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'success' | 'danger' | 'neutral';
}

const variants = {
  default: 'bg-white border-rpg-border',
  success: 'bg-green-50 border-success/40',
  danger: 'bg-red-50 border-danger/40',
  neutral: 'bg-stone-50 border-rpg-border',
};

export function Card({ children, className = '', onClick, variant = 'default' }: CardProps) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm ${variants[variant]} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {children}
    </div>
  );
}
