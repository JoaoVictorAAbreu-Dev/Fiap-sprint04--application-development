import { useMemo, useState, type ReactNode } from 'react';
import type { MonitoredPoint } from '@/domain/entities/vegetation-monitoring.entity';
import { MonitoredPointsContext } from '@/app/providers/monitored-points.context';
import { MONITORED_POINTS } from '@/shared/constants/monitored-points';
import { registerReading } from '@/shared/utils/monitored-points.util';
import { appendReadingToHistory, createInitialReadingHistory } from '@/shared/utils/reading-history.util';

type MonitoredPointsProviderProps = {
  children: ReactNode;
};

export const MonitoredPointsProvider = ({ children }: MonitoredPointsProviderProps) => {
  const [points, setPoints] = useState<readonly MonitoredPoint[]>(MONITORED_POINTS);
  const [historyByPoint, setHistoryByPoint] = useState(() => createInitialReadingHistory(MONITORED_POINTS));

  const value = useMemo(
    () => ({
      points,
      historyByPoint,
      submitReading: (id: string, heightCm: number) => {
        // Valida antes de atualizar o estado: o erro volta para quem chamou (formulário).
        const readAt = new Date().toISOString();
        setPoints(registerReading(points, id, heightCm, readAt));
        setHistoryByPoint((current) => appendReadingToHistory(current, id, { heightCm, readAt }));
      },
      reset: () => {
        setPoints(MONITORED_POINTS);
        setHistoryByPoint(createInitialReadingHistory(MONITORED_POINTS));
      },
    }),
    [points, historyByPoint],
  );

  return <MonitoredPointsContext.Provider value={value}>{children}</MonitoredPointsContext.Provider>;
};
