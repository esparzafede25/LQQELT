# Ofelia’s Dream en el presente

20 de octubre de 2026. El usuario aportó bensound-ofeliasdream.mp3 para el resto de la historia del presente. Archivo original íntegro de producción en assets/present-music-v1, sin recomprimir.

## Comportamiento

- Comienza al despertar y acompaña dormitorio, pasillo, baño, cocina, mapa/sobre, mochila, auto y epílogo.
- Conserva una única reproducción entre habitaciones. Los recuerdos, menú, archivo, créditos y pesadilla quedan fuera de esta pista.
- Se desvanece al entrar a un recuerdo y vuelve desde la posición conservada al regresar al presente. Volver durante un fundido cancela la parada anterior; no duplica la canción.
- Volumen bajo: ganancia0.18 respecto al original,0.09 durante los subtítulos/elecciones. Respeta volumen y silencio generales. Los efectos y diálogos anteriores se conservan.
- Repite la pista si la partida lo requiere. Posición musical mantenida durante la sesión; recargar inicia de nuevo la canción. Cargas tardías no pueden reactivarla fuera del presente. Fallar la carga no bloquea el juego y puede recuperarse en otra entrada.

La pesadilla mantiene Stifled Screams y la voz real con eco, documentadas en PASADA_13_VOZ_INTRO.md. Al iniciar el video de despertar se detiene esa mezcla y comienza el fondo del presente.

## Verificación

Stage: cocina con música activa, entrada al recuerdo del mate con música del presente pausada, menú y Continuar con recuperación de música en la cocina. H: cocina activa y recuerdo del mate pausado; partida completa desde la pesadilla hasta dormitorio con cambio correcto de pista. El regreso final de H se registra en browser-H.json. No errores de aplicación en las rutas comprobadas. En accesos directos sin interacción previa el contexto puede iniciar bloqueado por el navegador y se habilita al pulsar el control de sonido.

Suite completa Stage y H:18/18PASS. Present-score verifica continuidad entre escenas, pausa/retorno a la misma posición, reducción por diálogo, bus de silencio, cancelación de fundidos, cargas tardías y recuperación de errores. El resto de pruebas cubre diálogos, recuerdos, guardados, baño, mochila y final. Validador:37scripts/imports,49medios cinematográficos,20medios de recorrido PASS.

Paquete integrado:9 archivos, cinco sobrescrituras con guardas SHA256 y respaldo en qa/present/story-music-v1/backup-main del workspace. Manifiesto h-story-music-v1-result.json, con prioridad sobre h-intro-sound-v1 para OpeningScene y CreditsScene. Cierre documental/capturas en h-music-delivery-v1-result.json. No reejecutar integradores ya aplicados. No videos ni guardados del usuario sobrescritos, sources intacto y sin publicar GitHub.

Original ~298.8 s, -17.60 LUFS y -1.21 dBTP; sólo atenuación en reproducción. Crédito Bensound — Ofelia’s Dream. Las decisiones de volumen son una primera mezcla ajustable después de la escucha del usuario.
