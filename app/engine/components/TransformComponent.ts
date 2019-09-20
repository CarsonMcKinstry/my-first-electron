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

  update(deltaTime: number, ticks: number) {
    this.pos = this.pos.add(this.vel.scale(deltaTime));
  }

  render() {}
}
