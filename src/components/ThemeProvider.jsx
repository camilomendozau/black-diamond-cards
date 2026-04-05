import React, { createContext, useEffect, useState } from 'react';
import { themes, defaultTheme } from '../data/themes';

const defaultTemplate = 'classic';
const defaultLayout = 'default';

const validTemplates = ['classic', 'glass', 'bold'];
const validLayouts = ['default', 'centered', 'sidebar'];

// Create the theme context
export const ThemeContext = createContext({
  currentTheme: defaultTheme,
  currentTemplate: defaultTemplate,
  currentLayout: defaultLayout,
  setTheme: () => {},
  themeColors: themes[defaultTheme].colors,
});

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  const [currentTemplate, setCurrentTemplate] = useState(defaultTemplate);
  const [currentLayout, setCurrentLayout] = useState(defaultLayout);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    const urlTheme = urlParams.get('th');
    const urlTemplate = urlParams.get('t');
    const urlLayout = urlParams.get('l');
    
    const savedTheme = localStorage.getItem('biolife-theme');
    const savedTemplate = localStorage.getItem('biolife-template');
    const savedLayout = localStorage.getItem('biolife-layout');
    
    const initialTheme = (urlTheme && themes[urlTheme]) 
      ? urlTheme 
      : (savedTheme || defaultTheme);
    
    const initialTemplate = (urlTemplate && validTemplates.includes(urlTemplate))
      ? urlTemplate
      : (savedTemplate || defaultTemplate);
    
    const initialLayout = (urlLayout && validLayouts.includes(urlLayout))
      ? urlLayout
      : (savedLayout || defaultLayout);
    
    if (urlTheme && themes[urlTheme]) {
      localStorage.setItem('biolife-theme', urlTheme);
    }
    if (urlTemplate && validTemplates.includes(urlTemplate)) {
      localStorage.setItem('biolife-template', urlTemplate);
    }
    if (urlLayout && validLayouts.includes(urlLayout)) {
      localStorage.setItem('biolife-layout', urlLayout);
    }
    
    setCurrentTheme(initialTheme);
    setCurrentTemplate(initialTemplate);
    setCurrentLayout(initialLayout);
    applyTheme(initialTheme);
    applyBodyClasses(initialTemplate, initialLayout);
    setMounted(true);
  }, []);

  const applyTheme = (themeName) => {
    const selectedTheme = themes[themeName];
    if (!selectedTheme) return;

    // Apply CSS variables to document root
    const root = document.documentElement;

    Object.entries(selectedTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply gradient variables
    root.style.setProperty('--gradient-from', selectedTheme.gradientFrom);
    root.style.setProperty('--gradient-via', selectedTheme.gradientVia);
    root.style.setProperty('--gradient-to', selectedTheme.gradientTo);

    // Save preference
    localStorage.setItem('biolife-theme', themeName);
    setCurrentTheme(themeName);
  };

  const applyBodyClasses = (template, layout) => {
    const body = document.body;
    body.classList.remove('template-classic', 'template-glass', 'template-bold');
    body.classList.remove('layout-default', 'layout-centered', 'layout-sidebar');
    body.classList.remove('page-index', 'page-presentacion', 'page-catalogo', 'page-precios', 'page-porque', 'page-capacitacion', 'page-acceso', 'page-registro', 'page-configuracion');
    body.classList.add(`template-${template}`);
    
    const path = window.location.pathname;
    const isIndexPage = path === '/' || path === '/index.html' || path === '';
    const finalLayout = isIndexPage ? layout : 'default';
    
    body.classList.add(`layout-${finalLayout}`);
    
    let pageClass = 'page-index';
    if (path.includes('presentacion')) pageClass = 'page-presentacion';
    else if (path.includes('catalogo')) pageClass = 'page-catalogo';
    else if (path.includes('precios')) pageClass = 'page-precios';
    else if (path.includes('porque')) pageClass = 'page-porque';
    else if (path.includes('capacitacion')) pageClass = 'page-capacitacion';
    else if (path.includes('acceso')) pageClass = 'page-acceso';
    else if (path.includes('registro')) pageClass = 'page-registro';
    else if (path.includes('configuracion')) pageClass = 'page-configuracion';
    body.classList.add(pageClass);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  const themeValue = {
    currentTheme,
    currentTemplate,
    currentLayout,
    setTheme: applyTheme,
    themeColors: themes[currentTheme]?.colors || themes[defaultTheme].colors,
    availableThemes: themes,
    availableTemplates: validTemplates,
    availableLayouts: validLayouts,
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}