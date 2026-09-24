import type { HTMLAttributes } from 'react';

import { colorClasses } from '../../styles/colors';

type BadgeStatus = 'waiting' | 'drawing' | 'completed';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  status?: BadgeStatus;
};

export function Badge({ children, className = '', status, ...props }: BadgeProps) {
  const colors = status ? colorClasses.status[status] : 'tw:border-blue-100 tw:bg-blue-50 tw:text-blue-600';

  return (
    <span
      className={`tw:inline-flex tw:min-h-7 tw:items-center tw:gap-2 tw:rounded-full tw:border tw:px-2.5 tw:text-xs tw:font-medium ${colors} ${className}`}
      {...props}
    >
      {status && <span className={`tw:size-2 tw:shrink-0 tw:rounded-full ${colorClasses.statusDot[status]}`} aria-hidden="true" />}
      {children}
    </span>
  );
}
