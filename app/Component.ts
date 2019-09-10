// import { Entity } from './Entity';

export abstract class Component {
  public abstract intialize(): void;

  public abstract update(deltaTime: number): void;

  public abstract render(context: CanvasRenderingContext2D): void;
}
