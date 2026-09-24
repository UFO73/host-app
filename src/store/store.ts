import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { ViewerBridgeClient } from '../bridge/bridgeListeners';
import { BridgeMessageType } from '../bridge/constants';
import { viewerConfig } from '../config/env';
import { MeasurementFlow } from './MeasurementFlow';
import { measurementActivationRequested, measurementCancellationRequested, measurementsReducer } from './slices/measurementsSlice';

const listenerMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer: { measurements: measurementsReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;

export const viewerBridgeClient = new ViewerBridgeClient({ viewerOrigin: viewerConfig.origin });
const measurementFlow = new MeasurementFlow({ bridge: viewerBridgeClient, dispatch: store.dispatch });

listenerMiddleware.startListening({
  actionCreator: measurementActivationRequested,
  effect: (action) => measurementFlow.activate(action.payload.rowId),
});

listenerMiddleware.startListening({
  actionCreator: measurementCancellationRequested,
  effect: (action) => measurementFlow.cancel(action.payload.rowId),
});

viewerBridgeClient.subscribe((message) => {
  if (message.type === BridgeMessageType.MEASUREMENT_ADDED) {
    measurementFlow.handleMeasurementAdded(message.payload);
  }

  if (message.type === BridgeMessageType.MEASUREMENT_UPDATED) {
    measurementFlow.handleMeasurementUpdated(message.payload);
  }
});
