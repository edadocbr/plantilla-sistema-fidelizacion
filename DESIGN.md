---
name: Interfaz de Caja · Fidelización
description: Sistema neutro y de alto contraste para Caja, el pase del Cliente y el panel de Administración, sobre shadcn/ui radix-nova.
colors:
  ink: "oklch(0.205 0 0)"
  ink-deep: "oklch(0.145 0 0)"
  paper: "oklch(1 0 0)"
  paper-on-ink: "oklch(0.985 0 0)"
  mist: "oklch(0.97 0 0)"
  graphite: "oklch(0.48 0 0)"
  hairline: "oklch(0.922 0 0)"
  alert-red: "oklch(0.577 0.245 27.325)"
  qr-white: "#ffffff"
  qr-black: "#000000"
typography:
  display:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1
    fontFeature: "tnum"
  headline:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    letterSpacing: "0.1em"
    fontFeature: "tnum"
  title:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "20px"
  control-desktop: "40px"
  row-desktop: "44px"
  touch: "48px"
  touch-primary: "56px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-on-ink}"
    rounded: "{rounded.lg}"
    height: "56px"
    padding: "0 24px"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-deep}"
    rounded: "{rounded.lg}"
    height: "48px"
    padding: "0 20px"
  button-ghost:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-deep}"
    rounded: "{rounded.lg}"
    height: "48px"
    padding: "0 20px"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-deep}"
    typography: "{typography.headline}"
    rounded: "{rounded.lg}"
    height: "56px"
    padding: "0 16px"
  card-profile:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-deep}"
    rounded: "{rounded.xl}"
    padding: "16px"
  alert-error:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.alert-red}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  alert-prize:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-on-ink}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  stamp-earned:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-on-ink}"
    rounded: "{rounded.lg}"
  stamp-empty:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.lg}"
  reward-row:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-on-ink}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  qr-panel:
    backgroundColor: "{colors.qr-white}"
    textColor: "{colors.qr-black}"
    rounded: "{rounded.xl}"
    padding: "12px"
  table-row-desktop:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-deep}"
    height: "44px"
    padding: "0 16px"
  button-desktop:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-on-ink}"
    rounded: "{rounded.lg}"
    height: "40px"
    padding: "0 16px"
  input-desktop:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-deep}"
    rounded: "{rounded.lg}"
    height: "40px"
    padding: "0 12px"
  sidebar-desktop:
    textColor: "{colors.ink-deep}"
    width: "240px"
  badge-status:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "24px"
    padding: "0 10px"
---

# Design System: Interfaz de Caja · Fidelización

_Incluye la Vista del Cliente (`/customer`), el pase digital que Caja escanea, y el Panel de Administración (`/admin`)._

<!-- Nota de proceso: el modo se ejecutó sin la entrevista de lenguaje cualitativo (se pidió generar el archivo directamente). North Star, nombres de color y reglas con nombre son inferencias a partir del código y de PRODUCT.md; confirmarlas o corregirlas. -->

## Overview

**Creative North Star: "The Till Instrument"**

Un instrumento de mostrador: neutro, preciso y silencioso. La pantalla de Caja se usa de pie, con el cliente esperando, a menudo bajo luz de tienda y con una mano. No compite por atención: el saldo, el campo de DNI y la acción primaria son lo único que pesa. El sistema usa tinta casi negra sobre papel blanco, sin color de marca, y reserva el rojo para errores. El estilo es el de shadcn/ui `radix-nova` (neutral, `baseColor: neutral`, iconos Lucide) sin personalización de identidad.

**Modo operativo: Operate.** Una sola pantalla de alta velocidad. Presupuesto de respuesta de menos de 3 segundos por operación. No hay navegación secundaria, ni páginas intermedias, ni modales bloqueantes. Las dos fases (Identificar y Atender) intercambian contenido en el mismo lugar; la confirmación de canje y los errores son inline. Escaneabilidad, consistencia y velocidad pesan más que la expresión.

**Vista del Cliente.** El pase digital (`/customer`) sigue en modo Operate: es la otra mitad de la misma transacción, la pantalla que el cliente muestra en el mostrador. Una sola pantalla móvil, sin modales ni navegación, con el QR como foco estático y el progreso y las recompensas debajo. Es una pantalla de baja frecuencia para el cliente, por eso admite micro-animaciones puntuales de refuerzo (ver Delight controlado) sin cambiar el carácter del sistema.

