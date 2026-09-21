import type { PropsWithChildren } from 'react';

export function MeasurementRow({ children }: PropsWithChildren) {
  return (
    <div className="tw:border tw:border-neutral-200 tw:bg-white tw:p-3" role="listitem">
      {children}
    </div>
  );
}
