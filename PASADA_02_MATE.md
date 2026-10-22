# Pasada 02 — Recorrido y continuidad del mate

Documento de dirección original. Para el estado de implementación del 3 de octubre, leer **PASADA_03_RECORRIDO.md**: recorrido guiado y acciones continuas en una cocina ampliada. La exploración POV y la recolección en cualquier orden de esta propuesta siguen pendientes. Los detalles siguientes describen el objetivo y diagnóstico original, no el estado actual de todos los recursos.

## Resultado buscado

Valentino prepara y comparte el mate mediante clics sobre objetos de la cocina. Cada clic desencadena una acción completa desde la postura visible. El jugador puede detenerse a mirar la ventana y la planta. Los diálogos conservan sus globos sobre cada personaje y esperan al lector. La prioridad es una escena pequeña y cuidada.

## Primera corrección: cebar sin salto

En el juego actual, `perform('pour')` llama a `clip('pour')`, que sustituye el plano maestro por `02-pour.png`. Esa imagen ya muestra a Valentino con la pava levantada. El video continúa desde ahí: falta toda la toma de la pava. Un fundido o un movimiento CSS no resuelve ese gesto ausente.

Producir primero una versión de cebado que arranque en el plano maestro actual, con las manos de Valentino apoyadas y la pava en su posición visible. Secuencia: mira el asa → separa la mano de la mesa → agarra → levanta → aproxima al mate → inclina → sirve → endereza → apoya la pava → suelta. Mantener el padre, la vajilla, la luz y la cámara. El padre puede seguir el gesto con la mirada, sin otra acción grande.

El cuadro inicial debe coincidir con la espera anterior. Al terminar, conservar el cuadro real del video durante el diálogo y la siguiente espera. El pase posterior debe partir de esa postura y de esas mismas posiciones de objetos. La devolución actual sirve como referencia de continuidad percibida, aunque también se deberá revisar su empalme con el cierre.

Validar este primer gesto antes de producir el recorrido completo: manos y asa estables, sin duplicados, mate quieto, pava apoyada de forma legible. Un cambio de plano es válido si mantiene la fase de la acción; no debe saltar de manos vacías a un objeto ya levantado.

## Distribución de la cocina ampliada

Usar la imagen `assets/mate-cinematic/01-master.png` y las referencias originales como autoridad visual. Esta distribución es una propuesta para nuevos encuadres; no describe objetos que ya estén modelados o fotografiados fuera de campo.

| Zona | Objetos y personajes | Cámara |
| --- | --- | --- |
| Mesa | Padre sentado a la derecha; Valentino empieza a la izquierda. La mesa recibe lo que trae. | Plano general actual, ampliado sólo si hace falta mostrar el recorrido. |
| Ventana, izquierda | Ventana y planta ya visibles. Mate vacío con bombilla, en el mueble bajo la ventana. | Plano de Valentino acercándose; inspecciones a la altura de sus ojos. |
| Mesada, derecha | Yerbera en la mesada. Pava sobre un apoyo estable de la misma mesada, con agua ya lista. | Plano de acceso a la mesada, conservando la orientación de la mesa. |

El nuevo inicio necesita la mesa sin mate ni pava. No retirar esos objetos del plano con código y dejarlos en la imagen. Tampoco inventar una cocina diferente para cada plano. Fijar antes las posiciones, alturas, pasos libres y recorrido, con una vista de referencia común.

No añadir encendido de hornalla, espera de hervor ni manipulación de fuego en esta pasada. La preparación se centra en los objetos y en el encuentro con el padre.

## Recorrido jugable

Tras «Serví vos hoy», quedan disponibles las zonas de ventana y mesada. Puede buscar mate y yerba en cualquier orden; se trae un objeto por vez y se apoya en la mesa. La pava se busca después de preparar el mate, para que su traslado tenga un propósito inmediato.

| Clic | Actuación completa | Resultado visible |
| --- | --- | --- |
| Mate en el mueble | Valentino gira, camina, alcanza el mate, lo toma, vuelve y lo apoya. | Mate vacío con bombilla sobre la mesa; desaparece del mueble. |
| Yerbera en la mesada | Gira, camina, toma la yerbera, vuelve y la apoya. | Yerbera sobre la mesa; desaparece de la mesada. |
| Preparar el mate | Toma la yerbera, abre, vierte yerba, cierra y apoya. | Mate preparado; yerbera cerrada. |
| Pava en la mesada | Se acerca, agarra el asa, levanta, vuelve y apoya con cuidado. | Pava sobre la mesa; mesada sin pava. |
| Cebar | Toma la pava desde su reposo, sirve y la vuelve a apoyar. | Mate cebado; manos libres. |
| Alcanzar a papá | Toma el mate desde la mesa, lo acerca; el padre lo recibe. | Mate en manos del padre; manos del chico vacías. |
| Padre toma | Sorbo breve animado; baja el mate antes de conversar. | Mate sostenido por el padre. |
| Recibir | Después de «Tomá», el padre ofrece desde su postura de reposo; Valentino recibe. | Mate en manos del chico. |
| Cierre | Valentino se acomoda y comparte la pausa. | Cierre silencioso, luego regreso al presente. |

