/**
 * LO QUE QUEDÓ EN LA TIERRA
 * SubtitleManager — Subtítulos cinematográficos, cadencia de diálogos y monólogos
 */

export class SubtitleManager {
  constructor(containerElement, audioManager) {
    this.container = containerElement;
    this.audio = audioManager;
    this.timeoutId = null;
    this.isDisplaying = false;
  }

  show({ speaker = '', text = '', thought = false, duration = 4000, onComplete = null }) {
    this.clear();

    const block = document.createElement('div');
    block.className = 'subtitle-block';

    if (speaker) {
      const speakerEl = document.createElement('span');
      speakerEl.className = 'subtitle-speaker';
      speakerEl.textContent = speaker;
      block.appendChild(speakerEl);
    }

    const textEl = document.createElement('span');
    textEl.className = thought ? 'subtitle-text subtitle-thought' : 'subtitle-text';
    textEl.textContent = text;
    block.appendChild(textEl);

    this.container.appendChild(block);

    // Fade in
    requestAnimationFrame(() => {
      block.classList.add('visible');
    });

    this.isDisplaying = true;

    if (duration > 0) {
      this.timeoutId = setTimeout(() => {
        this.fadeOutBlock(block, onComplete);
      }, duration);
    }
  }

  fadeOutBlock(block, onComplete) {
    if (!block || !block.parentNode) return;
    block.classList.remove('visible');
    setTimeout(() => {
      if (block.parentNode) {
        block.parentNode.removeChild(block);
      }
      this.isDisplaying = false;
      if (onComplete) onComplete();
    }, 550);
  }

  clear() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.container.innerHTML = '';
    this.isDisplaying = false;
  }

  /**
   * Reproduce una secuencia cronometrada de diálogos
   * @param {Array<{speaker: string, text: string, thought?: boolean, delay?: number, duration?: number, voice?: 'father'|'announcer'|null}>} sequence 
   * @param {Function} onFinish 
   */
  async playSequence(sequence, onFinish = null) {
    for (const item of sequence) {
      if (item.delay) {
        await new Promise(r => setTimeout(r, item.delay));
      }

      if (item.voice === 'father' && this.audio) {
        this.audio.speakFatherVoice(item.text);
      } else if (item.voice === 'announcer' && this.audio) {
        this.audio.speakRadioFragment(item.text, 'announcer');
      }

      const duration = item.duration || Math.max(3000, item.text.length * 75);

      await new Promise(resolve => {
        this.show({
          speaker: item.speaker,
          text: item.text,
          thought: item.thought,
          duration: duration,
          onComplete: resolve
        });
      });

      // Pausa contemplativa entre líneas
      await new Promise(r => setTimeout(r, 600));
    }

    if (onFinish) onFinish();
  }
}
