import { Component } from "./Component";
import { Vector } from "../primitives/Vector";

export class TransformComponent extends Component {
  constructor(
    private pos: Vector,
    private vel: Vector,
    public readonly width: number,
    public readonly height: number,
    public readonly scale: number
  ) {
    super();
  }

  initialize() {}

  get position() {
    return this.pos;
  }

  get velocity() {
    return this.vel;
  }

  update(
    deltaTime: number,
    ticks: number,
    gameWidth?: number,
    gameHeight?: number
  ) {
    const toAdd = new Vector(
      this.velocity.x * deltaTime,
      this.velocity.y * deltaTime
    );
    this.pos = this.position.add(toAdd);

    if (gameWidth && gameHeight) {
      if (this.pos.x < 0) {
        this.pos.x = 0;
      }

      if (this.pos.x > gameWidth - this.width) {
        this.pos.x = gameWidth - this.width;
      }

      if (this.pos.y < 0) {
        this.pos.y = 0;
      }

      if (this.pos.y > gameHeight - this.height) {
        this.pos.y = gameHeight - this.height;
      }
    }
  }

  render() {}
}
