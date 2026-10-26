# Recuerdos una sola vez y cierre del relator — 24/10/2026

Pedido: los recuerdos del mate, llave diez y radio se viven una sola vez por partida. Al tocar de nuevo un objeto completado, Valentino responde como pensamiento: «Por hoy, prefiero dejarlo ahí.» Se conserva la posibilidad de tocar el objeto, pero no se vuelve a entrar al recuerdo. Los indicadores de finalización existentes sirven también para partidas guardadas; una partida nueva vuelve a habilitarlos.

La respuesta usa el cartel de subtítulos con nombre VALENTINO. Bloquea las interacciones sólo mientras está visible, luego devuelve los objetos disponibles. Una salida de escena o cancelación no reactiva una visita anterior. No reinicia progreso ni altera el desbloqueo del siguiente recuerdo/cajón.

Radio: «Se está yendo... ¡Se vaaaa!» pertenece a RELATOR y cierra su transmisión. La estática termina después de esa línea. Valentino conserva «Si salgo ahora por la ruta, todavía puedo llegar a verlo partir» al volver a la cocina.

Archivos funcionales: scenes/PresentScene.js, PresentKitchenScene.js y RadioFilmScene.js. No se modifican imágenes, clips ni grabaciones. Preparación local; no publicar GitHub automáticamente.

Pruebas funcionales: kitchen-triggers, memory-completion, dialogue-return, subtitle-cancel y chair-grief. Validador de scripts/medios. Evidencia de navegador e integración: qa/present/memory-once-v1.

## Entrega

Integrados los tres archivos funcionales en H con comprobación previa de todos los SHA actuales, respaldo y reemplazo por archivo temporal. Cinco pruebas funcionales PASS y validador PASS (40 scripts, 49 medios cinemáticos, 20 del recorrido).

Navegador de preparación: mate jugado completo desde la cocina; segundo clic muestra pensamiento con nombre, vuelve a habilitar objetos y la recarga conserva el bloqueo. Radio sintonizada y diálogos recorridos: última intervención «¡Se vaaaa!» con etiqueta RELATOR; luego regreso a cocina con frase de Valentino, sin errores de consola. Llave y radio completadas cubiertas por pruebas funcionales del mismo disparador. Guardados del usuario en localhost intactos: pruebas en orígenes aislados. No se hizo una nueva revisión artística de videos porque no se modificó ningún medio.

Ver juego principal en http://localhost:3019/juego.html. Falta publicación por el usuario desde Antigravity para llevar esta corrección a GitHub.
