# Recorrido del mate — 3 de octubre de 2026

## Implementación

`scenes/MateRouteScene.js` conserva el diálogo aprobado de `MateScene.js` y agrega siete acciones independientes por clic: buscar mate, buscar yerba, buscar pava, preparar, cebar, alcanzar al padre (incluye sorbo) y recibir. La cámara se mueve con los botones Ventana / Mesa / Mesada o las flechas. H señala el objeto disponible; Tab y Enter permiten activarlo.

La búsqueda usa caminatas animadas, agarre, transporte y apoyo del objeto. No se desplazan recortes de personajes con CSS. La cámara recorta una cocina amplia; los clips de búsqueda también contienen seguimiento propio.

Cada video parte de una imagen extraída del final real del anterior. Al terminar se conserva el último cuadro del video durante la espera y el diálogo. Las ubicaciones de objetos se actualizan sólo después de completar la acción. Los clics repetidos se ignoran mientras se actúa. Si falla un video se ofrece reintentar sin avanzar ni guardar. Salir cancela las esperas y pausa los videos.

## Recursos y pruebas

La ruta nueva está activa en `?scene=MISSION_MATE`; `?scene=MISSION_MATE_LEGACY` conserva la versión anterior para comparación. El alias `MISSION_MATE_ROUTE` también abre la nueva versión.

Los recursos están en `assets/mate-route/`; `production.json` conserva tareas y prompts. Los contactos de revisión están en `qa/route/`. `qa/route-check.html` ejecuta pruebas en navegador del recorrido, salida durante movimiento y recuperación de un recurso fallido. `npm run build` valida sintaxis, imports y existencia/formato de los archivos.

Validación realizada: build correcto (20 scripts, 11 recursos anteriores y 15 nuevos); recorrido completo en navegador correcto, incluyendo siete videos, bloqueo de clic repetido, espera de diálogo y guardado al cierre. Evidencia en `qa/route/full-run.txt`. Se comprobó navegación por flechas y activación con Enter en el juego principal. A 390×844 el diálogo inicial permanece dentro de la pantalla. Las pruebas de salida durante acción y recuperación de video fallido también pasaron durante el desarrollo. Vista principal en `qa/route/game-preview.jpg`.

## Límites de esta entrega

- El orden de recolección es guiado: mate → yerba → pava. La propuesta anterior de elegir cualquier orden requeriría variantes visuales para conservar los objetos presentes en cada estado.
- Ventana y planta todavía no tienen las inspecciones POV propuestas. Los botones laterales exploran la cocina.
- Las generaciones presentan variaciones pequeñas de rasgos, materiales y utilería. La continuidad de acciones no equivale a un acabado artístico final.
- El diálogo sigue siendo breve y provisional. No se amplió Radio, Taller ni la rutina del presente. El cierre vuelve a INTRO.
- El sonido es procedural; queda pendiente foley definitivo y voz.

La dirección narrativa y las referencias originales siguen vigentes. No revelar la carta vacía ni presentar la misión espacial como un hecho objetivo.
