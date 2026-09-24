import { useDispatch, useSelector } from 'react-redux';

import { Badge, Button } from '../../sharedComponents';
import {
  measurementActivationRequested,
  measurementAddedRequested,
  measurementCancellationRequested,
  selectMeasurements,
  selectTotalsByUnit,
} from '../../store/slices/measurementsSlice';
import type { AppDispatch } from '../../store/store';
import { MeasurementList } from '../MeasurementList';
import { MeasurementRow } from '../MeasurementRow';
import { MeasurementTotals } from '../MeasurementTotals';

export function ScoringForm() {
  const dispatch = useDispatch<AppDispatch>();
  const measurements = useSelector(selectMeasurements);
  const totalsByUnit = useSelector(selectTotalsByUnit);

  return (
    <aside
      className="tw:flex tw:min-h-64 tw:flex-col tw:gap-5 tw:border-t tw:border-neutral-200 tw:bg-neutral-50 tw:p-5 tw:lg:min-h-0 tw:lg:overflow-y-auto tw:lg:border-t-0 tw:lg:border-l"
      aria-labelledby="scoring-form-title"
    >
      <header className="tw:flex tw:items-start tw:justify-between tw:gap-3">
        <h1 id="scoring-form-title" className="tw:text-lg tw:font-semibold">
          Scoring Form
        </h1>
        <Badge>{measurements.length}</Badge>
      </header>
      <Button onClick={() => dispatch(measurementAddedRequested())}>+ Додати вимірювання</Button>
      <MeasurementList>
        {measurements.map((measurement) => (
          <MeasurementRow
            key={measurement.rowId}
            measurement={measurement}
            onActivate={(rowId) => dispatch(measurementActivationRequested({ rowId }))}
            onDeactivate={(rowId) => dispatch(measurementCancellationRequested({ rowId }))}
          />
        ))}
      </MeasurementList>
      <MeasurementTotals totalsByUnit={totalsByUnit} />
    </aside>
  );
}
