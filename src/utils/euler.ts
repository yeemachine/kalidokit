import { XYZ, RotationOrder, EulerRotation } from "../Types";
import { Vector } from "..";

/** Euler rotation class. */
export default class Euler {
    public x: number;
    public y: number;
    public z: number;
    public rotationOrder?: RotationOrder;

    constructor(a?: number | EulerRotation, b?: number, c?: number, rotationOrder?: RotationOrder) {
        if (!!a && typeof a === "object") {
            this.x = a.x ?? 0;
            this.y = a.y ?? 0;
            this.z = a.z ?? 0;
            this.rotationOrder = a.rotationOrder ?? "XYZ";
            return;
        }

        this.x = a ?? 0;
        this.y = b ?? 0;
        this.z = c ?? 0;
        this.rotationOrder = rotationOrder ?? "XYZ";
    }

    /**
     * Multiplies a number to an Euler.
     * @param {number} a: Number to multiply
     */
    multiply(v: number) {
        return new Euler(this.x * v, this.y * v, this.z * v, this.rotationOrder);
    }
}