**Panel de Administración.** `/admin` es Operate puro y desktop-first (1280–1920 px): alta densidad, escaneabilidad rápida y navegación sin recargas completas (layout persistente con sidebar y cabecera). Tres secciones: Resumen (KPIs, gráfico de barras y actividad en caja), Clientes (tabla densa con búsqueda reactiva, filtro de estado, orden y panel lateral de detalle) y Programa (reglas, recompensas y activación). Sin delight y sin decoración. Atajos: `g r`, `g c`, `g p`, `/` y `Ctrl+S`; las acciones por teclado no se animan. A diferencia de Caja, admite un diálogo bloqueante para el alta del programa, porque la modalidad es irrevocable.

**Key Characteristics:**
- Neutral monocromo; el único color es el rojo de error.
- Objetivos táctiles de 48 px, y 56 px para la acción primaria y los campos.
- Saldo en cifras tabulares grandes, siempre visible.
- Plano: sin sombras, profundidad por anillos de 1 px.
- Movimiento mínimo y funcional, solo `transform` y `opacity`.

### Motion

Los tokens viven en `app/globals.css` (`:root`) y siguen las curvas de Emil Kowalski. Son la única fuente de curvas y duraciones de UI.

- `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`: única curva de UI. Sin `ease-in`.
- `--dur-fast: 120ms`: respuesta de botón (`scale(0.97)` al pulsar).
- `--dur-base: 180ms`: entrada de fase y alertas (`translateY` de 8 px y -4 px, más `opacity`).
- `--dur-slow: 240ms`: avance de la barra de progreso y toast.
- Máximo de UI: 240 ms; ninguna animación supera 300 ms.
- Propiedades permitidas: `transform` (incluidas `translate` y `scale`) y `opacity`. Nunca `height`, `width`, `top`, `margin`, `box-shadow`, `filter` ni color. Por eso `button`, `input`, `badge`, `progress` y `sonner` fueron ajustados (sin `transition-all` ni `transition-colors`).
- Keyframes propios: `motion-enter`, `motion-alert-enter`, `motion-pop`, `motion-fade`.
- Curva por defecto: `--default-transition-timing-function` usa la misma curva oficial, de modo que cualquier `transition-*` de Tailwind la hereda; cada componente fija su duración.
- **Overlays del panel (`tw-animate-css`, parcheados en `components/ui/`):** `sheet` entra con traslación completa de borde a borde (`translateX`, 240 ms) más `opacity`; `dialog` y `alert-dialog` con `scale(0.95)` a `1` más `opacity` a 240 ms (overlay a 120 ms); `dropdown-menu`, `popover`, `select` y `tooltip` a 120 ms con origen en su disparador; el interruptor y la raya de la pestaña activa a 120 ms.
- **Sidebar:** estático en escritorio (sin transiciones de `width`, `left` ni `margin`); en pantallas menores de 1024 px es un `sheet` que se desplaza con `translateX`.
- **`recharts`:** el gráfico de barras fija `isAnimationActive={false}` en `Bar` y en `ChartTooltip`, porque su animación interna cambia la altura de las barras.
- **`prefers-reduced-motion: reduce`:** se eliminan los desplazamientos y escalas. Las entradas pasan a `motion-fade` de 80 ms lineal (solo `opacity`), los botones y la barra de progreso quedan en 0.01 ms, el toast solo anima `opacity` en 80 ms, y spinner y skeleton se detienen. Sheet, dialog, menús, popovers y tooltips (cualquier elemento con `animate-in` o `animate-out`) pierden traslación y escala y pasan a fundido lineal de 80 ms; el interruptor y las pestañas también se reducen a 80 ms o menos.
- Excepción de bucle: el giro del spinner (`animate-spin`) es el único movimiento continuo y es una rotación (`transform`).

### Delight controlado (Vista del Cliente)

Solo la pantalla del cliente, de baja frecuencia, permite refuerzos puntuales. Siguen los mismos tokens: `--ease-out`, `--dur-base` (180 ms), solo `transform` y `opacity`.

