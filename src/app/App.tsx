import { useCallback, useEffect } from 'react';

import { ScoringForm } from '../components/ScoringForm';
import { ViewerFrame } from '../components/ViewerFrame';
import { viewerConfig } from '../config/env';
import { AppLayout } from '../layout';
import { viewerBridgeClient } from '../store/store';

export function App() {
  useEffect(() => {
    viewerBridgeClient.connect();
    return () => viewerBridgeClient.disconnect();
  }, []);

  const handleViewerWindow = useCallback((viewerWindow: Window | null) => {
    viewerBridgeClient.setViewerWindow(viewerWindow);
  }, []);

  return (
    <AppLayout>
      <ViewerFrame src={viewerConfig.url} onViewerWindow={handleViewerWindow} />
      <ScoringForm />
    </AppLayout>
  );
}
