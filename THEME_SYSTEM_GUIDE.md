# 🎨 Sistema de Temas - Guía Completa

## 📋 Descripción General

Se ha implementado un **sistema de temas dinámico** para tu proyecto Biolife que permite cambiar los estilos visuales de toda la aplicación sin necesidad de recargar la página.

### Características:
✅ **7 temas predefinidos** listos para usar
✅ **Persistencia** - Los cambios se guardan en el navegador
✅ **Sin necesidad de compilación** - Los cambios son instantáneos
✅ **Basado en CSS Variables** - Compatible con Tailwind CSS
✅ **Fácil de extender** - Puedes agregar más temas rápidamente

---

## 🎯 Temas Disponibles

1. **BioGreen** (Predeterminado) - Verde fresco con acentos ámbar
2. **Ocean Wave** - Azulesoes profundos con acentos cian
3. **Sunset Vibes** - Naranjas cálidos y púrpuras
4. **Dark Forest** - Verdes oscuros con acentos dorados
5. **Purple Power** - Púrpuras audaces con acentos rosas
6. **Minimal Gray** - Grises limpios con acentos azules
7. **Tropical Paradise** - Colores tropicales vibrantes

---

## 🔧 Cómo Cambiar de Tema

### Opción 1: Interfaz Visual (Recomendado)
1. Ve a `/configuracion` en tu navegador
2. Selecciona el tema que desees
3. ¡Los cambios se aplican instantáneamente!

### Opción 2: Consola del Navegador (Desarrollo)
```javascript
// Abre las herramientas de desarrollador (F12)
// Y ejecuta:
localStorage.setItem('biolife-theme', 'ocean'); // o cualquier otro tema
location.reload();
```

### Opción 3: Programáticamente en Componentes React
```jsx
import { useTheme } from '../hooks/useTheme';

function MiComponente() {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <button onClick={() => setTheme('sunset')}>
      Cambiar a Sunset
    </button>
  );
}
```

---

## 📁 Archivos Creados

```
src/
├── data/
│   └── themes.js                 # Definición de todos los temas
├── components/
│   ├── ThemeProvider.jsx         # Proveedor de contexto de temas
│   └── ThemeSwitcher.jsx         # Componente UI para cambiar temas
├── hooks/
│   └── useTheme.js               # Hook personalizado para usar temas
├── styles/
│   └── global.css                # CSS variables y utilidades
├── layouts/
│   ├── Layout.astro              # (Actualizado) Envuelto con ThemeProvider
│   └── LayoutTraining.astro      # (Actualizado) Envuelto con ThemeProvider
└── pages/
    └── configuracion.astro       # Página de configuración/temas

```

---

## 🎨 Cómo Usar CSS Variables en Tus Componentes

### En Archivos CSS/Astro
```css
.mi-elemento {
  background-color: var(--color-primary);
  color: var(--color-text);
  border-color: var(--color-border);
}

.degradado {
  background: linear-gradient(
    90deg,
    var(--gradient-from),
    var(--gradient-via),
    var(--gradient-to)
  );
}
```

### Variables Disponibles en Cada Tema
```
--color-primary          # Color primario principal
--color-primaryLight     # Versión clara del primario
--color-primaryDark      # Versión oscura del primario
--color-secondary        # Color secundario
--color-secondaryDark    # Versión oscura del secundario
--color-accent           # Color de acento
--color-background       # Color de fondo
--color-backgroundDark   # Color de fondo oscuro
--color-text             # Color del texto
--color-textLight        # Texto en un tono claro
--color-border           # Color de bordes
--color-card             # Color de las tarjetas
--gradient-from          # Inicio del gradiente
--gradient-via           # Punto medio del gradiente
--gradient-to            # Final del gradiente
```

### En Componentes React con Inline Styles
```jsx
function MiBoton() {
  return (
    <button style={{
      backgroundColor: 'var(--color-primary)',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '8px'
    }}>
      Mi Botón
    </button>
  );
}
```

### Utility Classes Personalizadas

Ya hay clases Tailwind predefinidas en `global.css`:

