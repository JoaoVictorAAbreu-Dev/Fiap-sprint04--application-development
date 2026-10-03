import { useState, type SyntheticEvent } from 'react';
import type { MonitoredPoint } from '@/domain/entities/vegetation-monitoring.entity';
import { classifyVegetationHeight } from '@/shared/utils/vegetation-classification.util';

type ReadingFormProps = {
  points: readonly MonitoredPoint[];
  onSubmit: (id: string, heightCm: number) => void;
  onReset: () => void;
};

type Feedback = { type: 'success' | 'error'; message: string } | null;

export const ReadingForm = ({ points, onSubmit, onReset }: ReadingFormProps) => {
  const [pointId, setPointId] = useState(points[0]?.id ?? '');
  const [rawHeight, setRawHeight] = useState('');
  const [feedback, setFeedback] = useState<Feedback>(null);

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalized = rawHeight.trim().replace(',', '.');
    const heightCm = normalized === '' ? Number.NaN : Number(normalized);

    try {
      onSubmit(pointId, heightCm);
      const { classification } = classifyVegetationHeight(heightCm);
      setFeedback({ type: 'success', message: `${pointId} atualizado para ${heightCm} cm: ${classification}.` });
      setRawHeight('');
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Não foi possível registrar a leitura.',
      });
    }
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Registrar nova leitura</h3>
      <p className="mt-1 text-sm text-slate-600">
        Simula a chegada de uma medição. O ponto é reclassificado e o painel é atualizado na hora.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_10rem_auto] sm:items-end">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Ponto
          <select
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
            value={pointId}
            onChange={(event) => setPointId(event.target.value)}
          >
            {points.map((point) => (
              <option key={point.id} value={point.id}>
                {point.id} · {point.highway} km {point.km.toFixed(1).replace('.', ',')}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Altura (cm)
          <input
            type="text"
            inputMode="decimal"
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
            value={rawHeight}
            onChange={(event) => setRawHeight(event.target.value)}
            placeholder="ex.: 72,5"
          />
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Registrar leitura
          </button>
          <button
            type="button"
            onClick={() => {
              onReset();
              setFeedback(null);
            }}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Restaurar dados
          </button>
        </div>
      </form>

      {feedback ? (
        <p
          role={feedback.type === 'error' ? 'alert' : 'status'}
          className={`mt-3 text-sm ${feedback.type === 'error' ? 'text-rose-700' : 'text-emerald-700'}`}
        >
          {feedback.message}
        </p>
      ) : null}
    </article>
  );
};
