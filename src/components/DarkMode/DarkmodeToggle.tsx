import type React from "react";
import "./DarkmodeToggle.css";

type Props = {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DarkmodeToggle: React.FC<Props> = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={isDarkMode}
        onChange={() => setIsDarkMode((prev) => !prev)}
      />
      <span className="slider"/>
    </label>
  );
};