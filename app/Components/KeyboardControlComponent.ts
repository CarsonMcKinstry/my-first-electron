import { SpriteComponent } from "./SpriteComponent";
import { TransformComponent } from "./TransformComponent";
import { Component } from "../Component";
import { Entity } from "../Entity";
import { Vector } from "../Vector";

export class KeyboardControl extends Component {
    public transform: TransformComponent;
    public sprite: SpriteComponent;

    constructor(
        public upKey: string, // 38
        public downKey: string, // 40
        public leftKey: string, // 37
        public rightKey: string, // 39
        public shootKey: string, // 32
        private owner: Entity // public transform: TransformComponent, // public sprite: SpriteComponent
    ) {
        super();

        this.transform = this.owner.getComponent("transform");
        this.sprite = this.owner.getComponent("sprite");
    }

    intialize() {}

    update() {
        document.removeEventListener("keydown", this.handleKeyDown);

        document.addEventListener("keydown", this.handleKeyDown);

        document.removeEventListener("keyup", this.handleKeyUp);

        document.addEventListener("keyup", this.handleKeyUp);
    }

    handleKeyDown = (e: KeyboardEvent) => {
        switch (e.keyCode) {
            case 38: // up
                this.sprite.play(this.upKey);
                this.transform.velocity = new Vector(
                    this.transform.velocity.x,
                    -20
                );
                break;
            case 40: // down
                this.sprite.play(this.downKey);
                this.transform.velocity = new Vector(
                    this.transform.velocity.x,
                    20
                );
                break;
            case 37: // left
                this.sprite.play(this.leftKey);
                this.transform.velocity = new Vector(
                    -20,
                    this.transform.velocity.y
                );
                break;
            case 39: // right
                this.sprite.play(this.rightKey);
                this.transform.velocity = new Vector(
                    20,
                    this.transform.velocity.y
                );
                break;
            case 32: // shoot
                break;
            default:
                break;
        }
    };

    handleKeyUp = (e: KeyboardEvent) => {
        switch (e.keyCode) {
            case 38: // up
                this.transform.velocity = new Vector(
                    this.transform.velocity.x,
                    0
                );

                break;
            case 40: // down
                this.transform.velocity = new Vector(
                    this.transform.velocity.x,
                    0
                );
                break;
            case 37: // left
                this.transform.velocity = new Vector(
                    0,
                    this.transform.velocity.y
                );
                break;
            case 39: // right
                this.transform.velocity = new Vector(
                    0,
                    this.transform.velocity.y
                );
                break;
            case 32: // shoot
                break;
            default:
                break;
        }
    };

    render() {}
}
