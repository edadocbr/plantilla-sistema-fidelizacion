### Tarea 2 / CUS-02: Presentar la credencial de fidelización

| Atributo | Descripción |
| :--- | :--- |
| **Nombre** | Presentar la credencial de fidelización |
| **Objetivo** | Permitir al personal del establecimiento escanear o ingresar los datos del cliente para acceder a su perfil y registrar beneficios. |
| **Actores** | Personal de Caja / Cliente |
| **Descripción** | El personal utiliza la terminal de caja desde su dispositivo. La pantalla única de identificación permite leer el código QR con la cámara o ingresar manualmente el Documento de Identidad (DNI) del cliente, sin opciones divididas ni botones para volver atrás. |
| **Precondición** | El personal accede a la terminal de caja en el mostrador. El cliente está físicamente presente con su código QR o DNI listo. |
| **Postcondición** | El perfil del cliente se carga en la pantalla del personal, listo para registrar operaciones. |

**Flujo Básico**

1. El personal de caja accede a la terminal de caja desde su dispositivo.
2. El sistema muestra una única pantalla de identificación con el visor de cámara activo y, debajo, el campo para ingresar el DNI. La lectura por cámara y el ingreso manual están disponibles al mismo tiempo.
3. El personal apunta la cámara hacia la pantalla del cliente.
4. El sistema solicita, si es la primera vez, los permisos de la cámara del dispositivo.
5. El personal enfoca la cámara hacia el código QR del cliente.
6. El sistema detecta y lee el código QR con éxito.
7. El sistema recupera el perfil del cliente y lo muestra en pantalla, finalizando el flujo de identificación: nombre, DNI, fecha de inscripción y saldo de puntos o sellos acumulados.

**Flujos Alternativos**

*   **Flujo alternativo: Falla de lectura del dispositivo.**
    1. En el paso 6, si la cámara del personal no logra leer el código QR por reflejos, pantalla dañada del cliente o problemas del dispositivo, el campo de DNI permanece visible y enfocado.
    2. No es necesario regresar a una pantalla de opciones: el personal ingresa directamente el número de DNI.
    3. Si la cámara no está disponible o se deniega el permiso, el sistema lo informa y pide ingresar el DNI del cliente.
    4. El personal ingresa los 8 dígitos del DNI; la búsqueda se ejecuta automáticamente al completar el número o al confirmar la búsqueda.
    5. Continúa en el paso 7 del flujo básico.

*   **Flujo alternativo: Cliente no registrado o DNI inválido (Verificación manual).**
    1. En la verificación manual, si el sistema no encuentra un perfil asociado al DNI ingresado.
    2. El sistema muestra un mensaje de error claro y no obstructivo: "Cliente no encontrado".
    3. El sistema limpia el campo de texto y devuelve el foco al ingreso del DNI.
    4. El personal puede reintentar el ingreso o invitar al cliente a registrarse en el programa.
