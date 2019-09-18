export class Vector {
  constructor(private _x: number, private _y: number) {}

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  public add(v: Vector) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  public subtract(v: Vector) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  public invert() {
    return new Vector(this.y, this.x);
  }

  public scale(s: number | Vector) {
    if (s instanceof Vector) {
      return new Vector(this.x * s.x, this.y * s.y);
    }

    return new Vector(this.x * s, this.y * s);
  }
}
