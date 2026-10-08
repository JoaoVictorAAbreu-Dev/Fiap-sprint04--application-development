import type {
  MonitoredPoint,
  ReadingHistoryByPoint,
  ReadingHistoryEntry,
} from '@/domain/entities/vegetation-monitoring.entity';

export const createInitialReadingHistory = (points: readonly MonitoredPoint[]): ReadingHistoryByPoint =>
  Object.fromEntries(
    points.map((point) => [point.id, [{ heightCm: point.heightCm, readAt: point.lastReadingAt }]]),
  );

export const appendReadingToHistory = (
  history: ReadingHistoryByPoint,
  id: string,
  entry: ReadingHistoryEntry,
): ReadingHistoryByPoint => ({
  ...history,
  [id]: [...(history[id] ?? []), entry],
});
