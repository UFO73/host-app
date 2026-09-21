import type { PropsWithChildren } from 'react';

export function MeasurementList({ children }: PropsWithChildren) {
  return (
    <div className="tw:grid tw:gap-3" role="list">
      {children}
    </div>
  );
}
