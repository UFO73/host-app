import { Badge, Button } from '../../sharedComponents';
import type { Measurement } from '../../store/slices/measurementsSlice';

type MeasurementRowProps = {
  measurement: Measurement;
  onActivate: (rowId: string) => void;
  onDeactivate: (rowId: string) => void;
};

const statusLabel: Record<Measurement['status'], string> = {
  waiting: 'Очікує',
  drawing: 'Малювання…',
  completed: 'Готово',
};

export function MeasurementRow({ measurement, onActivate, onDeactivate }: MeasurementRowProps) {
  const area = measurement.status === 'completed' ? measurement.area : undefined;
  const valueLabel = area ? `${area.value.toFixed(1)} ${area.unit}` : '-';

  return (
    <div className="tw:grid tw:gap-3 tw:border tw:border-neutral-200 tw:bg-white tw:p-3" role="listitem">
      <div className="tw:flex tw:items-start tw:justify-between tw:gap-3">
        <div className="tw:min-w-0">
          <p className="tw:text-sm tw:font-medium tw:text-neutral-950">{valueLabel}</p>
          <p className="tw:mt-1 tw:truncate tw:text-xs tw:text-neutral-500">{measurement.rowId}</p>
        </div>
        <Badge>{statusLabel[measurement.status]}</Badge>
      </div>
      {measurement.status === 'drawing' && (
        <Button className="tw:border-neutral-400 tw:bg-white tw:text-neutral-900 tw:hover:bg-neutral-100" onClick={() => onDeactivate(measurement.rowId)}>
          Скасувати
        </Button>
      )}
      {measurement.status === 'waiting' && <Button onClick={() => onActivate(measurement.rowId)}>Активувати</Button>}
    </div>
  );
}
