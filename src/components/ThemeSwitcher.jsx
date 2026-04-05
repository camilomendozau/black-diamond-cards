import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { themes } from '../data/themes';

export function ThemeSwitcher() {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="font-bold text-lg mb-4" style={{ color: `var(--color-primary)` }}>
        🎨 Elige un Tema
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(availableThemes || {}).map(([key, theme]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTheme(key)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
              currentTheme === key
                ? 'border-gray-800 shadow-lg'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            style={{
              backgroundColor: currentTheme === key ? theme.colors.backgroundDark : '#ffffff',
            }}
          >
            <div
              className="h-8 rounded mb-2 flex items-center gap-2"
              style={{
                background: `linear-gradient(90deg, ${theme.gradientFrom}, ${theme.gradientVia}, ${theme.gradientTo})`,
              }}
            />
            <div style={{ color: theme.colors.text }}>
              <p className="font-semibold text-sm">{theme.name}</p>
              <p className="text-xs" style={{ color: theme.colors.textLight }}>
                {theme.description}
              </p>
            </div>
            {currentTheme === key && (
              <div className="mt-2 text-xs font-bold text-green-600">✓ Seleccionado</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
