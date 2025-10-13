import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeProvider';
import { FaSun, FaMoon } from 'react-icons/fa';
import '../styles/ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div 
      className={`theme-toggle-switch ${theme === 'dark' ? 'dark-mode' : ''}`}
      onClick={toggleTheme}
    >
      <div className="highlight"></div>
      <FaSun className="sun-icon" />
      <FaMoon className="moon-icon" />
    </div>
  );
};

export default ThemeToggle;