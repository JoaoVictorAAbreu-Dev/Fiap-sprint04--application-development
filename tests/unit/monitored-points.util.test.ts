import { describe, expect, it } from 'vitest';
import type { MonitoredPoint } from '@/domain/entities/vegetation-monitoring.entity';
import { MONITORED_POINTS } from '@/shared/constants/monitored-points';
import {
  calculateAverageHeight,
  countInterventions,
  filterPoints,
  getInterventionQueue,
  listHighways,
  registerReading,
  sortByPriority,
  summarizeByCondition,
} from '@/shared/utils/monitored-points.util';
import { classifyMonitoredPoints } from '@/shared/utils/vegetation-classification.util';

const classified = classifyMonitoredPoints(MONITORED_POINTS);

describe('monitored-points fixture', () => {
  it('has unique IDs and covers every condition, including an invalid reading', () => {
    const ids = MONITORED_POINTS.map((point) => point.id);
    const summary = summarizeByCondition(classified);

    expect(new Set(ids).size).toBe(ids.length);
    expect(Object.values(summary).every((count) => count > 0)).toBe(true);
    expect(Object.values(summary).reduce((sum, count) => sum + count, 0)).toBe(MONITORED_POINTS.length);
  });
});

describe('sortByPriority', () => {
  it('puts the most urgent first and breaks ties by greater height', () => {
    const sorted = sortByPriority(classified);

    expect(sorted[0].classification).toBe('Intervenção Prioritária');
    expect(sorted[0].heightCm).toBe(112);
    expect(sorted.map((point) => point.priority)).toEqual(
      [...sorted.map((point) => point.priority)].sort((a, b) => b - a),
    );
    expect(sorted[sorted.length - 1].classification).toBe('Leitura inválida');
  });

  it('does not mutate the original list', () => {
    const snapshot = classified.map((point) => point.id);

    sortByPriority(classified);

    expect(classified.map((point) => point.id)).toEqual(snapshot);
  });
});

describe('intervention queue and indicators', () => {
  it('lists only points that require field service, most urgent first', () => {
    const queue = getInterventionQueue(classified);

    expect(queue.length).toBe(countInterventions(classified));
    expect(queue.every((point) => point.priority >= 3)).toBe(true);
    expect(queue[0].priority).toBeGreaterThanOrEqual(queue[queue.length - 1].priority);
  });

  it('averages only valid readings', () => {
    const average = calculateAverageHeight(
      classifyMonitoredPoints([
        { ...MONITORED_POINTS[0], heightCm: 10 },
        { ...MONITORED_POINTS[1], heightCm: 30 },
        { ...MONITORED_POINTS[2], heightCm: null },
      ]),
    );

    expect(average).toBe(20);
  });

  it('returns null when there is no valid reading', () => {
    expect(calculateAverageHeight([])).toBeNull();
    expect(calculateAverageHeight(classifyMonitoredPoints([{ ...MONITORED_POINTS[0], heightCm: null }]))).toBeNull();
  });
});

describe('filterPoints and listHighways', () => {
  it('filters by classification, highway and both', () => {
    const byClass = filterPoints(classified, { classification: 'Atenção', highway: 'todas' });
    const byHighway = filterPoints(classified, { classification: 'todas', highway: 'BR-116' });
    const both = filterPoints(classified, { classification: 'Intervenção Prioritária', highway: 'BR-116' });
    const all = filterPoints(classified, { classification: 'todas', highway: 'todas' });

    expect(byClass.every((point) => point.classification === 'Atenção')).toBe(true);
    expect(byHighway.every((point) => point.highway === 'BR-116')).toBe(true);
    expect(both.every((point) => point.classification === 'Intervenção Prioritária' && point.highway === 'BR-116')).toBe(true);
    expect(all).toHaveLength(classified.length);
  });

  it('lists unique highways in alphabetical order', () => {
    const highways = listHighways(MONITORED_POINTS);

    expect(highways).toEqual([...new Set(highways)].sort());
    expect(highways).toContain('SP-070');
  });
});

describe('registerReading', () => {
  const readAt = '2026-10-03T10:00:00-03:00';

  it('updates height and date of one point and reclassifies it, without mutating the input', () => {
    const before = [...MONITORED_POINTS] as MonitoredPoint[];
    const target = MONITORED_POINTS[0];

    const next = registerReading(MONITORED_POINTS, target.id, 95, readAt);
    const updated = classifyMonitoredPoints(next).find((point) => point.id === target.id);

    expect(updated).toMatchObject({ heightCm: 95, lastReadingAt: readAt, classification: 'Intervenção Prioritária' });
    expect(next.filter((point) => point.id !== target.id)).toEqual(before.filter((point) => point.id !== target.id));
    expect(MONITORED_POINTS[0].heightCm).toBe(target.heightCm);
  });

  it('recovers a point that had an invalid reading', () => {
    const invalid = MONITORED_POINTS.find((point) => point.heightCm === null);

    expect(invalid).toBeDefined();

    const next = registerReading(MONITORED_POINTS, invalid!.id, 20, readAt);

    expect(classifyMonitoredPoints(next).find((point) => point.id === invalid!.id)?.classification).toBe('Monitorado');
  });

  it('rejects invalid heights and unknown points', () => {
    expect(() => registerReading(MONITORED_POINTS, 'PT-001', -1, readAt)).toThrow(RangeError);
    expect(() => registerReading(MONITORED_POINTS, 'PT-001', Number.NaN, readAt)).toThrow(RangeError);
    expect(() => registerReading(MONITORED_POINTS, 'PT-999', 10, readAt)).toThrow(RangeError);
  });
});
