import { Vector } from "./../Vector";
import { EntityManager } from "./../EntityManager";
import { Component } from "../Component";

interface Position {
  x: number;
  y: number;
}

export class TransformComponent extends Component {
  public position: Vector;
  public velocity: Vector;

  constructor(
    posX: number,
    posY: number,
    velX: number,
    velY: number,
    public readonly w: number,
    public readonly h: number,
    public readonly s: number
  ) {
    super();
    this.position = new Vector(posX, posY);

    this.velocity = new Vector(velX, velY);
  }

  intialize() {}

  update(deltaTime: number) {
    this.position = this.position.add(this.velocity.multiply(deltaTime));
  }

  render(context: CanvasRenderingContext2D) {}
}
