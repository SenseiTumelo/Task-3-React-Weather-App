import React, { useState } from "react";
import { Text } from "./Text";
import { Button } from "./ButtonComponent/Button";
import descIcon from "../assets/description.png";
import hunidityIcon from "../assets/humidity.png";
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

export const Hero = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found. Please check the spelling.");
        } else if (response.status === 401) {
          throw new Error("Invalid API key. Check your .env file.");
        }
        throw new Error("Failed to fetch weather data.");
      }

      const data: WeatherData = await response.json();
      setWeather(data);
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

  return (
    <main >
      <div className="hero-section">      
        <div className="location-details">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="city"
              value={city}
              name="city"
              placeholder="Search for location"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
            />
            <Button style={{ color: "#fff", marginLeft: "0.5rem", width: "5rem", height: "2.5rem" }}>
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
                <Button style={{ color: '#fff' }} >
                  <img src={feelslikeIcon} className="icons" alt="" />
                  <strong>Feels like: </strong>{Math.round(weather.main.feels_like)}°C
                </Button>
                <Button style={{ color: '#fff' }}>
                  <img src={hunidityIcon} className="icons" alt="" />
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
      <div className="hourly-section">
        <Card ><Text variant="h3">Monday</Text></Card>
      </div>

    </main>
  );
};