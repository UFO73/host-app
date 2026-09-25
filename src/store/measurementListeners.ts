import { createListenerMiddleware, type Dispatch } from '@reduxjs/toolkit';

import type { ViewerBridgeClient } from '../bridge/bridgeListeners';
import { BridgeMessageType } from '../bridge/constants';
import {
  measurementActivationRequested,
  measurementAddedReceived,
  measurementCancelled,
  measurementCancellationRequested,
  measurementDeleted,
  measurementDeletionRequested,
  measurementDrawingStarted,
  measurementFocusRequested,
  measurementUpdatedReceived,
} from './slices/measurementsSlice';

export const measurementListenerMiddleware = createListenerMiddleware();

type MeasurementListenersOptions = {
  bridge: ViewerBridgeClient;
  dispatch: Dispatch;
};

export function registerMeasurementListeners({ bridge, dispatch }: MeasurementListenersOptions) {
  measurementListenerMiddleware.startListening({
    actionCreator: measurementActivationRequested,
    effect: ({ payload }) => {
      dispatch(measurementDrawingStarted({ rowId: payload.rowId }));
      bridge.activateTool(payload);
    },
  });

  measurementListenerMiddleware.startListening({
    actionCreator: measurementCancellationRequested,
    effect: ({ payload }) => {
      bridge.deactivateTool(payload);
      dispatch(measurementCancelled(payload));
    },
  });

  measurementListenerMiddleware.startListening({
    actionCreator: measurementFocusRequested,
    effect: ({ payload }) => bridge.focusMeasurement(payload),
  });

  measurementListenerMiddleware.startListening({
    actionCreator: measurementDeletionRequested,
    effect: ({ payload }) => bridge.deleteMeasurement(payload),
  });

  bridge.subscribe((message) => {
    switch (message.type) {
      case BridgeMessageType.MEASUREMENT_ADDED:
        dispatch(measurementAddedReceived(message.payload));
        break;
      case BridgeMessageType.MEASUREMENT_UPDATED:
        dispatch(measurementUpdatedReceived(message.payload));
        break;
      case BridgeMessageType.MEASUREMENT_REMOVED:
        dispatch(measurementDeleted({ rowId: message.payload.rowId }));
        break;
    }
  });
}
