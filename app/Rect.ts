export class Rect {
  constructor(
    private _x: number,
    private _y: number,
    private _w: number,
    private _h: number
  ) {}

  set x(v: number) {
    this._x = v;
  }
  set y(v: number) {
    this._y = v;
  }
  set w(v: number) {
    this._w = v;
  }
  set h(v: number) {
    this._h = v;
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  get w() {
    return this._w;
  }
  get h() {
    return this._h;
  }
}
