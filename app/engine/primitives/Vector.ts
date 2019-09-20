export class Vector {
  constructor(private _x: number, private _y: number) {}

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  set x(v: number) {
    this._x = v;
  }

  set y(v: number) {
    this._y = v;
  }

  public add(v: Vector) {
    this._x += v.x;
    this._y += v.y;

    return this;
  }

  public subtract(v: Vector) {
    this._x -= v.x;
    this._y -= v.y;
    return this;
  }

  public invert() {
    return new Vector(this.y, this.x);
  }

  public scale(s: number | Vector) {
    if (s instanceof Vector) {
      this._x *= s.x;
      this._y *= s.y;
    } else {
      this._x *= s;
      this._y *= s;
    }

    return this;
  }
}
