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

  public add(v: Vector) {
    this._x = this.x + v.x;
    this._y = this.y + v.y;
    return this;
  }

  public move(v: Vector) {
    this._x = v.x;
    this._y = v.y;
    return this;
  }

  public scale(s: number | Vector) {
    if (s instanceof Vector) {
      this._width = this.width * s.x;
      this._height = this.height * s.y;
    } else {
      this._width = this.width * s;
      this._height = this.height * s;
    }

    return this;
  }
}
