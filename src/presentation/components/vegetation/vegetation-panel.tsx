import { useMemo, useState } from 'react';
import type { PointFilters } from '@/domain/entities/vegetation-monitoring.entity';
import { ConditionSummary } from '@/presentation/components/vegetation/condition-summary';
import { InterventionQueue } from '@/presentation/components/vegetation/intervention-queue';
import { ReadingForm } from '@/presentation/components/vegetation/reading-form';
import { VegetationFilters } from '@/presentation/components/vegetation/vegetation-filters';
import { VegetationMonitoringTable } from '@/presentation/components/vegetation/vegetation-monitoring-table';
import { useClassifiedPoints, useMonitoredPoints } from '@/presentation/hooks/use-monitored-points';
import {
  filterPoints,
  getInterventionQueue,
  listHighways,
  sortByPriority,
  summarizeByCondition,
} from '@/shared/utils/monitored-points.util';

const INITIAL_FILTERS: PointFilters = { classification: 'todas', highway: 'todas' };

export const VegetationPanel = () => {
  const { points, submitReading, reset } = useMonitoredPoints();
  const classified = useClassifiedPoints();
  const [filters, setFilters] = useState<PointFilters>(INITIAL_FILTERS);

  const summary = useMemo(() => summarizeByCondition(classified), [classified]);
  const queue = useMemo(() => getInterventionQueue(classified), [classified]);
  const highways = useMemo(() => listHighways(points), [points]);
  const visiblePoints = useMemo(
    () => sortByPriority(filterPoints(classified, filters)),
    [classified, filters],
  );

  return (
    <div className="space-y-6">
      <ConditionSummary summary={summary} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <InterventionQueue queue={queue} />
        <ReadingForm points={points} onSubmit={submitReading} onReset={reset} />
      </div>

      <VegetationFilters filters={filters} highways={highways} onChange={setFilters} />
      <VegetationMonitoringTable points={visiblePoints} totalPoints={classified.length} />
    </div>
  );
};