Una acción principal requiere un clic. No pedir un clic para cada microgesto. Durante la actuación se bloquean nuevas acciones; al terminar vuelve el control. No usar teletransporte, arrastre de figuras recortadas ni objetos que aparezcan por un contador invisible.

Si el jugador elige preparar antes de tener mate y yerba, Valentino orienta con una frase breve hacia lo que falta. No bloquear la exploración ni mostrar un aviso técnico. El padre no repite instrucciones constantemente.

## Cámara y exploración opcional

La cámara acompaña el desplazamiento para revelar dónde están las cosas: recorrido corto lateral o corte a un plano conectado por el mismo movimiento. Mostrar salida y llegada; mantener la dirección de desplazamiento y la ubicación del padre. Evitar desplazar sólo el fondo como sustituto de caminar.

Ventana: clic → Valentino se acerca → POV a su altura, mirando afuera a través de la ventana existente → pequeña acción visible, como apartar apenas la cortina → regreso. Conservar «Todavía está fresco afuera» como texto provisional.

Planta: clic → se acerca → POV del mismo ejemplar y maceta → toca suavemente una hoja y ésta se mueve → regreso. No agregar un recuerdo explicado ni una pista obligatoria en esta pasada.

El retorno debe recuperar el plano, la ubicación del chico y los objetos del momento anterior. Si dejó la yerbera en la mesa, tiene que seguir allí al volver del POV. Las inspecciones no completan tareas principales y pueden repetirse sin alterar el progreso.

En POV, mostrar el diálogo de Valentino como voz fuera de campo, identificado por nombre y fuera del objeto observado. No anclarlo a una cabeza que no está en ese encuadre. Los planos compartidos conservan los globos actuales sobre las cabezas.

## Contrato de continuidad de cada recurso

Para cada clip registrar: cuadro anterior, postura inicial, objeto y mano que lo sostiene, recorrido, postura final y siguiente acción posible. Revisar juntas las imágenes de inicio y final antes de integrar.

- El primer cuadro reproduce el estado que estaba viendo el jugador: cámara, manos, ropa, objetos y luz.
- El último cuadro se mantiene en pantalla. La siguiente acción parte de ese mismo estado o de un corte que conserva su continuidad.
- Cada objeto tiene una ubicación única: mueble, mesa o mano. Nunca aparece duplicado.
- Los videos actuales de cebado y pase son referencias de movimiento parcial; no llamarlos acciones completas.
- Si falta un video, declararlo como pendiente. Un plano fijo o un acercamiento digital puede servir para revisar composición, pero no cuenta como actuación o POV animado terminado.

Los recorridos de búsqueda pueden componerse con varios planos conectados. No exigir que una sola generación resuelva caminar, agarrar, volver y apoyar si pierde consistencia.

## Integración y comprobación

Trabajar únicamente en esta copia y en MISSION_MATE. Conservar el guardado al terminar, la salida al menú, la cancelación al cambiar de escena, los globos y el avance por clic/teclado. No reescribir los diálogos narrativos ni ampliar Radio/Taller.

Representar de forma explícita ubicación de objetos, acción en curso y exploración abierta. Actualizar las zonas clicables y los anclajes de diálogo al cambiar de plano. Si un recurso falla, evitar bloquear la escena y registrar qué actuación falta en el informe.

Comprobar el recorrido con mate primero y con yerba primero; inspeccionar antes y después de colocar objetos; pulsar repetidamente durante una acción; salir al menú durante recorrido, POV y diálogo; volver a entrar; revisar escritorio y móvil. No guardar MATE_COMPLETED antes del cierre. Escuchar que el sonido de agua empieza cuando se vierte, no cuando se hace clic o se agarra la pava.

Entregar una lista honesta de actuaciones animadas, recursos provisionales y acciones pendientes, junto con los archivos cambiados y la comprobación realizada.

## Orden de trabajo

1. Corregir y revisar el cebado completo en el montaje existente.
2. Fijar una referencia común de la cocina ampliada y producir el inicio con mesa vacía.
3. Implementar la búsqueda del mate como primer recorrido completo y comprobar su continuidad.
4. Incorporar yerba, preparación y pava usando la misma distribución.
5. Completar pase, sorbo y cierre; conservar y revisar la devolución.
6. Añadir los dos POV opcionales y sus retornos.

La primera entrega de esta pasada debe mostrar el cebado corregido y señalar los recursos que todavía hacen falta para el recorrido. No declarar la escena terminada sólo porque los clics funcionan.
