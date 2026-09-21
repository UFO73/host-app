import type { PropsWithChildren } from 'react';

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <main className="tw:grid tw:min-h-dvh tw:bg-white tw:text-neutral-950 tw:lg:h-dvh tw:lg:grid-cols-[minmax(0,1fr)_22rem] tw:lg:overflow-hidden">
      {children}
    </main>
  );
}
