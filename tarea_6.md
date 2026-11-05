# Tarea 6 / CUS-06: Supervisar operaciones y analizar los resultados del programa

| Atributo | Descripción |
| :--- | :--- |
| **Nombre** | Supervisar operaciones y resultados del programa |
| **Objetivo** | Permitir al administrador visualizar las métricas clave de adopción y el impacto del programa en unidades reales acumuladas, auditar la actividad reciente en caja y analizar la evolución temporal de puntos o sellos. |
| **Actores** | Administrador del Negocio |
| **Descripción** | Al ingresar al panel, el administrador visualiza un resumen ejecutivo enfocado en la salud del negocio: número de clientes inscritos, volumen de puntos emitidos y canjeados o cartillas completadas y premios entregados, un feed cronológico de la actividad reciente de caja y gráficos comparativos de rendimiento por períodos. |
| **Precondición** | El administrador accede al panel con permisos de gestión y el programa de fidelización se encuentra configurado. |
| **Postcondición** | El administrador obtiene una perspectiva clara de la retención de clientes y del costo e impacto de las recompensas otorgadas. |

**Flujo Básico**
1. El administrador ingresa al panel de control principal del sistema (vista de inicio del administrador).
2. El sistema carga las **Tarjetas de Métricas Principales (KPIs)** del negocio:
    * **Total de Clientes Inscritos:** Cantidad acumulada de usuarios registrados en el programa, con el número de clientes activos en los últimos 30 días como referencia.
    * **Métrica del Programa (según modalidad):**
      * *Si es Puntos:* Total de **Puntos Emitidos** y total de **Puntos Canjeados**, expresados en unidades reales acumuladas.
      * *Si es Sellos:* Total de **Cartillas Completadas** y total de **Premios Entregados** en el período.
    * **Tasa de Canje:** Relación entre lo canjeado y lo emitido.
3. El sistema muestra la sección de **Gráficos de Rendimiento**:
    * Visualización comparativa en barras de puntos o sellos emitidos frente a los canjeados, desglosada por **Día, Mes y Año**.
4. El sistema presenta el feed de **Actividad Reciente en Caja**:
    * Una tabla ligera y limpia con las últimas transacciones realizadas: hora, tipo de acción (registro o canje), cliente y nombre del cajero. La cabecera de la tabla se desplaza junto con el contenido y no permanece fija.
5. El administrador utiliza los filtros temporales para auditar diferentes rangos de fechas: hoy, últimos 7 días, últimos 30 días o un rango personalizado.
6. El flujo de supervisión finaliza cuando el administrador navega a otra sección o cierra sesión.

**Flujos Alternativos**

*   **Flujo alternativo: Consulta de período sin datos (Estados Vacíos).**
    1. En el paso 5, si el administrador selecciona un rango de fechas donde no se registraron transacciones o inscripciones.
    2. El sistema muestra un componente de estado vacío amigable y limpio: "No hay registros para este período", tanto en el gráfico como en la actividad reciente, en lugar de romper el diseño o mostrar ceros confusos.
    3. Las tarjetas de métricas pueden reflejar cero sin afectar la claridad del panel.
    4. El administrador ajusta el selector de fechas.
