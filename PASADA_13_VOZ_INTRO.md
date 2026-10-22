# Voz real, eco y música de la pesadilla

20 de octubre de 2026. El usuario grabó el monólogo, aceptó la edición limpia y pidió incorporarla a la introducción con eco leve y la canción Stifled Screams que aportó.

## Entrega

La mezcla `assets/intro-sound-v1/sueno-mezcla.mp3` reúne los ocho párrafos de su voz, reflexiones cortas y música de fondo. 86.30 s, estéreo, 48 kHz, 192 kb/s. Voz directa al centro; eco a 105/165/285/430 ms filtrado y muy por debajo de la voz. Música atenuada y con reducción adicional durante los párrafos. Entrada y salida graduales. Pico verdadero -5.30 dBTP, sin saturación. Maestro limpio y ocho tomas se conservan en assets/voice-intro-v1; música original y tiempos/hashes en assets/intro-sound-v1. No voz sintética ni cambios de tono o velocidad.

Los planos primero y quinto ganan medio segundo para dejar respirar la lectura. Duraciones: 12,10,10,9.5,11.5,10.5,10,10 s, más 2.8 s de fundido antes del despertar. Todo el texto se conserva. DreamSoundtrack reproduce una sola mezcla por el bus principal de sonido y volumen. Omitir/salir/fallar/despertar detienen y desconectan la fuente; cargas o reanudaciones tardías no la reinician. Se ofrece Activar audio o Reintentar audio si hace falta. Reanudar contexto retoma la posición visual actual.

## Pruebas e integración

- Decodificación completa de ambas mezclas MP3 y medición de niveles sin saturación.
- Stage: imágenes y narración lateral, transporte de audio activo, silencio/reactivación y fundido final de plano 8.
- H: partida desde INICIAR, pesadilla completa y despertar hasta dormitorio jugable. En la comprobación posterior con música del presente se verificó canción del sueño activa y música del presente aún detenida durante la pesadilla; al llegar al dormitorio la segunda música está activa. Consola sin errores ni avisos en esa partida.
- Dream-audio/nightmare/opening-route/audio-lifecycle PASS. Con el seguimiento de música del presente, suite completa 18/18 PASS y validador 37 scripts/imports,49 medios cinematográficos y20 de recorrido PASS en H.
- Captura real de H: qa/present/intro-sound-v1/intro-H-proof.png.

Primer paquete integrado:22 archivos, tres sobrescrituras respaldadas en qa/present/intro-sound-v1/backup-main del workspace; manifiesto h-intro-sound-v1-result.json. OpeningScene y CreditsScene reciben después las modificaciones de la segunda canción: para esos archivos manda h-story-music-v1-result.json. No reejecutar los integradores ya aplicados.

Fuentes sincronizadas y GitHub intactos; originales de voz/música conservados. Créditos musicales incorporados. No se afirma que la escucha artística del usuario ni todo el sonido del juego estén cerrados.

Enlace del juego: http://localhost:3019/index.html
