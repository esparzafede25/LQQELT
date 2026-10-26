# Amanecer y edición para celular

Entregado el 25 de octubre de 2026 en la carpeta principal de H.

## Final del auto

La salida empieza grisácea y azulada. La luz se vuelve cálida y el sol emerge por el horizonte mientras el auto se aleja. La transición sigue el tiempo real del video; no avanza durante una pausa. La ruta vacía del epílogo conserva el sol y la luz final. No se deformó ni regeneró el auto: se conserva la animación revisada.

## Celular

La portada tiene una tarjeta adicional, «La historia, en tus manos», con acceso «Jugar en celular». La entrada es juego-movil.html; la versión de computadora sigue en juego.html.

La edición móvil comparte historia, diálogos, música y guardado con el juego del mismo navegador. Incluye botones táctiles para los objetos, diálogos legibles, navegación siempre accesible y distribución vertical u horizontal. Las imágenes no se recortan para rellenar una pantalla vertical. Se desactivan polvo y movimiento de fondo innecesarios.

31 videos adaptados a 1280 píxeles de ancho, conservando proporción y número de cuadros; 57 imágenes WebP. Videos: aproximadamente 221 MB a 25,3 MB. Imágenes: 129 MB a 6,7 MB. El conjunto de estos medios pasa de 350 MB a 32,1 MB. La música y los audios independientes se conservan, por lo que estos números no describen el tamaño de todo el proyecto.

Los originales de computadora y sus videos de 1080 se conservan. Las copias livianas están en assets/mobile-v1 y el mapa de archivos en scripts/MobileAssets.js.

## Verificación y alcance

26 pruebas funcionales y validador aprobados en preparación; validador de H aprobado. Los 31 videos móviles se decodificaron completos, con encuadre y cantidad de cuadros comprobados. Audio del auto presente en las copias móviles.

Pruebas del juego real en pantallas de 390×844, 844×390 y 360×640: controles táctiles, diálogo del mate, giro de pantalla, recuperación de objetos guardados, mochila, entrada al auto, motor, alejamiento, amanecer y ruta vacía. Introducción observada hasta los ocho planos; ruta «Omitir introducción» al dormitorio jugable y recuperación desde Continuar comprobadas. No se afirma una nueva prueba completa de la introducción sin omitir ni una prueba en un teléfono físico. La lógica y los medios del despertar también tienen comprobaciones automáticas.

H: tarjeta de celular, menú móvil, entrada al auto, motor, salida y ruta vacía comprobados, sin errores de consola. Integración de 114 archivos con comprobación previa de todos los destinos, respaldos y SHA después de cada copia. Los medios originales coinciden con los usados para preparar la edición móvil.

## Abrir y publicar

- Portada local: http://localhost:3019/index.html
- Juego de computadora: http://localhost:3019/juego.html
- Juego para celular: http://localhost:3019/juego-movil.html

Para llevarlo a GitHub, publicar desde Antigravity la carpeta principal de H, incluyendo juego-movil.html, los módulos y estilos actualizados y toda la carpeta assets/mobile-v1. No excluir MobileAssets.js ni los medios móviles. No es necesario publicar qa ni los respaldos. Desde un celular se usará la web publicada y su tarjeta «Jugar en celular»; localhost corresponde a esta computadora.

No se publicó GitHub ni se modificó sources. No se usó Runway, no se descargaron modelos y no se interrumpieron trabajos de Comfy.
