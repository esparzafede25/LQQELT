# Lo que queda en la Tierra — correcciones visuales V4
16 de octubre de 2026.

Mochila: los cuatro objetos conservan sus formas; carta debajo del mapa; nueva levantada de bolso con mano libre separada de la mesa. Cara original, fondo y muebles fijos.
Auto: carrocería y puerta abierta fijas/conectadas durante entrada; cara y bolsa rígidas. Corte al interior sobre la acción de entrar, cierre fuera de cámara. Suspiro con respiración pequeña y rasgos originales. Partida con auto de proporciones constantes.
Baño: vuelve al pasillo con accesos a baño/cocina. Silla: baja la cabeza y cierra los ojos, mantiene gesto y permite apartar mirada.
Preparación revisada en cuadros intermedios; 14 pruebas de lógica y validador pasan. Métricas: cero cambios en región fija de mesa/puerta, y empalmes exactos carta->tomar bolso/corte interior->suspiro. No equivalen a aprobación de cada detalle artístico del juego: el siguiente trabajo con el usuario sigue siendo diálogos y sonidos.
Se conservaron las versiones anteriores. No se publicó GitHub. Fuentes sincronizadas intactas.
Consultar PASADA_07_RIGIDEZ.md y qa/present/h-rigid-v4-result.json para integración y respaldos.

## Registro anterior preservado
# Lo que queda en la Tierra — base jugable cerrada, 16 de octubre de 2026

## Entrega
Versión integrada en H:/TP FINAL I.C/Lo que queda en la Tierra -  JUEGO.
Jugar en esta PC: http://localhost:3019/index.html
Vista general: http://localhost:3019/recorrido.html
Servidor3019 independiente oculto. Staging sigue en juego-pulido y servidor3018.

## Alcance terminado y probado
- Ocho planos de pesadilla con monólogo lateral provisional para futura voz; despertar y salida del dormitorio con Valentino adulto.
- Presente en tercera persona: dormitorio, pasillo con baño o cocina, baño aislado en negro infinito y casa fría/oscura. Valentino sin mochila dentro de casa.
- Baño adulto V4: derecha anatómica alcanza y gira cruz, agua únicamente desde pico; lavado y reflejo; giro de cierre y agua apagada; salida física al vacío. Todos los tramos encadenados desde cuadros finales reales.
- Cocina con objetos: mate, herramientas y radio activan recuerdos, y los tres regresan a cocina. Carta y mapa llevan a preparar la mochila.
- Cuatro objetos guardados, tomar mochila, colocarla en auto, sentarse/cerrar puerta, clic Arrancar, primer plano de suspiro, auto alejándose y títulos. Guardados sólo tras acciones terminadas.
- No taller inicial; conservar recuerdo del taller con papá. No publicación GitHub; el usuario subirá desde Antigravity.

## Evidencia
Una partida QA desde pesadilla hasta títulos recorrió los tres recuerdos, carta, mochila y final (127.0.0.5:3018). La rama baño se probó por clics, recargas después de abrir/cerrar, salida a cocina y Menú->Continuar (127.0.0.6:3018). Créditos abre. Cuadros intermedios y cadenas de videos revisados antes de integrar.
En H:13archivos de pruebas pasan; validación34scripts/49assets y16medios del recorrido pasa. HTTP200, todas las imágenes de recorrido cargadas, menú y navegación de casa comprobados desde servidorH3019. Copias verificadas porSHA256.

## Preservación
113archivos integrados,14reemplazos con respaldo; ningún archivo borrado. Código H contrastado con snapshot y diferencias revisadas antes de escribir, sin cambios inesperados Antigravity. Respaldo original: juego-pulido/qa/present/h-backup-2026-10-16.
Reporte: qa/present/h-integration-result-2026-10-16.json.
Sources intacto. Sin Runway, compras, cambios de plan ni descargas de modelos. Comfy sin trabajos pendientes al cerrar.

