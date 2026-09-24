export const colorClasses = {
  primaryButton: 'tw:border-blue-600 tw:bg-blue-600 tw:text-white tw:hover:bg-blue-700',
  outlineButton: 'tw:border-blue-200 tw:bg-white tw:text-blue-600 tw:hover:bg-blue-50',
  neutralButton: 'tw:border-neutral-300 tw:bg-white tw:text-neutral-800 tw:hover:bg-neutral-100',
  dangerButton: 'tw:border-red-300 tw:bg-white tw:text-red-600 tw:hover:bg-red-50',
  panel: 'tw:border-blue-100 tw:bg-blue-50/40',
  status: {
    waiting: 'tw:border-blue-200 tw:bg-blue-50 tw:text-blue-700',
    drawing: 'tw:border-amber-200 tw:bg-amber-50 tw:text-amber-800',
    completed: 'tw:border-emerald-200 tw:bg-emerald-50 tw:text-emerald-700',
  },
  statusDot: {
    waiting: 'tw:bg-blue-500',
    drawing: 'tw:bg-amber-400',
    completed: 'tw:bg-emerald-500',
  },
} as const;
