import type { PropsWithChildren } from 'react';

export function MeasurementTotals({ children }: PropsWithChildren) {
  return <footer className="tw:border-t tw:border-neutral-200 tw:pt-4">{children}</footer>;
}
