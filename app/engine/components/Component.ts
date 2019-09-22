export abstract class Component {
  public abstract initialize(): void;

  public abstract update(
    delatTime: number,
    ticks: number,
    gameWidth?: number,
    gameHeight?: number
  ): void;

  public abstract render(buffer: CanvasRenderingContext2D): void;
}
