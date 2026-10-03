import { useContext, useMemo } from 'react';
import { MonitoredPointsContext } from '@/app/providers/monitored-points.context';
import { classifyMonitoredPoints } from '@/shared/utils/vegetation-classification.util';

export const useMonitoredPoints = () => {
  const context = useContext(MonitoredPointsContext);

  if (!context) {
    throw new Error('useMonitoredPoints deve ser usado dentro de MonitoredPointsProvider.');
  }

  return context;
};

/** Pontos já classificados (reclassificados automaticamente a cada nova leitura). */
export const useClassifiedPoints = () => {
  const { points } = useMonitoredPoints();

  return useMemo(() => classifyMonitoredPoints(points), [points]);
};
