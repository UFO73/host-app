import { createAction, createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type MeasurementArea = { value: number; unit: string };

export type Measurement =
  | { status: 'waiting'; rowId: string }
  | { status: 'drawing'; rowId: string }
  | {
      status: 'completed';
      rowId: string;
      annotationId: string;
      area: MeasurementArea;
    };

export type MeasurementResult = {
  rowId: string;
  annotationId: string;
  area: MeasurementArea;
};

export type MeasurementsState = { rows: Measurement[] };
const initialState: MeasurementsState = { rows: [] };

const measurementsSlice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    measurementAddedRequested: {
      reducer(state, action: PayloadAction<{ rowId: string }>) {
        state.rows.push({ status: 'waiting', rowId: action.payload.rowId });
      },
      prepare() {
        return { payload: { rowId: crypto.randomUUID() } };
      },
    },
    measurementDrawingStarted(state, action: PayloadAction<{ rowId: string }>) {
      state.rows = state.rows.map((row) => {
        if (row.rowId === action.payload.rowId && row.status === 'waiting') {
          return { status: 'drawing', rowId: row.rowId };
        }

        if (row.status === 'drawing') {
          return { status: 'waiting', rowId: row.rowId };
        }

        return row;
      });
    },
    measurementCancelled(state, action: PayloadAction<{ rowId: string }>) {
      state.rows = state.rows.map((row) => (row.rowId === action.payload.rowId && row.status === 'drawing' ? { status: 'waiting', rowId: row.rowId } : row));
    },
    measurementAddedReceived(state, action: PayloadAction<MeasurementResult>) {
      state.rows = state.rows.map((row) => (row.rowId === action.payload.rowId && row.status === 'drawing' ? { status: 'completed', ...action.payload } : row));
    },
    measurementUpdatedReceived(state, action: PayloadAction<MeasurementResult>) {
      state.rows = state.rows.map((row) =>
        row.rowId === action.payload.rowId && row.status === 'completed' && row.annotationId === action.payload.annotationId
          ? { status: 'completed', ...action.payload }
          : row,
      );
    },
  },
});

export const { measurementAddedReceived, measurementAddedRequested, measurementCancelled, measurementDrawingStarted, measurementUpdatedReceived } =
  measurementsSlice.actions;

export const measurementActivationRequested = createAction<{ rowId: string }>('measurements/measurementActivationRequested');
export const measurementCancellationRequested = createAction<{ rowId: string }>('measurements/measurementCancellationRequested');
export const measurementsReducer = measurementsSlice.reducer;

type MeasurementsRootState = { measurements: MeasurementsState };
export const selectMeasurements = (state: MeasurementsRootState) => state.measurements.rows;
export const selectTotalsByUnit = createSelector([selectMeasurements], (measurements) =>
  measurements.reduce<Record<string, number>>((totals, measurement) => {
    if (measurement.status === 'completed') {
      const { unit, value } = measurement.area;
      totals[unit] = (totals[unit] ?? 0) + value;
    }
    return totals;
  }, {}),
);
