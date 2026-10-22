# Auto — revisión solicitada por el usuario

19 de octubre. El usuario RECHAZA la carga/entrada entregada V6: puerta separada y partes del cuerpo incorrectas. Esta indicación prevalece sobre la aprobación visual registrada en PASADA_09 y CIERRE_PROYECTO. No afirmar corregido por tests lógicos o panel inmóvil.

Revisión directa de pack-car-sit-rigid-render-v6/frame_00041.png frente al raw car-entry-connected-v5/frame_00041_.png: el montaje borra una franja diagonal del antebrazo y torso. La máscara persona contiene sólo superficies visibles del raw, pero se combina con otra geometría de ventana/puerta; aparecen huecos del fondo y miembros cortados. El raw tiene brazo completo. No volver a segmentar actor con una puerta distinta ni reparar sólo el cuello.

La unión de puerta también requiere una base mecánica coherente: bisagras cortas sobre el pilar A, no un poste aparentemente separado. Se prepara una base nueva con herramienta integrada de imágenes, conservando identidad/ropa/auto/casa/atmósfera. Comfy8188 revisado: cola vacía. No se enviaron nuevos videos aún.

H conserva la versión anterior mientras se revisa el sustituto. No modificar sonidos, fuentes ni GitHub. Manifiesto vigente de H: h-connected-motion-v6-result.json. No repetir integradores anteriores.

## Corrección del usuario: puerta V7 invertida — RECHAZADA
Las tres imágenes car-physical-v7-start/bag-inside/seated muestran panel INTERIOR hacia la cámara frontal: orientación errónea. Usuario lo señaló expresamente. Descartar V7 y sus videos; NO integrar aunque estén completos. Trabajos d0510a89-6f1c-425b-bd74-137b31eb0ef5 (place), a57f1d1f-1234-4aee-b726-742229e1d88f (enter). Cola vacía al retomar. No reenviar ni usar el colector V7 para producción.

Se vuelve a la referencia ORIGINAL departure-car-v1/00-start.png, cuya cara EXTERIOR de puerta está orientada correctamente. Nueva edición localizada: conservar exterior oxidado, manija exterior y espejo; corregir sólo unión de borde delantero con pilar A y bisagras cortas, sin invertir puerta ni mostrar apoyabrazos/manivela interior. Primero revisar base; no enviar animación de una base incorrecta.

## V8 en preparación
Base car-physical-v8-start.png y pose car-physical-v8-bag-inside.png revisadas: exterior correcto y dos bisagras cortas sin poste flotante, cuerpo íntegro. Generadas con herramienta integrada a partir del original (no de V7). Carga local enviada con submit-car-physical-v8.cjs: e24bda49-a9a1-4dd6-b58c-a0f2675595cd, 65cuadros. Pendiente revisar movimiento completo; las imágenes fijas no equivalen a aprobación de video. No máscaras que corten cuerpo; película entera antes de cualquier composición. Historial V7 no disponible en sesión Comfy actual; se mantienen IDs como rechazados, no asumir éxito.

Pose final car-physical-v8-seated.png revisada: ambos pies dentro y cuerpo tras parabrisas, puerta abierta exterior sin cambio de orientación. Entrada enviada 9d7902a6-aa7b-4aac-acfb-8090e93a57b7,65cuadros. Cola comprobada: carga calculando, entrada pendiente. Colector collect-car-physical-v8.cjs guarda candidatos en qa/present/car-physical-v8, NO producción. Galería car-physical-v8.html. Prompts completos de movimiento en workflows JSON y submit-car-physical-v8.cjs. Imágenes editadas con herramienta integrada, referencias y dirección: original -> V8start (sólo bisagras cortas y unión A); V8start -> bag-inside (sólo pose/bolso, exterior invariante); bag-inside -> seated (sentado completo, pies dentro, puerta invariante). No sustituir películas aprobadas por imágenes fijas.

## V9 — estado vigente, revisión en juego
Videos V8 encontrados completos65+65, recopilados sin reenviar (historial de sesión anterior no disponible). Cola inicialmente ocupada por otro trabajo: no interrumpido. Después libre se calculó SAM3 partes bolso/manos0153b12f-d4ea-4cf7-a1f3-4f8184350c95 y reaparición desde49 b2da64b6-9313-446e-8968-b24d6cf7a409. Máscaras+JSON en QA. Se rechazó raw carga por bolso que se aplasta, y cola de entrada por mano agrandada. No se seleccionaron completos por tener endpoints correctos.

car-full-body-v9.html/.js conserva fuente completa del actor y puerta. Prueba con panel estático produjo doble manija: RECHAZADA; código vigente usa metal NATIVO del mismo cuadro sólo para oclusión del bolso, nunca placa estática sobre cuerpo. Prueba que rellenaba bolso con final de carga generó mano en asiento: RECHAZADA. Nueva placa car-v9-clean-empty.png generada con herramienta integrada y revisada sin actor/manos/bolso. Corrección probada en canvas33/41/47/49 y reexport65. No reutilizar renders previos a esta última exportación.

Activos preparados assets/departure-car-v9: carga65 y entrada37(primeros1..37), posters reales, PRODUCCION.md. Sólo CarDepartureProgress actualizado en Stage; suspiro/partida/epílogo previos intactos. Láminas completas QA car-v9-edited/place-all-frames.jpg y enter-all-frames.jpg. Validación35scripts49medios20walk y pruebas car-departure/epilogue PASS. Falta terminar prueba en navegador e integrar H con guardas actuales. No afirmar entrega aún.

Receptor temporal car-v9-export.cjs3022PID8944 (verificar antes de cerrar); origen127.0.0.8:3018, sólo PNG acotados en QA. Servidor Stage3018 reabierto; principal3019 puede estar cerrado. No descargas por navegador. No publicar fuentes/GitHub ni crear automatización.

## Integrado y comprobado en H — 19 de octubre
V9 integrado con respaldo h-backup-car-v9 y reporte h-car-v9-result.json (prevalece sobre connected-v6 para estos archivos). 9archivos verificados porSHA antes de cierre de notas; después se añade screenshot y se actualizan hashes de documentos. No repetir integrador Apply.

H127.0.0.27:3019/index.html?scene=CAR_DEPARTURE reprodujo carga65 y entrada37 hasta Arrancar; recarga recuperó Arrancar, clic continuó suspiro/partida y epílogo con ruta vacía y títulos. Consola errores/avisos[]; validador35scripts49medios20walk y pruebas car-departure/epilogue PASS en H. Captura car-v9-H-proof.png registra carga desde medio REAL assets/departure-car-v9/01-place-bag.mp4,5.416s. No equivale a aprobación artística de cada detalle restante. Fuentes intactas y sonidos sin nuevos cambios.

Decisión final: actor Y puerta de misma película, sin máscara person y sin metal estático de otra geometría. Panel/puerta nativos pueden acompañar ligeramente gesto. Bolso rígido usa placa vacía NUEVA revisada sin manos, no final de actor; se eliminaron los renders intermedios como candidatos de producción reexportando los65 finales. Cola de entrada38..65 no usada. Suspiro/partida/epílogo conservados. Próximo control con usuario: percepción de esta corrección antes de cerrar pulido de voces/diálogos/sonidos. No afirmar que todo el juego esté terminado artísticamente.