## Próxima etapa con el usuario
Pulir diálogos, grabar voz de la intro y trabajar sonidos. Persisten detalles visuales menores: suavidad facial durante algunos giros/movimientos, goteo inicial algo abundante al lavarse, leve deriva de muebles y escala del sobre en mochila. No presentar esta entrega como perfección visual.
El seguimiento automático de esta etapa se desactiva al entregar el enlace. Retomar próximas mejoras por indicación del usuario, respetando este estado.



Selección final de entrada:21cuadros de gesto real (levanta pierna, se inclina y entra), corte al interior. La cola original con mano flotante fue descartada; no se presenta como sentada completa en plano abierto. Cabeza anclada al collar con transformación rígida uniforme, sin borrar rectángulos de hombros.


## Entrega comprobada de correcciones V4
Paquete de33archivos integrado en H con respaldo y verificacion SHA256, preservando los cambios existentes. Pruebas en H:14/14PASS y validador34scripts49assets20walkPASS. Desde127.0.0.12:3019 se jugaron mate, llave, mapa, carta, tomar bolso, ir al auto, entrada con corte al interior, Arrancar, suspiro y auto en ruta, hasta titulos finales. Recarga antes de Arrancar recupera exactamente ese paso. La salida del bano al pasillo y la silla triste habian sido integradas y probadas antes y permanecen sin cambios.
Enlace principal http://localhost:3019/index.html y recorrido http://localhost:3019/recorrido.html:HTTP200 verificado. Fuentes sincronizadas intactas; sin GitHub/Runway/compras. Versiones anteriores de todos los medios preservadas. Seguimiento corregir-deformaciones-del-juego ELIMINADO despues de la prueba completa. No repetir los scripts de integracion con guardas antiguas.
La entrada seleccionada usa21cuadros con gesto de subir y corte sobre accion al interior; no afirma una sentada completa en plano abierto. Cabeza y collar RGB originales, objetos y auto rigidos; entorno fijo. Proximo trabajo con el usuario: dialogos y sonidos.

## 17 de octubre: primera pasada sonora
Estado y alcance actuales en PASADA_08_SONIDO.md. Se prepara sonido de casa, objetos y final, con el guion de voz de intro guardado para grabación posterior.


## Entregada primera pasada sonora — 17 de octubre
13archivos de programa/documentación integrados con respaldo h-backup-audio-v1 y hashes. H:16/16pruebas pasan, validador35scripts49medios20walkPASS. Navegador127.0.0.16:3019 recorrió cinco acciones de mochila, entrada, Arrancar, suspiro/ruta, títulos y regreso al menú; sin errores ni avisos de consola. Seven muestras WebAudio reales renderizadas con señal y sin saturación. Comprobaciones de cancelación de motor, reintentos, pausa y callbacks tardíos pasan. Muestra visual qa/present/audio-H-proof-v1.png.
La mezcla sigue siendo una primera capa sintetizada. Falta escucha artística con usuario, voces reales, pulido editorial de diálogos y sonidos del baño con sincronía de canilla. No afirmar que todo el sonido del juego esté cerrado. Guion de intro preparado conservando textos actuales. No nuevas animaciones ni cambios a imágenes. No automatización ni GitHub. No ejecutar otra vez integradores con manifests antiguos.
Jugar: http://localhost:3019/index.html. Audición opcional: http://localhost:3019/qa/present/audio-preview-v1.html, botón Preparar muestras; no inicia sonido solo. Guion de grabación: GUION_VOZ_INTRO.md.

## 19oct — correcciones de movimiento del cierre
Estado vigente en PASADA_09_MOVIMIENTO.md. Se retiró la cabeza rígida de mochila y entrada: cabeza/cuello/hombros se mueven juntos, con decorado/objetos y puerta estables. Suspiro anterior recuperado, partida real generada y epílogo con ruta vacía ya integrados parcialmente en H. Mochila/carga/entrada revisadas y probadas en Stage, pendientes de integración guardada y comprobación H. No considerar aprobaciónV4 como calidad definitiva. Sonidos pospuestos por indicación del usuario.

