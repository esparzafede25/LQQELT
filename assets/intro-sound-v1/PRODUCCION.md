# Pesadilla: voz real y música

20 de octubre de 2026. Voz de Valentino grabada y aportada por el usuario. Música proporcionada por el usuario: `bensound-stifledscreams.mp3`, identificada como Stifled Screams — Bensound. Archivo original de música conservado como `musica-original.mp3`; SHA256 en `montaje.json`. No se atribuye una autoría adicional no verificada.

## Mezcla de reproducción

`sueno-mezcla.mp3`, estéreo 48 kHz, 192 kb/s, 86.30 segundos. Es la pista reproducida por OpeningScene mediante DreamSoundtrack. Contiene la voz editada, el eco y la música, con todos los tiempos ya fijados en una misma mezcla.

La voz directa permanece al centro. Reflexiones cortas a 105, 165, 285 y 430 ms, filtradas entre 180 Hz y 4.2 kHz y muy por debajo de la voz directa, producen un eco leve sin repetir palabras a volumen protagonista. `voz-con-eco.mp3` permite escuchar ese tratamiento sin la música.

La música se reproduce al 65% de su amplitud original y baja adicionalmente al 48% de ese nivel durante los párrafos. Entra en 2.8 s, se recupera suavemente entre frases y sale con fundido de 4.5 s antes del despertar. No se acelera, estira ni cambia el tono de la voz. Pico verdadero de la mezcla MP3: -5.30 dBTP; intensidad integrada -25.37 LUFS, sin saturación. Se prioriza conservar dinámica e inteligibilidad sobre aumentar volumen con limitación fuerte.

## Sincronía

Los ocho planos duran 12, 10, 10, 9.5, 11.5, 10.5, 10 y 10 segundos. Voz del primer plano a los 3.8 s, resto a los 1.6 s de cada imagen. El último eco de cada párrafo termina antes del plano siguiente. Tras los 83.5 s de imágenes, hay 2.8 s de fundido; la pista termina al comenzar el video de despertar. Texto y contenido se conservan.

La voz limpia y los ocho párrafos editables se conservan en `assets/voice-intro-v1/`. `montaje.json` registra fuente, hashes y tiempos de cada toma. Scripts y maestros WAV de mezcla en `qa/present/intro-sound-v1/` del workspace.

## Reproducción y cancelación

DreamSoundtrack conecta una única fuente al control principal de sonido/volumen del juego. El silencio no cambia los tiempos de las imágenes. Omitir, salir, fallar o llegar al despertar detienen y desconectan la fuente, cancelan carga pendiente y descartan resultados tardíos. Si el navegador bloquea el sonido, aparece «Activar audio»; al habilitarlo se retoma en el punto actual de la pesadilla. Si falla la carga, «Reintentar audio» permite recuperar la pista sin volver a comenzar el sueño.

Pruebas y estado de integración en `PASADA_13_VOZ_INTRO.md`. Ninguna voz sintética, servicio de audio externo o cambio de animaciones.
