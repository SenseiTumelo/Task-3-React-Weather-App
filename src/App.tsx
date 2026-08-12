import { type FormEvent, useEffect, useState } from "react";
import ThemeToggle from "./components/ThemeToggle";
import WeatherCard from "./components/WeatherCard";
import ForecastSection from "./components/ForecastSection";
import MoreDetailsCard from "./components/MoreDetailsCard";

import settingIcon from "./assets/sidebarIcons/setting.png";
import humidityIcon from "./assets/humidity.png";
import homeIcon from "./assets/home.png";
import forecastIcon from "./assets/forecast.png";
import locationIcon from "./assets/location.png";
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

  const [savedLocations, setSavedLocations] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [deleteCandidate, setDeleteCandidate] =
    useState<string | null>(null);

  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  console.log("isOffline:", isOffline);
  const weatherCacheStorageKey = "weather-cache";

  type CachedWeatherStorage = Record<
    string,
    {
      weather: WeatherData;
      forecast: ForecastData;
      timestamp: number;
    }
  >;

  const normalizeCacheKey = (cityName: string) =>
    cityName.trim().toLowerCase();

  const loadAllCachedWeatherData = (): CachedWeatherStorage => {
    const raw = localStorage.getItem(weatherCacheStorageKey);
    if (!raw) return {};

    try {
      return JSON.parse(raw) as CachedWeatherStorage;
    } catch {
      return {};
    }
  };

  const getCachedCityData = (cityName: string) => {
    const cache = loadAllCachedWeatherData();
    return cache[normalizeCacheKey(cityName)] ?? null;
  };

  const cacheWeatherData = (
    weatherData: WeatherData,
    forecastData: ForecastData,
    cityName: string
  ) => {
    const cache = loadAllCachedWeatherData();

    cache[normalizeCacheKey(cityName)] = {
      weather: weatherData,
      forecast: forecastData,
      timestamp: Date.now(),
    };

    localStorage.setItem(
      weatherCacheStorageKey,
      JSON.stringify(cache)
    );
    localStorage.setItem(
      `${weatherCacheStorageKey}-last`,
      normalizeCacheKey(cityName)
    );
  };

  const loadLastCachedCityKey = (): string | null => {
    return localStorage.getItem(`${weatherCacheStorageKey}-last`);
  };

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const loadInitialWeather = async () => {
      setLoading(true);
      setError("");

      const lastCityKey = loadLastCachedCityKey();
      const cached =
        (lastCityKey && getCachedCityData(lastCityKey)) ||
        null;

      if (!navigator.onLine) {
        if (cached) {
          setWeather(cached.weather);
          setForecast(cached.forecast);
          setSearchCity(cached.weather.name);
          setQuery(cached.weather.name);
          setLocationStatus(
            "Offline: showing cached weather data."
          );
        } else {
          setError(
            "Offline and no cached weather data is available."
          );
        }

        setLoading(false);
        return;
      }

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

          cacheWeatherData(
            currentWeather,
            currentForecast,
            currentWeather.name
          );

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

        cacheWeatherData(
          currentWeather,
          currentForecast,
          currentWeather.name
        );

        setLocationStatus(
          `Using your current location: ${currentWeather.name}`
        );
      } catch {
        if (cached) {
          setWeather(cached.weather);
          setForecast(cached.forecast);
          setSearchCity(cached.weather.name);
          setQuery(cached.weather.name);
          setLocationStatus(
            "Showing cached weather data due to network problem."
          );
        } else {
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

            cacheWeatherData(
              fallbackWeather,
              fallbackForecast,
              fallbackWeather.name
            );

            setLocationStatus(
              "Location permission denied. Using Polokwane instead."
            );
          } catch {
            setError("Unable to load weather data.");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    void loadInitialWeather();
  }, []);

  const handleSaveLocation = () => {
    const locationName = weather?.name;

    if (!locationName) {
      return;
    }

    const alreadySaved = savedLocations.includes(locationName);

    setSavedLocations((prev) =>
      alreadySaved ? prev : [...prev, locationName]
    );

    setToastMessage(
      alreadySaved
        ? `${locationName} is already saved.`
        : `${locationName} saved successfully.`
    );
    setToastVisible(true);

    window.setTimeout(() => {
      setToastVisible(false);
    }, 2200);
  };

  const handleRequestDeleteSavedLocation = (
    location: string
  ) => {
    setDeleteCandidate(location);
  };

  const handleCancelDeleteSavedLocation = () => {
    setDeleteCandidate(null);
  };

  const handleDeleteSavedLocation = (
    locationToDelete: string
  ) => {
    if (!locationToDelete) {
      return;
    }

    setSavedLocations((prev) =>
      prev.filter((location) => location !== locationToDelete)
    );

    setToastMessage(
      `${locationToDelete} removed from saved locations.`
    );
    setToastVisible(true);
    setDeleteCandidate(null);

    window.setTimeout(() => {
      setToastVisible(false);
    }, 2200);
  };

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const city = query.trim();
    if (!city) {
      return;
    }

    setLoading(true);
    setError("");

    if (!navigator.onLine) {
      const cached = getCachedCityData(city);

      if (cached) {
        setWeather(cached.weather);
        setForecast(cached.forecast);
        setSearchCity(cached.weather.name);
        setQuery(cached.weather.name);
        setLocationStatus(
          `Offline: showing cached weather for ${cached.weather.name}.`
        );
      } else {
        setError(
          `No cached weather for "${city}". Search a location while online first.`
        );
      }

      setLoading(false);
      return;
    }

    try {
      const [currentWeather, currentForecast] =
        await Promise.all([
          getWeatherByCity(city),
          getForecastByCity(city),
        ]);

      setWeather(currentWeather);
      setForecast(currentForecast);
      setSearchCity(currentWeather.name);
      setQuery(currentWeather.name);

      cacheWeatherData(
        currentWeather,
        currentForecast,
        currentWeather.name
      );

      setLocationStatus(
        `Showing weather for ${currentWeather.name}`
      );
    } catch {
      const cached = getCachedCityData(city);
      if (cached) {
        setWeather(cached.weather);
        setForecast(cached.forecast);
        setSearchCity(cached.weather.name);
        setQuery(cached.weather.name);
        setLocationStatus(
          "Offline: showing cached weather data."
        );
      } else {
        setError(
          "Unable to load weather for that city. Try again."
        );
      }
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
      icon: homeIcon,
    },
    {
      key: "forecast",
      label: "Forecast",
      icon: forecastIcon,
    },
    {
      key: "location",
      label: "Location",
      icon: locationIcon,
    },
    {
      key: "settings",
      label: "Settings",
      icon: settingIcon,
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
                    <img
                      src={item.icon}
                      alt={`${item.label} icon`}
                    />
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
        {toastVisible && (
          <div className="toast-notification">
            {toastMessage}
          </div>
        )}

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

<div className="settings-row">


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
                  onSaveLocation={handleSaveLocation}
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

              {savedLocations.length > 0 && (
                <div className="saved-locations-card">
                  <div className="saved-locations-header">
                    <h3>Saved Locations</h3>
                  </div>

                  <ul className="saved-locations-list">
                    {savedLocations.map((location) => (
                      <li
                        key={location}
                        className="saved-location-item"
                      >
                        <span>{location}</span>

                        <button
                          type="button"
                          className="saved-location-delete-button"
                          onClick={() =>
                            handleRequestDeleteSavedLocation(location)
                          }
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {deleteCandidate && (
                <div
                  className="confirm-delete-overlay"
                  role="dialog"
                  aria-modal="true"
                >
                  <div className="confirm-delete-modal">
                    <h3>Confirm delete</h3>
                    <p>
                      Remove "{deleteCandidate}" from saved locations?
                    </p>

                    <div className="confirm-delete-actions">
                      <button
                        type="button"
                        className="confirm-delete-button cancel"
                        onClick={handleCancelDeleteSavedLocation}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        className="confirm-delete-button confirm"
                        onClick={() =>
                          handleDeleteSavedLocation(deleteCandidate)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

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