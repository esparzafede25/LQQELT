# Voz de Valentino — primera edición real

20 de octubre de 2026. Grabación aportada por el usuario: `Grabación (10).m4a`, 73.589 segundos, AAC estéreo 96 kHz. Original sin modificaciones en OneDrive y copia de resguardo en `qa/present/voice-intro-v1/original.m4a`, SHA256 coincidente.

## Entrega

- `INTRO_VALENTINO_EDITADA.wav`: maestro PCM 24 bits, mono, 48 kHz, 63.20 segundos.
- `INTRO_VALENTINO_EDITADA.mp3`: copia para escuchar, 192 kb/s.
- `VO_INTRO_01.wav` a `VO_INTRO_08.wav`: ocho párrafos separados, listos para futura sincronización por plano.
- `edicion.json`: tiempos exactos de origen y del montaje, texto esperado y tratamiento aplicado.

Se quitan los intentos incompletos de «Dejaste todo en su lugar…» entre 13.46 y 23.72 s y de «Me da miedo olvidar tu voz…» entre 49.75 y 57.99 s. Se conservan sus lecturas completas posteriores. Se retiran los «vamos de nuevo», se dejan 1.45 s de separación entre párrafos y márgenes inicial/final. Se conservan respiraciones y pausas interiores.

Tratamiento: fundidos de borde de 8 ms para evitar clics, filtro suave de graves a 65 Hz y ganancia uniforme de +6.28 dB, limitada por pico verdadero de -2 dBTP. Medición final: -23.56 LUFS integrados, 6.60 LU de rango, sin saturación. No se cambia velocidad, tono o identidad de la voz; no se generan palabras.

## Comprobación

Transcripción local de origen, tramos dudosos y edición mediante Faster Whisper small; no se envió la grabación a servicios externos. Cortes elegidos en regiones de baja energía, fuera de las palabras reconocidas. Transcripción final contiene las ocho ideas en orden y no contiene los intentos descartados. Decodificación completa de WAV/MP3 sin errores. El reconocimiento puede confundir «vos/voz», «pasillo/pastillo» y algunas consonantes: no se confunde una hipótesis automática con una escucha humana definitiva.

El usuario aceptó esta edición y pidió unirla a la introducción con eco leve y la música aportada. Las ocho tomas se utilizan en `assets/intro-sound-v1/sueno-mezcla.mp3`; ver `PASADA_13_VOZ_INTRO.md` para el estado de integración y pruebas. Se conserva este maestro limpio para futuras mezclas. No afirmar corrección perfecta de pronunciación a partir de reconocimiento automático.

Herramientas locales de edición y reportes: `qa/present/voice-intro-v1/`. Dependencias/modelo local en `.tools/`, ya excluida de Git. Sources, GitHub y archivos de producción anteriores intactos.
