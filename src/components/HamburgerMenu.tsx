import { useEffect, useRef, useState } from "react";

export type MenuSection =
  | "home"
  | "forecast"
  | "location"
  | "favorites"
  | "settings";

interface HamburgerMenuProps {
  activeSection: MenuSection;
  onNavigate: (section: MenuSection) => void;
}

function HamburgerMenu({
  activeSection,
  onNavigate,
}: HamburgerMenuProps) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigation = (section: MenuSection) => {
    onNavigate(section);
    setOpen(false);
  };

  return (
    <div className="hamburger-wrapper" ref={menuRef}>
      <button
        type="button"
        className={`header-icon-button hamburger-button ${
          open ? "active" : ""
        }`}
        onClick={() => setOpen((previous) => !previous)}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {open && (
        <div className="hamburger-menu">
          <button
            type="button"
            className={activeSection === "home" ? "active" : ""}
            onClick={() => handleNavigation("home")}
          >
            <span className="menu-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 11.5L12 4l9 7.5" />
                <path d="M5 10.5V20h14v-9.5" />
                <path d="M9 20v-6h6v6" />
              </svg>
            </span>

            <span>Overview</span>
          </button>

          <button
            type="button"
            className={activeSection === "forecast" ? "active" : ""}
            onClick={() => handleNavigation("forecast")}
          >
            <span className="menu-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>

            <span>Forecast</span>
          </button>

          <button
            type="button"
            className={activeSection === "location" ? "active" : ""}
            onClick={() => handleNavigation("location")}
          >
            <span className="menu-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </span>

            <span>Map</span>
          </button>

          <button
            type="button"
            className={activeSection === "favorites" ? "active" : ""}
            onClick={() => handleNavigation("favorites")}
          >
            <span className="menu-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.8 8.7c0 5-8.8 10.3-8.8 10.3S3.2 13.7 3.2 8.7A4.7 4.7 0 0 1 12 6a4.7 4.7 0 0 1 8.8 2.7z" />
              </svg>
            </span>

            <span>Favorites</span>
          </button>

          <button
            type="button"
            className={activeSection === "settings" ? "active" : ""}
            onClick={() => handleNavigation("settings")}
          >
            <span className="menu-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.5 1.5-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20h-2v-.3a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.5-1.5.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6v-2h.3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L9 7.5l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V6h2v.3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.5 1.5-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.3v2h-.3a1.7 1.7 0 0 0-1.6 1z" />
              </svg>
            </span>

            <span>Settings</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default HamburgerMenu;