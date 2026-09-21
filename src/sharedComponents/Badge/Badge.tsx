import type { HTMLAttributes } from 'react';

export function Badge({ className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`tw:inline-flex tw:min-h-6 tw:items-center tw:border tw:border-neutral-300 tw:bg-neutral-100 tw:px-2 tw:text-xs tw:font-medium tw:text-neutral-700 ${className}`}
      {...props}
    />
  );
}
