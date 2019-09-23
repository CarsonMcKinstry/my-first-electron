import { Canvas } from './../old/types';
import { createCanvas } from './utils';

export class Game {
  private _isRunning: boolean = false;
  private buffer: Canvas;
  private screen: Canvas;
  private deltaTime: number = 0;
  private lastTicks: number = 0;

  constructor(
    private root: HTMLElement,
    public readonly width: number,
    public readonly height: number,
    private readonly assetBase: string,
    private readonly frameRateTargetTime: number,
    private readonly onQuit: () => void
  ) {
    this.buffer = createCanvas(width, height);
    this.screen = createCanvas(width, height);

    root.appendChild(this.screen.canvas);
  }

  public get isRunning() {
    return this._isRunning;
  }

  public start() {
    this._isRunning = true;
    requestAnimationFrame(this.loop);
  }

  public initialize() {
    // this.createKeyboardListener();
    // this.loadLevel();
  }

  calculateDeltaTime(ticks: number) {
    const nextDeltaTime = (ticks - this.lastTicks) / 1000;

    this.deltaTime = nextDeltaTime > 0.05 ? 0.05 : nextDeltaTime;
  }

  private loop = (ticks: number) => {
    this.update();
    this.render();

    this.calculateDeltaTime(ticks);

    this.lastTicks = ticks;

    if (this.isRunning) {
      requestAnimationFrame(this.loop);
    }
  };

  private update() {
    setTimeout(() => {
      // this.entitmanager.update
      // this.handleCameraMovement
    }, this.frameRateTargetTime);
  }

  private render() {
    this.buffer.context.clearRect(0, 0, this.width, this.height);
    this.screen.context.clearRect(0, 0, this.width, this.height);

    // this.entityManager.render(this.bufferContext);

    this.screen.context.drawImage(this.buffer.canvas, 0, 0);
  }
}
