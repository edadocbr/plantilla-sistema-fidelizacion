# SaaS de Gestión de Credenciales Digitales para la Fidelización de Clientes

Este repositorio contiene un **boceto inicial de alta fidelidad** de un sistema de fidelización para comercios. Las pantallas y los flujos principales ya están construidos y validados, pero forman parte de un proyecto más grande que evolucionará hacia una implementación completa.

> [!IMPORTANT]
> **Nombre provisional  del repositorio:** El nombre del repositorio es **temporal** y **podría** en futuras iteraciones. La estructura, los datos de demostración y algunos comportamientos de esta versión tampoco deben interpretarse como la arquitectura definitiva del sistema.

## Alcance del boceto

La aplicación permite recorrer la experiencia completa desde tres perspectivas:

- **Caja:** identificación del cliente y registro de compras o sellos.
- **Cliente:** consulta de la credencial digital, el saldo y las recompensas.
- **Administración:** supervisión del programa y configuración de sus reglas.

Los datos utilizados son de demostración y viven en la sesión del navegador. No existe todavía una integración con un backend real ni un sistema de autenticación de producción.

## Arquitectura de diseño

La interfaz fue construida utilizando **herramientas avanzadas de diseño asistido por IA**, con una metodología centrada en la claridad operativa, la jerarquía visual y el craft de interacción.

### Impeccable

**Impeccable** se utilizó para definir y aplicar el sistema visual del producto:

- Jerarquía, escala tipográfica y ritmo vertical.
- Tipografía **Figtree** para toda la interfaz.
- Densidad **Operate**, priorizando escaneabilidad, velocidad y objetivos táctiles amplios.
- Paleta neutra de alto contraste, con el color reservado para estados de error.
- Componentes basados en shadcn/ui y Radix, con una estética funcional y sin decoración innecesaria.

### Skills de Emil Kowalski

Las **Skills de Emil Kowalski** guiaron el craft de la animación y las transiciones:

- Transiciones de **240 ms como máximo**, reservadas para cambios de estado significativos.
- Curvas bezier estrictas y consistentes, con una única curva de salida para la interfaz.
- Animación limitada a propiedades compuestas como `transform` y `opacity`.
- Sin animaciones decorativas en las vistas operativas.
- Soporte completo de `prefers-reduced-motion`: las animaciones se reducen a fundidos breves o se desactivan.

## Guía de navegación y pruebas

Con el servidor de desarrollo en marcha, abre `http://localhost:3000` y navega a cualquiera de las siguientes rutas.

### Caja — `/cashier`

Pantalla operativa para el personal de mostrador.

**Qué probar:**

- Identificación del cliente mediante la cámara o el ingreso manual del DNI en una misma pantalla.
- Lectura del código QR y recuperación inmediata del perfil.
- Registro rápido de una compra en modalidad de puntos o asignación directa de un sello.
- Aparición de recompensas inmediatas cuando el nuevo saldo habilita un premio.
- Confirmación de canje dentro de la fila de la recompensa, sin ventanas emergentes bloqueantes.

### Cliente — `/customer`

Credencial digital que el cliente muestra en el mostrador.

**Cómo simular una sesión:**

- La sesión se simula con el documento del cliente: `/customer?nationalId=70123456`.
- El modo de sellos se puede probar con `/customer?mode=stamps`.
- La cantidad de sellos de la cuadrícula se ajusta con `?maxStamps=`, por ejemplo: `/customer?nationalId=70123456&mode=stamps&maxStamps=8`.

**Qué probar:**

- Código QR estático con el DNI como respaldo.
- Progreso adaptable: saldo de puntos con barra o cuadrícula de sellos.
- Modo sin conexión con la última copia guardada y la hora de corte.
- Ocultamiento de los datos por inactividad y restauración de la vista al recargar.
- Recompensas disponibles y su estado dentro de la credencial.

### Administrador — `/admin`

Panel de control para la gestión del programa.

**Qué probar:**

- **Resumen:** métricas acumuladas en unidades reales, gráficos comparativos y actividad reciente de caja.
- **Clientes:** búsqueda, filtros, ordenamiento y panel lateral con el detalle del cliente.
- **Programa:** configuración de la modalidad, colores corporativos, reglas de acumulación, recompensas, cooldown y activación condicionada.
- La configuración del programa también admite la modalidad de sellos con `?mode=stamps`, por ejemplo: `/admin/program?mode=stamps`.

**Atajos de teclado:**

| Atajo | Acción |
| :--- | :--- |
| `g r` | Ir a Resumen |
| `g c` | Ir a Clientes |
| `g p` | Ir a Programa |
| `/` | Enfocar la búsqueda de clientes (solo en Clientes) |
| `Ctrl+S` / `Cmd+S` | Guardar cambios del programa (solo en Programa) |

## Notas de desarrollo e instalación

### Requisitos

- Node.js 20 o superior.
- npm como gestor de paquetes.

### Puesta en marcha

```bash
npm install
npm run dev
```

Abre `http://localhost:3000` en el navegador. La aplicación se recarga automáticamente al modificar el código.

### Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Compilación de producción
npm run start    # Servidor de producción
npm run lint     # Análisis estático
```

### Estructura principal

```text
app/          Rutas y layouts de la aplicación
components/   Componentes de Caja, Cliente, Administración y UI
lib/          Tipos, datos de demostración y lógica de negocio
hooks/        Comportamientos reutilizables de la interfaz
```

### Nota importante sobre pruebas en móviles

Las pruebas en dispositivos móviles físicos a través de la red local pueden presentar fallos de hidratación o bloqueos de red debido al entorno de desarrollo actual. Para validar la experiencia móvil, se recomienda usar el modo responsive del navegador o un emulador local. Si se prueba en un dispositivo físico, conviene hacerlo con una conexión estable y verificando la consola del navegador.
