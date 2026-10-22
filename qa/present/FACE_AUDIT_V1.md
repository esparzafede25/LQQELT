# Auditoria facial del presente — 15 octubre, 23:14

24capturas de8videos principales en face-audit-v1 (cuadros16/32/48). Inspeccionados cuadros32 de cada video y posters principales. No modificar originals ni asumir que un poster correcto garantiza video correcto.

| Tramo | Observacion | Siguiente |
|---|---|---|
| Despertar | Rostro intermedio mas joven/suave, poca veta | FLF adulto nuevo y extremo sentado fijo |
| Salir dormitorio | Cara pequena y borrosa al caminar | Base adulta1024 y control de destino |
| Pasillo a bano | Perfil largo, algo mas juvenil en ojos | Revisar otros cuadros y rostro al girar |
| Pasillo a cocina | Principalmente espalda, sin mochila | Baja prioridad facial; no romper caminata |
| Abrir canilla | Cara principal madera, reflejo joven/borroso | Restaurar ambos y conservar mano DERECHA girando cruz |
| Lavarse cara | Reflejo cambia suavizado/ojos | Restaurar identidad/reflejo manteniendo agua desde spout |
| Cerrar canilla | Mano en cuadro32 parece cerca del spout mas que de cruz separada | Verificar contacto y giro fisico; no aprobar solo por usar brazo derecho |
| Salir banoV5 | Rostro claramente mas joven/suave al girar | Prioridad alta; salidaV6 previa tampoco aprobada |
| Cocina estatica | Cara adulta de madera cercana a master; luz fria | Conservar, revisar transiciones/observaciones |
| Preparacion mochila | Cinco clips restaurados ya staging/probados | Detalles menores sobre/toma documentados |

Canon dormitorio nuevo: assets/present-third-person/bedroom-adult-canonical-v2.png, imagegen exec82625b3a..., target bedroom-start-v1 +master. Revisado: adulto/veta/pose/casa oscura coherentes. No integrar poster aislado antes videos.
Prompts exactos en bedroom-adult-production.md. Nuevos jobs65frames: exit364572d6-4176-409b-939a-15210ad74144 y wake53de20d2-3dd9-4b24-b285-83c5af8c4bde. Revisar cuadros y comparacion FINAL REAL wake con inicio exit; si difiere, rebasar exit al final real, no unir con salto.

Bano: nuevos posters cerrados adultos V1/V2 candidatos, posible hilo/sombra bajo spout a verificar cerca. No repetir referencia con agua si intento cerrado fuga; generar desde cerrado original+master sin referencia con agua. No integrar antes gestos de derecha y espejo verificados. Entorno fuera de set sigue negro infinito.

Codificacion de scripts verificada con node UTF8: sin caracteresFFFD, bano con ene correcto en progreso/escena/CSS. Get-Content sin EncodingUTF8 produce sustituciones en salida de shell; NO repararlas como si archivo estuviese corrupto.
