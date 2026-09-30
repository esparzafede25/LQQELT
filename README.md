# LO QUE QUEDÓ EN LA TIERRA — EXPERIENCIA NARRATIVA INTERACTIVA

> **Pieza transmedia complementaria y precuela emocional del cortometraje homónimo.**
> Construida en Vanilla HTML5, CSS3 y JavaScript modular, con estética cinematográfica stop-motion de madera tallada.

---

## 1. Conexión Narrativa con el Cortometraje

En la película, **Valentino** emprende un viaje en automóvil para presenciar aparentemente la partida de su padre en una misión tripulada hacia Marte. Sin embargo, ese viaje es una **metáfora del duelo**: Valentino no logra aceptar la muerte de su padre y su mente transforma la pérdida irreparable en una *"despedida todavía pendiente"* (*"Mi padre se está yendo y todavía puedo llegar a verlo partir"*).

Al final del cortometraje se revela que la supuesta carta del padre que Valentino viene leyendo está **vacía**.

> **REGLA FUNDAMENTAL DE ESTA PRECUELA:**  
> **El juego NUNCA revela que la carta está vacía.** Ese giro pertenece exclusivamente al desenlace del film. El juego construye la arquitectura emocional del autoengaño de Valentino a través de recuerdos cotidianos reales.

---

## 2. Progresión Obligatoria de Capítulos

El orden de las misiones responde estrictamente a la evolución psicológica del duelo:

1. **INTRODUCCIÓN (El Taller):** Valentino en el taller/garage recientemente vaciado. Sensación de ausencia, silencio y polvo en el contraluz.
2. **MISIÓN 1 — EL MATE (`Una mañana cualquiera` — Función: PRESENCIA):**  
   Recuerdo íntimo y doméstico. Valentino ceba mate con su padre en una mañana soleada.  
   *Conexión con el corto:* Explica el origen del mate de madera del que Valentino bebe a solas durante la madrugada en la película.
3. **MISIÓN 2 — EL AUTO (`Pasame la diez` — Función: HERENCIA):**  
   Recuerdo en el garage arreglando el motor del sedán clásico. El padre le enseña a escuchar el motor antes de meter mano y a ajustar la abrazadera con la llave 10mm.  
   *Conexión con el corto:* Valentino sabe cómo reparar el automóvil en la banquina cuando la aguja de temperatura sube.
4. **MISIÓN 3 — LA RADIO (`Quedate, que falta poco` — Función: DISTORSIÓN):**  
   Escuchando un partido de fútbol un domingo por la tarde. Lentamente, interferencias ambiguas de radio entran en el dial (*"...los cuatro seleccionados...", "...06:42...", "...el lanzamiento está previsto..."*). Las palabras del relator (*"se va solo..."*, *"todavía puede verlo"*) se mezclan en la mente de Valentino.
5. **SECUENCIA FINAL — EL SOBRE + EL MAPA (Función: NEGACIÓN):**  
   Valentino abre el cajón de su padre. Encuentra el mapa de la Patagonia con la cruz en el árbol del km 142 (donde su padre estuvo a los 23 años) y el sobre con la inscripción "Valentino". Al abrirlo, se enfoca su rostro y resuena la voz del padre en off (*"Valentino... 17 de octubre... 06:42"*). Valentino concluye: *"Papá se está yendo. Todavía llego a despedirme"*.
6. **FINAL — EL VIAJE (Función: BÚSQUEDA DE DESPEDIDA):**  
   Valentino prepara la mochila guardando el mate, la llave 10mm, el mapa y el sobre. **El sobre asoma visiblemente de la mochila**, conectando con el insert de la Escena 4 del cortometraje en el asiento del acompañante. Valentino arranca el auto y parte por la ruta patagónica al atardecer rumbo a la partida.

---

## 3. Estructura del Proyecto

