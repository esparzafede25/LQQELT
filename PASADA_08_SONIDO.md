# Pasada 08 — sonido y preparación de voz
17 de octubre de 2026.

Primera capa sonora, no mezcla definitiva: viento doméstico apagado en recorrido y preparación de mochila; contactos discretos de papel, ropa, cuero, mate y llave; mochila apoyada en asiento y puerta cerrada fuera de cámara. Se conservan películas V4 y diálogo actual.
VideoSoundCues sigue tiempo REAL del video: silencio mientras pausa/buffering/seek, no repite contactos y descarta contactos viejos tras saltos. Se resetea en reintento y retira listeners al salir.
Arranque ahora espera playing, una vez por reproducción. Bus del motor anteriormente en cero: corregido. Reanudar etapa4 conserva ralentí sin repetir burro. Error/salida cancela arranque pendiente, corta fuentes de burro y detiene ralentí. Volumen guardado0 ya no se reemplaza por.8.
Foley sintetizado con WebAudio; no grabaciones finales ni voz artificial. Muestras reales OfflineAudioContext7/7 con señal y sin saturación, valores en qa/present/audio-render-check-v1.txt. Revisión de escucha accesible en qa/present/audio-preview-v1.html (Preparar muestras). Falta ajustar gusto/mezcla con el usuario y las voces reales; no afirmar mezcla artística definitiva.
Guion de voz de intro en GUION_VOZ_INTRO.md: ocho textos ACTUALES, indicaciones de interpretación y tiempos de imagen; no se modificaron frases, historia ni sobre. No se solicita grabación ahora.
Suite16/16PASS; validador35scripts/49medios/20walkPASS. En preparación se jugaron cinco acciones y entrada al auto, luego Arrancar. Pendiente comprobación final Stage, integración H guardada por SHA y prueba de motor/menú en H.
No fuentes sincronizadas, GitHub, compras, Runway ni videos nuevos. No se creó automatización. Servidores locales reabiertos:3018PID24676,3019PID27028.


Revisión Stage completada: origen127.0.0.15:3018 retomó hasta títulos finales; consola sin errores/avisos. VideoSoundCues ahora también sigue cuadros presentados mediante requestVideoFrameCallback, con cancelación en pausa/fin/salida y fallback timeupdate; prueba dedicada pasa. Preparado para integrar13archivos.


## Entregada primera pasada sonora — 17 de octubre
13archivos de programa/documentación integrados con respaldo h-backup-audio-v1 y hashes. H:16/16pruebas pasan, validador35scripts49medios20walkPASS. Navegador127.0.0.16:3019 recorrió cinco acciones de mochila, entrada, Arrancar, suspiro/ruta, títulos y regreso al menú; sin errores ni avisos de consola. Seven muestras WebAudio reales renderizadas con señal y sin saturación. Comprobaciones de cancelación de motor, reintentos, pausa y callbacks tardíos pasan. Muestra visual qa/present/audio-H-proof-v1.png.
La mezcla sigue siendo una primera capa sintetizada. Falta escucha artística con usuario, voces reales, pulido editorial de diálogos y sonidos del baño con sincronía de canilla. No afirmar que todo el sonido del juego esté cerrado. Guion de intro preparado conservando textos actuales. No nuevas animaciones ni cambios a imágenes. No automatización ni GitHub. No ejecutar otra vez integradores con manifests antiguos.
Jugar: http://localhost:3019/index.html. Audición opcional: http://localhost:3019/qa/present/audio-preview-v1.html, botón Preparar muestras; no inicia sonido solo. Guion de grabación: GUION_VOZ_INTRO.md.
