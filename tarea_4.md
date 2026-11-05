# Tarea 4 / CUS-04: Verificar y canjear una recompensa

| Atributo | Descripción |
| :--- | :--- |
| **Nombre** | Verificar y canjear recompensa |
| **Objetivo** | Permitir al personal comprobar si el cliente cuenta con el saldo suficiente para canjear un beneficio (por acumulación histórica o alcanzado en la compra actual) y ejecutar el canje de forma inmediata. |
| **Actores** | Personal de Caja |
| **Descripción** | Tras identificar al cliente y opcionalmente registrar una compra o asignación de sellos, el sistema evalúa en tiempo real si el saldo del cliente cumple con las reglas de canje. El personal visualiza los premios disponibles y puede ejecutar el canje de manera inmediata con un solo toque. |
| **Precondición** | El personal ha completado la identificación del cliente y su perfil está activo en la terminal de caja. El cliente posee un saldo de puntos o una cartilla de sellos elegible para al menos una recompensa. |
| **Postcondición** | La recompensa es aplicada, el saldo o sellos correspondientes son descontados o reiniciados, y la terminal de caja queda lista para la siguiente operación. |

**Flujo Básico (Camino Principal)**
1. El personal completa el registro de la compra o asignación de sellos o simplemente visualiza el perfil del cliente tras identificarlo.
2. El sistema evalúa automáticamente el saldo actualizado frente al catálogo de recompensas del establecimiento:
    * **Si la compra actual hace que el cliente alcance la meta:** El sistema despliega una alerta visual destacada en la pantalla de atención indicando: "¡Premio disponible por la compra actual!".
    * **Si el cliente ya tenía premios acumulados de visitas anteriores:** El sistema muestra una sección clara denominada "Recompensas Disponibles".
3. El personal consulta verbalmente al cliente si desea canjear su beneficio en esa visita.
4. El personal hace clic en el botón de "Canjear" correspondiente al premio seleccionado.
5. El sistema muestra la confirmación directamente en la fila de la recompensa seleccionada, sin ventanas emergentes bloqueantes, con las opciones "Confirmar canje" y "Cancelar".
6. El personal confirma la acción.
7. El sistema procesa el canje, actualiza el saldo descontando los puntos o reiniciando los sellos de la cartilla y registra la entrega del beneficio.
8. El sistema muestra una notificación emergente visual breve indicando el éxito, cierra la atención y vuelve a la vista de identificación, finalizando el flujo.

**Flujos Alternativos**

*   **Flujo alternativo: Cancelación del canje por decisión del cliente.**
    1. En el paso 5, si el cliente prefiere acumular más para un premio mayor y decide no canjear en ese momento.
    2. El personal hace clic en "Cancelar" dentro de la confirmación de la fila.
    3. El sistema cierra la confirmación sin alterar el saldo del cliente.
    4. El flujo regresa a la pantalla de atención del cliente, dejándola lista para finalizar la atención.

*   **Flujo alternativo: Error de conexión durante el canje.**
    1. En el paso 7, si el sistema no puede procesar el canje.
    2. El sistema detiene el indicador de carga y muestra una alerta clara de error: "No se pudo procesar el canje, verifique su red".
    3. El saldo del cliente se mantiene intacto en su estado previo y los botones de canje vuelven a estar disponibles para reintentar al recuperar la conexión.
