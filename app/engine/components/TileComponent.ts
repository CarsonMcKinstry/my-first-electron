import { Vector } from "./../primitives/Vector";
import { Component } from "./Component";
import { Rect } from "../primitives/Rect";
import { TextureManager } from "../managers/TextureManager";

export class TileComponent extends Component {
  public destination: Rect;

  constructor(
    public texture: HTMLCanvasElement,
    public buffer: CanvasRenderingContext2D,
    public source: Rect,
    public position: Vector,
    public tileSize: number,
    public tileScale: number
  ) {
    super();

    this.destination = new Rect(
      position.x,
      position.y,
      tileSize * tileScale,
      tileSize * tileScale
    );
  }

  update() {}
  initialize() {}
  render() {
    TextureManager.draw(
      this.texture,
      this.buffer,
      this.source,
      this.destination
    );
  }
}
