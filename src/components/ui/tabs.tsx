import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Tabs({
  value,
  onValueChange,
  children,
  className,
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function TabsList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex border-b border-border', className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  onClick,
  isActive,
}: {
  value: string;
  children: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
        isActive
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  activeValue,
  children,
  className,
}: {
  value: string;
  activeValue: string;
  children: ReactNode;
  className?: string;
}) {
  if (value !== activeValue) return null;
  return <div className={className}>{children}</div>;
}
