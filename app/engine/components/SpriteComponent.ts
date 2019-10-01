import { compose } from 'lodash/fp';
import { createAnimation, scaleRect, createVector } from './../utils';
import { TransformComponent } from './TransformComponent';
import { AssetManager } from '../managers/AssetManager';
import { Entity } from '../Entity';
import { Component } from '../Component';
import { Canvas, Rect, AnimationOptions, Animation } from '../_types';
import { TextureManager } from '../managers/TextureManager';
import { repositionRect } from '../utils';

export class SpriteComponent extends Component {
  private texture: HTMLCanvasElement;
  private transform: TransformComponent;
  private sourceRect: Rect;
  private destinationRect: Rect;

  // animation related
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
    private buffer: Canvas,
    private camera: Rect,
    private animationOptions?: AnimationOptions
  ) {
    super();

    this.transform = this.entity.getComponent('TransformComponent');

    this.texture = this.assetManager.getTexture(this.textureId);

    this.sourceRect = this.destinationRect = {
      x: 0,
      y: 0,
      w: this.transform.width,
      h: this.transform.height
    };

    if (animationOptions) {
      this.isAnimated = true;
      this.isFixed = animationOptions.isFixed;
      this.numFrames = animationOptions.numFrames;
      this.animationSpeed = animationOptions.animationSpeed;

      if (animationOptions.hasDirections && animationOptions.animationNames) {
        animationOptions.animationNames.forEach((direction, index) => {
          this.animations.set(
            direction,
            createAnimation(index, this.numFrames, this.animationSpeed)
          );
        });

        this.currentAnimationName = animationOptions.animationNames[0];
        console.log(this.currentAnimationName);
      }

      this.animationIndex = 0;
    } else {
      this.animations.set(
        'SINGLE',
        createAnimation(0, this.numFrames, this.animationSpeed)
      );
    }
    this.play(this.currentAnimationName);
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

  initialize() {}

  update(
    deltaTime: number,
    currentTime: number,
    gameWidth: number,
    gameHeight: number
  ) {
    if (this.isAnimated) {
      const s = Math.floor(currentTime / this.animationSpeed) % this.numFrames;

      this.sourceRect = repositionRect(
        {
          x: this.sourceRect.w * s
        },
        this.sourceRect
      );
    }

    this.sourceRect = repositionRect(
      {
        y: this.animationIndex * this.transform.height
      },
      this.sourceRect
    );

    const destinationReposition = createVector(
      this.isFixed
        ? this.transform.position.x
        : this.transform.position.x - this.camera.x,
      this.isFixed
        ? this.transform.position.y
        : this.transform.position.y - this.camera.y
    );

    this.destinationRect = compose(
      scaleRect(this.transform.scale),
      repositionRect(destinationReposition)
    )(this.destinationRect);
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