- `motion-pop`: el casillero de sello recién ganado entra con `scale(0.9)` a `1` más `opacity`. Nunca parte de `scale(0)`. Solo se animan los sellos ganados desde la última visita; los anteriores aparecen estáticos.
- `motion-enter`: entra el panel de progreso y cada fila de recompensa (`translateY` de 8 px más `opacity`).
- `motion-alert-enter`: bienvenida y alerta de sesión caducada.
- **El QR y el DNI de respaldo permanecen inmóviles desde el primer fotograma.** Ningún contenedor que los envuelva anima, y no hay bucles ni partículas.
- Con `prefers-reduced-motion`, `motion-pop` y las entradas pasan a `motion-fade` de 80 ms lineal, solo `opacity`.

### Language convention

- Código, componentes, archivos, rutas, parámetros de URL, tipos, funciones y API simulada: **en inglés** (`app/cashier`, `components/cashier`, `lib/cashier`, `app/customer`, `app/admin`, `components/customer`, `components/admin`, `CashierScreen`, `CustomerScreen`, `OverviewView`, `?mode=stamps`, `?maxStamps=8`, `?currencyPerPoint=2`).
- Texto visible de la interfaz (etiquetas, botones, alertas, toasts, badges, `aria-label`): **100% en español**, con localización `es-PE` para números y fechas.
- Comentarios de código: en español.

## Colors

Paleta neutra de una sola cromaticidad: tinta, papel y grises, con rojo solo para el error. Todos los valores son los tokens `oklch` de `:root` en `app/globals.css`, expuestos como `--background`, `--foreground`, `--primary`, etc. (los nombres descriptivos de abajo son inferidos).

### Primary
- **Ink** (`oklch(0.205 0 0)`, `--primary`): botón primario, alerta de premio, texto fuerte de acciones y selección de texto.

### Neutral
- **Paper** (`oklch(1 0 0)`, `--background` / `--card`): fondo de pantalla y tarjetas.
- **Ink Deep** (`oklch(0.145 0 0)`, `--foreground` y `--ring`): texto principal y anillo de foco, ajustado para alto contraste.
- **Mist** (`oklch(0.97 0 0)`, `--secondary` / `--muted` / `--accent`): fondo del visor, pistas, badge secundario.
- **Graphite** (`oklch(0.48 0 0)`, `--muted-foreground`): texto secundario y ayudas. Oscurecido desde el valor de shadcn (0.556) para mantener contraste AA sobre Mist.
- **Hairline** (`oklch(0.922 0 0)`, `--border` / `--input`): bordes y separadores.
- **Paper on Ink** (`oklch(0.985 0 0)`, `--primary-foreground`): texto sobre fondo Ink.

### Semantic
- **Alert Red** (`oklch(0.577 0.245 27.325)`, `--destructive`): errores de campo, alertas inline y badge "Sin conexión". Siempre acompañado de icono y texto.

### QR
- **QR White / QR Black** (`#ffffff` / `#000000`): el código QR del cliente es siempre negro sobre blanco, con zona de silencio, sin importar el tema. Son los únicos valores fuera de la paleta `oklch`, y existen por legibilidad del escáner.

### Named Rules
**The Scannable Rule.** El QR nunca se tiñe ni se invierte: contraste máximo fijo.
**The No-Color-Alone Rule.** Éxito, error e información nunca dependen solo del color: llevan icono y texto.
**The One Red Rule.** El rojo significa error o falta de conexión y nada más.

**Nota de deriva:** existe un bloque `.dark` completo en `globals.css`, pero ningún proveedor de tema aplica la clase `dark`; hoy la interfaz es solo clara. Para Caja se asume luz ambiente de tienda.

## Typography

**Display / Body / Label:** Figtree (`next/font/google` en `app/layout.tsx`, variable `--font-figtree`), con fallback `ui-sans-serif, system-ui`. Sustituye a Geist, marcada como fuente sobreutilizada. **Mono:** Geist Mono (`--font-geist-mono`), reservada para datos estructurados como los códigos hexadecimales de color del programa y los valores del tooltip del gráfico.

**Character:** sans geométrica, abierta y legible a distancia. Las cifras tabulares no dependen de la fuente mono: se logran con `tabular-nums` (`font-variant-numeric`) sobre Figtree en saldos, KPIs, montos, DNI y tablas. Si una fuente no trae la característica `tnum`, el navegador usa cifras proporcionales; conviene verificarlo con Figtree.

**Wiring:** `@theme inline` define `--font-sans: var(--font-figtree), ui-sans-serif, system-ui, sans-serif` y `--font-mono: var(--font-geist-mono)`; `app/layout.tsx` inyecta ambas variables en `<html>`.