## Entrega verificada — 19 de octubre: movimiento del cierre
Mochila/carga/entrada integradas y probadas en H, junto al suspiro anterior recuperado, partida real y ruta final vacía. Cabeza y cuello se mueven unidos, puerta fija/conectada, asa original y agarre revisados. Entrada con gesto de subir y corte al interior,17cuadros seleccionados. Ver PASADA_09_MOVIMIENTO.md para alcance y evidencia.
H:16/16pruebasPASS, validador35scripts49medios20walkPASS. Partida de prueba desde mochila hasta títulos en127.0.0.21:3019, con recarga antes de Arrancar conservando avance, sin errores/avisos de consola. Main http://localhost:3019/index.html; tramo corregido sin tocar guardados principales http://127.0.0.22:3019/index.html?scene=DEPARTURE. Respaldo h-backup-connected-motion-v6 y reporte h-connected-motion-v6-result.json, actualizados después de verificar. Sonidos quedan para después por indicación del usuario. Sources/GitHub intactos. Sin seguimiento nuevo ni trabajos Comfy pendientes al cerrar.

## Revisión posterior del usuario — prioridad sobre la entrega anterior
El usuario rechazó puerta separada y anatomía de V6; la etiqueta previa de entrega no equivale a aprobación artística. V7 también rechazado por puerta invertida. Estado vigente en PASADA_10_AUTO.md. V9 sustituye carga/entrada conservando actor y puerta de una misma fuente, exterior correcto y bisagras cortas; bolso uniforme sin pegar cabeza rígida. Entrada1..37 con corte al interior; cola de mano agrandada descartada. Puerta nativa acompaña levemente gesto; no se afirma inmovilidad absoluta ni una sentada exterior completa.

Stage recorrió nuevas acciones hasta Arrancar y recarga recuperó ese paso. Validación35scripts49medios20walk y pruebas car-departure/epilogue PASS. Sólo cambio de medios y referencias; suspiro/partida/ruta vacía anteriores conservados. Preparado para integración guardada y comprobación en H. Diálogos/voz y escucha artística de sonidos siguen pendientes; no afirmar juego completo acabado artísticamente.

V9 ya integrado y comprobado en H: carga/entrada/corte interior, recarga antes de Arrancar, suspiro/partida/ruta vacía y títulos; consola sin errores/avisos. Validación y dos pruebas pertinentes PASS. Respaldo h-backup-car-v9, reporte h-car-v9-result.json. Ver PASADA_10_AUTO.md para decisiones y límites: puerta/actor nativos coherentes, bolso restaurado; no afirmar inmovilidad absoluta de puerta ni sentada completa exterior. No nuevos sonidos, GitHub ni automatización. Captura car-v9-H-proof.png de reproducción real en H.

## Animaciones1080 — 19 de octubre
Pedido de reescalado ejecutado sobre31películas de ruta jugable:20 convertidas con FFmpeg/Lanczos local y11 ya1080 preservadas sin recomprimir.18 convertidas1920×1080 y2pasillos1872×1080 conservan aspecto; los11recuerdos1916×1080 intactos. No IA ni nuevas caras, interpolación o voces/sonidos. Sin cambios de código/rutas/guardados. Ver PASADA_11_1080.md e inventario/results e integration-main en qa/present/upscale-1080. Respaldo de cada video original en backup-stage/backup-main. No reejecutar integradores de medios anteriores con hashes antiguos; guardas1080 vigentes. Resolución mayor no equivale a nuevos detalles ni perfección artística del original.

Lote1080 integrado y verificado en H:31/31 PASS en navegador (resolución/reproducción/cuadro final), consola limpia; juego real confirma1920×1080 en carga del auto, captura game-H-proof.png. Validación de medios/imports PASS Stage/H. Manifiesto vigente h-upscale-1080-result.json; originales preservados. Esta entrega cierra reescalado, no pulido narrativo/sonoro ni corrección de defectos artísticos originales.

## 20 de octubre — archivo de producción e imágenes

