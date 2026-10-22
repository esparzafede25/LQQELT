# Lo que queda en la Tierra

## Copia de trabajo: recorrido de la escena del Mate

Abrir esta carpeta completa en Antigravity y leer `CONTINUAR_EN_ANTIGRAVITY.md`.

Ejecutar `npm run dev` y visitar `http://localhost:3017/?scene=MISSION_MATE` para probar directamente el recuerdo. El menú está en `http://localhost:3017/`. El puerto predeterminado de esta copia es 3017; las instrucciones antiguas de abajo se conservaron como referencia.

La nueva escena contiene siete acciones animadas: buscar mate, yerba y pava, preparar, cebar, pasar al padre (con sorbo) y recibir. Cada acción requiere un clic sobre el objeto. Ventana / Mesa / Mesada y las flechas desplazan la cámara. H muestra la interacción disponible; Tab y Enter también permiten activarla. El recorrido es guiado y conserva el cuadro final real de cada movimiento.

Los diálogos aparecen sobre quien habla. Esperan hasta que hagas clic en el texto o en el escenario; Espacio/Enter también permiten avanzar. Las acciones quedan bloqueadas mientras se lee. Las conversaciones pueden ampliarse con frases sucesivas sin cambiar la duración de los clips.

`npm run build` valida los scripts, imports y archivos del Mate. `qa/route-check.html` prueba el nuevo recorrido, guardado, salida durante una acción y recuperación de un video fallido. `assets/mate-route/production.json` conserva los prompts de producción. Los assets son locales y no necesitan conectarse a Runway para reproducirse. Leer `PASADA_03_RECORRIDO.md` para conocer alcance y limitaciones; `qa/results.json` corresponde a la versión anterior.

Taller también cuenta con una versión integrada: `http://localhost:3017/?scene=MISSION_CAR`. Elegir la llave de 10 en el banco, ajustar en el motor y cerrar el capó. Leer `PASADA_04_TALLER.md` para alcance y límites. Radio está en `http://localhost:3017/?scene=MISSION_RADIO`: encender, sintonizar cerca de 950 AM y escuchar; leer `PASADA_05_RADIO.md`. El presente mantiene su implementación anterior. Los diálogos y las actuaciones requieren revisión artística del autor.

**Experiencia narrativa interactiva.**  
*Precuela del cortometraje “Lo que queda en la Tierra”.*

---

### Descripción Breve

Experiencia *point-and-click* de estética stop motion centrada en Valentino y los recuerdos compartidos con su padre. Tres recuerdos —el mate, reparar un automóvil y escuchar un partido por radio— comienzan a construir la interpretación emocional que llevará a Valentino a emprender el viaje del cortometraje.

> **Nota:** Esta obra forma parte de un proyecto final de producción audiovisual y transmedia.

---

### Tecnologías Utilizadas

- **Frontend Core:** Vanilla HTML5, CSS3, JavaScript moderno (ES Modules).
- **Diseño Sonoro & Audio Foley:** Web Audio API (síntesis de audio procedural, ruido analógico, filtros heterodinos para sintonización de radio, sonidos de motor y ambiente).
- **Estética Visual:** Estilo cinematográfico *stop motion* con relación de aspecto 2.39:1 (widescreen letterbox), simulación de grano analógico y partículas de polvo en suspensión.
- **Persistencia:** `localStorage` para almacenamiento de hitos y progresos del relato.

---

### Instalación y Ejecución Local

No requiere instalación de librerías externas ni dependencias pesadas.

#### 1. Clonar el repositorio
```bash
git clone https://github.com/esparzafede25/LQQELT.git
cd LQQELT
```

#### 2. Ejecutar servidor de desarrollo local
Puedes utilizar Node.js con el servidor integrado:
```bash
npm run dev
# o directamente:
node server.js
```
También es posible utilizar cualquier servidor estático:
```bash
# Alternativa con Python:
python -m http.server 3000

# Alternativa con npx:
npx serve .
```

Abre en tu navegador:  
`http://localhost:3000/`

---

### Comando de Build

Para validar la integridad de los archivos estáticos:
```bash
npm run build
```

---

### Despliegue en Producción

El proyecto está optimizado con rutas relativas limpias para su despliegue inmediato en plataformas como **Vercel** o **GitHub Pages**.

