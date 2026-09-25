import type { MeasurementsState } from './slices/measurementsSlice';

const STORAGE_KEY = 'scoring-form-measurements';
const emptyState: MeasurementsState = { rows: [] };

export function loadMeasurements(): MeasurementsState {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    if (!value) return emptyState;

    const state = JSON.parse(value) as MeasurementsState;
    return {
      rows: state.rows.map((row) => (row.status === 'drawing' ? { status: 'waiting', rowId: row.rowId, toolName: row.toolName } : row)),
    };
  } catch {
    return emptyState;
  }
}

export function saveMeasurements(state: MeasurementsState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
