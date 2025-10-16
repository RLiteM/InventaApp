import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeProvider';
import { FaSun, FaMoon } from 'react-icons/fa';
import '../styles/ThemeToggle.css';

const ThemeToggle = ({ isCollapsed }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Si está colapsado, muestra solo el ícono activo
  if (isCollapsed) {
    return (
      <div className="theme-toggle-collapsed" onClick={toggleTheme}>
        {theme === 'dark' ? <FaMoon /> : <FaSun />}
      </div>
    );
  }

  // Renderizado normal del interruptor
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