import { SpriteComponent } from "./SpriteComponent";
import { TransformComponent } from "./TransformComponent";
import { Component } from "./Component";
import { Entity } from "../entities/Entity";
import { Vector } from "../primitives/Vector";
import { fromEvent, Subscription, merge, Observable } from "rxjs";
import { filter, share } from "rxjs/operators";

const keyPress = (k: number) => (o: Observable<KeyboardEvent>) =>
  o.pipe(filter(e => e.keyCode === k));

type KeyHandler = (
  e: Observable<KeyboardEvent>,
  controler: KeyboardControl
) => Observable<KeyboardEvent>;

interface Keys {
  up: KeyHandler;
  down: KeyHandler;
  left: KeyHandler;
  right: KeyHandler;
}

export class KeyboardControl extends Component {
  public transform: TransformComponent;
  public sprite: SpriteComponent;

  constructor(
    public upKey: string, // 38
    public downKey: string, // 40
    public leftKey: string, // 37
    public rightKey: string, // 39
    public entity: Entity
  ) {
    super();
    this.transform = this.entity.getComponent(
      "TransformComponent"
    ) as TransformComponent;
    this.sprite = this.entity.getComponent(
      "SpriteComponent"
    ) as SpriteComponent;
  }

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
        this.transform.velocity.set(this.transform.velocity.x, -20);
        break;
      case 40: // down
        this.sprite.play(this.downKey);
        this.transform.velocity.set(this.transform.velocity.x, 20);
        break;
      case 37: // left
        this.sprite.play(this.leftKey);
        this.transform.velocity.set(-20, this.transform.velocity.y);
        break;
      case 39: // right
        this.sprite.play(this.rightKey);
        this.transform.velocity.set(20, this.transform.velocity.y);
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
        this.transform.velocity.set(this.transform.velocity.x, 0);

        break;
      case 40: // down
        this.transform.velocity.set(this.transform.velocity.x, 0);
        break;
      case 37: // left
        this.transform.velocity.set(0, this.transform.velocity.y);
        break;
      case 39: // right
        this.transform.velocity.set(0, this.transform.velocity.y);
        break;
      case 32: // shoot
        break;
      default:
        break;
    }
  };

  initialize() {}

  render() {}
}
