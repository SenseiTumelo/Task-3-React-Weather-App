export type TemperatureUnit = 'metric' | 'imperial';

export interface WeatherData {
  name: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
  iconUrl: string;
  minTemp: number;
  maxTemp: number;
  pressure: number;
  sunrise: string;
  sunset: string;
  visibility: string;
}

export interface ForecastItem {
  label: string;
  temp: number;
  description: string;
  icon: string;
  iconUrl: string;
}

export interface ForecastData {
  daily: ForecastItem[];
  hourly: ForecastItem[];
}

const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

const getApiKey = (): string | undefined =>
  (import.meta.env.VITE_OPENWEATHER_API_KEY as string | undefined) ||
  (import.meta.env.VITE_API_KEY as string | undefined);

const formatTime = (timestamp?: number): string => {
  if (!timestamp) return '—';

  return new Date(timestamp * 1000).toLocaleTimeString('en', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

const normalizeWeather = (data: any): WeatherData => ({
  name: data.name,
  country: data.sys.country,
  temperature: Math.round(data.main.temp),
  feelsLike: Math.round(data.main.feels_like),
  humidity: data.main.humidity,
  windSpeed: Math.round(data.wind.speed),
  condition: data.weather?.[0]?.description || 'No condition',
  icon: data.weather?.[0]?.icon || '01d',
  iconUrl: `https://openweathermap.org/img/wn/${data.weather?.[0]?.icon || '01d'}@2x.png`,
  minTemp: Math.round(data.main.temp_min),
  maxTemp: Math.round(data.main.temp_max),
  pressure: data.main.pressure,
  sunrise: formatTime(data.sys?.sunrise),
  sunset: formatTime(data.sys?.sunset),
  visibility: `${Math.round((data.visibility || 0) / 1000)} km`,
});

const normalizeForecast = (data: any): ForecastData => {
  const list = data.list || [];

  const dailyEntries = Array.from(
    new Map(
      list.map((item: any) => {
        const dayKey = item.dt_txt.split(' ')[0];
        return [dayKey, item];
      })
    ).values()
  ).slice(0, 5);

  const daily = dailyEntries.map((item: any) => ({
    label: new Date(item.dt * 1000).toLocaleDateString('en', { weekday: 'short' }),
    temp: Math.round(item.main.temp),
    description: item.weather?.[0]?.description || 'No condition',
    icon: item.weather?.[0]?.icon || '01d',
    iconUrl: `https://openweathermap.org/img/wn/${item.weather?.[0]?.icon || '01d'}@2x.png`,
  }));

  const hourly = list.slice(0, 8).map((item: any) => ({
    label: new Date(item.dt * 1000).toLocaleTimeString('en', {
      hour: 'numeric',
      minute: '2-digit',
    }),
    temp: Math.round(item.main.temp),
    description: item.weather?.[0]?.description || 'No condition',
    icon: item.weather?.[0]?.icon || '01d',
    iconUrl: `https://openweathermap.org/img/wn/${item.weather?.[0]?.icon || '01d'}@2x.png`,
  }));

  return { daily, hourly };
};

export const convertTemperature = (value: number, unit: TemperatureUnit): number =>
  unit === 'metric' ? value : Math.round((value * 9) / 5 + 32);

export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  const apiKey = "912533d7b0a5f9eaa2cb9be133558ccb";

  if (!apiKey) {
    throw new Error('OpenWeather API key is missing.');
  }

  const response = await fetch(
    `${WEATHER_BASE_URL}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
  );

  if (!response.ok) {
    throw new Error('City not found');
  }

  const data = await response.json();
  return normalizeWeather(data);
};

export const getWeatherByCoordinates = async (lat: number, lon: number): Promise<WeatherData> => {
  const apiKey = "912533d7b0a5f9eaa2cb9be133558ccb";

  if (!apiKey) {
    throw new Error('OpenWeather API key is missing.');
  }

  const response = await fetch(
    `${WEATHER_BASE_URL}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );

  if (!response.ok) {
    throw new Error('Unable to fetch weather data');
  }

  const data = await response.json();
  return normalizeWeather(data);
};

export const getForecastByCity = async (city: string): Promise<ForecastData> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('OpenWeather API key is missing.');
  }

  const response = await fetch(
    `${FORECAST_BASE_URL}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
  );

  if (!response.ok) {
    throw new Error('Forecast not found');
  }

  const data = await response.json();
  return normalizeForecast(data);
};

export const getForecastByCoordinates = async (lat: number, lon: number): Promise<ForecastData> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('OpenWeather API key is missing.');
  }

  const response = await fetch(
    `${FORECAST_BASE_URL}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );

  if (!response.ok) {
    throw new Error('Unable to fetch forecast data');
  }

  const data = await response.json();
  return normalizeForecast(data);
};