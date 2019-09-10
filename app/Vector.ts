export class Vector {
  constructor(private readonly _x: number, private readonly _y: number) {}

  public get x() {
    return this._x;
  }

  public get y() {
    return this._y;
  }

  public add(v: Vector): Vector {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  public multiply(s: number): Vector {
    return new Vector(this.x * s, this.y * s);
  }
}
