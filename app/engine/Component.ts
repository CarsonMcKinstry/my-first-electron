import { Canvas, Rect } from './_types';
export abstract class Component {
  public abstract initialize(): void;

  public abstract update(
    delatTime: number,
    ticks: number,
    gameWidth: number,
    gameHeight: number,
    camera: Rect
  ): void;

  public abstract render(buffer: Canvas): void;
}
