interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'gold';
}

const styles = {
  default: 'bg-stone-100 text-stone-700',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  gold: 'bg-amber-100 text-amber-900',
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}
