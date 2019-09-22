// import { KeyboardControl } from './../Components/KeyboardControlComponent';
import { TransformComponent } from "./Components/TransformComponent";
import { KeyboardControl } from "./Components/KeyboardControlComponent";
import { SpriteComponent } from "./Components/SpriteComponent";
import { AssetManager } from "./managers/AssetManager";
import { fromEvent, merge, Subscription, Observable } from "rxjs";
import { filter, tap } from "rxjs/operators";
import { Canvas } from "./types";
import { EntityManager } from "./managers/EntityManager";
import { Vector } from "./primitives/Vector";

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
  private assetManager: AssetManager;

  constructor(
    // private root: HTMLElement,
    public readonly width: number,
    public readonly height: number,
    private readonly assetBase: string,
    private readonly frameTargetTime: number,
    private readonly onQuit: () => void
  ) {
    this.assetManager = new AssetManager(assetBase);
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

  public async loadLevel(level: number) {
    await this.assetManager.addTexture(
      "chopper-image",
      "chopper-spritesheet.png"
    );
    const chopperEntity = this.entityManager.addEntity("chopper");

    chopperEntity.addComponent(
      new TransformComponent(new Vector(240, 106), new Vector(0, 0), 32, 32, 1)
    );
    chopperEntity.addComponent(
      new SpriteComponent(
        chopperEntity,
        "chopper-image",
        this.assetManager,
        this.bufferContext,
        {
          id: "chopper-image",
          numFrames: 2,
          animationSpeed: 90,
          isFixed: false,
          hasDirections: true,
          animationNames: ["DOWN", "RIGHT", "LEFT", "UP"]
        }
      )
    );
    chopperEntity.addComponent(
      new KeyboardControl("UP", "DOWN", "LEFT", "RIGHT", chopperEntity)
    );
  }

  public get isRunning() {
    return this._isRunning;
  }

  public initialize(root: HTMLElement) {
    root.appendChild(this.gameBoard);
    this.createKeyboardListener();
    this.loadLevel(1);

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
      this.entityManager.update(
        this.deltaTime,
        this.lastTicks,
        this.width,
        this.height
      );
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