### Hierarchy
- **Display** (600, 3rem / `text-5xl`, line-height 1, tabular): saldo del cliente.
- **Headline** (500, 1.5rem / `text-2xl`, tracking 0.1em en DNI, tabular): campos de DNI y monto.
- **Title** (600, 1.25rem / `text-xl`): nombre del cliente. **Section title** (600, 1.125rem / `text-lg`): "Caja", "Registrar compra", "Recompensas disponibles".
- **Body** (400, 1rem y 0.875rem): títulos de alerta (500, 1rem), nombre de recompensa (500), descripciones y ayudas (0.875rem, Graphite).
- **Label** (500, 0.875rem, line-height 1): etiquetas de campo y badges.

### Named Rules
**The Tabular Rule.** Todo número que cambia (saldo, monto, puntos, DNI, costos) usa cifras tabulares para que no salte al actualizarse.

## Layout

Una columna, pensada para celular o tablet y centrada en pantallas anchas: contenedor `max-w-2xl` (42rem), `min-h-dvh`, padding de 16 px y separación vertical de 16–20 px. Encabezado fijo de 56 px (`h-14`) con borde inferior, título "Caja" y badges de modo y conexión.

- **Fase A (Identificar):** el visor QR ocupa el espacio restante (`flex-1`, mínimo 42dvh); debajo, el campo de DNI y "Buscar" quedan en la zona del pulgar.
- **Fase B (Atender):** perfil y saldo, registro, recompensas y "Cancelar atención" en una sola columna con scroll si hace falta; la acción de cancelar se ancla al final.
- **Alertas:** en el flujo normal bajo el encabezado, de modo que el contenido de abajo se desplaza al aparecer; solo la alerta se anima.
- **Objetivos táctiles:** 48 px mínimo (`h-12`) y 56 px (`h-14`) para campos y acción primaria; 8 px o más entre acciones.
- **Escala de espacio:** múltiplos de 4 px de Tailwind (4, 8, 12, 16, 20).

**Pase del cliente (`/customer`):** columna móvil de `max-w-md` (28rem), `min-h-dvh`, padding de 16 px y separación de 16 px. Orden fijo: identidad, QR con el DNI debajo, alerta de bienvenida (si el saldo es 0), progreso y recompensas. El QR mide `min(72vw, 38dvh)` para que todo quepa sin scroll en 360×640; las recompensas se recortan a 2 filas más un contador "+N más". Con zoom de texto alto se permite scroll como último recurso.

**Panel de administración (`/admin`):** `SidebarProvider` con sidebar fijo de 240 px y cabecera de 56 px (migas de pan, comercio y estado del programa), contenido con padding de 16 px (24 px en pantallas grandes). Resumen: fila de 4 KPIs, y gráfico (7/12) con actividad en caja (5/12) desde 1280 px; apilados por debajo. Clientes: barra de herramientas, tabla de filas de 44 px con cabecera estática y paginación de 25. Programa: secciones a 2/3 y panel de estado a 1/3 (arriba en pantallas menores). El `<thead>` de la tabla no es `sticky`: dentro del contenedor `overflow-x-auto` de `table` se anclaba al contenedor y tapaba la primera fila.

### Densidad (escala de escritorio)

| Contexto | Control | Fila de tabla | Mínimo táctil |
|---|---|---|---|
| Admin en escritorio (puntero) | 40 px (`h-10`) | 44 px (`h-11`) | n/a |
| Vistas táctiles (Caja, Cliente) y admin bajo 1024 px | 48 px (`h-12`), 56 px la acción primaria | n/a | 48 px |

El panel prioriza densidad y escaneabilidad, sin bajar nunca de 40 px por control. Bajo 1024 px el sidebar sale de pantalla y los controles táctiles vuelven a 48 px. Es una extensión del sistema: el mínimo de 48 px de Caja y Cliente no cambia.

## Elevation & Depth

Plano por defecto. No hay sombras en reposo ni en estado. La profundidad se logra con anillos de 1 px (`ring-1 ring-foreground/10`) en tarjetas y filas de recompensa, bordes `Hairline` en campos y encabezado, y el contraste de tinta sobre papel para la alerta de premio. El único efecto de sombra es un `drop-shadow` de 1 px que perfila las esquinas del encuadre del visor QR.

### Named Rules
**The Flat-By-Default Rule.** Las superficies son planas; la jerarquía viene del tamaño, el peso y el contraste, no de la elevación.

