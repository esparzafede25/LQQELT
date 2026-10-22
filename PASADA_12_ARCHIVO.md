# Archivo de producción e imágenes de utilería

20 de octubre de 2026. Pedido: reemplazar imágenes provisionales por arte de buena calidad en el archivo de producción y corregir los objetos que todavía aparecían como gráficos de prueba en el recorrido activo.

## Entregado

- Cinco fichas de personajes con imágenes: infancia, adolescencia, juventud, adulto y padre. Se conserva el maestro facial adulto y se reutilizan originales de Bocetos. Dos retratos nuevos se generan con referencias del juego; no se sustituyen caras de las animaciones.
- Láminas de gestos, materiales y edades ampliables. Cada imagen del archivo puede abrirse y cerrarse con el botón o Escape.
- La guía de rutas y gráficos provisionales se transforma en «Objetos y escenarios»: mapa, sobre, cocina cálida, taller con papá, dormitorio adulto actual y baño aislado en negro.
- Mapa y sobre de 1536 × 1024 también reemplazan los cuatro usos de SVG provisionales de ENVELOPE, tanto en tarjetas como en inspección. Ruta 40 y Km 142 legibles; el sobre conserva el nombre Valentino y nunca muestra el interior.
- Nuevo icono del árbol para la pestaña del navegador. No se modifica la lógica narrativa, los diálogos, los guardados, los sonidos ni los 31 videos de la pasada 1080.

Procedencia, resoluciones y prompts: `assets/archive-v1/PRODUCCION.md` y `prompts.json`. Once imágenes en esa carpeta: cuatro nuevas y siete copias de originales existentes. Los originales permanecen intactos.

## Revisión y pruebas realizadas

1. Revisión visual de las cuatro imágenes generadas y de la galería dentro de Stage. Se revisaron ampliaciones de adulto, mapa, sobre y dormitorio, cierre con botón/Escape, pestañas y vuelta al menú.
2. Integración de 19 archivos de arte/código con verificación SHA256 y cinco sobrescrituras respaldadas. Todos los hashes H coincidían con el estado previo antes de escribir; no se copiaron carpetas completas ni se borraron archivos.
3. Validador en Stage y H: 35 scripts/imports, 49 medios cinematográficos y 20 medios de recorrido presentes, PASS. Prueba de cancelación/salida del final: cuatro casos, PASS en ambos.
4. Navegador H en origen de prueba `127.0.0.33:3019`: inspección del mapa, volver al cajón, abrir sobre, secuencia de diálogos y transición automática a «Preparar la mochila», 0/4. Sin errores ni avisos de consola. Guardados de localhost no se borran.
5. Archivo H: cuatro pestañas activadas con controles visibles, 14/14 imágenes cargadas a su resolución real, ampliación del mapa y cierre con Escape. Sin errores ni avisos. Capturas de retratos y tarjetas guardadas en `qa/present/archive-v1-*-H-proof.png`.

Manifiesto de esta revisión: `qa/present/h-archive-v1-result.json`. Respaldo de los archivos reemplazados: `qa/present/archive-v1-backup-main/` en el workspace. El manifiesto de esta pasada tiene prioridad sobre los anteriores para ArchiveScene, EnvelopeScene, ambos CSS, index y CIERRE_PROYECTO. No reejecutar `integrate-archive-v1.cjs --apply`: ya aplicado.

## Límites y siguiente trabajo

Quedan conservados los prototipos heredados fuera del recorrido normal, cuyos archivos aún contienen referencias provisionales. Esta pasada no declara corregidas todas las imperfecciones de las animaciones ni cierra voz, diálogos y sonido. No se publicaron cambios en GitHub; el usuario lo hará con Antigravity. Sources intacto, sin Runway, compras ni nuevos seguimientos automáticos.

Ver el archivo: http://localhost:3019/index.html?scene=ARCHIVE

Jugar: http://localhost:3019/index.html
