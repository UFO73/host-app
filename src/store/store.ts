import { configureStore } from '@reduxjs/toolkit';

import { ViewerBridgeClient } from '../bridge/bridgeListeners';
import { viewerConfig } from '../config/env';
import { measurementListenerMiddleware, registerMeasurementListeners } from './measurementListeners';
import { loadMeasurements, saveMeasurements } from './measurementStorage';
import { measurementsReducer } from './slices/measurementsSlice';

export const store = configureStore({
  reducer: { measurements: measurementsReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(measurementListenerMiddleware.middleware),
  preloadedState: { measurements: loadMeasurements() },
});

export type AppDispatch = typeof store.dispatch;

export const viewerBridgeClient = new ViewerBridgeClient({ viewerOrigin: viewerConfig.origin });
registerMeasurementListeners({ bridge: viewerBridgeClient, dispatch: store.dispatch });

store.subscribe(() => saveMeasurements(store.getState().measurements));