## Shapes

Esquinas suavemente redondeadas con escala derivada de `--radius: 0.625rem`: `sm` 6 px, `md` 8 px, `lg` 10 px (botones, campos, alertas), `xl` 14 px (tarjeta de perfil, visor QR, filas de recompensa), píldora completa en badges. Bordes de 1 px en `Hairline`. Iconos Lucide con trazo uniforme de 16 px (`size-4`), nunca emoji.

## Components

Componentes de shadcn/ui, style `radix-nova` (`components.json`: `rsc: true`, `baseColor: neutral`, `cssVariables: true`, iconos `lucide`), con la utilidad `cn` del paquete `cn`.

**Inventario instalado (`components/ui/`, 36):** `alert`, `alert-dialog`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `chart`, `dialog`, `dropdown-menu`, `empty`, `field`, `input`, `input-group`, `item`, `kbd`, `label`, `pagination`, `popover`, `progress`, `radio-group`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `sonner`, `spinner`, `switch`, `table`, `tabs`, `textarea`, `toggle`, `toggle-group`, `tooltip`.

- **Caja:** `alert`, `badge`, `button`, `card`, `input`, `label`, `progress`, `separator`, `skeleton`, `sonner`, `spinner`.
- **Cliente:** `alert`, `badge`, `button`, `item`, `progress`, `skeleton`.
- **Administración:** `sidebar`, `breadcrumb`, `kbd`, `tooltip`, `table`, `dropdown-menu`, `toggle-group`, `input-group`, `tabs`, `chart`, `calendar`, `popover`, `empty`, `field`, `radio-group`, `switch`, `sheet`, `dialog`, `alert-dialog`, además de `badge`, `button`, `card`, `input`, `separator`, `skeleton`, `alert`, `sonner` y `spinner`.
- **Instalados sin uso directo:** `pagination` (la paginación usa botones), `scroll-area`, `select`, `textarea` y `toggle` (dependencias de otros componentes).

Dependencias de soporte: `radix-ui`, `class-variance-authority`, `cn`, `sonner`, `next-themes`, `lucide-react`, `tw-animate-css`, `html5-qrcode` (lector QR de Caja), `qrcode.react` (QR del cliente y del programa, SVG), `recharts` (gráfico de barras vía `chart`, con animación desactivada), `react-day-picker` y `date-fns` (selector de rango). Ninguna está en el registry de shadcn salvo las que trae cada componente.

**Ajustes locales de motion (todos los parches viven en `components/ui/`):** `sidebar` (sin transiciones de `width`, `left`, `margin` ni `transition-all`), `sheet` y `dialog`/`alert-dialog` (240 ms con la curva oficial; el panel entra de borde a borde), `dropdown-menu`, `popover`, `select` y `tooltip` (120 ms), `tabs` y `switch` (120 ms, sin `transition-all`), `table`, `breadcrumb`, `input-group`, `scroll-area`, `textarea` y `toggle` (sin transiciones de color), y los anteriores: `button` (`transition-[translate,scale,opacity]`, `active:scale-[0.97]`), `input` (sin `transition-colors`), `badge` (sin `transition-all`), `progress` (`transition-transform` a `--dur-slow`), `item` (sin `transition-colors`) y `sonner` (posición arriba al centro, 2.5 s, y la transición de `[data-sonner-toast]` forzada a `transform`/`opacity` en `globals.css`).

**Módulos de Caja (`components/cashier/`):** `cashier-screen` (estado y alertas), `identify-view` (Fase A), `serve-view` (Fase B), `qr-scanner` (cámara).

**Módulos de administración (`components/admin/`):** `admin-shell` (layout, contexto y atajos), `app-sidebar`, `admin-header`, `overview-view` (filtros y composición), `kpi-cards`, `performance-chart`, `activity-table`, `date-range-picker`, `customers-view`, `customer-sheet`, `program-view`, `program-wizard`, `rewards-editor`, `program-status-panel` y `color-field`. Datos de ejemplo y validaciones en `lib/admin/` y `lib/cashier/mock-api.ts`.

**Módulos del cliente (`components/customer/`):** `customer-screen` (`CustomerScreen`: carga, sesión, alertas y composición), `identity-header` (nombre, "Miembro desde" e insignia sin conexión), `qr-pass` (QR focal estático y DNI de respaldo, o alerta de sesión caducada), `progress-panel` (barra de puntos o cuadrícula de sellos según `mode`), `stamp-grid` (cuadrícula 5×2) y `rewards-section` (filas de `item` para las recompensas disponibles).

