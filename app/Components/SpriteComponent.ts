import { Animation } from "./../Animation";
import { TextureManager } from "./../TextureManager";
import { Rect } from "./../Rect";
import { Entity } from "../Entity";
import { TransformComponent } from "./TransformComponent";
import { AssetManager } from "./../AssetManager";
import { Component } from "../Component";

interface AnimationOptions {
  id: string;
  numFrames: number;
  animationSpeed: number;
  hasDirections: boolean;
  isFixed: boolean;
}

export class SpriteComponent extends Component {
  private texture: HTMLCanvasElement;
  private transform?: TransformComponent;
  private sourceRect: Rect;
  private destinationRect: Rect;

  private isFixed: boolean = false;
  private isAnimated: boolean = false;
  private currentAnimationName: string = "";
  private animationIndex: number = 0;
  private animationSpeed: number = 0;
  private numFrames: number = 0;

  private animations: Map<string, Animation> = new Map();

  constructor(
    public textureId: string,
    private assetManager: AssetManager,
    private owner: Entity,
    private gameBoard: CanvasRenderingContext2D,
    private animationOptions?: AnimationOptions
  ) {
    super();
    this.texture = this.setTexture(textureId);

    this.sourceRect = new Rect(0, 0, 0, 0);
    this.destinationRect = new Rect(0, 0, 0, 0);

    if (animationOptions) {
      this.isAnimated = true;
      this.isFixed = animationOptions.isFixed;
      this.numFrames = animationOptions.numFrames;
      this.animationSpeed = animationOptions.animationSpeed;

      if (animationOptions.hasDirections) {
        // TODO:
      } else {
        const singleAnimation = new Animation(
          0,
          this.numFrames,
          this.animationSpeed
        );

        this.animations.set("SingleAnimation", singleAnimation);

        this.animationIndex = 0;
        this.currentAnimationName = "SingleAnimation";
      }
    }
  }

  setTexture(textureId: string): HTMLCanvasElement {
    return this.assetManager.getTexture(textureId);
  }

  intialize() {
    this.transform = this.owner.getComponent<TransformComponent>("transform");
    this.sourceRect.x = 0;
    this.sourceRect.y = 0;
    this.sourceRect.w = this.transform.w;
    this.sourceRect.h = this.transform.h;
  }

  update() {
    if (this.transform) {
      this.destinationRect.x = this.transform.position.x;
      this.destinationRect.y = this.transform.position.y;
      this.destinationRect.w = this.transform.w * this.transform.s;
      this.destinationRect.h = this.transform.h * this.transform.s;
    }
  }
  render() {
    TextureManager.draw(
      this.texture,
      this.gameBoard,
      this.sourceRect,
      this.destinationRect,
      false
    );
  }
}
