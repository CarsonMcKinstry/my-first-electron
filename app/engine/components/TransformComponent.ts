import { addVector, scaleVector, clamp } from './../utils';
import { Component } from '../Component';
import { Vector } from '../_types';

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

  get position() {
    return this.pos;
  }

  get velocity() {
    return this.vel;
  }

  initialize() {}

  update(
    deltaTime: number,
    ticks: number,
    gameWidth: number,
    gameHeight: number
  ) {
    this.pos = addVector(this.pos, scaleVector(deltaTime, this.vel));

    this.pos.x = clamp(this.pos.x, 0, gameWidth - this.width);
    this.pos.y = clamp(this.pos.y, 0, gameHeight - this.height);
  }
  render() {}
}
