import { createContext } from 'react';
import type { MonitoredPoint } from '@/domain/entities/vegetation-monitoring.entity';

export type MonitoredPointsContextValue = {
  points: readonly MonitoredPoint[];
  /** Registra uma nova leitura de altura. Lança RangeError se o ponto ou a altura forem inválidos. */
  submitReading: (id: string, heightCm: number) => void;
  /** Restaura a massa de dados demonstrativa original. */
  reset: () => void;
};

export const MonitoredPointsContext = createContext<MonitoredPointsContextValue | null>(null);
