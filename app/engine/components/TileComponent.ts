import { TextureManager } from '../managers/TextureManager';
import { Vector, Rect, Canvas } from '../_types';
import { Component } from '../Component';
import { repositionRect } from '../utils';

export class TileComponent extends Component {
  private destination: Rect;

  constructor(
    private texture: HTMLCanvasElement,
    private buffer: Canvas,
    private source: Rect,
    private position: Vector,
    private tileSize: number,
    private tileScale: number
  ) {
    super();

    this.destination = {
      ...position,
      w: tileSize * tileScale,
      h: tileScale * tileScale
    };
  }

  update() {
    this.destination = repositionRect(this.position, this.destination);
  }

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
