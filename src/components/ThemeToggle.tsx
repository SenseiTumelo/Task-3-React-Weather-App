import { useEffect, useState } from "react";

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark-theme");
      document.body.classList.add("dark-theme");

      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark-theme");
      document.body.classList.remove("dark-theme");

      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      type="button"
      className={`theme-toggle ${
        darkMode ? "theme-toggle--dark" : ""
      }`}
      onClick={() =>
        setDarkMode((previous) => !previous)
      }
      aria-label={
        darkMode
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      title={
        darkMode
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
    >
      <span className="theme-toggle__icon">
        {darkMode ? "☀" : "☾"}
      </span>
    </button>
  );
}

export default ThemeToggle;