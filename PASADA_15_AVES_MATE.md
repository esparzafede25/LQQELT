# Aves en el recuerdo del mate — 20 de octubre

Pedido: usar el archivo de aves del usuario como ambiente de fondo en el mate. Original conservado; copia de reproducción con bordes suaves, bucle, entrada y salida graduales. Respeta volumen y silencio generales. No modifica escenas, videos, diálogos ni partidas guardadas.

Implementación: AudioManager activa aves sólo cuando el mate normal está visible, y las pausa al abandonar la escena. PresentScore admite una fuente y niveles opcionales, conservando los valores anteriores de la canción del presente.

Stage y H: tres pruebas pertinentes PASS (aves, música del presente, ciclo de audio); validador37scripts/49medios/20walk PASS. Navegador en ambas copias: recuerdo visible y aves playing después del gesto de audio; menú paused, consola sin errores/avisos. Evidencia de H en qa/present/mate-birds-v1/browser-H.json y mate-H-proof.png. No se cambia el silencio guardado del usuario en localhost.

Integración guardada por SHA256 y respaldo; manifiesto qa/present/h-mate-birds-v1-result.json. No volver a ejecutar integradores ya aplicados. Fuentes, originales y GitHub intactos.
