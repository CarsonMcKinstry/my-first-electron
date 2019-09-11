import { TransformComponent } from "./Components/TransformComponent";
import { buildGrid } from "./canvas";
import { ipcRenderer } from "electron";
import { FRAME_TARGET_TIME } from "../constants.js";
import { EntityManager } from "./EntityManager";
import { AssetManager } from "./AssetManager";
import { SpriteComponent } from "./Components/SpriteComponent";

interface CoordinatePair {
  x: number;
  y: number;
}

export class Game {
  private _isRunning: boolean = false;
  private deltaTime: number = 0;
  private bufferCanvas: HTMLCanvasElement;
  private buffer: CanvasRenderingContext2D;

  private entityManager: EntityManager = new EntityManager();
  private assetManager: AssetManager;

  constructor(
    private context: CanvasRenderingContext2D,
    public readonly width: number,
    public readonly height: number
  ) {
    this.bufferCanvas = document.createElement("canvas");

    this.bufferCanvas.width = width;
    this.bufferCanvas.height = height;

    this.buffer = this.bufferCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    this.assetManager = new AssetManager(this.entityManager);
  }

  public get isRunning() {
    return this._isRunning;
  }

  public async loadLevel(levelNumber: number): Promise<void> {
    await this.assetManager.addTexture("tank-image", "tank-big-right.png");

    await this.assetManager.addTexture(
      "chopper-image",
      "chopper-spritesheet.png"
    );

    const tankEntity = this.entityManager.addEntity("tank");
    const chopperEntity = this.entityManager.addEntity("chopper");

    tankEntity.addComponent(
      "transform",
      new TransformComponent(0, 0, 20, 20, 32, 32, 1)
    );
    tankEntity.addComponent(
      "sprite",
      new SpriteComponent(
        "tank-image",
        this.assetManager,
        tankEntity,
        this.buffer
      )
    );

    chopperEntity.addComponent(
      "transform",
      new TransformComponent(240, 106, 0, 0, 32, 32, 1)
    );
    chopperEntity.addComponent(
      "sprite",
      new SpriteComponent(
        "chopper-image",
        this.assetManager,
        chopperEntity,
        this.buffer,
        {
          id: "chopper-image",
          numFrames: 2,
          animationSpeed: 90,
          isFixed: false,
          hasDirections: true
        }
      )
    );
  }

  public initialize() {
    this.loadLevel(1);

    this._isRunning = true;
    requestAnimationFrame(this.loop);
  }

  private loop = (currentTime: number) => {
    this.processInput();
    this.update(currentTime);
    this.render();

    if (this.isRunning) {
      requestAnimationFrame(this.loop);
    }
  };

  protected handleInput = (e: KeyboardEvent) => {
    switch (e.keyCode) {
      case 27:
        this._isRunning = false;
        ipcRenderer.send("quit");
        break;
      case 76:
        for (const [_, entity] of this.entityManager.entities) {
          console.log(entity.name);
        }
        break;
      default:
        break;
    }
  };

  private processInput() {
    document.removeEventListener("keydown", this.handleInput);

    document.addEventListener("keydown", this.handleInput);
  }

  private update(currentTime: number) {
    this.deltaTime = (currentTime - this.deltaTime) / 1000;

    this.deltaTime = this.deltaTime > 0.05 ? 0.05 : this.deltaTime;

    setTimeout(() => {
      this.entityManager.update(this.deltaTime);
    }, FRAME_TARGET_TIME);
  }

  private render() {
    this.buffer.clearRect(0, 0, this.width, this.height);
    this.context.clearRect(0, 0, this.width, this.height);

    if (this.entityManager.hasNoEntities) {
      return;
    } else {
      this.entityManager.render(this.buffer);
    }

    this.context.drawImage(this.bufferCanvas, 0, 0);
  }
}
