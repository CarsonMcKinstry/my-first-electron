// import { KeyboardControl } from './../Components/KeyboardControlComponent';
import { TransformComponent } from './Components/TransformComponent';
import { KeyboardControl } from './Components/KeyboardControlComponent';
import { SpriteComponent } from './Components/SpriteComponent';
import { AssetManager } from '../engine/managers/AssetManager';
import { fromEvent, merge, Subscription, Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Canvas, LayerType } from './types';
import { EntityManager } from './managers/EntityManager';
import { Vector } from './primitives/Vector';
import { GameMap } from './Map';
import { Rect } from './primitives/Rect';
import { Entity } from './entities/Entity';

export class Game {
  private _isRunning: boolean = false;
  private deltaTime: number = 0;
  private lastTicks: number = 0;
  private gameBoard: HTMLCanvasElement;
  private gameBoardContext: CanvasRenderingContext2D;
  private buffer: HTMLCanvasElement;
  private bufferContext: CanvasRenderingContext2D;
  public camera: Rect;
  private player?: Entity;

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

    this.camera = new Rect(0, 0, width, height);
  }

  private createCanvas(width: number, height: number): Canvas {
    const canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    return {
      canvas,
      context
    } as Canvas;
  }

  public async loadLevel(level: number) {
    await this.assetManager.addTexture(
      'chopper-image',
      'images/chopper-spritesheet.png'
    );
    await this.assetManager.addTexture(
      'jungle-tiletexture',
      'tilemaps/jungle.png'
    );
    await this.assetManager.addTexture('radar-image', 'images/radar.png');

    const map = new GameMap(
      'jungle-tiletexture',
      2,
      32,
      this.entityManager,
      this.assetManager,
      this.bufferContext,
      this.camera
    );

    map.loadMap(`${this.assetBase}/tilemaps/jungle.map`);

    const radarEntity = this.entityManager.addEntity(
      'radar',
      LayerType.UI_LAYER
    );

    radarEntity.addComponent(
      new TransformComponent(new Vector(720, 15), new Vector(0, 0), 64, 64, 1)
    );
    radarEntity.addComponent(
      new SpriteComponent(
        radarEntity,
        'radar-image',
        this.assetManager,
        this.bufferContext,
        this.camera,
        {
          animationSpeed: 90,
          numFrames: 8,
          isFixed: true,
          hasDirections: false
        }
      )
    );

    this.player = this.entityManager.addEntity(
      'chopper',
      LayerType.PLAYER_LAYER
    );

    this.player.addComponent(
      new TransformComponent(new Vector(240, 106), new Vector(0, 0), 32, 32, 1)
    );
    this.player.addComponent(
      new SpriteComponent(
        this.player,
        'chopper-image',
        this.assetManager,
        this.bufferContext,
        this.camera,
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
      this.handleCameraMovement();
    }, this.frameTargetTime);
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

      playerX = playerX > this.camera.width ? this.camera.width : playerX;
      playerY = playerY > this.camera.height ? this.camera.height : playerY;
      const newPosition = new Vector(playerX, playerY);

      this.camera.move(newPosition);
    }
  }

  private createKeyboardListener() {
    if (this.keyboardListener) {
      this.keyboardListener.unsubscribe();
    }

    const keydowns = fromEvent<KeyboardEvent>(document, 'keydown');

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
