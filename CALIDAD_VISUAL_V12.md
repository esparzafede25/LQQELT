# Mejora visual — versión 12

Entrega del 22 de octubre de 2026. La versión revisada está guardada en `H:\TP FINAL I.C\Lo que queda en la Tierra -  JUEGO`.

[Jugar](http://localhost:3019/juego.html) · [Portada](http://localhost:3019/)

Se revisaron las 31 animaciones activas: 13 recibieron restauración moderada de detalle con RealESRGAN x4plus local, 11 recuerdos en HD se conservaron y 7 acciones problemáticas se reconstruyeron. Todas tienen 1080 líneas. Dos planos del pasillo conservan su proporción original en 1872 × 1080; los demás están en 1920 × 1080.

El guardado del mate ahora muestra el alcance de la mano, el agarre y el depósito antes de retirar los dedos. La llave, el mapa y el sobre mantienen su tamaño mediante composición rígida sobre el actor animado. Valentino toma la mochila con cabeza, cuello y cuerpo animados juntos. Las imágenes de espera se extrajeron de los propios clips para mantener la continuidad.

La entrada al auto utiliza un corte al interior: Valentino se acomoda y apoya las manos en el volante. Se conservaron el suspiro y el alejamiento real del vehículo, con la ruta vacía al final. La grabación original del motor conserva exactamente su contenido; los contactos de objetos y puerta se sincronizaron con los nuevos movimientos.

La casa mantiene su luz fría y oscura, el baño sigue rodeado de negro y la introducción conserva solamente música y textos. Los diálogos aprobados permanecen iguales.

Se comprobó la introducción completa hasta el dormitorio, el recorrido por la casa y el baño, el regreso al pasillo, la silla, el disparador del recuerdo del mate, las cinco acciones de la mochila y el final. Recargar después de guardar la llave recuperó correctamente los dos objetos guardados. La validación y las seis pruebas funcionales pasaron; todos los videos se decodificaron completos. Los 31 archivos de H coinciden con la versión revisada.

Para publicar esta versión, usar Antigravity desde la carpeta principal de H. Incluir las nuevas carpetas `assets/departure-motion-v12` y `assets/departure-car-v12`, los videos modificados del presente y los cuatro archivos JavaScript actualizados. Los recursos usados por el juego están en `assets`; las pruebas y los respaldos permanecen en el workspace.

Las referencias nuevas se editaron con la herramienta integrada imagegen, usando la cocina y el diseño adulto como referencias. El prompt de trabajo conserva cámara, encuadre, luz fría y objetos; mantiene la identidad de madera tallada y la anatomía conectada. Para el mate se separaron dos gestos: llevarlo sujeto hasta la boca de la mochila y luego depositarlo y retirar la mano. Para el auto se pidió acomodarse en el asiento desde una cámara interior fija. Los prompts completos y workflows están guardados en `qa/present/deformation-v11` del workspace.

Los respaldos, hashes y comprobaciones están registrados en `h-quality-v12-result.json`, `active-v12-checks.json`, `main-v12-checks.json` y `gameplay-v12.json` de esa carpeta. El seguimiento automático de esta pasada quedó desactivado después de la entrega. La publicación en GitHub queda a cargo del usuario mediante Antigravity.
