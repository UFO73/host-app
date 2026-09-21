import type { ViewerFrameProps } from './ViewerFrame.types';

export function ViewerFrame({ src }: ViewerFrameProps) {
  return (
    <section className="tw:relative tw:min-h-[60dvh] tw:bg-neutral-950 tw:lg:min-h-0">
      <iframe
        className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:border-0"
        src={src}
        title="Medical image viewer"
        allow="clipboard-read; clipboard-write; fullscreen"
        allowFullScreen
      />
    </section>
  );
}
