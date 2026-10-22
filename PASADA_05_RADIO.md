# Radio — Quedate, que falta poco

Valentino vuelve a tener 11 años y su padre conserva el aspecto más joven del Mate. El autor aprobó el envejecimiento del padre en Taller; mantener esa diferencia temporal.

Plano integrado al atardecer, luz cálida y ventana azul. Una actuación completa muestra alcanzar la perilla, encender, soltar y volver a escuchar. La sintonización posterior es un control interactivo, no una segunda animación corporal. Cerca de 950 AM baja la estática y se habilita escuchar. Diálogo sobre los personajes; relator, interferencia y pensamiento del presente se identifican fuera del encuadre para no atribuirlos al padre o al niño.

El último fotograma se mantiene durante la conversación. La distorsión enfría suavemente el plano, sin aparición de una figura adulta provisoria. Las referencias a misión, 06:42 y sector sur siguen como fragmentos ambiguos del recuerdo; no hay imagen de un lanzamiento ni confirmación objetiva. El pensamiento final está identificado como «VALENTINO · AHORA». Se conservan RADIO_COMPLETED y LETTER_SEQUENCE_UNLOCKED, guardados sólo al terminar.

Recursos en `assets/radio-cinematic/`; prompts en `production.json` e `image-prompt.txt`. Plano creado con image_gen integrado, clip con Runway. Código en `RadioFilmScene.js`, pruebas en `qa/radio-check.html`. La versión anterior permanece en `RadioScene.js`.

Pendiente artístico: actuación de escucha durante los diálogos, voces definitivas y relato deportivo grabado. Esta pasada usa texto y estática procedural; no presenta el sintetizador de voz del navegador como voz final. Los diálogos siguen siendo provisorios. La prioridad es conectar el juego completo para el 26 de octubre.

Validado el 4/10: recorrido completo, sintonía incorrecta/correcta, bloqueo de clic repetido, páginas de diálogo, guardado y desbloqueo de carta sólo al terminar, salida durante actuación y reintento ante video fallido. Evidencia en `qa/radio/`. Build: 22 scripts y 36 recursos cinematográficos. Copia en H: verificada con el mismo validador y reproducción real de Radio desde puerto 3018. Se elevaron los diálogos para no cubrir el rostro del otro personaje.
