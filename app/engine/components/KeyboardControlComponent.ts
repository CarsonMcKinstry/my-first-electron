import { SpriteComponent } from "./SpriteComponent";
import { TransformComponent } from "./TransformComponent";
import { Component } from "./Component";
import { Entity } from "../entities/Entity";
import { Vector } from "../primitives/Vector";
import { fromEvent, Subscription, merge, Observable } from "rxjs";
import { filter, share, tap, mapTo } from "rxjs/operators";

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

const keyPress = (k: number, e: Observable<KeyboardEvent>) =>
  e.pipe(filter(e => e.keyCode === k));

export class KeyboardControl extends Component {
  public transform: TransformComponent;
  public sprite: SpriteComponent;

  private control: Subscription;

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

    const keyDown = fromEvent<KeyboardEvent>(document, "keydown").pipe(share());
    const keyUp = fromEvent<KeyboardEvent>(document, "keyup").pipe(share());

    const downs = [
      keyPress(37, keyDown).pipe(mapTo({ x: -20, direction: this.leftKey })),
      keyPress(38, keyDown).pipe(mapTo({ y: -20, direction: this.upKey })),
      keyPress(39, keyDown).pipe(mapTo({ x: 20, direction: this.rightKey })),
      keyPress(40, keyDown).pipe(mapTo({ y: 20, direction: this.downKey }))
    ];
    const ups = [
      keyPress(37, keyUp).pipe(mapTo({ x: 0 })),
      keyPress(38, keyUp).pipe(mapTo({ y: 0 })),
      keyPress(39, keyUp).pipe(mapTo({ x: 0 })),
      keyPress(40, keyUp).pipe(mapTo({ y: 0 }))
    ];

    this.control = merge<{
      x?: number;
      y?: number;
      direction?: string;
    }>(...ups, ...downs)
      .pipe(
        tap(({ x, y, direction }) => {
          if (direction) {
            this.sprite.play(direction);
          }
          if (x !== undefined) {
            this.transform.velocity.x = x;
          }
          if (y !== undefined) {
            this.transform.velocity.y = y;
          }
        })
      )
      .subscribe();
  }
  update() {}

  initialize() {}

  render() {}
}
