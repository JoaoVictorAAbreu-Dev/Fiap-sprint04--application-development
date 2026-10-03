import { Marker, Popup } from 'react-leaflet';
import { divIcon, type LatLngExpression } from 'leaflet';
import type { WeatherSnapshot } from '@/domain/entities/weather.entity';
import { calculateRiskScore, getRiskLevel } from '@/shared/utils/risk.util';
import { RiskBadge } from '@/presentation/components/shared/risk-badge';

type RiskMarkerProps = {
  weather: WeatherSnapshot;
};

const getMarkerColor = (score: number) => {
  if (score >= 75) return '#dc2626';
  if (score >= 50) return '#ea580c';
  if (score >= 25) return '#ca8a04';
  return '#16a34a';
};

export const RiskMarker = ({ weather }: RiskMarkerProps) => {
  const score = calculateRiskScore(weather);
  const level = getRiskLevel(score);
  const color = getMarkerColor(score);
  const position: LatLngExpression = [weather.latitude, weather.longitude];

  const markerIcon = divIcon({
    className: 'custom-risk-marker',
    html: `<span style="display:inline-block;width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid #ffffff;box-shadow:0 0 0 2px rgba(15,23,42,0.2);"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

  return (
    <Marker position={position} icon={markerIcon}>
      <Popup>
        <div className="space-y-1 text-sm">
          <p className="font-semibold text-slate-900">{weather.localityName}</p>
          <p>Latitude: {weather.latitude.toFixed(6)}</p>
          <p>Longitude: {weather.longitude.toFixed(6)}</p>
          <p>Temperatura: {weather.temperatureC.toFixed(1)} °C</p>
          <p>Umidade: {weather.humidityPct.toFixed(0)}%</p>
          <p>Chuva: {weather.precipitationMm.toFixed(1)} mm</p>
          <p>Velocidade do vento: {weather.windSpeedKmh.toFixed(1)} km/h</p>
          <div className="pt-1">
            <p className="mb-1">Nivel de risco:</p>
            <RiskBadge level={level} />
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
