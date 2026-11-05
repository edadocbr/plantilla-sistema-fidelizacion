# Tarea 5 / CUS-05: Configurar el programa de fidelización y recompensas

| Atributo | Descripción |
| :--- | :--- |
| **Nombre** | Configurar programa de fidelización y recompensas |
| **Objetivo** | Permitir al administrador configurar un programa de fidelización fijando de forma irrevocable la modalidad (puntos o sellos) y los colores corporativos, y condicionando la activación del programa al llenado completo de sus reglas y recompensas. |
| **Actores** | Administrador del Negocio |
| **Descripción** | El administrador configura el programa desde su panel. Un diálogo obligatorio le exige definir la modalidad base y la identidad visual. Una vez guardado este paso inicial, el sistema genera el código QR del programa en estado inactivo. El administrador completa las reglas de acumulación, hitos de premios y el tiempo de seguridad (cooldown), y solo podrá activar el programa cuando toda la configuración esté completa. |
| **Precondición** | El administrador accede a la sección Programa de su panel con permisos de gestión. |
| **Postcondición** | El programa de fidelización queda registrado con su modalidad fija (puntos o sellos), sus colores corporativos, su QR generado y sus reglas operativas listas para aplicarse en caja tras su activación. |

**Flujo Básico**
1. El administrador accede a la sección Programa. Si aún no existe un programa configurado, el sistema abre automáticamente un **diálogo obligatorio de configuración bloqueante**; si ya existe, muestra su configuración para edición.
2. El diálogo inicial presenta los siguientes campos obligatorios:
    * Selección de modalidad única (Opciones excluyentes: "Sistema de Puntos" o "Sistema de Sellos").
    * Personalización visual básica con los colores corporativos principal y secundario para la tarjeta digital.
3. El administrador selecciona la modalidad, define los colores y hace clic en "Continuar".
4. El sistema procesa la selección, fija la modalidad de forma permanente para ese programa, guarda los colores, genera el código QR del programa y crea el registro en estado **Inactivo**. La modalidad no puede cambiarse después.
5. El sistema muestra el panel general de configuración con los campos pendientes:
    * **Si se eligió Puntos:** Configuración de la equivalencia (valor monetario por punto) y umbrales de premios.
    * **Si se eligió Sellos:** Configuración del total de casilleros (entre 5 y 20) y asignación de premios en hitos específicos.
    * Configuración de la regla de seguridad **Cooldown** (tiempo de espera obligatorio entre registros consecutivos para un mismo cliente, entre 0.5 y 72 horas).
6. El administrador completa todos los campos requeridos y activa el interruptor de "Programa Activo".
7. El administrador hace clic en el botón "Guardar Cambios".
8. El sistema valida que no existan campos vacíos ni valores incongruentes. Si la configuración está completa, actualiza el estado a Activo y muestra un mensaje emergente de éxito. Si se solicitó la activación con campos incompletos, guarda el programa como Inactivo, resalta los requisitos pendientes y muestra el aviso correspondiente, finalizando el flujo.

**Flujos Alternativos**

*   **Flujo alternativo: Intento de activación con configuración incompleta.**
    1. En el paso 6, si el administrador intenta activar el interruptor de "Programa Activo" o guardar sin haber rellenado los umbrales de premios o los valores de acumulación.
    2. El sistema bloquea la acción de guardado como activo.
    3. El sistema resalta visualmente los campos faltantes con un aviso de error descriptivo: "Debe configurar al menos una recompensa para activar el programa".
    4. El programa se guarda únicamente en estado **Inactivo** (o mantiene sus cambios sin activarse), permitiendo al administrador corregir o completar después.
