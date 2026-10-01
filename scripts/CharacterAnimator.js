/**
 * LO QUE QUEDÓ EN LA TIERRA
 * CharacterAnimator — Controlador de microanimaciones, cambios de pose y actuación teatral stop-motion
 * Inspiración: Puesta en escena teatral, expresividad corporal y peso artesanal de marionetas
 */

export class CharacterAnimator {
  /**
   * Aplica una pose o microanimación a un elemento de personaje.
   * @param {HTMLElement} element - Contenedor del personaje (.character-layer)
   * @param {string} poseClass - Clase CSS de la pose (ej: 'pose-reach-mate', 'pose-kid-listen')
   * @param {number} [duration=0] - Duración en ms antes de regresar al idle. Si es 0, la pose se mantiene.
   * @param {string} [returnPose='stop-motion-idle'] - Clase de pose a restaurar
   * @returns {Promise<void>}
   */
  static async playPose(element, poseClass, duration = 0, returnPose = 'stop-motion-idle') {
    if (!element) return;

    // Remover poses de acción previas sin quitar clases base
    const currentClasses = Array.from(element.classList);
    currentClasses.forEach(cls => {
      if (cls.startsWith('pose-')) {
        element.classList.remove(cls);
      }
    });

    // Agregar nueva pose
    element.classList.add(poseClass);

    if (duration > 0) {
      await new Promise(resolve => setTimeout(resolve, duration));
      if (element && element.classList.contains(poseClass)) {
        element.classList.remove(poseClass);
        if (returnPose && !element.classList.contains(returnPose)) {
          element.classList.add(returnPose);
        }
      }
    }
  }

  /**
   * Ejecuta una reacción física completa: anticipación, acción sostenida y vuelta a reposo.
   * @param {HTMLElement} element 
   * @param {string} actionPose 
   * @param {number} holdDuration 
   */
  static async performAction(element, actionPose, holdDuration = 1800) {
    if (!element) return;

    // Micro-anticipación (leve encogimiento previo al movimiento)
    element.classList.add('pose-anticipate');
    await new Promise(r => setTimeout(r, 120));
    element.classList.remove('pose-anticipate');

    // Acción principal
    await this.playPose(element, actionPose, holdDuration);
  }

  /**
   * Configura la orientación del personaje (mirar izquierda o derecha)
   * @param {HTMLElement} element 
   * @param {'left'|'right'} direction 
   */
  static setFacing(element, direction) {
    if (!element) return;
    if (direction === 'left') {
      element.classList.add('facing-left');
    } else {
      element.classList.remove('facing-left');
    }
  }
}
