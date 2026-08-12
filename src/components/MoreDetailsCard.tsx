import {
  convertTemperature,
  type TemperatureUnit,
  type WeatherData,
} from "../services/weatherService";

import humidityIcon from "../assets/humidity.png";
import sunriseIcon from "../assets/sunrise.png";
import sunIcon from "../assets/sun.png";
import visibilityIcon from "../assets/visibility.png";
import feelsLikeIcon from "../assets/feels_like.png";
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
      icon: feelsLikeIcon,
    },
    {
      label: "Humidity",
      value: `${weather.humidity}%`,
      icon: humidityIcon,
    },
    {
      label: "Sunrise",
      value: weather.sunrise,
      icon: sunriseIcon,
    },
    {
      label: "Sunset",
      value: weather.sunset,
      icon: sunIcon,
    },
    {
      label: "Visibility",
      value: weather.visibility,
      icon: visibilityIcon,
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
             <img src={detail.icon} alt={detail.label} />
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