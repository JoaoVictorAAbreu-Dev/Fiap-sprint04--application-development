import { describe, expect, it } from 'vitest';
import type { MonitoredPoint } from '@/domain/entities/vegetation-monitoring.entity';
import {
  classifyMonitoredPoint,
  classifyMonitoredPoints,
  classifyVegetationHeight,
  isValidHeightCm,
} from '@/shared/utils/vegetation-classification.util';

const buildPoint = (id: string, heightCm: number | null): MonitoredPoint => ({
  id,
  highway: 'SP-000',
  segment: 'Trecho X',
  km: 1,
  heightCm,
  lastReadingAt: '2026-10-02T08:00:00-03:00',
});

describe('vegetation-classification.util', () => {
  it.each([
    [0, 'Monitorado', 1],
    [30, 'Monitorado', 1],
    [30.1, 'Atenção', 2],
    [50, 'Atenção', 2],
    [50.1, 'Intervenção Programada', 3],
    [80, 'Intervenção Programada', 3],
    [80.1, 'Intervenção Prioritária', 4],
    [250, 'Intervenção Prioritária', 4],
  ])('classifies %s cm as %s (priority %s)', (heightCm, expectedClassification, expectedPriority) => {
    const band = classifyVegetationHeight(heightCm);

    expect(band.classification).toBe(expectedClassification);
    expect(band.priority).toBe(expectedPriority);
  });

  it('rejects negative and non-finite heights', () => {
    expect(() => classifyVegetationHeight(-1)).toThrow(RangeError);
    expect(() => classifyVegetationHeight(Number.NaN)).toThrow(RangeError);
    expect(() => classifyVegetationHeight(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });

  it('validates heights', () => {
    expect(isValidHeightCm(0)).toBe(true);
    expect(isValidHeightCm(12.5)).toBe(true);
    expect(isValidHeightCm(-0.1)).toBe(false);
    expect(isValidHeightCm(null)).toBe(false);
    expect(isValidHeightCm('40')).toBe(false);
  });

  it('classifies a point keeping its identification and adding priority and action', () => {
    const result = classifyMonitoredPoint(buildPoint('PT-X', 90));

    expect(result).toMatchObject({
      id: 'PT-X',
      highway: 'SP-000',
      heightCm: 90,
      classification: 'Intervenção Prioritária',
      priority: 4,
    });
    expect(result.recommendedAction.length).toBeGreaterThan(0);
  });

  it('does not throw for a missing or invalid reading and marks it as invalid', () => {
    const missing = classifyMonitoredPoint(buildPoint('PT-NULL', null));
    const negative = classifyMonitoredPoint(buildPoint('PT-NEG', -5));

    expect(missing.classification).toBe('Leitura inválida');
    expect(negative.classification).toBe('Leitura inválida');
    expect(missing.priority).toBe(0);
    expect(missing.recommendedAction.length).toBeGreaterThan(0);
  });

  it('processes a whole batch without losing points, even with an invalid one', () => {
    const result = classifyMonitoredPoints([
      buildPoint('A', 20),
      buildPoint('B', 40),
      buildPoint('C', 70),
      buildPoint('D', 90),
      buildPoint('E', null),
    ]);

    expect(result.map((point) => point.classification)).toEqual([
      'Monitorado',
      'Atenção',
      'Intervenção Programada',
      'Intervenção Prioritária',
      'Leitura inválida',
    ]);
    expect(result.every((point) => point.recommendedAction.length > 0)).toBe(true);
  });

  it('returns an empty list for an empty batch', () => {
    expect(classifyMonitoredPoints([])).toEqual([]);
  });
});
