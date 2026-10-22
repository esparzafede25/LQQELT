# Portada para presentar juego y cortometraje

Abrir http://localhost:3019/ con el servidor de la carpeta principal en funcionamiento. Es una web local preparada para publicar junto con el proyecto; esta pasada no publica ni cambia GitHub.

- `index.html`: portada con imagen principal, dos afiches y enlaces a las experiencias.
- `juego.html`: juego existente, con acceso Inicio para volver a la portada. Usa el mismo guardado del navegador, volumen y archivos; no se cambió la lógica del juego.
- `cortometraje.html`: espacio del corto con aviso Próximamente. No muestra un reproductor vacío ni reproduce una película de prueba.
- Los enlaces anteriores `index.html?scene=...` se conservan: redirigen a `juego.html` con la misma consulta y fragmento.
- La portada y el corto no inician música ni cargan animaciones del juego.

## Cuando esté terminado el cortometraje

Se puede entregar el MP4 o un enlace de reproducción. Sólo hay que completar `scripts/portal-config.js`; la portada cambia de Próximamente a Disponible para ver automáticamente.

Para un MP4 dentro de esta misma carpeta:

```js
export const CORTOMETRAJE = {
  url: 'assets/cortometraje/final.mp4',
  formato: 'video'
};
```

Copiar el archivo a esa ruta. Se mostrará en la página del corto con controles, sin reproducir automáticamente. El video debe ser apto para navegador (MP4 H.264/AAC).

Para una página de YouTube, Vimeo u otro alojamiento, poner su URL completa y `formato: 'enlace'`. El botón abrirá esa página. No pegar código de iframe. Dejar `url: ''` conserva el estado Próximamente.

## Presentación y publicación

La portada funciona en servidor estático con las rutas relativas actuales y la configuración Vercel existente. Publicar el proyecto completo con `index.html`, `juego.html`, `cortometraje.html`, `assets`, `scripts` y `styles`; las películas del juego también son necesarias. Hasta publicar, localhost sólo se abre en esta computadora. Una publicación en otro dominio tiene su propio guardado de navegador.

No reejecutar integradores anteriores. Manifiesto de esta pasada: `qa/present/h-portal-v1-result.json`, respaldo de lo reemplazado en `qa/present/portal-v1/backup-main`. Original del index del juego preservado en `qa/present/portal-v1/index-game-before.html`.

## Comprobación de esta entrega — 21 de octubre

Integrada en H con respaldo/SHA256. Stage/H:39scripts,49medios y20walk validados. Navegador: cuatro imágenes cargadas, tarjetas del juego/corto operativas, página Próximamente sin reproductor roto, enlace Inicio dentro del juego, enlace viejo index.html?scene=CAR_DEPARTURE redirigido conservando parámetros. En origen de prueba se volvió a portada y luego Continuar recuperó la partida del auto. Consola limpia. Vista móvil375px sin desbordamiento horizontal; control temporal de tamaño restaurado. Evidencia portal-H-proof.png y browser-H.json en qa/present/portal-v1. Cortometraje real aún no entregado: configuración vacía preservada. No publicación ni subida GitHub en esta pasada.
