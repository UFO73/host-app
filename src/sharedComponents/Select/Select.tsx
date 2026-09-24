import type { SelectHTMLAttributes } from 'react';

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: SelectOption[];
};

export function Select({ className = '', label, options, ...props }: SelectProps) {
  return (
    <label className="tw:grid tw:gap-2 tw:text-sm tw:font-medium tw:text-neutral-700">
      {label}
      <select
        className={`tw:h-11 tw:w-full tw:rounded-md tw:border tw:border-neutral-300 tw:bg-white tw:px-3 tw:text-sm tw:text-neutral-900 tw:outline-none tw:focus:border-blue-500 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
