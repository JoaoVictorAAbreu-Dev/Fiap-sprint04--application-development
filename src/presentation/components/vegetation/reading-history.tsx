import dayjs from 'dayjs';
import type { ReadingHistoryEntry } from '@/domain/entities/vegetation-monitoring.entity';

type ReadingHistoryProps = {
  entries: readonly ReadingHistoryEntry[];
};

export const ReadingHistory = ({ entries }: ReadingHistoryProps) => (
  <details className="min-w-36">
    <summary className="cursor-pointer text-sm font-medium text-emerald-800 underline underline-offset-2">
      Ver histórico ({entries.length})
    </summary>
    <ol className="mt-2 space-y-1 text-xs text-slate-600">
      {[...entries].reverse().map((entry, index) => (
        <li key={`${entry.readAt}-${index}`}>
          {entry.heightCm === null ? 'Sem leitura' : `${entry.heightCm.toFixed(1)} cm`} ·{' '}
          {dayjs(entry.readAt).format('DD/MM/YYYY HH:mm')}
        </li>
      ))}
    </ol>
  </details>
);
