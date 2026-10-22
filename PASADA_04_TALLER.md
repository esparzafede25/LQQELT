# Taller — Pasame la diez

## Dirección

El autor aprobó el estilo del nuevo Mate como referencia del juego. Esta pasada integra personajes, auto y taller en el mismo plano, con Valentino de 18 años basado en su hoja de diseño. Conserva la calidez del recuerdo y la enseñanza del padre. El acabado oscuro del presente se trabaja después de conectar el recorrido completo.

## Alcance

- Elegir la llave en la caja del banco. Una elección incorrecta recibe una orientación del padre y permite reintentar.
- Valentino saca las manos de los bolsillos, camina al banco, toma la llave y vuelve.
- Clic en el motor: se acerca, apoya la herramienta, ajusta y se incorpora conservándola.
- Clic en el capó: cierre animado y pausa entre padre e hijo.
- Diálogos sobre cada personaje, con avance por clic o Espacio/Enter. H señala el objeto disponible.
- Se conserva el último cuadro real de cada clip. Cada nueva generación comienza desde el final de la anterior. Un fallo ofrece reintento sin completar el recuerdo.

## Archivos

La nueva versión está registrada en `MISSION_CAR` y en el alias `MISSION_CAR_FILM`. La anterior está disponible en `MISSION_CAR_LEGACY`. Abrir `http://localhost:3017/?scene=MISSION_CAR` con el servidor local activo.

`scenes/CarFilmScene.js` reutiliza el reproductor cancelable y el diálogo del Mate. `assets/car-cinematic/` contiene imágenes y videos locales. `production.json` registra los prompts de video; `image-prompt.txt` registra el plano inicial, generado con la herramienta integrada de imágenes. `qa/car-check.html` permite comprobar selección, errores, salida, recorrido y guardado. La versión anterior de la escena queda preservada en `CarScene.js`.

## Límites y revisión pendiente

## Validación realizada

Build correcto: 21 scripts, imports y 33 recursos validados. Prueba completa en navegador correcta: selección incorrecta y retorno a la caja, tres videos completos, bloqueo de clics repetidos, guardado sólo al cerrar y retorno solicitado a INTRO. Salir durante la búsqueda cancela esperas y no guarda. Un recurso fallido permite reintentar y llegar al diálogo. Resultados en `qa/car/full-run.txt`, `cancel.txt` y `retry.txt`; captura en `qa/car/game-preview.jpg`. El diálogo inicial también se comprobó en una ventana angosta; falta una revisión móvil integral.

## Límites artísticos

Los diálogos están recortados para acompañar las tres acciones; no son una revisión definitiva del guion. Se omite por ahora el arranque y escucha del motor de la versión anterior porque no hay actuación correspondiente de encendido. El motor permanece apagado durante el trabajo. La frase final conserva el vínculo con la temperatura y el viaje.

Revisar artísticamente manos, proporción de la llave y rasgos: los videos generados conservan el movimiento completo pero presentan variaciones pequeñas. La selección de herramienta se hace mediante botones de texto, sin un POV adicional. No hay voces; se reutiliza sonido procedural. No considerar estos recursos un tutorial mecánico.

La prioridad de entrega sigue siendo el 26 de octubre: cerrar Taller, continuar Radio y conectar todo antes de ampliar detalles opcionales.
