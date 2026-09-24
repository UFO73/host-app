import { SigmaIcon } from '../../sharedComponents';
import { colorClasses } from '../../styles/colors';

type MeasurementTotalsProps = { totalsByUnit: Record<string, number> };

export function MeasurementTotals({ totalsByUnit }: MeasurementTotalsProps) {
  const totalEntries = Object.entries(totalsByUnit);
  return (
    <footer className={`tw:mt-auto tw:grid tw:grid-cols-[auto_1fr] tw:gap-x-3 tw:gap-y-2 tw:rounded-md tw:border tw:p-4 ${colorClasses.panel}`}>
      <SigmaIcon className="tw:row-span-2 tw:size-8 tw:text-blue-600" />
      <p className="tw:text-sm tw:font-semibold tw:text-neutral-900">Сума площ</p>
      <div className="tw:flex tw:flex-wrap tw:gap-x-4 tw:gap-y-1">
        {totalEntries.length ? (
          totalEntries.map(([unit, value]) => (
            <p key={unit} className="tw:text-2xl tw:font-semibold tw:text-neutral-950">
              {value.toFixed(1)} <span className="tw:text-sm">{unit}</span>
            </p>
          ))
        ) : (
          <p className="tw:text-2xl tw:font-semibold tw:text-neutral-950">0 mm²</p>
        )}
      </div>
    </footer>
  );
}
