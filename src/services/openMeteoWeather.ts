/** Open-Meteo forecast for Warinci demo farm site — Anantapur, Andhra Pradesh */

export const WEATHER_LOCATION = {
  name: 'Anantapur',
  region: 'Andhra Pradesh',
  latitude: 14.6819,
  longitude: 77.6006,
  timezone: 'Asia/Kolkata',
} as const;

export type WeatherRisk = {
  label: string;
  tone: 'alert' | 'watch' | 'ok';
};

export type LiveWeather = {
  temperatureC: number;
  humidityPct: number;
  windKmh: number;
  weatherCode: number;
  condition: string;
  tempMinC: number;
  tempMaxC: number;
  risk: WeatherRisk | null;
  fetchedAt: string;
};

type OpenMeteoResponse = {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
};

/** WMO Weather interpretation codes (Open-Meteo) */
export function weatherCodeLabel(code: number): string {
  if (code === 0) return 'Clear';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Fog';
  if (code >= 51 && code <= 57) return 'Drizzle';
  if (code >= 61 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Showers';
  if (code >= 85 && code <= 86) return 'Snow showers';
  if (code === 95) return 'Thunderstorm';
  if (code === 96 || code === 99) return 'Storm + hail';
  return 'Cloudy';
}

function deriveRisk(
  temperatureC: number,
  windKmh: number,
  weatherCode: number,
): WeatherRisk | null {
  if (weatherCode >= 95) {
    return { label: 'storm risk', tone: 'alert' };
  }
  if (weatherCode >= 61 && weatherCode <= 82) {
    return { label: 'rain risk', tone: 'alert' };
  }
  if (temperatureC >= 35) {
    return { label: 'heat risk', tone: 'alert' };
  }
  if (windKmh >= 40) {
    return { label: 'wind risk', tone: 'alert' };
  }
  if (temperatureC >= 30) {
    return { label: 'heat watch', tone: 'watch' };
  }
  return null;
}

export async function fetchAnantapurWeather(
  signal?: AbortSignal,
): Promise<LiveWeather> {
  const params = new URLSearchParams({
    latitude: String(WEATHER_LOCATION.latitude),
    longitude: String(WEATHER_LOCATION.longitude),
    current:
      'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min',
    timezone: WEATHER_LOCATION.timezone,
    forecast_days: '1',
  });

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params}`,
    { signal },
  );

  if (!res.ok) {
    throw new Error(`Open-Meteo ${res.status}`);
  }

  const data = (await res.json()) as OpenMeteoResponse;
  const temperatureC = data.current.temperature_2m;
  const humidityPct = data.current.relative_humidity_2m;
  const windKmh = data.current.wind_speed_10m;
  const weatherCode = data.current.weather_code;
  const tempMinC = data.daily.temperature_2m_min[0] ?? temperatureC - 2;
  const tempMaxC = data.daily.temperature_2m_max[0] ?? temperatureC + 2;

  return {
    temperatureC,
    humidityPct,
    windKmh,
    weatherCode,
    condition: weatherCodeLabel(weatherCode),
    tempMinC,
    tempMaxC,
    risk: deriveRisk(temperatureC, windKmh, weatherCode),
    fetchedAt: data.current.time,
  };
}
