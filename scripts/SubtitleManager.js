/**
 * LO QUE QUEDÓ EN LA TIERRA
 * SubtitleManager — Subtítulos cinematográficos, cadencia de diálogos y opciones interactivas
 * Inspiración: Elegancia visual de aventura gráfica autoral (estilo cinematográfico sobrio)
 */

export class SubtitleManager {
  constructor(containerElement, audioManager) {
    this.container = containerElement;
    this.audio = audioManager;
    this.timeoutId = null;
    this.isDisplaying = false;
    this.sequenceVersion = 0;
    this.sequenceCancel = null;
  }

  show({ speaker = '', text = '', thought = false, duration = 4000, onComplete = null }) {
    this.clear();

    const block = document.createElement('div');
    block.className = thought ? 'subtitle-block subtitle-block-thought' : 'subtitle-block';

    if (speaker) {
      const speakerEl = document.createElement('div');
      speakerEl.className = 'subtitle-speaker-badge';
      speakerEl.innerHTML = `<span class="speaker-deco">◆</span><span class="speaker-name">${speaker}</span><span class="speaker-deco">◆</span>`;
      block.appendChild(speakerEl);
    }

    const textEl = document.createElement('div');
    textEl.className = thought ? 'subtitle-text subtitle-thought' : 'subtitle-text';
    textEl.textContent = text;
    block.appendChild(textEl);

    this.container.appendChild(block);

    // Fade in suave y cinematográfico
    requestAnimationFrame(() => {
      block.classList.add('visible');
    });

    this.isDisplaying = true;
    this.audio?.setStoryDialogue?.(true);

    if (duration > 0) {
      this.timeoutId = setTimeout(() => {
        this.fadeOutBlock(block, onComplete);
      }, duration);
    }
  }

  /**
   * Muestra un diálogo con opciones interactivas integradas a la atmósfera
   * @param {Object} config
   * @param {string} [config.speaker]
   * @param {string} config.text
   * @param {Array<{label: string, value: any}>} config.choices
   * @param {Function} config.onSelect
   */
  showChoices({ speaker = '', text = '', choices = [], onSelect = null }) {
    this.clear();

    const block = document.createElement('div');
    block.className = 'subtitle-block subtitle-block-choices';

    if (speaker) {
      const speakerEl = document.createElement('div');
      speakerEl.className = 'subtitle-speaker-badge';
      speakerEl.innerHTML = `<span class="speaker-deco">◆</span><span class="speaker-name">${speaker}</span><span class="speaker-deco">◆</span>`;
      block.appendChild(speakerEl);
    }

    if (text) {
      const textEl = document.createElement('div');
      textEl.className = 'subtitle-text';
      textEl.textContent = text;
      block.appendChild(textEl);
    }

    // Columna de opciones interactivas
    const choicesList = document.createElement('div');
    choicesList.className = 'cinematic-choices-list';

    choices.forEach((choice, index) => {
      const btn = document.createElement('button');
      btn.className = 'cinematic-choice-item';
      btn.innerHTML = `<span class="choice-marker">${index + 1}.</span> <span class="choice-label">${choice.label}</span>`;
      
      btn.addEventListener('click', () => {
        if (this.audio) this.audio.playToolClink();
        this.fadeOutBlock(block, () => {
          if (onSelect) onSelect(choice.value, choice);
        });
      });

      choicesList.appendChild(btn);
    });

    block.appendChild(choicesList);
    this.container.appendChild(block);

    requestAnimationFrame(() => {
      block.classList.add('visible');
    });

    this.isDisplaying = true;
    this.audio?.setStoryDialogue?.(true);
  }

  fadeOutBlock(block, onComplete) {
    if (!block || !block.parentNode) return;
    block.classList.remove('visible');
    setTimeout(() => {
      if (block.parentNode !== this.container) return;
      if (block.parentNode) {
        block.parentNode.removeChild(block);
      }
      this.isDisplaying = false;
      this.audio?.setStoryDialogue?.(false);
      if (onComplete) onComplete();
    }, 450);
  }

  clear() {
    if (!this.sequenceShowing) {
      this.sequenceVersion++;
      this.sequenceCancel?.();
      this.sequenceCancel = null;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.container.innerHTML = '';
    this.isDisplaying = false;
    this.audio?.setStoryDialogue?.(false);
  }

  /**
   * Reproduce una secuencia cronometrada de diálogos
   * @param {Array<{speaker: string, text: string, thought?: boolean, delay?: number, duration?: number, voice?: 'father'|'announcer'|null}>} sequence 
   * @param {Function} onFinish 
   */
  async playSequence(sequence, onFinish = null) {
    this.clear();
    const version = this.sequenceVersion;
    for (const item of sequence) {
      if (item.delay) await new Promise(resolve => setTimeout(resolve, item.delay));
      if (this.sequenceVersion !== version) return false;
      if (item.voice === 'father' && this.audio) this.audio.speakFatherVoice(item.text);
      else if (item.voice === 'announcer' && this.audio) this.audio.speakRadioFragment(item.text, 'announcer');
      const ok = await new Promise(resolve => {
        this.sequenceCancel = () => resolve(false);
        this.sequenceShowing = true;
        try {
          this.show({speaker:item.speaker,text:item.text,thought:item.thought,
            duration:item.duration || Math.max(3000,item.text.length * 75),
            onComplete:() => resolve(true)});
        } finally { this.sequenceShowing = false; }
      });
      if (!ok || this.sequenceVersion !== version) return false;
      this.sequenceCancel = null;
      await new Promise(resolve => setTimeout(resolve,600));
      if (this.sequenceVersion !== version) return false;
    }
    if (onFinish) onFinish();
    return true;
  }
}
