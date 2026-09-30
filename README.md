# Lo que quedó en la Tierra

**Experiencia narrativa interactiva.**  
*Precuela del cortometraje “Lo que quedó en la Tierra”.*

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
