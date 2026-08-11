import {
  convertTemperature,
  type ForecastData,
  type TemperatureUnit,
} from "../services/weatherService";

interface ForecastSectionProps {
  forecast: ForecastData | null;
  temperatureUnit: TemperatureUnit;
  loading?: boolean;
}

function ForecastSection({
  forecast,
  temperatureUnit,
  loading = false,
}: ForecastSectionProps) {
  if (loading) {
    return (
      <section className="forecast-section">

        <div className="forecast-panel forecast-panel--loading">
          <div className="loading-spinner" />
          <p>Loading forecast...</p>
        </div>

      </section>
    );
  }

  if (!forecast) {
    return null;
  }

  return (
    <section className="forecast-section">

      {/* 5 DAY FORECAST */}
      <div className="forecast-panel">

        <div className="forecast-panel__header">

          <div>
            <span className="section-label">
              FORECAST
            </span>

            <h3>
              5-Day Forecast
            </h3>

            <p>
              Weather conditions for the next
              five days.
            </p>
          </div>

        </div>

        <div className="forecast-list">

          {forecast.daily.map((item) => (
            <div
              key={item.label}
              className="forecast-item"
            >

              <div className="forecast-day">
                <strong>
                  {item.label}
                </strong>

                <span>
                  {item.description}
                </span>
              </div>

              <img
                src={item.iconUrl}
                alt={item.description}
                className="forecast-icon"
              />

              <strong className="forecast-temperature">
                {convertTemperature(
                  item.temp,
                  temperatureUnit
                )}
                °
                {temperatureUnit === "metric"
                  ? "C"
                  : "F"}
              </strong>

            </div>
          ))}

        </div>

      </div>

      {/* HOURLY FORECAST */}
      <div className="forecast-panel">

        <div className="forecast-panel__header">

          <div>
            <span className="section-label">
              HOURLY
            </span>

            <h3>
              Hourly Forecast
            </h3>

            <p>
              Weather conditions for the next
              eight hours.
            </p>
          </div>

        </div>

        <div className="hourly-list">

          {forecast.hourly.map((item) => (
            <div
              key={item.label}
              className="hourly-item"
            >

              <span className="hourly-time">
                {item.label}
              </span>

              <img
                src={item.iconUrl}
                alt={item.description}
                className="forecast-icon"
              />

              <strong>
                {convertTemperature(
                  item.temp,
                  temperatureUnit
                )}
                °
                {temperatureUnit === "metric"
                  ? "C"
                  : "F"}
              </strong>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default ForecastSection;