Estado vigente en PASADA_12_ARCHIVO.md. Se reemplazaron los cuatro retratos SVG del archivo y el boceto del padre por imágenes de calidad basadas en referencias, conservando el maestro facial adulto. Láminas originales ampliables y galería de objetos/escenarios en lugar de la antigua guía técnica visible. Mapa y sobre nuevos también integrados en la escena jugable ENVELOPE; nombre Valentino, Ruta 40/Km 142, interior de la carta fuera de campo. Nuevo icono del árbol. Once imágenes reunidas, originales intactos; prompts y procedencia en assets/archive-v1.

H revisado: cuatro pestañas, 14/14 imágenes cargadas, ampliación/cierre; mapa, volver al cajón, sobre, diálogos y llegada automática a preparar mochila. Consolas sin errores/avisos. Validador Stage/H y cuatro casos de cancelación PASS. Integración guardada con respaldo, manifiesto h-archive-v1-result.json; no reejecutar integrador aplicado. Ningún video1080, sonido o guardado existente sobrescrito por esta pasada. Sources y GitHub intactos. Prototipos heredados conservados fuera del recorrido normal; no afirmar perfección visual de todo el juego. Enlace http://localhost:3019/index.html?scene=ARCHIVE.

## 20 de octubre — voz real y canciones del usuario

Estado vigente en PASADA_13_VOZ_INTRO.md y PASADA_14_MUSICA_PRESENTE.md. Grabación del usuario editada para quitar retomas fallidas, aceptada por él y unida al sueño con eco leve y Stifled Screams — Bensound. Mezcla única sincronizada de86.30s; voz limpia y ocho párrafos editables conservados. Otra canción aportada, Ofelia’s Dream — Bensound, acompaña desde despertar hasta casa/mochila/auto/epílogo: continua entre escenas del presente, funde y se pausa en recuerdos/menú, retoma al regresar y baja durante subtítulos. Respeta silencio/volumen. Créditos actualizados.

H: pesadilla completa/despertar/dormitorio comprobados; audio del sueño activo sin segunda canción durante pesadilla y música del presente activa al llegar al dormitorio. Cocina con nueva música y recuerdo del mate con pista del presente pausada. Suite Stage/H18/18PASS, validador37scripts/49medios/20walkPASS, mezclas decodificadas completas y sin saturación. Captura intro-H-proof y reporte browser-H. No se afirma perfección artística ni cierre total de diálogos/sonidos.

Integrados22archivos de intro y9de música del presente (29únicos antes del cierre documental), con respaldo y SHA256; preservadas diferencias Antigravity verificando el estado antes de escribir. Guardas vigentes: h-music-delivery-v1 (documentación), h-story-music-v1 > h-intro-sound-v1 > h-archive-v1 > anteriores; videos1080 intactos. No reejecutar integradores aplicados. Fuentes/GitHub y grabaciones originales intactos, sin compras ni automatizaciones nuevas. Jugar http://localhost:3019/index.html.

## 20 de octubre — aves en el mate

Audio aportado por el usuario integrado sólo como fondo del recuerdo del mate. Original intacto, copia con bordes suaves, bucle y fundidos. Respeta silencio y volumen; no se mezcla con la canción del presente. Stage/H tres pruebas de audio PASS y validador37scripts/49medios/20walk PASS; navegador H confirma playing en mate y paused al salir al menú, consola limpia. Ver PASADA_15_AVES_MATE.md y evidencia en qa/present/mate-birds-v1. Manifiesto h-mate-birds-v1-result.json prevalece para AudioManager/PresentScore y documentación actualizada; no reejecutar integrador aplicado. Sin cambios a videos, partidas, sources o GitHub. No se da por terminado todo el sonido del juego.

## 21 de octubre — Adiós Nonino en la llave diez

Tema aportado por usuario, interpretación identificada como Agustín Luna, añadido al recuerdo normal del taller con papá desde00:50.000. Original preservado y copia dedicada con corte preciso; fondo suave y fundidos. Respeta silencio/volumen, pausa al salir, no afecta partida final del auto. Créditos actualizados. Stage/H pruebas3/3PASS y validador37scripts/49medios/20walkPASS; navegador taller playing y menú paused, consola limpia. Evidencia y detalle en PASADA_16_LLAVE_MUSICA.md y qa/present/wrench-music-v1. Manifiesto h-wrench-music-v1-result.json prevalece para AudioManager/Credits/documentación sobre guardas anteriores; no reejecutar integradores aplicados. Videos, sources, originales y GitHub intactos.

