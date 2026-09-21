type SpinnerProps = {
  label?: string;
};

export function Spinner({ label = 'Loading' }: SpinnerProps) {
  return (
    <span
      className="tw:inline-block tw:size-4 tw:animate-spin tw:rounded-full tw:border-2 tw:border-current tw:border-r-transparent"
      role="status"
      aria-label={label}
    />
  );
}
