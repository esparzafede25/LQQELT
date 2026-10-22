# Continuación en Antigravity — Lo que queda en la Tierra

**Carpeta principal desde el 4/10/2026:** `H:\TP FINAL I.C\Lo que queda en la Tierra -  JUEGO`. La copia de Codex queda como respaldo. Ver `LEEME_PRIMERO.md`.

## Actualización del 3 de octubre de 2026

**Radio integrada:** `MISSION_RADIO` utiliza `RadioFilmScene.js`. Encendido animado, sintonización y diálogos a clic. Leer `PASADA_05_RADIO.md`. El próximo bloque es conectar y revisar el presente y el cierre, dejando el acabado atmosférico final para después.

**Taller integrado:** `MISSION_CAR` utiliza `CarFilmScene.js` y tres videos locales en `assets/car-cinematic/`. Leer `PASADA_04_TALLER.md`. La versión anterior queda en `MISSION_CAR_LEGACY`. Seguir con Radio antes de ampliar detalles opcionales de Mate/Taller.

**Entrega indicada por el autor: 26 de octubre.** Leer `ENTREGA_26_OCTUBRE.md`. Priorizar el recorrido completo; evitar invertir toda la producción en seguir perfeccionando Mate.

Leer primero **PASADA_03_RECORRIDO.md**. La implementación actual del recorrido está en `scenes/MateRouteScene.js`, con siete acciones y recursos en `assets/mate-route/`. La descripción inferior conserva la pasada anterior como referencia histórica; ya no describe los saltos ni los recursos de la nueva ruta. La recolección actual es guiada: mate → yerba → pava. Los POV de ventana/planta siguen pendientes. Conservar los diálogos sobre las cabezas y las esperas controladas por el lector.

Esta carpeta contiene una copia de trabajo del juego existente. La carpeta original en H:\TP FINAL I.C\juego lo que queda en la Tierra no fue modificada. Abrir ESTA carpeta completa en Antigravity, no solamente index.html.

## Ejecutar

Requiere Node.js. Ejecutar `npm run dev` y abrir `http://localhost:3017/?scene=MISSION_MATE`. `npm run build` valida sintaxis, imports locales y los recursos de ambas versiones. El menú completo está en `http://localhost:3017/`.

## Dirección que debe conservarse

El juego es la precuela del corto sobre Valentino y el duelo por su padre. La misión a Marte es una interpretación emocional de Valentino. El juego no debe revelar la carta vacía ni confirmar objetivamente la misión espacial.

Presente: casa oscura, aislamiento, planos fijos, rutina, acciones mínimas; referencia de lenguaje No, I'm Not Human. Recuerdos: personajes visibles, composición cinematográfica e interacción con objetos; referencia de lenguaje Grim Fandango. Mantener el universo propio de stop motion artesanal: rostros de madera tallada, ropa de tela, objetos gastados, maquetas e iluminación cinematográfica. Las referencias no autorizan copiar visualmente esos juegos.

Valentino tiene 11 años en Mate y Radio, 18 en Taller. Los diseños ya existen. La prioridad es terminar Mate antes de ampliar Radio o Taller.

## Implementado en esta pasada

