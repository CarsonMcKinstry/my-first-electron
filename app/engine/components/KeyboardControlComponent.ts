import { repositionVector } from '../utils';
import { Component } from '../Component';
import { TransformComponent } from './TransformComponent';
import { SpriteComponent } from './SpriteComponent';
import { Entity } from '../Entity';
import { fromEvent, Subscription, Observable, merge } from 'rxjs';
import { share, filter, pluck, mapTo, tap } from 'rxjs/operators';

const keyPress = (n: number) => (e: Observable<KeyboardEvent>) =>
  e.pipe(
    pluck('keyCode'),
    filter(k => k === n)
  );

interface ControlMap {
  x?: number;
  y?: number;
  direction?: string;
}

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
      'TransformComponent'
    ) as TransformComponent;
    this.sprite = this.entity.getComponent(
      'SpriteComponent'
    ) as SpriteComponent;

    const keyDown = fromEvent<KeyboardEvent>(document, 'keydown').pipe(share());
    const keyUp = fromEvent<KeyboardEvent>(document, 'keyup').pipe(share());

    const controls = merge<ControlMap>(
      // up
      keyDown.pipe(
        keyPress(38),
        mapTo({ y: -200, direction: this.upKey })
      ),
      // down
      keyDown.pipe(
        keyPress(40),
        mapTo({ y: 200, direction: this.downKey })
      ),
      // left
      keyDown.pipe(
        keyPress(37),
        mapTo({ x: -200, direction: this.leftKey })
      ),
      // right
      keyDown.pipe(
        keyPress(39),
        mapTo({ x: 200, direction: this.rightKey })
      ),
      // up
      keyUp.pipe(
        keyPress(38),
        mapTo({ y: 0 })
      ),
      // down
      keyUp.pipe(
        keyPress(40),
        mapTo({ y: 0 })
      ),
      // left
      keyUp.pipe(
        keyPress(37),
        mapTo({ x: 0 })
      ),
      // right
      keyUp.pipe(
        keyPress(39),
        mapTo({ x: 0 })
      )
    );

    this.control = controls
      .pipe(
        tap(({ x, y, direction }) => {
          if (direction) {
            this.sprite.play(direction);
          }
          this.transform.velocity = repositionVector(
            { x, y },
            this.transform.velocity
          );
        })
      )
      .subscribe();
  }

  update() {}
  initialize() {}
  render() {}
}
