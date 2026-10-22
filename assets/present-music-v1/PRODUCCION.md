# Música del presente — Ofelia’s Dream

20 de octubre de 2026. Archivo aportado por el usuario: `H:/Boludeando ando/Lo que queda en la Tierra/bensound-ofeliasdream.mp3`. Copia íntegra en `ofelias-dream-original.mp3`, sin recomprimir ni modificar el original. Crédito mostrado: Ofelia’s Dream — Bensound, según identificación del archivo proporcionado.

Ámbito: despertar, dormitorio, pasillo, baño, cocina, mapa/sobre, preparación de mochila, auto y epílogo. La pesadilla conserva Stifled Screams y la voz real con eco. Los tres recuerdos conservan su sonido anterior. Menú, archivo y créditos no reciben esta música.

`PresentScore` mantiene una sola fuente estéreo al cambiar entre escenas del presente, conectada al bus principal que respeta silencio y volumen guardados. Ganancia de fondo 0.18, aproximadamente -14.9 dB respecto al original. Durante subtítulos y elecciones baja a 0.09; vuelve gradualmente al terminar. No se modifican diálogos ni efectos existentes.

La canción entra en 1.7 s. Al ir a un recuerdo o salir al menú se desvanece en 0.8 s; la posición se conserva en memoria y se retoma al volver. Si se regresa durante ese fundido, se cancela la parada anterior sin duplicar fuentes. Al terminar la pista, se repite. La posición no se guarda entre recargas del navegador. Un fallo de carga no bloquea la partida y puede recuperarse en la siguiente entrada al presente.

Medición del original: 298.8 s, -17.60 LUFS integrados, -1.21 dBTP. La atenuación se realiza al reproducir, antes del control de volumen general. No se envió la canción a servicios externos ni se generó música adicional.

Pruebas de continuidad, pausa/retorno, mezcla con diálogos, cancelación de fundidos, carga tardía, errores y silencio: `qa/present/present-score.test.mjs`. Estado de integración y pruebas de navegador en `PASADA_14_MUSICA_PRESENTE.md`.
