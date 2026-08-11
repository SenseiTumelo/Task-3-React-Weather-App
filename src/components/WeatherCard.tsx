import {
  convertTemperature,
  getWeatherByCity,
  type TemperatureUnit,
  type WeatherData,
} from "../services/weatherService";

import { useEffect, useState } from "react";

interface WeatherCardProps {
  city?: string;
  temperatureUnit?: TemperatureUnit;
  fallbackCity?: string;
}

function WeatherCard({
  city = "Polokwane",
  temperatureUnit = "metric",
  fallbackCity = "Polokwane",
}: WeatherCardProps) {
  const [weather, setWeather] =
    useState<WeatherData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    const loadWeather = async () => {
      setLoading(true);
      setError("");

      try {
        const targetCity =
          city?.trim() || fallbackCity;

        const data =
          await getWeatherByCity(targetCity);

        if (!cancelled) {
          setWeather(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load weather"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadWeather();

    return () => {
      cancelled = true;
    };
  }, [city, fallbackCity]);

  if (loading) {
    return (
      <article className="weather-card weather-card--loading">
        <div className="loading-spinner" />
        <p>Loading weather data...</p>
      </article>
    );
  }

  if (error) {
    return (
      <article className="weather-card weather-card--loading">
        <p>{error}</p>
      </article>
    );
  }

  if (!weather) {
    return null;
  }

  const tempUnitLabel =
    temperatureUnit === "metric"
      ? "°C"
      : "°F";

  const currentTemp = convertTemperature(
    weather.temperature,
    temperatureUnit
  );

  const highTemp = convertTemperature(
    weather.maxTemp,
    temperatureUnit
  );

  const lowTemp = convertTemperature(
    weather.minTemp,
    temperatureUnit
  );

  return (
    <article className="weather-card">

      <div className="weather-card__background" />

      <div className="weather-card__content">

        <div className="weather-card__top">

          <div>

            <span className="weather-card__label">
              CURRENT WEATHER
            </span>

            <h2>
              {weather.name}
            </h2>

            <p className="weather-card__country">
              {weather.country}
            </p>

            <p className="weather-card__condition">
              {weather.condition}
            </p>

          </div>

          <div className="weather-card__main-temp">

            <img
              src={weather.iconUrl}
              alt={weather.condition}
              className="weather-icon"
            />

            <div>
              <strong>
                {currentTemp}
                <sup>
                  {tempUnitLabel}
                </sup>
              </strong>

              <span>
                Feels like{" "}
                {convertTemperature(
                  weather.feelsLike,
                  temperatureUnit
                )}
                {tempUnitLabel}
              </span>
            </div>

          </div>

        </div>

        <div className="weather-card__bottom">

          <div className="weather-stat">
            <span>WIND</span>
            <strong>
              {weather.windSpeed}
              <small> km/h</small>
            </strong>
          </div>

          <div className="weather-stat">
            <span>PRESSURE</span>
            <strong>
              {weather.pressure}
              <small> hPa</small>
            </strong>
          </div>

          <div className="weather-stat">
            <span>LOW</span>
            <strong>
              {lowTemp}
              {tempUnitLabel}
            </strong>
          </div>

          <div className="weather-stat">
            <span>HIGH</span>
            <strong>
              {highTemp}
              {tempUnitLabel}
            </strong>
          </div>

        </div>

      </div>
    </article>
  );
}

export default WeatherCard;