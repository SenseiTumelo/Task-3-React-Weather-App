import React, { useState } from "react";
import { Text } from "./Text";
import { Button } from "./ButtonComponent/Button";
import descIcon from "../assets/description.png";
import humidityIcon from "../assets/humidity.png";
import feelslikeIcon from "../assets/wind.png";
import { Card } from "./CardComponent/Card";

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
}

interface HourlyItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

export const Hero = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<HourlyItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    setWeather(null);
    setForecast([]);

    try {
      // 1. Fetch current weather
      const resCurrent = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
      );

      if (!resCurrent.ok) {
        if (resCurrent.status === 404) {
          throw new Error("City not found. Please check the spelling.");
        } else if (resCurrent.status === 401) {
          throw new Error("Invalid API key. Check your .env file.");
        }
        throw new Error("Failed to fetch weather data.");
      }

      const dataCurrent: WeatherData = await resCurrent.json();
      setWeather(dataCurrent);

      
      const resForecast = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
      );

      if (resForecast.ok) {
        const dataForecast = await resForecast.json();
       
        setForecast(dataForecast.list.slice(0, 8));
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="hero-container">
      <div className="hero-section">      
        <div className="location-details">
          <form className="search-form" onSubmit={handleSubmit}>
            <input
              type="text"
              id="city"
              value={city}
              name="city"
              placeholder="Search for location"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
            />
            <Button style={{ color: "#fff", width: "5rem", height: "2.5rem" }}>
              Search
            </Button>
          </form>

          {loading && <p>Loading data...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {weather && (
            <div className="weather-details">
              <div className="weather-icon">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                />
              </div>

              <Text variant="h1">{Math.round(weather.main.temp)}°C</Text>
              <Text variant="h3">{weather.name}</Text>
              
              <div className="more-weather-details">
                <Button style={{ color: '#fff' }}>
                  <img src={feelslikeIcon} className="icons" alt="" />
                  <strong>Feels like: </strong>{Math.round(weather.main.feels_like)}°C
                </Button>
                <Button style={{ color: '#fff' }}>
                  <img src={humidityIcon} className="icons" alt="" />
                  <strong> Humidity: </strong>{weather.main.humidity}%
                </Button>
                <Button style={{ color: '#fff' }}>
                  <img src={descIcon} className="icons" alt="" />
                  <strong>Description: </strong>{weather.weather[0].description}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {forecast.length > 0 && (
        <>
          <Text variant="h1" style={{ color: '#fff', textAlign: 'center', margin: '2rem 0 1rem' }}>
            Hourly Weather
          </Text>
          <div className="hourly-section">
            {forecast.map((item) => (
              <div className="hourly-card" key={item.dt}>
                <Card style={{ width: '8rem', padding: '0.75rem', textAlign: 'center' }}>
                  <Text variant="h3" style={{ color: '#fff', fontSize: '0.9rem' }}>
                    {formatTime(item.dt_txt)}
                  </Text>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                    alt={item.weather[0].description}
                  />
                  <Text variant="h3" style={{ color: '#fff', fontWeight: 'bold' }}>
                    {Math.round(item.main.temp)}°C
                  </Text>
                </Card>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
};