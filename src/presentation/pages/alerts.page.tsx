import { useCurrentWeatherByLocalitiesQuery } from '@/presentation/hooks/queries/use-current-weather-by-localities.query';
import { useMonitoredLocalitiesQuery } from '@/presentation/hooks/queries/use-monitored-localities.query';
import { calculateRiskScore, getRiskLevel, isAlertPoint } from '@/shared/utils/risk.util';

export const AlertsPage = () => {
  const localitiesQuery = useMonitoredLocalitiesQuery({ limit: 10 });
  const weatherQuery = useCurrentWeatherByLocalitiesQuery(localitiesQuery.data ?? []);

  if (localitiesQuery.isLoading || weatherQuery.isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Alertas</h2>
        <p className="mt-2 text-sm text-slate-600">Consolidando alertas operacionais...</p>
      </section>
    );
  }

  if (localitiesQuery.isError || weatherQuery.isError) {
    const errorMessage =
      localitiesQuery.error instanceof Error
        ? localitiesQuery.error.message
        : weatherQuery.error instanceof Error
          ? weatherQuery.error.message
          : 'Erro desconhecido';

    return (
      <section className="rounded-xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-rose-900">Alertas</h2>
        <p className="mt-2 text-sm text-rose-700">Falha ao carregar alertas: {errorMessage}</p>
      </section>
    );
  }

  const alerts = (weatherQuery.data ?? [])
    .filter(isAlertPoint)
    .map((item) => ({
      ...item,
      riskScore: calculateRiskScore(item),
    }))
    .sort((a, b) => b.riskScore - a.riskScore);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Alertas Operacionais</h2>
      <p className="mt-2 text-sm text-slate-600">
        Pontos em condicao de atencao com base em limiares de vento, temperatura e precipitacao.
      </p>

      {alerts.length === 0 ? (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-700">Nenhum alerta ativo no momento.</p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4">Localidade</th>
                <th className="py-2 pr-4">Risco</th>
                <th className="py-2 pr-4">Temp.</th>
                <th className="py-2 pr-4">Vento</th>
                <th className="py-2 pr-4">Precipitação</th>
                <th className="py-2 pr-4">Condição</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {alerts.map((item) => (
                <tr key={`${item.localityName}-${item.latitude}-${item.longitude}`}>
                  <td className="py-2 pr-4">{item.localityName}</td>
                  <td className="py-2 pr-4">{getRiskLevel(item.riskScore)}</td>
                  <td className="py-2 pr-4">{item.temperatureC.toFixed(1)} °C</td>
                  <td className="py-2 pr-4">{item.windSpeedKmh.toFixed(1)} km/h</td>
                  <td className="py-2 pr-4">{item.precipitationMm.toFixed(1)} mm</td>
                  <td className="py-2 pr-4">{item.weatherCondition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
