import { useCallback, useRef } from 'react';

import type { ViewerFrameProps } from './ViewerFrame.types';

export function ViewerFrame({ src, onViewerWindow }: ViewerFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const setIframeElement = useCallback(
    (element: HTMLIFrameElement | null) => {
      iframeRef.current = element;
      onViewerWindow?.(element?.contentWindow ?? null);
    },
    [onViewerWindow],
  );

  const publishViewerWindow = useCallback(() => {
    onViewerWindow?.(iframeRef.current?.contentWindow ?? null);
  }, [onViewerWindow]);

  return (
    <section className="tw:relative tw:min-h-[60dvh] tw:bg-neutral-950 tw:lg:min-h-0">
      <iframe
        ref={setIframeElement}
        className="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:border-0"
        src={src}
        title="Переглядач медичних зображень"
        allow="clipboard-read; clipboard-write; fullscreen"
        allowFullScreen
        onLoad={publishViewerWindow}
      />
    </section>
  );
}
