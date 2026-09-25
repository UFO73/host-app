import type { PropsWithChildren } from 'react';

import { DocumentIcon, ListIcon } from '../../sharedComponents';
import { colorClasses } from '../../styles/colors';

type MeasurementListProps = PropsWithChildren<{ count: number }>;

export function MeasurementList({ children, count }: MeasurementListProps) {
  return (
    <section className="tw:grid tw:gap-3" aria-labelledby="measurement-list-title">
      <header className="tw:flex tw:items-center tw:gap-2">
        <ListIcon className="tw:size-5 tw:text-neutral-600" />
        <h2 id="measurement-list-title" className="tw:text-base tw:font-semibold tw:text-neutral-900">
          Список вимірювань
        </h2>
        <span className="tw:flex tw:size-7 tw:items-center tw:justify-center tw:rounded-full tw:bg-blue-50 tw:text-sm tw:font-semibold tw:text-blue-600">
          {count}
        </span>
      </header>

      {count === 0 ? (
        <div className={`tw:grid tw:min-h-48 tw:place-items-center tw:rounded-md tw:border tw:p-6 tw:text-center ${colorClasses.panel}`}>
          <div>
            <DocumentIcon className="tw:mx-auto tw:size-12 tw:text-neutral-500" />
            <p className="tw:mt-3 tw:font-semibold tw:text-neutral-900">Ще немає вимірювань</p>
            <p className="tw:mt-1 tw:text-sm tw:leading-5 tw:text-neutral-500">Натисніть “Додати вимірювання”, щоб створити перший рядок</p>
          </div>
        </div>
      ) : (
        <div className="tw:overflow-hidden tw:rounded-md tw:border tw:border-neutral-200">
          <table className="tw:w-full tw:table-fixed tw:border-collapse tw:bg-white tw:text-left tw:text-xs">
            <thead className="tw:bg-neutral-50 tw:text-neutral-600">
              <tr>
                <th className="tw:w-[15%] tw:px-2 tw:py-3 tw:font-semibold tw:sm:w-[15%]">Назва</th>
                <th className="tw:w-[23%] tw:px-2 tw:py-3 tw:font-semibold tw:sm:w-[20%]">Статус</th>
                <th className="tw:w-[14%] tw:px-2 tw:py-3 tw:font-semibold tw:sm:w-[12%]">
                  <span className="tw:sm:hidden">Знач.</span>
                  <span className="tw:hidden tw:sm:inline">Значення</span>
                </th>
                <th className="tw:hidden tw:w-[11%] tw:px-2 tw:py-3 tw:font-semibold tw:sm:table-cell">Одиниці</th>
                <th className="tw:w-[40%] tw:px-2 tw:py-3 tw:font-semibold tw:sm:w-[35%]">Дії</th>
              </tr>
            </thead>
            <tbody>{children}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}
