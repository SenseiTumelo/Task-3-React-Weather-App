import type React from "react";
//import "./DarkmodeToggle.css";


interface DarkmodeToggleProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DarkmodeToggle: React.FC<DarkmodeToggleProps> = ({ isDarkMode, setIsDarkMode }) => {
  return (

    <button type="button" onClick={() => setIsDarkMode((prev) => !prev)}>
      {isDarkMode ? "☀️" : "🌙"}
      
    {/*<label className="toggle-switch">
      <input
        type="checkbox"
        checked={isDarkMode}
        onChange={() => setIsDarkMode((prev) => !prev)}
      />
      <span className="slider"/>
    </label>*/}
    </button>

  );
};