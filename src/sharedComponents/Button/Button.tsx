import type { ButtonHTMLAttributes } from 'react';

import { colorClasses } from '../../styles/colors';

type ButtonVariant = 'primary' | 'outline' | 'neutral' | 'danger';
type ButtonSize = 'default' | 'compact';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: colorClasses.primaryButton,
  outline: colorClasses.outlineButton,
  neutral: colorClasses.neutralButton,
  danger: colorClasses.dangerButton,
};

const sizeClasses: Record<ButtonSize, string> = {
  default: 'tw:gap-2 tw:px-3',
  compact: 'tw:gap-1.5 tw:px-2',
};

export function Button({ className = '', size = 'default', type = 'button', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={`tw:inline-flex tw:h-9 tw:items-center tw:justify-center tw:rounded-md tw:border tw:text-sm tw:font-medium tw:transition-colors tw:[&_svg]:shrink-0 tw:disabled:cursor-not-allowed tw:disabled:opacity-50 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      type={type}
      {...props}
    />
  );
}