## 21 de octubre — recuerdos sin zumbido

Pedido del usuario: retirar el fondo tonal de mate, llave y radio. AudioManager ya no crea drones para mate_morning ni car_garage; al entrar sigue limpiando el ambiente anterior. Cubre los tres recuerdos activos y sus versiones heredadas. Aves, Adiós Nonino, música del presente y efectos puntuales/estática de sintonía conservados; no se silencian buses compartidos. Stage: comprobación de ambas atmósferas sin crear tonos y limpieza previa PASS; pruebas de aves/llave/ciclo de audio3/3PASS y validador37scripts/49medios/20walkPASS. Cambio reversible de código sin modificaciones de medios ni guardados. Manifiesto h-memory-no-hum-v1-result.json prevalece para AudioManager y este documento; originales y sources/GitHub intactos.

## 21 de octubre — partido sutil en radio

Ambiente de fútbol aportado por usuario integrado al encender radio, filtrado mono350–2400Hz y muy bajo detrás de la estática. Nivel .0007–.004 con dial; estática mantiene suelo .10. No zumbido tonal. Original conservado. Stage pruebas radio/mate/llave3/3PASS y validador37scripts/49medios/20walkPASS. H navegador: antes apagada, después playing; dial950AM operativo y al salir paused; consola limpia. Ver PASADA_17_PARTIDO_RADIO.md. Guardas h-radio-match-v1-result.json para AudioManager/documentos. No reejecutar integrador aplicado.

## 21 de octubre — arranque y salida con efecto del usuario

Archivo real de auto dividido en dos segmentos consecutivos, unidos a04-start y05-away sin recomprimir imagen1080. Motor arranca al pulsar Arrancar; salida6.75s con alejamiento y fundido, sin cola silenciosa original. Audio nativo del video conectado a master .55; respeta volumen/silencio y acompaña pausa, carga y fin. Motor sintetizado retirado de esta secuencia cuando hay conexión WebAudio. Paisaje vacío del epílogo sin video ni motor residual. Stage/H pruebas car-recording/car-departure/radio3/3PASS y validador37scripts/49medios/20walkPASS. H: arranque reproduciendo1920×1080, muted=false, llegada a epílogo sin videos; consola limpia. Flujos de imagen idénticos por SHA256 a los originales. Ver PASADA_18_AUTO_SONIDO.md y evidencia car-sound-v1. Guardas h-car-sound-v1-result.json para AudioManager/CarDepartureScene/CarDepartureProgress/documentos > h-radio-match-v1 > anteriores. No reejecutar integradores aplicados. Grabaciones, videos anteriores, guardados del usuario, sources y GitHub intactos; no se afirma cierre artístico de todos los sonidos.

## 21 de octubre — portada unificada de presentación

La raíz/index.html ahora presenta juego y cortometraje con hero de ruta, dos tarjetas de imagen y estética cinematográfica oscura. Juego conservado en juego.html con enlace Inicio; almacenamiento del mismo origen intacto. Enlaces index.html?scene=... redirigen conservando parámetros. Cortometraje.html muestra Próximamente hasta completar scripts/portal-config.js con MP4 o enlace; no se cargó contenido de prueba como película. Arte existente en copias WebP ligeras, identidad preservada. Sin música automática en portada/corto.

Stage/H validador39scripts/49medios/20walkPASS. Navegación H: imágenes4/4, corto pendiente, acceso al juego, regreso Inicio, compatibilidad enlace antiguo, Continuar recupera partida de prueba del auto; consola limpia. Móvil375px sin desborde, tamaño restaurado. Evidencia portal-v1/portal-H-proof.png y browser-H.json. Integración con respaldo y SHA256, manifiesto h-portal-v1-result.json prevalece para index/documentos; juego.html nuevo conserva aplicación anterior. Leer PORTADA_WEB.md para agregar el corto. Local http://localhost:3019/; aún no publicada ni enviada a GitHub por preferencia de trabajar la copia local y subir desde Antigravity. No modificar sources ni reejecutar integradores aplicados. Sonidos y videos no cambiaron en esta pasada.

