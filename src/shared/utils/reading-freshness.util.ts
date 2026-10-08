import { READING_STALE_AFTER_DAYS } from '@/shared/constants/reading-freshness';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const isReadingStale = (
  readAt: string,
  now = new Date(),
  staleAfterDays = READING_STALE_AFTER_DAYS,
): boolean => {
  const timestamp = Date.parse(readAt);
  if (!Number.isFinite(timestamp)) return true;

  return now.getTime() - timestamp >= staleAfterDays * DAY_IN_MS;
};
