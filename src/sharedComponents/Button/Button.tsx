import type { ButtonHTMLAttributes } from 'react';

import { colorClasses } from '../../styles/colors';

type ButtonVariant = 'primary' | 'outline' | 'neutral' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: colorClasses.primaryButton,
  outline: colorClasses.outlineButton,
  neutral: colorClasses.neutralButton,
  danger: colorClasses.dangerButton,
};

export function Button({ className = '', type = 'button', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={`tw:inline-flex tw:h-9 tw:items-center tw:justify-center tw:gap-2 tw:rounded-md tw:border tw:px-3 tw:text-sm tw:font-medium tw:transition-colors tw:disabled:cursor-not-allowed tw:disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      type={type}
      {...props}
    />
  );
}
