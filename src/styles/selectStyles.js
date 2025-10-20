export const getSelectStyles = (theme) => {
  const isDark = theme === 'dark';
  return {
      control: (p, s) => ({ ...p, backgroundColor: isDark ? '#2d3748' : '#ffffff', borderColor: s.isFocused ? (isDark ? '#00796b' : '#00695c') : (isDark ? '#4a5568' : '#e2e8f0'), color: isDark ? '#f7fafc' : '#2d3748', boxShadow: s.isFocused ? `0 0 0 1px ${isDark ? '#00796b' : '#00695c'}` : 'none', '&:hover': { borderColor: isDark ? '#00796b' : '#00695c' } }),
      menu: p => ({ ...p, backgroundColor: isDark ? '#2d3748' : '#ffffff', zIndex: 9999 }),
      option: (p, s) => ({ ...p, backgroundColor: s.isSelected ? (isDark ? '#00796b' : '#00695c') : s.isFocused ? (isDark ? '#4a5568' : '#e6f6f3') : 'transparent', color: s.isSelected ? '#ffffff' : (isDark ? '#f7fafc' : '#2d3748'), '&:active': { backgroundColor: isDark ? '#00796b' : '#00695c' } }),
      singleValue: p => ({ ...p, color: isDark ? '#f7fafc' : '#2d3748' }),
      input: p => ({ ...p, color: isDark ? '#f7fafc' : '#2d3748' }),
      placeholder: p => ({ ...p, color: isDark ? '#a0aec0' : '#a0aec0' }),
  };
};