## 21 de octubre — voz de intro más pausada y sonido real del grifo

Estado vigente en PASADA_19_INTRO_ECO.md y PASADA_20_GRIFO.md. Intro v2: voz directa -2.85dB, dicción6% más lenta sin cambiar tono, pausas en silencios de frase, ecos más presentes y reverberación estéreo. Mezcla104.30s y ocho planos ampliados/sincronizados. Pico verdadero -7.93dBTP, integrada -27.92LUFS; originales y v1 conservados. H reprodujo nueva mezcla con monólogo, incluidos planos5/8; guardado posterior habilitó Continuar y dormitorio. Pruebas dream-audio/nightmare/opening-route3/3PASS. Muestra de voz disponible en assets/intro-sound-v2/muestra-voz.mp3. La nueva transcripción ASR opcional no estuvo disponible; no se afirma escucha humana automatizada.

Grifo: original del usuario conservado, bucle15.75s de tramo continuo con cruce250ms y filtro200–6000Hz, ganancia .18. Agua comienza con apertura2.4s, sigue entre acciones y se corta al cerrar3.7s; mano en lavado1.00–2.25s amortigua a2500Hz y nivel .21. Pausa/espera/fallo/salida cancela, carga tardía no reactiva y respeta silencio/volumen. H: apertura playing, continuidad al lavado, canilla cerrada guardada y vuelta al pasillo sin agua. Pruebas tap-sound/walk-progress/opening-route3/3PASS; validador40scripts/49medios/20walkPASS. Sin cambios visuales ni nueva animación.

Entrega conjunta con respaldo/SHA256 y evidencia en qa/present/intro-sound-v2 y tap-sound-v1. Manifiesto h-intro-tap-delivery-v1-result.json prevalece para documentos/evidencia y confirma los17archivos de producción integrados por h-intro-sound-v2 y h-tap-sound-v1. No reejecutar integradores aplicados. Portada, otros sonidos, grabaciones originales, guardados de localhost, sources y GitHub intactos. Calidad artística de la voz abierta al ajuste con el usuario. Abrir http://localhost:3019/.

## 21/10/2026 — Diálogos aprobados

Aplicadas revisiones M/L/R/E del usuario. R13 trasladada al regreso visible a cocina, con marca persistente y cancelación segura; E08–E10 sólo leyendas sin voz ni etiqueta V.O. M01 se distribuye en dos globos naturales. Ver PASADA_21_DIALOGOS.md. Pruebas de retorno/guardado/cancelación, sobre sin voz, finalización de recuerdos y disparadores aprobadas; validador 40 scripts/49 medios/20 walk. Navegador: recorrido radio hasta cocina y habilitación posterior del cajón; revisión de globos del mate. Ninguna modificación de audio o video.

## 22/10/2026 — Introducción sin voz

Por pedido del usuario se retiró la voz grabada de la introducción. DreamSoundtrack usa assets/intro-music-only-v1/sueno-musica.mp3, preparado directamente desde la música original, sin voz ni ducking de narración. Conserva duración, imágenes y textos. Originales de voz intactos como respaldo. Pista verificada: sólo audio, 104,30 s. Pruebas dream-audio y validador aprobadas.

## 22/10/2026 — Bloqueo tras introducción en GitHub

Confirmados seis medios del recorrido ausentes en HEAD 6b5586f por exclusión de qa. Recursos de despertar/dormitorio/pasillo copiados idénticos a assets/present-home-v1 y rutas activas corregidas. Validación exige assets para medios del recorrido. Cuatro verificaciones aprobadas. Ver CORRECCION_PUBLICACION.md y qa/present/production-paths-v1/media.json. Falta que usuario publique esta corrección desde Antigravity; no se hizo push.
