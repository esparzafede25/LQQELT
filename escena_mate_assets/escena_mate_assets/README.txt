ESCENA DEL MATE — ASSETS ORDENADOS
==================================

Esta carpeta reúne los diseños y fondos preparados para integrar la escena del mate en el juego.

ESTRUCTURA
----------
characters/valentino_11/
  - valentino11_idle.png
  - valentino11_cebando_mate.png
  - valentino11_entregando_mate.png
  - valentino11_esperando_recibiendo.png

characters/father/
  - father_idle.png
  - father_recibiendo_mate.png
  - father_tomando_mate.png
  - father_devolviendo_mate.png

backgrounds/
  - bg_angle_01_general.png
  - bg_angle_02_valentino_action.png
  - bg_angle_03_father_reaction.png
  - bg_angle_alt_close.png  (opcional)

references/
  - hojas de diseño y referencias visuales usadas para mantener continuidad.

USO SUGERIDO EN ANTIGRAVITY
---------------------------
Ángulo 1: plano general / inicio / conversación / idle.
Ángulo 2: acciones de Valentino (cebar, entregar mate).
Ángulo 3: acciones del padre (recibir, tomar, devolver mate).

FLUJO NARRATIVO RECOMENDADO
---------------------------
1. valentino11_idle sobre bg_angle_01_general
2. valentino11_cebando_mate sobre bg_angle_02_valentino_action
3. valentino11_entregando_mate sobre bg_angle_02_valentino_action
4. father_recibiendo_mate sobre bg_angle_03_father_reaction
5. father_tomando_mate sobre bg_angle_03_father_reaction
6. father_devolviendo_mate sobre bg_angle_03_father_reaction
7. valentino11_esperando_recibiendo sobre bg_angle_01_general

NOTAS
-----
- Los personajes están en PNG con canal alfa (transparencia).
- Los fondos no tienen personajes incrustados.
- Si querés, la próxima tanda puede ser el paquete equivalente de RADIO o TALLER/AUTO.