```
/
├── index.html                           # Estructura principal, canvas y capas de cine
├── README.md                            # Documentación integral
├── assets/
│   ├── backgrounds/                     # Fondos de alta definición generados y canon
│   │   ├── title_menu_bg.jpg            # Menú principal
│   │   ├── workshop_present.jpg         # Taller en el presente (ausencia)
│   │   ├── memory_mate.jpg              # Recuerdo 1 (Cocina y mate)
│   │   ├── memory_car.jpg               # Recuerdo 2 (Garaje y motor)
│   │   ├── memory_radio.jpg             # Recuerdo 3 (Radio analógica)
│   │   ├── sequence_envelope_map.jpg    # Cajón con mapa y sobre
│   │   ├── departure_backpack_seat.jpg  # Inserto de la mochila en el asiento
│   │   └── departure_highway_sunset.jpg # Auto alejándose en la ruta al atardecer
│   ├── characters/
│   │   ├── valentino/                   # Referencias visuales de Valentino
│   │   │   ├── valentino_front.jpg
│   │   │   ├── valentino_profile.jpg
│   │   │   ├── valentino_back.jpg
│   │   │   └── valentino_placeholder.svg
│   │   └── father/                      # Referencias visuales del Padre
│   │       ├── father_front.jpg
│   │       └── father_placeholder.svg
│   ├── props/                           # Objetos interactivos e ilustraciones SVG
│   │   ├── mate_placeholder.svg
│   │   ├── wrench_placeholder.svg
│   │   ├── radio_placeholder.svg
│   │   ├── map_placeholder.svg
│   │   ├── envelope_placeholder.svg
│   │   └── backpack_placeholder.svg
│   ├── references/                      # Láminas originales del proyecto
│   │   └── concept_madera_tallada.jpg   # Lámina "03 • Madera Tallada"
│   └── ui/                              # Grano stop-motion y cursores
│       ├── cursor_ring.svg
│       └── stopmotion_grain.svg
├── scenes/                              # Módulos de escenas independientes
│   ├── SceneManager.js                  # Máquina de estados y cortinas
│   ├── MenuScene.js                     # Menú principal
│   ├── IntroScene.js                    # Taller del presente
│   ├── MateScene.js                     # Misión 1 (Mate)
│   ├── CarScene.js                      # Misión 2 (Auto)
│   ├── RadioScene.js                    # Misión 3 (Radio)
│   ├── EnvelopeScene.js                 # Secuencia 4 (Sobre + Mapa)
│   ├── DepartureScene.js                # Preparación y partida
│   ├── EpilogueScene.js                 # Plano final y títulos
│   ├── ArchiveScene.js                  # Museo virtual y making of
│   └── CreditsScene.js                  # Créditos cinematográficos
├── scripts/
│   ├── app.js                           # Punto de entrada, parallax, polvo, cursor
│   ├── AudioManager.js                  # Síntesis Web Audio API (motor, foley, estática)
│   ├── StorageManager.js                # Persistencia en localStorage
│   └── SubtitleManager.js               # Subtitulado cinematográfico
└── styles/
    ├── main.css                         # Variables, layout widescreen, cursor
    ├── cinematic.css                    # Bandas 2.39:1, grano de film, viñeta
    ├── scenes.css                       # Hotspots, dial de radio, caja de herramientas
    └── archive.css                      # Estilos del museo virtual
```

---

## 4. Guía de Sustitución de Assets

Todos los elementos gráficos y sonoros están **completamente desacoplados de la lógica del juego**.

Para reemplazar cualquier fondo, imagen de personaje u objeto por una nueva versión externa de producción:
1. Copia tu archivo en la carpeta correspondiente dentro de `/assets/`.
2. Mantén el nombre del archivo (por ejemplo, `assets/backgrounds/memory_mate.jpg` o `assets/characters/valentino/valentino_front.jpg`).
3. El juego actualizará automáticamente la visual sin necesidad de tocar una sola línea de código JavaScript.

---

## 5. Ejecución Local y Publicación

### Probar Localmente
Al estar construido íntegramente con estándares web nativos (ES Modules), requiere un servidor HTTP local para servir los módulos:

```bash
# Opción 1: Con Node.js (npx)
npx serve .

# Opción 2: Con Python
python -m http.server 8000
```
Luego abre tu navegador en `http://localhost:8000` (o el puerto indicado).

### Publicación en Vercel o GitHub Pages
- **GitHub Pages:** Sube el repositorio a GitHub y activa GitHub Pages desde la rama `main` en `/root`. El proyecto funcionará de inmediato gracias al uso estricto de rutas relativas.
- **Vercel:** Conecta el repositorio en el panel de Vercel y despliega como proyecto estático sin comandos de build.
