import { type FormEvent, useEffect, useState } from "react";
import ThemeToggle from "./components/ThemeToggle";
import WeatherCard from "./components/WeatherCard";
import ForecastSection from "./components/ForecastSection";
import MoreDetailsCard from "./components/MoreDetailsCard";

import {
  getForecastByCity,
  getForecastByCoordinates,
  getWeatherByCity,
  getWeatherByCoordinates,
  type ForecastData,
  type TemperatureUnit,
  type WeatherData,
} from "./services/weatherService";

type NavigationSection = "home" | "forecast" | "location" | "settings";

function App() {
  const [query, setQuery] = useState("Polokwane");
  const [searchCity, setSearchCity] = useState("Polokwane");

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeSection, setActiveSection] =
    useState<NavigationSection>("home");

  const [temperatureUnit, setTemperatureUnit] =
    useState<TemperatureUnit>("metric");

  const [locationStatus, setLocationStatus] =
    useState("Requesting your location...");

  const [sidebarOpen, setSidebarOpen] = useState(false);


  useEffect(() => {
    const loadInitialWeather = async () => {
      setLoading(true);
      setError("");

      try {
        if (!navigator.geolocation) {
          const [currentWeather, currentForecast] =
            await Promise.all([
              getWeatherByCity("Polokwane"),
              getForecastByCity("Polokwane"),
            ]);

          setWeather(currentWeather);
          setForecast(currentForecast);
          setSearchCity(currentWeather.name);
          setQuery(currentWeather.name);

          setLocationStatus(
            "Geolocation is not supported. Using Polokwane."
          );

          return;
        }

        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
              }
            );
          }
        );

        const [currentWeather, currentForecast] =
          await Promise.all([
            getWeatherByCoordinates(
              position.coords.latitude,
              position.coords.longitude
            ),
            getForecastByCoordinates(
              position.coords.latitude,
              position.coords.longitude
            ),
          ]);

        setWeather(currentWeather);
        setForecast(currentForecast);
        setSearchCity(currentWeather.name);
        setQuery(currentWeather.name);

        setLocationStatus(
          `Using your current location: ${currentWeather.name}`
        );
      } catch {
        try {
          const [fallbackWeather, fallbackForecast] =
            await Promise.all([
              getWeatherByCity("Polokwane"),
              getForecastByCity("Polokwane"),
            ]);

          setWeather(fallbackWeather);
          setForecast(fallbackForecast);
          setSearchCity(fallbackWeather.name);
          setQuery(fallbackWeather.name);

          setLocationStatus(
            "Location permission denied. Using Polokwane instead."
          );
        } catch {
          setError("Unable to load weather data.");
        }
      } finally {
        setLoading(false);
      }
    };

    void loadInitialWeather();
  }, []);


  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();

    const trimmed = query.trim();

    if (!trimmed) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [currentWeather, currentForecast] =
        await Promise.all([
          getWeatherByCity(trimmed),
          getForecastByCity(trimmed),
        ]);

      setWeather(currentWeather);
      setForecast(currentForecast);

      setSearchCity(currentWeather.name);
      setQuery(currentWeather.name);

      setLocationStatus(
        `Showing weather for ${currentWeather.name}`
      );
    } catch {
      setError("City not found. Please try another city.");
    } finally {
      setLoading(false);
    }
  };


  const handleNavigation = (section: NavigationSection) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const navItems: Array<{
    key: NavigationSection;
    label: string;
    icon: string;
  }> = [
    {
      key: "home",
      label: "Home",
      icon: "⌂",
    },
    {
      key: "forecast",
      label: "Forecast",
      icon: "☁",
    },
    {
      key: "location",
      label: "Location",
      icon: "⌖",
    },
    {
      key: "settings",
      label: "Settings",
      icon: "⚙",
    },
  ];

  return (
    <div className="app-shell">

   
      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`side-nav ${
          sidebarOpen ? "side-nav--open" : ""
        }`}
      >
        <div className="side-nav__brand">

          <div className="side-nav__logo">
            ☁
          </div>

          <div>
            <div className="side-nav__brand-title">
              Weather App
            </div>

          </div>

        </div>



        <nav>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  className={`navigator ${
                    activeSection === item.key
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handleNavigation(item.key)
                  }
                >
                  <span className="navigator__icon">
                    {item.icon}
                  </span>

                  <span>
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

      </aside>

  
      <div className="main-area">

   
        <header className="topbar">

          <div className="topbar-left">

   
            <button
              type="button"
              className="hamburger-button"
              onClick={() =>
                setSidebarOpen((prev) => !prev)
              }
              aria-label="Toggle navigation menu"
              aria-expanded={sidebarOpen}
            >
              <span />
              <span />
              <span />
            </button>

            <div className="page-heading">

              <p className="page-heading__eyebrow">
                WEATHER DETAILS
              </p>

              <h1>
                {activeSection === "home" &&
                  "Today's Weather"}

                {activeSection === "forecast" &&
                  "Weather Forecast"}

                {activeSection === "location" &&
                  "Your Location"}

                {activeSection === "settings" &&
                  "Settings"}
              </h1>

            </div>

          </div>

          <div className="topbar-right">


            <ThemeToggle />

          </div>

        </header>


        <main className="content-area">


          {activeSection === "home" && (
            <div className="home-layout">

        
              <div className="search-area">


                <form
                  className="search-form"
                  onSubmit={handleSearch}
                >
                  <div className="search-input-wrapper">
                    <span className="search-icon">
                      ⌕
                    </span>

                    <input
                      type="text"
                      value={query}
                      onChange={(e) =>
                        setQuery(e.target.value)
                      }
                      placeholder="Search for a city..."
                    />
                  </div>

                  <button type="submit">
                    Search
                  </button>
                </form>

              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

     
              <div className="home-grid">

                <WeatherCard
                  city={searchCity}
                  temperatureUnit={temperatureUnit}
                />

                <MoreDetailsCard
                  weather={weather}
                  temperatureUnit={temperatureUnit}
                />

              </div>


              <ForecastSection
                forecast={forecast}
                temperatureUnit={temperatureUnit}
                loading={loading}
              />

            </div>
          )}

    
          {activeSection === "forecast" && (
            <div className="page-section">

              <div className="page-section__header">
                <p className="section-label">
                  FORECAST
                </p>

                <h2>
                  5-Day Weather Forecast
                </h2>

                <p>
                  Detailed weather conditions for{" "}
                  {searchCity}.
                </p>
              </div>

              <ForecastSection
                forecast={forecast}
                temperatureUnit={temperatureUnit}
                loading={loading}
              />

            </div>
          )}

      
          {activeSection === "location" && (
            <div className="page-section">

              <div className="page-section__header">
                <p className="section-label">
                  LOCATIONS
                </p>

                <h2>
                  Current Location
                </h2>

                <p>
                  {locationStatus}
                </p>
              </div>

              <div className="location-card">

                <div className="location-icon">
                  ⌖
                </div>

                <div className="location-information">

                  <span>
                    CITY
                  </span>

                  <strong>
                    {weather?.name ||
                      "Polokwane"}
                  </strong>

                </div>

                <div className="location-information">

                  <span>
                    COUNTRY
                  </span>

                  <strong>
                    {weather?.country ||
                      "ZA"}
                  </strong>

                </div>

                <div className="location-information">

                  <span>
                    CONDITIONS
                  </span>

                  <strong>
                    {weather?.condition ||
                      "Clear"}
                  </strong>

                </div>

              </div>

            </div>
          )}


          {activeSection === "settings" && (
            <div className="page-section">

              <div className="page-section__header">
                <p className="section-label">
                  SETTINGS
                </p>

                <h2>
                  Weather Preferences
                </h2>

              </div>

              <div className="settings-card">

                <div className="settings-row">

                  <div>
                    <strong>
                      Temperature Unit
                    </strong>

                    <p>
                      Choose between Celsius and
                      Fahrenheit.
                    </p>
                  </div>

                  <label className="unit-switch">

                    <span
                      className={
                        temperatureUnit ===
                        "metric"
                          ? "selected"
                          : ""
                      }
                    >
                      °C
                    </span>

                    <input
                      type="checkbox"
                      checked={
                        temperatureUnit ===
                        "imperial"
                      }
                      onChange={() =>
                        setTemperatureUnit(
                          (prev) =>
                            prev === "metric"
                              ? "imperial"
                              : "metric"
                        )
                      }
                    />

                    <span
                      className={
                        temperatureUnit ===
                        "imperial"
                          ? "selected"
                          : ""
                      }
                    >
                      °F
                    </span>

                  </label>

                </div>

              </div>

            </div>
          )}

        </main>

      </div>
    </div>
  );
}

export default App;