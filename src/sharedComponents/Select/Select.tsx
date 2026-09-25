import type { SelectHTMLAttributes } from 'react';

import { ChevronDownIcon } from '../Icons';

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: readonly SelectOption[];
};

export function Select({ className = '', label, options, ...props }: SelectProps) {
  return (
    <label className="tw:grid tw:gap-2 tw:text-sm tw:font-medium tw:text-neutral-700">
      {label}
      <span className="tw:relative">
        <select
          className={`tw:h-11 tw:w-full tw:appearance-none tw:rounded-md tw:border tw:border-neutral-300 tw:bg-white tw:pr-10 tw:pl-3 tw:text-sm tw:text-neutral-900 tw:outline-none tw:focus:border-blue-500 ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="tw:pointer-events-none tw:absolute tw:top-1/2 tw:right-4 tw:size-4 tw:-translate-y-1/2 tw:text-neutral-900" />
      </span>
    </label>
  );
}
