import { createVector } from './../utils';
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
    private tileScale: number,
    private camera: Rect
  ) {
    super();

    this.destination = {
      ...position,
      w: this.tileSize * this.tileScale,
      h: this.tileSize * this.tileScale
    };
  }

  update(
    deltaTime: number,
    ticks: number,
    gameWidth: number,
    gameHeight: number,
    camera: Rect
  ) {
    const nextPosition = createVector(
      this.position.x - camera.x,
      this.position.y - camera.y
    );

    this.destination = repositionRect(nextPosition, this.destination);
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
