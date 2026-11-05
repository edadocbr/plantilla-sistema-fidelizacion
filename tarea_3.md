# Tarea 3 / CUS-03: Registrar compra y asignar puntos o sellos

| Atributo | Descripción |
| :--- | :--- |
| **Nombre** | Registrar compra y asignar puntos o sellos |
| **Objetivo** | Permitir al personal registrar rápidamente la transacción del cliente para actualizar su saldo de puntos o sellos en el programa de fidelización. |
| **Actores** | Personal de Caja |
| **Descripción** | Tras identificar al cliente, el personal visualiza sus datos básicos en la terminal de caja y utiliza los controles de acción para sumarle el beneficio correspondiente: puntos calculados por la compra o un sello directo, de forma rápida y segura. |
| **Precondición** | El personal ha completado exitosamente la identificación del cliente. El perfil del cliente está cargado y visible en la pantalla de la terminal de caja. |
| **Postcondición** | El saldo del cliente se actualiza y la terminal de caja queda disponible para atender al siguiente cliente o para completar el canje de un premio habilitado. |

**Flujo Básico**
1. El sistema muestra en la parte superior los datos del cliente identificado: nombre, DNI y fecha de inscripción.
2. El sistema muestra debajo el estado actual del cliente: saldo de puntos o sellos acumulados.
3. El sistema despliega el área de registro según la configuración del comercio:
    * **Si el local usa Puntos:** Muestra un campo numérico para ingresar el monto de la compra y convierte el monto en puntos enteros.
    * **Si el local usa Sellos:** Muestra un botón primario directo de "Asignar Sello".
4. El personal ingresa el monto de la compra en el sistema de puntos o hace clic directamente en el botón de asignación en el sistema de sellos. El botón de registro permanece deshabilitado si el monto no alcanza para sumar al menos un punto o si hay una operación en curso.
5. En el sistema de puntos, el personal confirma la acción con el botón principal "Registrar compra". En el sistema de sellos, la asignación se realiza en un solo paso, sin confirmación adicional.
6. El sistema procesa la transacción y actualiza el saldo del cliente.
7. El sistema muestra un mensaje de confirmación visual breve y no obstructivo.
8. Si el nuevo saldo habilita uno o más premios inmediatos, el sistema permanece en la pantalla de atención con el perfil cargado para continuar con el canje. Si no habilita premios, limpia la pantalla y regresa a la vista de identificación principal, finalizando el flujo.

**Flujos Alternativos**

*   **Flujo alternativo: Monto inválido (Sistema de Puntos).**
    1. En el paso 4, si el personal ingresa un valor igual a cero, un monto que no alcanza para sumar un punto o deja el campo vacío.
    2. El sistema mantiene bloqueado o inactivo el botón de confirmación.
    3. El sistema muestra un mensaje de error claro debajo del campo: "Ingrese un monto válido mayor a 0" o "Monto mínimo de S/ X para sumar puntos", según corresponda.
    4. El personal corrige el monto ingresado en el campo.
    5. Continúa en el paso 5 del flujo básico.

*   **Flujo alternativo: Error de conexión durante el registro.**
    1. En el paso 6, si el sistema no puede registrar la transacción.
    2. El botón de confirmación detiene su indicador de carga visual.
    3. El sistema muestra una alerta de error: "No se pudo registrar, compruebe su conexión".
    4. Los datos previamente ingresados se mantienen intactos en pantalla para que el personal pueda reintentar la acción sin volver a escribirlos.