**Modo Puntos/Sellos:** no es un selector en pantalla; es un parámetro de configuración del comercio (`mode: "points" | "stamps"`, `?mode=` en las rutas de prueba) que activa una sola sección de progreso. `maxStamps` (10 por defecto, `DEFAULT_MAX_STAMPS`) fija los casilleros.

**Persistencia local y soporte (`lib/customer/pass.ts`, `hooks/`):** el saldo se guarda en `localStorage` para mostrar la última copia sin conexión, con la hora de actualización. También se guarda el último saldo visto para animar solo los sellos nuevos. Hooks: `use-online-status`, `use-session-timeout` (caduca a los 5 minutos sin actividad) y `use-wake-lock` (mantiene la pantalla encendida mientras se muestra el pase).

### Buttons
- **Shape:** esquina de 10 px.
- **Primary:** Ink sobre Paper on Ink; 56 px de alto en "Buscar", "Registrar compra" y "Asignar sello".
- **Outline:** borde Hairline sobre Paper, 48 px; "Canjear" y "Reintentar".
- **Ghost:** sin fondo, 48 px; "Cancelar atención".
- **Hover / Focus:** hover cambia el color de fondo al instante; foco con anillo de 3 px (`ring/50`) y borde `Ink Deep`; pulsado `scale(0.97)` en 120 ms. Estado de carga: `spinner` más verbo en gerundio ("Buscando", "Registrando", "Canjeando").

### Cards / Containers
- **Corner Style:** 14 px. **Background:** Paper. **Border:** anillo de 1 px. **Shadow:** ninguna. **Padding:** 16 px. Una sola tarjeta (perfil y saldo); el resto son secciones con encabezado.

### Inputs / Fields
- **Style:** borde Hairline, fondo transparente, 56 px de alto, texto de 1.5rem en cifras tabulares; DNI con `inputMode="numeric"` y ocho dígitos; monto con `inputMode="decimal"`.
- **Focus:** borde y anillo `Ink Deep`.
- **Error:** `aria-invalid` con borde y anillo rojos; mensaje con `role="alert"` bajo el campo; deshabilitado al 50%.

### Alerts
- **Error:** fondo Paper, texto rojo, icono, título de 1rem y descripción en Graphite; acción "Reintentar" cuando aplica. `role="alert"`, entra con `motion-alert-enter`.
- **Premio ("¡Premio disponible por la compra actual!"):** fondo Ink, texto Paper on Ink, icono de regalo.

### Badges
- **Caja:** **modo** (secundario, "Puntos" o "Sellos") y **conexión** (contorno "En línea", rojo "Sin conexión") de 24 px en el encabezado.
- **Cliente:** una sola insignia secundaria "Modo sin conexión · hh:mm" (hora de la última actualización), visible solo sin red. No es roja: el pase sigue funcionando.

### Progress, Toast, Skeleton
- **Progress:** pista Mist de 12 px, indicador Ink que avanza con `translateX`.
- **Sonner:** toast de éxito neutro con icono, arriba al centro, 2.5 s, solo `transform` y `opacity`.
- **Skeleton:** bloque Mist mientras arranca la cámara (Caja) y mientras carga el pase (cliente).

### Data Table (Administración)
`table` con encabezados `scope="col"`, filas de 44 px, cifras tabulares y borde de 1 px (`ring-foreground/10`) de 14 px de radio. Encabezados ordenables con botón de 40 px y `aria-sort`. Sin cabecera fija. Por debajo de 1024 px se ocultan columnas secundarias (Inscrito, Última operación). Acciones por fila en un `dropdown-menu`; el clic en la fila abre un `sheet` de 480 px.

### Sheet y Dialog (Administración)
`sheet` lateral derecho para detalle de cliente y edición de recompensas, a ancho completo en móvil. `dialog` bloqueante solo para el alta del programa (sin botón de cierre ni cierre por Escape o clic exterior). `alert-dialog` para confirmar eliminar. El foco queda atrapado y vuelve al disparador.

### Chart (Administración)
Barras agrupadas emitidos vs canjeados (`--chart-5` y `--chart-2`), leyenda y tooltip, con `isAnimationActive={false}` y tabla equivalente `sr-only`. Si no hay datos, `empty` con "No hay registros para este período".

