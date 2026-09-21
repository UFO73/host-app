import { ScoringForm } from '../components/ScoringForm';
import { ViewerFrame } from '../components/ViewerFrame';
import { viewerConfig } from '../config/env';
import { AppLayout } from '../layout';

export function App() {
  return (
    <AppLayout>
      <ViewerFrame src={viewerConfig} />
      <ScoringForm />
    </AppLayout>
  );
}
