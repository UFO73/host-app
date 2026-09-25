import { configureStore } from '@reduxjs/toolkit';

import { ViewerBridgeClient } from '../bridge/bridgeListeners';
import { viewerConfig } from '../config/env';
import { measurementListenerMiddleware, registerMeasurementListeners } from './measurementListeners';
import { measurementsReducer } from './slices/measurementsSlice';

export const store = configureStore({
  reducer: { measurements: measurementsReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(measurementListenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;

export const viewerBridgeClient = new ViewerBridgeClient({ viewerOrigin: viewerConfig.origin });
registerMeasurementListeners({ bridge: viewerBridgeClient, dispatch: store.dispatch });
