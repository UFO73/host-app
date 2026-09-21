import type { ButtonHTMLAttributes } from 'react';

export function Button({ className = '', type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`tw:inline-flex tw:h-9 tw:items-center tw:justify-center tw:border tw:border-neutral-900 tw:bg-neutral-900 tw:px-3 tw:text-sm tw:font-medium tw:text-white tw:transition-colors tw:hover:bg-neutral-700 tw:disabled:cursor-not-allowed tw:disabled:opacity-50 ${className}`}
      type={type}
      {...props}
    />
  );
}
