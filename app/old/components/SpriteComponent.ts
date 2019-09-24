import { TextureManager } from '../../engine/managers/TextureManager';
import { AnimationOptions } from '../types';
import { AssetManager } from '../../engine/managers/AssetManager';
import { TransformComponent } from './TransformComponent';
import { Component } from './Component';
import { Entity } from '../entities/Entity';
import { Rect } from '../primitives/Rect';
import { Vector } from '../primitives/Vector';
import { Animation } from '../primitives/Animation';

// const AnimationDirections = ["DOWN", "RIGHT", "LEFT", "UP"];

export class SpriteComponent extends Component {
  private transform?: TransformComponent;
  private sourceRect: Rect = new Rect(0, 0, 0, 0);
  private destinationRect: Rect = new Rect(0, 0, 0, 0);
  private texture: HTMLCanvasElement;

  private animations: Map<string, Animation> = new Map();
  private isFixed: boolean = false;
  private isAnimated: boolean = false;
  private currentAnimationName: string = '';
  private animationIndex: number = 0;
  private animationSpeed: number = 90;
  private numFrames: number = 1;

  constructor(
    private entity: Entity,
    private textureId: string,
    private assetManager: AssetManager,
    private buffer: CanvasRenderingContext2D,
    private camera: Rect,
    private animationOptions?: AnimationOptions
  ) {
    super();

    const transform = entity.getComponent('TransformComponent');

    if (transform) {
      // @ts-ignore
      this.transform = transform;
    }

    if (animationOptions) {
      this.isAnimated = true;
      this.isFixed = animationOptions.isFixed;
      this.numFrames = animationOptions.numFrames;
      this.animationSpeed = animationOptions.animationSpeed;

      if (animationOptions.hasDirections && animationOptions.animationNames) {
        animationOptions.animationNames.forEach((direction, index) => {
          this.animations.set(
            direction,
            new Animation(index, this.numFrames, this.animationSpeed)
          );
        });

        this.currentAnimationName = animationOptions.animationNames[0];
        console.log(this.currentAnimationName);
      }

      this.animationIndex = 0;
    } else {
      this.animations.set(
        'SINGLE',
        new Animation(0, this.numFrames, this.animationSpeed)
      );
    }
    this.play(this.currentAnimationName);

    this.texture = this.setTexture(textureId);
  }

  setTexture(textureId: string): HTMLCanvasElement {
    return this.assetManager.getTexture(textureId);
  }

  play(animationName: string) {
    const animation = this.animations.get(animationName);

    if (animation) {
      this.numFrames = animation.numFrames;
      this.animationIndex = animation.index;
      this.animationSpeed = animation.animationSpeed;
      this.currentAnimationName = animationName;
    }
  }

  initialize() {
    if (this.transform) {
      this.sourceRect = new Rect(
        0,
        0,
        this.transform.width,
        this.transform.height
      );
      this.destinationRect = new Rect(
        0,
        0,
        this.transform.width,
        this.transform.height
      );
    }
  }

  update(deltaTime: number, currentTime: number) {
    if (this.isAnimated) {
      const s = Math.floor(currentTime / this.animationSpeed) % this.numFrames;
      this.sourceRect.move(
        new Vector(this.sourceRect.width * s, this.sourceRect.y)
      );
    }

    if (this.transform) {
      this.sourceRect.move(
        new Vector(
          this.sourceRect.x,
          this.animationIndex * this.transform.height
        )
      );
    }

    if (this.transform) {
      this.destinationRect
        .move(
          new Vector(
            this.isFixed
              ? this.transform.position.x
              : this.transform.position.x - this.camera.x,
            this.isFixed
              ? this.transform.position.y
              : this.transform.position.y - this.camera.y
          )
        )
        .scale(this.transform.scale);
    }
  }

  render() {
    TextureManager.draw(
      this.texture,
      this.buffer,
      this.sourceRect,
      this.destinationRect
    );
  }
}
