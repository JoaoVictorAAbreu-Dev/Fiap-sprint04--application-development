import { VegetationMonitoringTable } from '@/presentation/components/vegetation/vegetation-monitoring-table';
import { useCurrentWeatherByLocalitiesQuery } from '@/presentation/hooks/queries/use-current-weather-by-localities.query';
import { useMonitoredLocalitiesQuery } from '@/presentation/hooks/queries/use-monitored-localities.query';
import { buildFictitiousSensingSnapshot } from '@/shared/utils/sensing-simulation.util';
import { useClassifiedPoints } from '@/presentation/hooks/use-monitored-points';
import { sortByPriority } from '@/shared/utils/monitored-points.util';

export const SensingPage = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useMonitoredLocalitiesQuery({
    limit: 10,
  });
  const {
    data: weatherData,
    isLoading: isWeatherLoading,
    isError: isWeatherError,
    error: weatherError,
    refetch: refetchWeather,
  } = useCurrentWeatherByLocalitiesQuery(data ?? []);
  const classifiedPoints = useClassifiedPoints();
  const vegetationPoints = sortByPriority(classifiedPoints);

  if (isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Sensoriamento</h2>
        <p className="mt-2 text-sm text-slate-600">Carregando localidades monitoradas...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-rose-900">Sensoriamento</h2>
        <p className="mt-2 text-sm text-rose-700">
          Falha ao carregar localidades: {error instanceof Error ? error.message : 'erro desconhecido'}
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 rounded-md bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700"
        >
          Tentar novamente
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Sensoriamento</h2>
          <span className="text-xs text-slate-500">{isFetching ? 'Atualizando...' : 'Atualizado'}</span>
        </div>

        <p className="mt-2 text-sm text-slate-600">
          Top 10 localidades obtidas automaticamente via OpenStreetMap Nominatim.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="py-2 pr-4">Nome</th>
              <th className="py-2 pr-4">Latitude</th>
              <th className="py-2 pr-4">Longitude</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {data?.map((locality) => (
              <tr key={`${locality.name}-${locality.latitude}-${locality.longitude}`}>
                <td className="py-2 pr-4">{locality.name}</td>
                <td className="py-2 pr-4">{locality.latitude.toFixed(6)}</td>
                <td className="py-2 pr-4">{locality.longitude.toFixed(6)}</td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      <VegetationMonitoringTable points={vegetationPoints} />

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Sensoriamento ficticio por localidade</h3>
        <p className="mt-2 text-sm text-slate-600">
          Indicadores sinteticos de vegetacao, solo, qualidade do ar e foco termico.
        </p>

        {isWeatherLoading && <p className="mt-2 text-sm text-slate-600">Calculando indicadores de sensores...</p>}

        {!isWeatherLoading && !isWeatherError && (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-4">Nome</th>
                  <th className="py-2 pr-4">Estresse de vegetacao</th>
                  <th className="py-2 pr-4">Umidade do solo</th>
                  <th className="py-2 pr-4">Indice de qualidade do ar</th>
                  <th className="py-2 pr-4">Foco termico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {weatherData?.map((item) => {
                  const sensing = buildFictitiousSensingSnapshot(item);
                  return (
                    <tr key={`sensing-${item.localityName}-${item.latitude}-${item.longitude}`}>
                      <td className="py-2 pr-4">{item.localityName}</td>
                      <td className="py-2 pr-4">{sensing.vegetationStressPct.toFixed(1)}%</td>
                      <td className="py-2 pr-4">{sensing.soilMoisturePct.toFixed(1)}%</td>
                      <td className="py-2 pr-4">{sensing.airQualityIndex}</td>
                      <td className="py-2 pr-4">{sensing.heatFocusC.toFixed(1)} degC</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Condicoes climaticas atuais (Open-Meteo)</h3>

        {isWeatherLoading && <p className="mt-2 text-sm text-slate-600">Carregando clima dos pontos...</p>}

        {isWeatherError && (
          <div className="mt-2 rounded-md border border-rose-200 bg-rose-50 p-3">
            <p className="text-sm text-rose-700">
              Falha ao carregar clima: {weatherError instanceof Error ? weatherError.message : 'erro desconhecido'}
            </p>
            <button
              type="button"
              onClick={() => void refetchWeather()}
              className="mt-3 rounded-md bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!isWeatherLoading && !isWeatherError && (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-4">Nome</th>
                  <th className="py-2 pr-4">Temperatura</th>
                  <th className="py-2 pr-4">Umidade</th>
                  <th className="py-2 pr-4">Vento</th>
                  <th className="py-2 pr-4">Precipitacao</th>
                  <th className="py-2 pr-4">Condicao</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {weatherData?.map((item) => (
                  <tr key={`${item.localityName}-${item.latitude}-${item.longitude}`}>
                    <td className="py-2 pr-4">{item.localityName}</td>
                    <td className="py-2 pr-4">{item.temperatureC.toFixed(1)} degC</td>
                    <td className="py-2 pr-4">{item.humidityPct.toFixed(0)}%</td>
                    <td className="py-2 pr-4">{item.windSpeedKmh.toFixed(1)} km/h</td>
                    <td className="py-2 pr-4">{item.precipitationMm.toFixed(1)} mm</td>
                    <td className="py-2 pr-4">{item.weatherCondition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
