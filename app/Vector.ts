export class Vector {
    constructor(private _x: number, private _y: number) {}

    public get x() {
        return this._x;
    }

    public get y() {
        return this._y;
    }

    // public set x(v: number) {
    //     this._x = v;
    // }

    // public set y(v: number) {
    //     this._y = v;
    // }

    public add(v: Vector): Vector {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    public multiply(s: number): Vector {
        return new Vector(this.x * s, this.y * s);
    }
}
