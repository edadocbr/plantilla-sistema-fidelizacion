### Tarea 1 / CUS-01: Consultar puntos o sellos acumulados

| Atributo | Descripción |
| :--- | :--- |
| **Nombre** | Consultar puntos o sellos acumulados |
| **Objetivo** | Permitir al cliente revisar rápidamente su saldo de recompensas y mostrar su código de identificación para acumular beneficios en su compra actual. |
| **Actores** | Cliente |
| **Descripción** | El cliente abre su credencial digital desde su teléfono móvil. El sistema le muestra de inmediato un código QR estático con el número de documento como respaldo y una tarjeta digital que refleja su progreso, ya sea mediante un saldo de puntos o una cuadrícula de sellos. |
| **Precondición** | El cliente accede a su credencial digital con su documento registrado. El comercio ya definió la modalidad de recompensas (puntos o sellos) y su identidad visual. |
| **Postcondición** | El cliente conoce su estado actual de beneficios y mantiene en pantalla el código QR listo para que el personal de caja lo escanee. |

**Flujo Básico**
1. El cliente abre la credencial digital de fidelización desde su teléfono móvil.
2. El sistema valida la sesión y carga la pantalla principal de forma inmediata, priorizando la claridad y la lectura rápida.
3. El sistema muestra en la parte superior un código QR estático de gran tamaño y, debajo, el número de documento de identidad como respaldo para dictarlo si el escaneo falla.
4. El sistema despliega en la parte central una tarjeta digital con el progreso del cliente.
5. El sistema muestra el progreso actual del cliente según el modelo del negocio:
    * **Si el local usa Puntos:** Muestra el saldo total en números grandes, una barra de progreso y el texto de puntos faltantes para la siguiente recompensa.
    * **Si el local usa Sellos:** Muestra un contador de sellos y una cuadrícula con los casilleros ganados marcados con una verificación y los faltantes en contorno con su número.
6. El cliente presenta esta misma pantalla frente al personal de caja.

**Flujos Alternativos**

*   **Flujo alternativo: Falta de conexión a internet.**
    1. En el paso 2, si el dispositivo móvil pierde la conexión a la red, el sistema carga la última copia guardada del saldo.
    2. El sistema muestra un indicador sutil de "Modo sin conexión" con la hora de la última actualización.
    3. El código QR se mantiene visible y funcional.
    4. Si no existe una copia previa, el sistema informa que no pudo cargar la credencial y ofrece reintentar la consulta.
    5. Continúa en el paso 6 del flujo básico cuando hay una copia disponible.

*   **Flujo alternativo: Sesión caducada por inactividad.**
    1. En el paso 3 del flujo básico, si el cliente permanece inactivo en la pantalla por un límite de 5 minutos, el sistema invalida la sesión actual.
    2. Por protección de privacidad, el sistema oculta el código QR y el número de documento.
    3. El sistema muestra un breve mensaje indicando que la sesión ha expirado por seguridad y pide restaurar la vista.
    4. El cliente recarga la credencial para continuar y la sesión se restablece.
    5. El flujo finaliza hasta que el cliente vuelve a consultar su credencial.

*   **Flujo alternativo: Cliente sin historial previo.**
    1. En el paso 5, si el usuario es nuevo y aún no tiene compras registradas, el sistema muestra los marcadores en cero o todos los espacios de sellos vacíos.
    2. El sistema muestra un mensaje de bienvenida amigable motivando la primera compra.
    3. Continúa en el paso 6 del flujo básico.