```html
<!-- Botón primario -->
<button class="btn-primary">Guardar</button>

<!-- Botón secundario -->
<button class="btn-secondary">Descargar</button>

<!-- Tarjeta con tema -->
<div class="card p-4">
  Contenido adaptable al tema
</div>

<!-- Texto con gradiente -->
<h1 class="gradient-text">Título Especial</h1>

<!-- Fondo con gradiente -->
<div class="gradient-bg p-8">
  Fondo gradiente
</div>

<!-- Texto del color primario -->
<p class="text-primary">Texto importante</p>

<!-- Fondo de tarjeta -->
<div class="bg-card p-4">
  Tarjeta
</div>
```

---

## 📝 Cómo Agregar un Nuevo Tema

1. **Abre `src/data/themes.js`**

2. **Añade tu nuevo tema en el objeto `themes`:**

```javascript
export const themes = {
  // ... temas existentes ...

  minombre: {
    id: 'minombre',
    name: 'Mi Nombre',
    description: 'Descripción de mi tema',
    colors: {
      primary: '#FF0000',
      primaryLight: '#FF3333',
      primaryDark: '#CC0000',
      secondary: '#FFFF00',
      secondaryDark: '#CCCC00',
      accent: '#00FF00',
      background: '#FFFFFF',
      backgroundDark: '#F5F5F5',
      text: '#000000',
      textLight: '#666666',
      border: '#DDDDDD',
      card: '#FFFFFF',
    },
    gradientFrom: '#FF0000',
    gradientVia: '#FF3333',
    gradientTo: '#FFFF00',
  },
};
```

3. **Listo!** Tu tema aparecerá automáticamente en el selector de temas.

---

## 🚀 Cómo Integrar Temas en Componentes Existentes

### Ejemplo: Actualizar un Botón

**Antes:**
```jsx
<button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
  Guardar
</button>
```

**Después:**
```jsx
<button
  className="text-white px-4 py-2 rounded transition-all hover:scale-105"
  style={{
    backgroundColor: 'var(--color-primary)',
  }}
  onMouseOver={(e) => e.target.style.backgroundColor = 'var(--color-primaryLight)'}
>
  Guardar
</button>
```

**O mejor aún, usa el utility class:**
```jsx
<button className="btn-primary">Guardar</button>
```

---

## 🛠️ Troubleshooting

### El tema no cambia
- Asegúrate de que `ThemeProvider` envuelve el contenido en tu layout
- Verifica que `client:load` esté presente en Astro (ej: `<ThemeProvider client:load>`)

### Las variables CSS no funcionan
- Abre las herramientas de desarrollo (F12)
- Vé a Elements/Inspector
- Busca `:root` en los estilos
- Verifica que `--color-*` variables estén ahí

### Los colores no cambian en componentes específicos
- Reemplaza colores hardcodeados (ej `bg-green-500`) con variables CSS
- Usa inline styles: `style={{ backgroundColor: 'var(--color-primary)' }}`

---

## 💾 Cómo Funciona Internamente

1. **ThemeProvider** inyecta variables CSS en el `:root` del documento
2. Los componentes usan `var(--color-*)` para acceder a estos valores
3. Al cambiar el tema, se actualizan todas las variables CSS
4. Los navegadores aplican los cambios instantáneamente (sin recargar)
5. La preferencia se guarda en `localStorage` para persistencia

---

## 📱 Compatibilidad

✅ Chrome/Edge 49+
✅ Firefox 31+
✅ Safari 9.1+
✅ Opera 36+
✅ Todos los navegadores móviles modernos

---

## 🎯 Próximos Pasos

1. **Reemplaza colores hardcodeados** en componentes que no usen variables CSS
2. **Actualiza ButtonRedirect.astro** para usar CSS variables
3. **Personaliza más componentes** siguiendo el patrón de `btn-primary`
4. **Crea temas adicionales** personalizados para tu marca

---

## 📞 Soporte

Si necesitas ayuda:
1. Revisa los archivos creados en `src/data/` y `src/components/`
2. Compara con ejemplos en `ControlPanel.jsx` o `ThemeSwitcher.jsx`
3. Usa las herramientas de desarrollo para inspeccionar estilos

¡Tu sistema de temas está listo para usar! 🎉
