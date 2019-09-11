import { SpriteComponent } from "./SpriteComponent";
import { TransformComponent } from "./TransformComponent";
import { Component } from "../Component";
import { Entity } from "../Entity";

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
        document.removeEventListener("keydown", this.handleInput);

        document.addEventListener("keydown", this.handleInput);
    }

    handleInput = (e: KeyboardEvent) => {
        switch (e.keyCode) {
            case 38: // up
                this.sprite.play(this.upKey);
                break;
            case 40: // down
                this.sprite.play(this.downKey);
                break;
            case 37: // left
                this.sprite.play(this.leftKey);
                break;
            case 39: // right
                this.sprite.play(this.rightKey);
                break;
            case 32: // shoot
                break;
            default:
                break;
        }
    };

    render() {}
}
