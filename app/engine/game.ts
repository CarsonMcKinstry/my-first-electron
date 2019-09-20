import { AssetManager } from "./../app/AssetManager";
import { fromEvent, merge, Subscription, Observable } from "rxjs";
import { filter, tap } from "rxjs/operators";
import { Canvas } from "./types";
import { EntityManager } from "./managers/EntityManager";
// import { ipcRenderer } from "electron";

export class Game {
  private _isRunning: boolean = false;
  private deltaTime: number = 0;
  private lastTicks: number = 0;
  private gameBoard: HTMLCanvasElement;
  private gameBoardContext: CanvasRenderingContext2D;
  private buffer: HTMLCanvasElement;
  private bufferContext: CanvasRenderingContext2D;

  private keyboardListener?: Subscription;

  private entityManager: EntityManager = new EntityManager();
  private assetManager: AssetManager = new AssetManager();

  constructor(
    private root: HTMLElement,
    public readonly width: number,
    public readonly height: number,
    private readonly frameTargetTime: number,
    private readonly onQuit: () => void
  ) {
    const buffer = this.createCanvas(width, height);
    this.bufferContext = buffer.context;
    this.buffer = buffer.canvas;

    const gameBoard = this.createCanvas(width, height);

    this.gameBoard = gameBoard.canvas;
    this.gameBoardContext = gameBoard.context;
  }

  private createCanvas(width: number, height: number): Canvas {
    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    return {
      canvas,
      context
    } as Canvas;
  }

  public get isRunning() {
    return this._isRunning;
  }

  public start() {
    this.root.appendChild(this.gameBoard);
    this.createKeyboardListener();

    this._isRunning = true;
    requestAnimationFrame(this.gameLoop);
  }

  private calculateDeltaTime(ticks: number) {
    const nextDeltaTime = (ticks - this.lastTicks) / 1000;

    this.deltaTime = nextDeltaTime > 0.05 ? 0.05 : nextDeltaTime;
  }

  private gameLoop = (ticks: number) => {
    this.update();
    this.render();

    this.calculateDeltaTime(ticks);

    this.lastTicks = ticks;

    if (this.isRunning) {
      requestAnimationFrame(this.gameLoop);
    }
  };

  private update() {
    setTimeout(() => {
      this.entityManager.update(this.deltaTime, this.lastTicks);
    }, this.frameTargetTime);
  }

  private createKeyboardListener() {
    if (this.keyboardListener) {
      this.keyboardListener.unsubscribe();
    }

    const keydowns = fromEvent<KeyboardEvent>(document, "keydown");

    const quit = keydowns.pipe(
      filter(e => e.keyCode === 27),
      tap(() => {
        this._isRunning = false;
      }),
      tap(() => {
        this.onQuit();
      }),
      tap(() => {
        if (this.keyboardListener) {
          this.keyboardListener.unsubscribe();
        }
      })
    );

    this.keyboardListener = merge(quit).subscribe();
  }

  private render() {
    this.bufferContext.clearRect(0, 0, this.width, this.height);
    this.gameBoardContext.clearRect(0, 0, this.width, this.height);

    if (this.entityManager.hasNoEntities) {
      return;
    } else {
      this.entityManager.render(this.bufferContext);
    }

    this.gameBoardContext.drawImage(this.buffer, 0, 0);
  }
}
