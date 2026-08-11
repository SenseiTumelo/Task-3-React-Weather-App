import {
  convertTemperature,
  type TemperatureUnit,
  type WeatherData,
} from "../services/weatherService";

interface MoreDetailsCardProps {
  weather: WeatherData | null;
  temperatureUnit: TemperatureUnit;
}

function MoreDetailsCard({
  weather,
  temperatureUnit,
}: MoreDetailsCardProps) {
  if (!weather) {
    return null;
  }

  const tempUnitLabel =
    temperatureUnit === "metric"
      ? "°C"
      : "°F";

  const feelsLike = convertTemperature(
    weather.feelsLike,
    temperatureUnit
  );

  const details = [
    {
      label: "Feels Like",
      value: `${feelsLike}${tempUnitLabel}`,
      icon: "🌡",
    },
    {
      label: "Humidity",
      value: `${weather.humidity}%`,
      icon: "💧",
    },
    {
      label: "Sunrise",
      value: weather.sunrise,
      icon: "☀",
    },
    {
      label: "Sunset",
      value: weather.sunset,
      icon: "◐",
    },
    {
      label: "Visibility",
      value: weather.visibility,
      icon: "◉",
    },
  ];

  return (
    <section className="more-details-card">

      <div className="more-details-card__header">

        <div>
          <span className="section-label">
            DETAILS
          </span>

          <h3>
            Today's Highlights
          </h3>
        </div>

        <span className="more-details-card__date">
          {weather.name}
        </span>

      </div>

      <div className="more-details-grid">

        {details.map((detail) => (
          <div
            className="more-detail-item"
            key={detail.label}
          >

            <div className="more-detail-icon">
              {detail.icon}
            </div>

            <div>
              <span>
                {detail.label}
              </span>

              <strong>
                {detail.value}
              </strong>
            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

export default MoreDetailsCard;