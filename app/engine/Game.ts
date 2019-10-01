import { KeyboardControl } from './components/KeyboardControlComponen';
import { EntityManager, AssetManager } from './managers';
import { Canvas, LayerType } from './_types';
import { createCanvas, createVector } from './utils';
import { GameMap } from './Map';
import { Entity } from './Entity';
import { SpriteComponent, TransformComponent } from './components';

export class Game {
  private _isRunning: boolean = false;
  private buffer: Canvas;
  private screen: Canvas;
  private deltaTime: number = 0;
  private lastTicks: number = 0;

  private entityManager: EntityManager = new EntityManager();
  private assetManager: AssetManager;

  private player?: Entity;

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

    this.root.appendChild(this.screen.canvas);

    this.assetManager = new AssetManager(assetBase);
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
    this.loadLevel();
  }

  public async loadLevel() {
    await this.assetManager.addTexture(
      'jungle-tiletexture',
      'tilemaps/jungle.png'
    );

    await this.assetManager.addTexture(
      'chopper-image',
      'images/chopper-spritesheet.png'
    );

    const map = new GameMap(
      'jungle-tiletexture',
      1,
      32,
      this.entityManager,
      this.assetManager,
      this.buffer
    );

    await map.loadMap(`${this.assetBase}/tilemaps/jungle.map`);

    this.player = this.entityManager.create('chopper', LayerType.PLAYER_LAYER);

    this.player.addComponent(
      new TransformComponent(
        createVector(240, 106),
        createVector(0, 0),
        32,
        32,
        1
      )
    );
    this.player.addComponent(
      new SpriteComponent(
        this.player,
        'chopper-image',
        this.assetManager,
        this.buffer,
        {
          numFrames: 2,
          animationSpeed: 90,
          isFixed: false,
          hasDirections: true,
          animationNames: ['DOWN', 'RIGHT', 'LEFT', 'UP']
        }
      )
    );

    this.player.addComponent(
      new KeyboardControl('UP', 'DOWN', 'LEFT', 'RIGHT', this.player)
    );
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
      this.entityManager.update(
        this.deltaTime,
        this.lastTicks,
        this.width,
        this.height
      );
      // this.handleCameraMovement
    }, this.frameRateTargetTime);
  }

  private render() {
    this.buffer.context.clearRect(0, 0, this.width, this.height);
    this.screen.context.clearRect(0, 0, this.width, this.height);

    if (this.entityManager.hasNoEntites) {
      return;
    } else {
      this.entityManager.render(this.buffer);
    }

    this.screen.context.drawImage(this.buffer.canvas, 0, 0);
  }
}