### Sidebar y Tabs (Administración)
`sidebar` de 240 px con tres destinos, atajos `kbd` visibles y estado activo; estático en escritorio. `tabs` (Día/Mes/Año) y `toggle-group` (período y estado) cambian contenido sin animación de layout, solo `opacity`.

### Stamp Grid (Vista del Cliente)
Cuadrícula de 5 columnas con `gap` de 8 px de casilleros cuadrados de 10 px de radio. Ganado: relleno Ink con icono de check. Faltante: contorno de 1 px (`ring-foreground/25`) con su número en Graphite. `role="img"` con etiqueta "N de M sellos"; no depende solo del color. El último sello nuevo usa `motion-pop`.

### Reward Row (Vista del Cliente)
Fila de `item` con fondo Ink, texto Paper on Ink, icono de regalo, nombre, "Muéstrala en caja para canjearla" y el costo en cifras tabulares. Es informativa: el canje lo hace Caja. Máximo 2 filas visibles.

### QR Pass (Vista del Cliente, componente distintivo)
Panel blanco de 12 px de padding y 14 px de radio con anillo de 1 px, que contiene el `QRCodeSVG` (nivel de corrección M, zona de silencio de 1 módulo). Debajo, el DNI en 1.5rem, tracking 0.1em y cifras tabulares, para dictarlo si el escaneo falla. Ambos son estáticos. Si la sesión caduca, se reemplazan por una alerta inline con "Recargar página".

### QR Scanner (Caja, componente distintivo)
Visor a ancho completo con esquinas de encuadre al 70% del lado menor (`.qr-frame`, unidades `cqmin`), sin la región sombreada de `html5-qrcode`. Estados: iniciando (skeleton), listo, no disponible (icono `CameraOff`, "Cámara no disponible").

## Do's and Don'ts

### Do:
- **Do** mantener una sola pantalla con dos fases que intercambian contenido en el mismo lugar; confirmar canjes y mostrar errores inline.
- **Do** usar `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` y los tokens `--dur-fast/base/slow` para toda animación de UI, limitada a `transform` y `opacity`.
- **Do** dar a cada control táctil 48 px como mínimo y 56 px a la acción primaria.
- **Do** usar cifras tabulares para saldo, montos y DNI.
- **Do** acompañar éxito, error e información con icono y texto, no solo con color.
- **Do** escribir el código, las rutas y los identificadores en inglés y la interfaz visible en español (`es-PE`).
- **Do** mantener el QR y el DNI de respaldo inmóviles desde el primer fotograma, en negro sobre blanco.
- **Do** limitar el delight a la Vista del Cliente y a `motion-pop` desde `scale(0.9)`.
- **Do** usar la escala de escritorio (controles de 40 px, filas de 44 px) solo en el panel de administración con puntero, y 48 px en vistas táctiles.
- **Do** mantener `isAnimationActive={false}` en todo gráfico de `recharts`.
- **Do** dejar el sidebar de escritorio estático y desplazarlo solo con `translateX` en móvil.
- **Do** preferir componentes del registry oficial de shadcn/ui (radix-nova) antes que de registries externos.

### Don't:
- **Don't** usar modales, páginas intermedias ni navegación secundaria en Caja.
- **Don't** usar `transition-all`, `ease-in`, ni animar `height`, `width`, `top`, `margin`, sombras o color.
- **Don't** superar 240 ms en animaciones de UI (nunca 300 ms).
- **Don't** mantener desplazamientos o escalas con `prefers-reduced-motion`; deja solo fundidos de 80 ms o menos.
- **Don't** introducir colores de marca, gradientes ni sombras que no estén en el sistema actual.
- **Don't** animar, teñir ni envolver en una entrada animada el QR o el DNI de respaldo.
- **Don't** partir ninguna escala de `scale(0)`; el mínimo es `scale(0.9)`.
- **Don't** llevar el delight a Caja ni al panel de administración.
- **Don't** poner `sticky` en el `<thead>` dentro del contenedor de `table`.
- **Don't** bajar de 40 px en controles de escritorio ni de 48 px en vistas táctiles.
- **Don't** volver a Geist como fuente sans.
- **Don't** usar rojo para nada que no sea error o falta de conexión.
- **Don't** usar emoji ni glifos como iconos; usar Lucide.
