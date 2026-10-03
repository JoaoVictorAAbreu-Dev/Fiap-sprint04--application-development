import type { MonitoredPoint } from '@/domain/entities/vegetation-monitoring.entity';

/**
 * Massa de dados DEMONSTRATIVA e determinística.
 * Rodovias, quilometragens e alturas são ilustrativos: não são medições reais de campo
 * nem dados oficiais da concessionária. Alturas de 30, 50 e 80 cm exercitam os limites das faixas
 * e o ponto PT-015 representa uma falha de sensor (sem leitura).
 */
export const MONITORED_POINTS: readonly MonitoredPoint[] = [
  { id: 'PT-001', highway: 'SP-070', segment: 'Trecho 01', km: 12.4, heightCm: 18, lastReadingAt: '2026-10-02T08:10:00-03:00' },
  { id: 'PT-002', highway: 'SP-070', segment: 'Trecho 02', km: 27.8, heightCm: 34, lastReadingAt: '2026-10-02T08:25:00-03:00' },
  { id: 'PT-003', highway: 'SP-070', segment: 'Trecho 03', km: 41.2, heightCm: 86, lastReadingAt: '2026-10-02T08:40:00-03:00' },
  { id: 'PT-004', highway: 'BR-116', segment: 'Trecho 01', km: 95.0, heightCm: 24, lastReadingAt: '2026-10-02T09:05:00-03:00' },
  { id: 'PT-005', highway: 'BR-116', segment: 'Trecho 02', km: 118.6, heightCm: 57, lastReadingAt: '2026-10-02T09:20:00-03:00' },
  { id: 'PT-006', highway: 'BR-116', segment: 'Trecho 03', km: 142.3, heightCm: 112, lastReadingAt: '2026-10-02T09:35:00-03:00' },
  { id: 'PT-007', highway: 'SP-150', segment: 'Trecho 01', km: 8.9, heightCm: 30, lastReadingAt: '2026-10-02T10:00:00-03:00' },
  { id: 'PT-008', highway: 'SP-150', segment: 'Trecho 02', km: 19.5, heightCm: 66, lastReadingAt: '2026-10-02T10:15:00-03:00' },
  { id: 'PT-009', highway: 'SP-160', segment: 'Trecho 01', km: 33.1, heightCm: 41, lastReadingAt: '2026-10-02T10:40:00-03:00' },
  { id: 'PT-010', highway: 'SP-160', segment: 'Trecho 02', km: 47.7, heightCm: 80, lastReadingAt: '2026-10-02T10:55:00-03:00' },
  { id: 'PT-011', highway: 'SP-348', segment: 'Trecho 01', km: 62.0, heightCm: 12, lastReadingAt: '2026-10-02T11:20:00-03:00' },
  { id: 'PT-012', highway: 'SP-348', segment: 'Trecho 02', km: 74.4, heightCm: 97, lastReadingAt: '2026-10-02T11:35:00-03:00' },
  { id: 'PT-013', highway: 'SP-348', segment: 'Trecho 03', km: 88.9, heightCm: 50, lastReadingAt: '2026-10-02T11:50:00-03:00' },
  { id: 'PT-014', highway: 'BR-116', segment: 'Trecho 04', km: 160.2, heightCm: 23, lastReadingAt: '2026-10-02T12:10:00-03:00' },
  { id: 'PT-015', highway: 'SP-150', segment: 'Trecho 03', km: 28.3, heightCm: null, lastReadingAt: '2026-09-30T06:00:00-03:00' },
];
