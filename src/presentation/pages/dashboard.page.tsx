import { RiskScoreCard } from '@/presentation/components/shared/risk-score-card';
import { SummaryCard } from '@/presentation/components/shared/summary-card';
import { VegetationPanel } from '@/presentation/components/vegetation/vegetation-panel';
import { useCurrentWeatherByLocalitiesQuery } from '@/presentation/hooks/queries/use-current-weather-by-localities.query';
import { useMonitoredLocalitiesQuery } from '@/presentation/hooks/queries/use-monitored-localities.query';
import { useClassifiedPoints } from '@/presentation/hooks/use-monitored-points';
import { buildFictitiousSensingSnapshot } from '@/shared/utils/sensing-simulation.util';
import { calculateRiskScore, getRiskLevel, isAlertPoint } from '@/shared/utils/risk.util';
import { calculateAverageHeight, countInterventions } from '@/shared/utils/monitored-points.util';

export const DashboardPage = () => {
  const vegetationPoints = useClassifiedPoints();
  const localitiesQuery = useMonitoredLocalitiesQuery({ limit: 10 });
  const weatherQuery = useCurrentWeatherByLocalitiesQuery(localitiesQuery.data ?? []);

  const weather = weatherQuery.data ?? [];
  const sensing = weather.map(buildFictitiousSensingSnapshot);
  const hasWeatherData = !weatherQuery.isLoading && !weatherQuery.isError && weather.length > 0;

  const monitoredPoints = vegetationPoints.length;
  const averageTemperature =
    weather.length > 0 ? weather.reduce((sum, item) => sum + item.temperatureC, 0) / weather.length : 0;
  const averageWindSpeed =
    weather.length > 0 ? weather.reduce((sum, item) => sum + item.windSpeedKmh, 0) / weather.length : 0;
  const averageVegetationStress =
    sensing.length > 0 ? sensing.reduce((sum, item) => sum + item.vegetationStressPct, 0) / sensing.length : 0;
  const alertPoints = weather.filter(isAlertPoint).length;
  const averageVegetationHeight = calculateAverageHeight(vegetationPoints);
  const interventionPoints = countInterventions(vegetationPoints);

  const riskByPoint = weather.map((item) => ({
    ...item,
    riskScore: calculateRiskScore(item),
  }));

  const generalRiskScore =
    riskByPoint.length > 0 ? riskByPoint.reduce((sum, item) => sum + item.riskScore, 0) / riskByPoint.length : 0;

  const mostCriticalArea = riskByPoint.reduce(
    (current, item) => (item.riskScore > current.riskScore ? item : current),
    riskByPoint[0],
  );

  return (
    <section className="space-y-6">
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard Executivo</h2>
        <p className="mt-2 text-sm text-slate-600">
          Visão consolidada da classificação da vegetação, da fila de atendimento e das condições climáticas complementares.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <SummaryCard title="Pontos monitorados" value={String(monitoredPoints)} />
        <SummaryCard
          title="Altura média"
          value={averageVegetationHeight === null ? '—' : `${averageVegetationHeight.toFixed(1)} cm`}
          helperText="Somente leituras válidas"
        />
        <SummaryCard title="Intervenções necessárias" value={String(interventionPoints)} />
        <SummaryCard title="Temperatura média" value={hasWeatherData ? `${averageTemperature.toFixed(1)} °C` : '—'} />
        <SummaryCard title="Pontos em alerta climático" value={hasWeatherData ? String(alertPoints) : '—'} />
        <SummaryCard title="Vento médio" value={hasWeatherData ? `${averageWindSpeed.toFixed(1)} km/h` : '—'} />
      </div>

      <VegetationPanel />

      {localitiesQuery.isError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="alert">
          <p>
            Não foi possível carregar as localidades do mapa e do clima, mas a classificação da vegetação continua
            funcionando.
          </p>
          <button
            type="button"
            onClick={() => void localitiesQuery.refetch()}
            className="mt-3 rounded-md bg-amber-700 px-3 py-2 font-medium text-white hover:bg-amber-800"
          >
            Tentar novamente
          </button>
        </div>
      ) : null}

      {localitiesQuery.isLoading || weatherQuery.isLoading ? (
        <p className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800" role="status">
          A classificação da vegetação já está disponível. Carregando apenas os indicadores climáticos complementares...
        </p>
      ) : null}

      {weatherQuery.isError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="alert">
          <p>Os dados climáticos estão indisponíveis, mas a classificação por altura continua funcionando.</p>
          <button
            type="button"
            onClick={() => void weatherQuery.refetch()}
            className="mt-3 rounded-md bg-amber-700 px-3 py-2 font-medium text-white hover:bg-amber-800"
          >
            Tentar carregar clima novamente
          </button>
        </div>
      ) : null}

      {hasWeatherData ? <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Área mais crítica monitorada</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">
            {mostCriticalArea ? mostCriticalArea.localityName : 'Sem dados'}
          </p>
          {mostCriticalArea ? (
            <p className="mt-2 text-sm text-slate-600">
              Temperatura {mostCriticalArea.temperatureC.toFixed(1)} °C | Vento{' '}
              {mostCriticalArea.windSpeedKmh.toFixed(1)} km/h | Precipitação{' '}
              {mostCriticalArea.precipitationMm.toFixed(1)} mm
            </p>
          ) : null}
          {mostCriticalArea ? (
            <p className="mt-2 text-xs font-semibold text-slate-500">
              Classificação: {getRiskLevel(mostCriticalArea.riskScore)}
            </p>
          ) : null}
        </article>

        <RiskScoreCard
          title="Score geral de risco"
          score={generalRiskScore}
          subtitle={`Cálculo climático complementar; estresse médio da vegetação: ${averageVegetationStress.toFixed(1)}%.`}
        />
      </div> : null}
    </section>
  );
};
