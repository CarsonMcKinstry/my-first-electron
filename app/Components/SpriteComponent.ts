import { Animation } from "./../Animation";
import { TextureManager } from "./../TextureManager";
import { Rect } from "./../Rect";
import { Entity } from "../Entity";
import { TransformComponent } from "./TransformComponent";
import { AssetManager } from "./../AssetManager";
import { Component } from "../Component";
import { Transform } from "stream";

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
    private animationSpeed: number = 90;
    private numFrames: number = 1;

    private animations: Map<string, Animation> = new Map();

    constructor(
        public textureId: string,
        private assetManager: AssetManager,
        private owner: Entity,
        private gameBoard: CanvasRenderingContext2D,
        private animationOptions?: AnimationOptions
    ) {
        super();

        this.sourceRect = new Rect(0, 0, 0, 0);
        this.destinationRect = new Rect(0, 0, 0, 0);

        const transformCompoonent = owner.getComponent("transform");
        if (transformCompoonent) {
            // @ts-ignore
            this.transform = transformCompoonent;
        }

        if (animationOptions) {
            this.isAnimated = true;
            this.isFixed = animationOptions.isFixed;
            this.numFrames = animationOptions.numFrames;
            this.animationSpeed = animationOptions.animationSpeed;

            if (animationOptions.hasDirections) {
                const downAnimation = new Animation(
                    0,
                    this.numFrames,
                    this.animationSpeed
                );
                const rightAnimation = new Animation(
                    1,
                    this.numFrames,
                    this.animationSpeed
                );
                const leftAnimation = new Animation(
                    2,
                    this.numFrames,
                    this.animationSpeed
                );
                const upAnimation = new Animation(
                    3,
                    this.numFrames,
                    this.animationSpeed
                );

                this.animations.set("DownAnimation", downAnimation);
                this.animations.set("RightAnimation", rightAnimation);
                this.animations.set("LeftAnimation", leftAnimation);
                this.animations.set("UpAnimation", upAnimation);

                this.animationIndex = 0;
                this.currentAnimationName = "DownAnimation";
            } else {
                const singleAnimation = new Animation(
                    0,
                    this.numFrames,
                    this.animationSpeed
                );

                this.animations.set("SingleAnimation", singleAnimation);

                this.animationIndex = 0;
                this.currentAnimationName = "SingleAnimation";

                this.play(this.currentAnimationName);
            }
        }
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

    intialize() {
        this.transform = this.owner.getComponent<TransformComponent>(
            "transform"
        );
        this.sourceRect.x = 0;
        this.sourceRect.y = 0;
        this.sourceRect.w = this.transform.w;
        this.sourceRect.h = this.transform.h;
    }

    update(deltaTime: number, currentTime: number) {
        if (this.isAnimated) {
            this.sourceRect.x =
                this.sourceRect.w *
                (Math.floor(currentTime / this.animationSpeed) %
                    this.numFrames);
        }
        if (this.transform) {
            this.sourceRect.y = this.animationIndex * this.transform.h;
        }
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
