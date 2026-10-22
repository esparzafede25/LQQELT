# Corrección visual rígida V4
Herramientas: Comfy Desktop local (WAN2.2 para cuerpo de nueva levantada, SAM3 para separar partes), Canvas para composición de sprites rígidos, ffmpeg para codificar; imágenes de limpieza mediante image_gen integrado. Sin Runway ni compras.
Los objetos y cabezas usan RGB original y movimientos rígidos; jamás se deforma su geometría. Ropa/cuerpo mantienen actuación de fuente separada. Fondo de casa/carrecería/puerta fijos. Esto reduce deformaciones sin prometer que cada gesto corporal de fuente sea perfecto.
Mochila: cinco películas nuevas y finales reales. Carta debajo del mapa. Originales conservados en departure-restored-v2.
Auto: puerta abierta fija unida al auto, actor entra detrás de su marco; corte al interior sobre el gesto de entrar. Suspiro: torso sube/baja3px, cabeza rígida inclina1.4grados; manos fijas al volante. Auto en ruta: sprite rígido con escala uniforme. Originales conservados en departure-car-v1.
Pruebas: qa/present/rigid-v4-metrics.json, rigid-final-continuity-v4.json y suite14archivos. Revisión visual de intermedios antes de seleccionar; flujo de juego debe constar en PASADA_07_RIGIDEZ.md.
Prompts y referencias de imágenes: qa/present/rigid-final-image-prompts-v4.json. Imagen madre de suspiro/car final conservada de originales; no identidad generada nueva.


Selección final de entrada:21cuadros de gesto real (levanta pierna, se inclina y entra), corte al interior. La cola original con mano flotante fue descartada; no se presenta como sentada completa en plano abierto. Cabeza anclada al collar con transformación rígida uniforme, sin borrar rectángulos de hombros.