- Seis imágenes integradas en `assets/mate-cinematic`: maestra, cebado, pase, padre tomando, devolución, cierre.
- Tres videos locales de unos cinco segundos: `pour.mp4`, `pass.mp4`, `return.mp4`. Sin audio generado; se conserva el sonido procedural del juego.
- En el montaje, la devolución se corta a los 2,8 segundos, antes de que el padre desvíe su mirada hacia cámara; el archivo completo se conserva para revisión.
- `scenes/MateScene.js`: tres acciones sobre objetos, inspección opcional de ventana, estados que bloquean clics repetidos, último cuadro del video conservado, planos fijos entre acciones, cierre silencioso y guardado al terminar.
- `styles/mate-film.css`: encuadre completo 16:9 y hotspots en el mismo sistema de coordenadas; sin recortes de personajes, parallax ni movimientos CSS de actuación. Rótulos al pasar el puntero, ayuda con H, navegación por teclado y áreas táctiles.
- Diálogo provisional breve: «Serví vos hoy», «Eso. Despacito», «¿Está bien?», «Está bueno», «Tomá». Es una propuesta de montaje, no guion aprobado por el autor.
- Nueva presentación acordada: diálogo sobre la cabeza del personaje, con nombre y anclaje diferente por plano. El texto espera un clic; también se avanza con Espacio/Enter. Los objetos no se activan durante una conversación.
- La duración del diálogo está separada de la animación: `say(speaker, text)` acepta texto o un array de frases. Los textos largos se dividen en páginas de hasta 64 caracteres por palabras, preservando su contenido. Para controlar el ritmo narrativo, preferir arrays de frases escritas deliberadamente.
- Se reserva espacio alrededor del encuadre para que el texto pueda ir sobre las cabezas sin tapar los rostros. `HEADS` en MateScene.js define los anclajes: actualizar si cambia un plano o su composición.
- Inicio de actuación después de abrir la transición mediante `onVisible`; prevención de transiciones simultáneas.
- Reparación de Continuar: las rutas WORKSHOP_* inexistentes se sustituyeron por INTRO, que decide según el progreso.
- Título actualizado a «Lo que queda en la Tierra» en menú y página principal.
- Validación real en `scripts/validate.cjs`; pruebas de navegador en `qa-mate.cjs` y evidencia en `qa/`.

## Límites y siguiente trabajo

La siguiente pasada está definida en **PASADA_02_MATE.md**. Leerla antes de hacer cambios: recoge la devolución del autor sobre los saltos de animación, la búsqueda de mate/yerba/pava y las inspecciones POV de ventana y planta. Los diálogos sobre cada personaje ya fueron revisados favorablemente; conservar su funcionamiento. El primer objetivo es corregir el gesto completo de cebado.

Esta es una primera versión integrada para revisión, no un acabado final del juego.

1. Revisar la actuación de manos y la continuidad entre los finales de video y el plano siguiente. Son generaciones nuevas, todavía pendientes de aprobación artística del autor. Hay variaciones de encuadre y ubicación de pava entre planos que deben valorarse viendo el montaje.
2. Padre tomando y cierre tienen imágenes fijas; aún no hay clips específicos de sorbo y de sentarse. El pase empieza con el mate ya extendido: falta tomarlo desde la mesa. La devolución fue valorada favorablemente por el autor. No presentar movimientos parciales como acciones completas.
3. La pose inicial de cebado entra mediante un corte que omite tomar y levantar la pava. Hace falta actuación desde la postura visible anterior; un fundido no resuelve el gesto ausente.
4. El recuerdo todavía regresa al taller INTRO heredado. La rutina del presente (dormitorio → pasillo → baño → cocina → preparar mate) está pendiente. Resolverla después de fijar Mate, sin improvisar diseños nuevos del presente.
5. Radio y Taller conservan su implementación anterior. Revisar más adelante las menciones objetivas a despegue y horarios en Radio/Sobre con el autor; no reescribir ahora todo el relato.
6. La voz y el foley final no están producidos: actualmente hay subtítulos y sonido procedural.

## Instrucción para el agente de Antigravity

Continuá sobre esta carpeta. Leé primero este documento y el código real. Ejecutá la escena MISSION_MATE y revisá las capturas de qa/. Conservá los diseños y el enfoque de planos integrados. Antes de ampliar escenas, auditá el recorrido completo y corregí errores observables de interacción, reproducción, encuadre, cancelación, guardado y continuidad. Verificá a 1440×900 y 390×844. No sustituyas los videos por personajes PNG animados con CSS. Si proponés una modificación narrativa o un nuevo plano, explicá qué problema concreto resuelve y mantené el cambio acotado a Mate. Al entregar, indicá archivos cambiados, pruebas realizadas y pendientes reales. No publiques ni sustituyas el proyecto original como parte de esta revisión.
