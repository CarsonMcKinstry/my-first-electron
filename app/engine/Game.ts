import { KeyboardControl } from './components/KeyboardControlComponent';
import { EntityManager, AssetManager } from './managers';
import { Canvas, LayerType, Rect } from './_types';
import {
  createCanvas,
  createRect,
  repositionRect,
  createVector
} from './utils';
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

  private camera: Rect;

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

    this.camera = createRect(0, 0, width, height);
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

  public async loadLevel(level: any) {
    // const level = await fs
    //   .readFile(levelFile)
    //   .then(buffer => buffer.toString('utf-8'))
    //   .then(json => JSON.parse(json));

    if (level) {
      const { map, player } = level;

      await this.assetManager.addTexture('map-tiletexture', map.texture);
      await this.assetManager.addTexture(
        'player-texture',
        player.sprite.spriteSheet
      );

      const gamemap = new GameMap(
        'map-tiletexture',
        2,
        map.tileSize,
        this.entityManager,
        this.assetManager,
        this.buffer,
        this.camera
      );

      await gamemap.loadMap(`${this.assetBase}/${map.tileMap}`);

      this.player = this.entityManager.create('player', LayerType.PLAYER_LAYER);

      this.player.addComponent(
        new TransformComponent(
          player.initialPosition,
          player.initialVelocity,
          player.sprite.width,
          player.sprite.height,
          1
        )
      );

      this.player.addComponent(
        new SpriteComponent(
          this.player,
          'player-texture',
          this.assetManager,
          this.buffer,
          this.camera,
          {
            numFrames: player.sprite.numFrames,
            animationSpeed: player.sprite.animationSpeed,
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
      this.handleCameraMovement();
    }, this.frameRateTargetTime);
  }

  private handleCameraMovement() {
    if (this.player) {
      const playerTransform = this.player.getComponent(
        'TransformComponent'
      ) as TransformComponent;

      let playerX = playerTransform.position.x - this.width / 2;
      let playerY = playerTransform.position.y - this.height / 2;

      playerX = playerX < 0 ? 0 : playerX;
      playerY = playerY < 0 ? 0 : playerY;

      playerX = playerX > this.camera.w ? this.camera.w : playerX;
      playerY = playerY > this.camera.h ? this.camera.h : playerY;

      const newPosition = createVector(playerX, playerY);

      this.camera = repositionRect(newPosition, this.camera);
    }
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
