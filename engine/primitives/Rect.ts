import { Vector } from "./Vector";

export class Rect {
  constructor(
    private _x: number,
    private _y: number,
    private _width: number,
    private _height: number
  ) {}

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  public move(v: Vector) {
    return new Rect(this.x + v.x, this.y + v.y, this.width, this.height);
  }

  public scale(s: number | Vector) {
    if (s instanceof Vector) {
      return new Rect(this.x, this.y, this.width * s.x, this.height * s.y);
    }
    return new Rect(this.x, this.y, this.width * s, this.height * s);
  }
}
