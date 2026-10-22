# Corrección de publicación — 22/10/2026

Diagnóstico confirmado leyendo el árbol GitHub HEAD 6b5586f162b77b7cf8b95ad0eed75bad5578d000: su .gitignore excluye qa/**/*.mp4 y qa/**/*.png, sin medios de QA en el árbol remoto. OpeningScene y PresentWalkProgress todavía dependían de seis medios de qa/present. Esto deja sin despertar, dormitorio y pasillo a la copia publicada.

Copiados sin recodificar esos seis archivos a assets/present-home-v1; referencias activas corregidas. Originales intactos. validate ahora rechaza medios del recorrido fuera de assets. Pruebas opening-route, walk-progress, dream-audio y validate aprobadas. No se publicaron cambios remotos: subir la corrección desde Antigravity usando la copia principal de H.

Archivos a incluir: assets/present-home-v1/ completa; scenes/OpeningScene.js; scripts/PresentWalkProgress.js; scripts/validate.cjs. No es necesario subir todos los prototipos de QA. Identidad, duración, animación y sonido sin cambios.
