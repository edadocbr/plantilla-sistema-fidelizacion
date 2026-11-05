# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Una sola PWA consumida por tres roles, cada uno con su propia interfaz:

- **Cliente habitual** (farmacias, supermercados, tiendas con puntos o sellos). Se identifica en caja y consulta su progreso desde el celular, en modo online y offline. Valora comodidad, rapidez y claridad sobre cuánto le falta para una recompensa. Prefiere no instalar una app por negocio. Incluye personas con visión reducida o dificultades motrices.
- **Personal de Caja** (atención al cliente). Trabaja bajo presión de tiempo en el mostrador, con el cliente esperando para pagar. Identifica al cliente, registra puntos o sellos, verifica y canjea recompensas. Necesita un método alternativo de identificación cuando el cliente no tiene el QR.
- **Administrador del negocio**. Trabaja desde computadora u otro dispositivo con acceso al sistema. Configura programas y recompensas, supervisa operaciones y alertas, y analiza resultados. No tiene conocimientos técnicos avanzados.

## Product Purpose

SaaS de Gestión de Credenciales Digitales para la Fidelización de Clientes, para negocios minoristas presenciales. Reemplaza tarjetas físicas y cartillas de sellos (se pierden, se falsifican, no generan datos) y evita la fatiga de las apps nativas descargables (hasta 70% de usuarios no las instala en el mostrador; más de 80% las elimina en 30 días).

Éxito: el cliente se identifica con una credencial digital sin fricción, Caja registra o canjea en menos de 3 segundos sin retrasar el pago, y el administrador centraliza configuración y métricas en un solo lugar. Las operaciones de Caja se reflejan de forma consistente en la credencial del cliente y en el panel.

Contexto académico: proyecto del curso Diseño de Interfaces de Usuario (UNMSM, FISI, Grupo 01, 2026-II). El alcance es diseño y prototipado de interfaces, no un sistema comercial completo.

## Positioning

Una credencial de fidelización con integridad transaccional (control de duplicados y alertas de fraude), entregada como Google Wallet más PWA, sin instalar una app por negocio. La accesibilidad visual y motriz y la velocidad en Caja son parte del producto, no un añadido.

## Operating Context

- Cliente: celular, en tienda, con conectividad variable. La credencial (puntos, recompensas, QR) debe ser legible online y offline.
- Caja: mostrador con el cliente presente; puede haber lectores de códigos y punto de venta. Escanear y marcar en menos de 3 segundos.
- Administrador: computadora o dispositivo con acceso al sistema; revisa operaciones periódicamente y ajusta promociones.
- Herramientas actuales que el sistema complementa: tarjetas físicas, apps de cada negocio, POS, hojas de cálculo y reportes de ventas.

## Capabilities and Constraints

Tareas identificadas (Entregable N°2):

1. Consultar puntos o sellos acumulados, con barra de progreso hacia la recompensa (Cliente, fácil).
2. Presentar la credencial con QR vía Google Wallet o PWA (Cliente, fácil).
3. Registrar una compra y asignar puntos o sellos (Caja, moderada).
4. Verificar y canjear una recompensa (Cliente y Caja, moderada).
5. Configurar programa, objetivos, puntos requeridos, recompensas y vigencia (Administrador, difícil).
6. Supervisar operaciones y analizar resultados: clientes registrados, puntos otorgados, canjes, promociones más usadas, historial y alertas (Administrador, difícil).

Restricciones y requisitos:

- Mensajes diferenciados de éxito, error e información; estados de operación completada, pendiente o con error; alertas de duplicados y posible fraude.
- Si un registro falla, se conserva el último estado válido de los puntos. Sin registros duplicados.
- Método alternativo al QR para identificar al cliente (por ejemplo teléfono).
- Gráficos de estado de recompensas sincronizados con la app, notificaciones push, sincronización asíncrona.
- Dispositivos móviles de distintos tamaños y navegadores; priorizar información y evitar la sobrecarga visual.
- Terminología del dominio: credencial, sellos/puntos, recompensa, canje, Caja, Cliente, Administrador. Idioma de la interfaz: español (Perú).
- Stack existente: Next.js (App Router) con shadcn/ui (`components.json`). Consultar `node_modules/next/dist/docs/` antes de escribir código, según AGENTS.md.
- Indefinido: nombre del producto, rubro del negocio, esquema exacto de puntos vs. sellos, moneda, proveedor de notificaciones push.

Decisiones vinculantes declaradas por el usuario:

- **Modo de diseño: Operate.** Es una app/dashboard, no una página de marketing. Escaneabilidad, consistencia y expectativas nativas pesan más que la expresión.
- **Movimiento:** el sistema usa exclusivamente las curvas de easing de Emil Kowalski para animaciones de UI (por ejemplo `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`). Toda animación de interfaz dura menos de 300 ms. Ninguna otra herramienta o skill introduce curvas o duraciones distintas.

## Brand Commitments

Sin marca definida: el producto es genérico y neutro (marca blanca), sin nombre ni identidad propia confirmados. No inventar nombre, logo ni voz de marca. Cada comercio podría aplicar su identidad más adelante (no confirmado).

## Evidence on Hand

- `[Grupo 01] Entregable N°1_ Definición del Proyecto.docx`: problema, solución, objetivos, alcances y limitaciones, referencias (Gallo 2014; CodeBroker 2021; Blanc 2026; BrandWallet 2026, entre otras).
- `[Grupo 01] Entregable N°2_ Análisis de Tareas.docx`: perfiles, resultados de entrevistas, 11 preguntas de análisis de tareas, 6 tareas con escenarios actuales y mejoras.
- **Solo hay una entrevista real: la del Cliente.** Los perfiles de Personal de Caja y Administrador fueron simulaciones académicas; sus hallazgos son hipótesis a validar en las pruebas de usabilidad.
- No existen testimonios, clientes reales, métricas de uso propias, precios ni datos de despliegue. No fabricarlos. Los bocetos a mano del Entregable N°2 aún no se han entregado.

## Product Principles

1. **Caja manda.** Ninguna decisión de diseño puede costarle a Caja más de 3 segundos por operación ni añadir pasos al flujo de escaneo.
2. **Accesibilidad como requisito base.** Contraste, tamaño de texto y objetivos táctiles amplios son condición de entrega, no mejora posterior.
3. **Estado siempre claro y recuperable.** Cada operación muestra éxito, error o pendiente sin ambigüedad, y nunca se pierde el último estado válido.
4. **Una sola verdad entre tres interfaces.** Lo que registra Caja se refleja igual en la credencial y en el panel.
5. **Sin instalación, sin fricción.** Credencial accesible desde Wallet o PWA, que funcione offline.

## Accessibility & Inclusion

Prioridad absoluta, junto con la velocidad operativa de Caja. Accesibilidad visual (baja visión: legibilidad, contraste, no depender solo del color) y motriz (objetivos táctiles grandes, tolerancia a errores de puntería, operación con una mano) estrictas en las tres interfaces. La credencial debe ser fácil de leer en modo online y offline. Respetar `prefers-reduced-motion` dentro del límite de 300 ms de las animaciones. El proyecto reconoce que no puede garantizar la misma respuesta ante todas las necesidades individuales, por lo que las pruebas de usabilidad deben cubrir condiciones de accesibilidad.
