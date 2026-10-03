import { useMemo, useState, type ReactNode } from 'react';
import type { MonitoredPoint } from '@/domain/entities/vegetation-monitoring.entity';
import { MonitoredPointsContext } from '@/app/providers/monitored-points.context';
import { MONITORED_POINTS } from '@/shared/constants/monitored-points';
import { registerReading } from '@/shared/utils/monitored-points.util';

type MonitoredPointsProviderProps = {
  children: ReactNode;
};

export const MonitoredPointsProvider = ({ children }: MonitoredPointsProviderProps) => {
  const [points, setPoints] = useState<readonly MonitoredPoint[]>(MONITORED_POINTS);

  const value = useMemo(
    () => ({
      points,
      submitReading: (id: string, heightCm: number) => {
        // Valida antes de atualizar o estado: o erro volta para quem chamou (formulário).
        setPoints(registerReading(points, id, heightCm, new Date().toISOString()));
      },
      reset: () => setPoints(MONITORED_POINTS),
    }),
    [points],
  );

  return <MonitoredPointsContext.Provider value={value}>{children}</MonitoredPointsContext.Provider>;
};
