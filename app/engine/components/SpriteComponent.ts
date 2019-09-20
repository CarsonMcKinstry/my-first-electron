import { TextureManager } from "./../managers/TextureManager";
import { AnimationOptions } from "./../types";
import { AssetManager } from "./../managers/AssetManager";
import { TransformComponent } from "../components/TransformComponent";
import { Component } from "./Component";
import { Entity } from "../entities/Entity";
import { Rect } from "../primitives/Rect";
import { Vector } from "../primitives/Vector";
import { Animation } from "../primitives/Animation";

// const AnimationDirections = ["DOWN", "RIGHT", "LEFT", "UP"];

export class SpriteComponent extends Component {
  private transform?: TransformComponent;
  private sourceRect: Rect = new Rect(0, 0, 0, 0);
  private destinationRect: Rect = new Rect(0, 0, 0, 0);
  private texture: HTMLCanvasElement;

  private animations: Map<string, Animation> = new Map();
  private isFixed: boolean = false;
  private isAnimated: boolean = false;
  private currentAnimationName: string = "";
  private animationIndex: number = 0;
  private animationSpeed: number = 90;
  private numFrames: number = 1;

  constructor(
    private entity: Entity,
    private textureId: string,
    private assetManager: AssetManager,
    private buffer: CanvasRenderingContext2D,
    private animationOptions?: AnimationOptions
  ) {
    super();

    const transform = entity.getComponent("TransformComponent");

    if (transform) {
      // @ts-ignore
      this.transform = transform;
    }

    this.texture = this.setTexture(textureId);

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
      }

      this.animationIndex = 0;
    } else {
      this.animations.set(
        "SINGLE",
        new Animation(0, this.numFrames, this.animationSpeed)
      );
    }
    this.play(this.currentAnimationName);
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
    }
  }

  update(deltaTime: number, currentTime: number) {
    if (this.isAnimated) {
      const x =
        this.sourceRect.width *
        (Math.floor(currentTime / this.animationSpeed) % this.numFrames);
      const y = this.transform
        ? this.animationIndex * this.transform.height
        : 0;

      const move = new Vector(x, y);

      this.sourceRect.move(move);
    }

    if (this.transform) {
      this.destinationRect = this.destinationRect
        .move(this.transform.position)
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
