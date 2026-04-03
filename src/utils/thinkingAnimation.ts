export interface ThinkingAnimationOptions {
  dotsElement: HTMLElement | null;
  timerElement: HTMLElement | null;
  tokensElement: HTMLElement | null;
  thinkingContainer: HTMLElement | null;
}

export class ThinkingAnimation {
  private seconds = 0;
  private tokenCount = 0;
  private dotCount = 0;
  private timerInterval?: ReturnType<typeof setInterval>;
  private dotsInterval?: ReturnType<typeof setInterval>;
  private tokensInterval?: ReturnType<typeof setInterval>;
  private escapeTimeout?: ReturnType<typeof setTimeout>;
  private isShowingMessage = false;

  constructor(private options: ThinkingAnimationOptions) {
    this.init();
  }

  private init() {
    this.startAnimation();
    this.setupKeyboardHandler();
  }

  private startAnimation() {
    this.cleanup();
    this.seconds = 0;
    this.tokenCount = 0;
    this.dotCount = 0;
    this.isShowingMessage = false;

    if (!this.options.thinkingContainer) return;

    this.options.thinkingContainer.innerHTML =
      'Thinking<span id="dots" style="display:inline-block;width:3ch;text-align:left">...</span> (<span id="timer">0</span>s · <span id="tokens">0</span> tokens · esc to interrupt)';

    const newDots = this.options.thinkingContainer.querySelector(
      "#dots",
    ) as HTMLElement;
    const newTimer = this.options.thinkingContainer.querySelector(
      "#timer",
    ) as HTMLElement;
    const newTokens = this.options.thinkingContainer.querySelector(
      "#tokens",
    ) as HTMLElement;

    this.timerInterval = setInterval(() => {
      this.seconds++;
      if (newTimer) newTimer.textContent = this.seconds.toString();
    }, 1000);

    this.dotsInterval = setInterval(() => {
      this.dotCount = (this.dotCount + 1) % 4;
      if (newDots) newDots.textContent = ".".repeat(this.dotCount || 1);
    }, 500);

    this.tokensInterval = setInterval(() => {
      const increment = Math.floor(Math.random() * 6) + 3;
      this.tokenCount += increment;
      if (newTokens) newTokens.textContent = this.tokenCount.toLocaleString();
    }, 50);
  }

  private setupKeyboardHandler() {
    document.addEventListener("keydown", this.handleKeydown);
  }

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.options.thinkingContainer) {
      if (this.isShowingMessage) {
        if (this.escapeTimeout) clearTimeout(this.escapeTimeout);
        this.startAnimation();
      } else {
        this.showInterruptMessage();
      }
    }
  };

  private showInterruptMessage() {
    this.isShowingMessage = true;
    this.cleanup();

    if (this.options.thinkingContainer) {
      this.options.thinkingContainer.textContent =
        "ERROR: Ray cant stop thinking, please try again later...";

      this.escapeTimeout = setTimeout(() => {
        this.startAnimation();
      }, 3000);
    }
  }

  private cleanup() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.dotsInterval) clearInterval(this.dotsInterval);
    if (this.tokensInterval) clearInterval(this.tokensInterval);
    if (this.escapeTimeout) clearTimeout(this.escapeTimeout);
  }

  destroy() {
    this.cleanup();
    document.removeEventListener("keydown", this.handleKeydown);
  }
}
