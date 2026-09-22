import React, { useEffect, useState } from 'react';
import { AlertTriangle, Cloud, Sun, Wind } from 'lucide-react';
import {
  fetchAnantapurWeather,
  LiveWeather,
  WEATHER_LOCATION,
} from '../services/openMeteoWeather';

const FALLBACK: LiveWeather = {
  temperatureC: 30,
  humidityPct: 65,
  windKmh: 12,
  weatherCode: 2,
  condition: 'Partly cloudy',
  tempMinC: 28,
  tempMaxC: 33,
  risk: { label: 'heat watch', tone: 'watch' },
  fetchedAt: '',
};

function buildScale(min: number, max: number, current: number) {
  const lo = Math.floor(Math.min(min, current));
  const hi = Math.ceil(Math.max(max, current));
  const span = Math.max(hi - lo, 4);
  const steps = 5;
  const labels: string[] = [];
  for (let i = 0; i < steps; i++) {
    const t = lo + (span * i) / (steps - 1);
    labels.push(`${Math.round(t)}°`);
  }
  const pct = Math.min(100, Math.max(0, ((current - lo) / span) * 100));
  return { labels, pct };
}

export const WeatherCard: React.FC = () => {
  const [weather, setWeather] = useState<LiveWeather>(FALLBACK);
  const [status, setStatus] = useState<'loading' | 'live' | 'fallback'>('loading');

  useEffect(() => {
    const ctrl = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        const live = await fetchAnantapurWeather(ctrl.signal);
        if (!cancelled) {
          setWeather(live);
          setStatus('live');
        }
      } catch {
        if (!cancelled && !ctrl.signal.aborted) {
          setStatus('fallback');
        }
      }
    })();

    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, []);

  const { labels, pct } = buildScale(
    weather.tempMinC,
    weather.tempMaxC,
    weather.temperatureC,
  );

  const ConditionIcon =
    weather.weatherCode === 0 || weather.weatherCode === 1
      ? Sun
      : weather.weatherCode >= 61
        ? Cloud
        : Cloud;

  const risk = weather.risk;

  return (
    <div
      id="weather-card-widget"
      className="h-full min-h-0 bg-[#dcdad4] rounded-[20px] p-3 border border-white/50 flex flex-col overflow-hidden"
    >
      <div className="flex items-start justify-between gap-2 shrink-0">
        <div className="min-w-0 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <Sun className="w-4 h-4 type-ink shrink-0" fill="currentColor" strokeWidth={1.25} />
            <h2 className="type-card-title truncate">Weather</h2>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="type-caption type-muted truncate">
              {WEATHER_LOCATION.name}, {WEATHER_LOCATION.region}
            </span>
            {risk && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md type-caption shrink-0 ${
                  risk.tone === 'alert'
                    ? 'bg-[#d92d20] pill-on-dark'
                    : risk.tone === 'watch'
                      ? 'bg-[#facc15] pill-on-light'
                      : 'bg-[#1c1917] pill-on-dark'
                }`}
              >
                <AlertTriangle className="w-3 h-3" strokeWidth={2} />
                {risk.label}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-[1rem_auto] gap-x-1.5 gap-y-1 type-caption type-ink shrink-0 items-center justify-items-start">
          <ConditionIcon
            className="w-3.5 h-3.5 justify-self-center"
            fill="currentColor"
            strokeWidth={1.25}
          />
          <span className="truncate max-w-[5.5rem]">{weather.condition}</span>
          <Wind className="w-3.5 h-3.5 justify-self-center" />
          <span>{Math.round(weather.windKmh)} km/h</span>
          <Sun
            className="w-3.5 h-3.5 justify-self-center"
            fill="currentColor"
            strokeWidth={1.25}
          />
          <span>{Math.round(weather.humidityPct)}%</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col items-center justify-center">
        <div className="type-hero leading-none">
          {Math.round(weather.temperatureC)}
          <span className="type-hero-unit">°C</span>
        </div>
        {status === 'loading' && (
          <div className="type-caption type-muted mt-1">Updating…</div>
        )}
        {status === 'fallback' && (
          <div className="type-caption type-muted mt-1">Cached demo values</div>
        )}
      </div>

      <div className="shrink-0 space-y-1.5">
        <div className="flex items-center justify-between type-caption type-ink px-0.5 tabular-nums">
          {labels.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="relative h-3 w-full rounded-full bg-gradient-to-r from-[#b4f53c] via-[#facc15] to-[#d92d20]">
          <div
            className="absolute -top-1 -translate-x-1/2 w-0.5 h-5 bg-[#1c1917]/50 rounded-full"
            style={{ left: `${pct}%` }}
            aria-hidden
          />
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-4 bg-white border border-[#211d19]/20 rounded-full shadow-sm"
            style={{ left: `${pct}%` }}
            title={`Current ${Math.round(weather.temperatureC)}°C`}
          />
        </div>
      </div>
    </div>
  );
};
