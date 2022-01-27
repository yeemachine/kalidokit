import { XYZ, AxisMap, EulerRotation } from "../Types";
import { PI, TWO_PI } from "./../constants";

/** Vector Math class. */
export default class Vector {
    public x: number;
    public y: number;
    public z: number;

    constructor(a?: number[] | XYZ | number | Vector | EulerRotation, b?: number, c?: number) {
        if (Array.isArray(a)) {
            this.x = a[0] ?? 0;
            this.y = a[1] ?? 0;
            this.z = a[2] ?? 0;
            return;
        }

        if (!!a && typeof a === "object") {
            this.x = a.x ?? 0;
            this.y = a.y ?? 0;
            this.z = a.z ?? 0;
            return;
        }

        this.x = a ?? 0;
        this.y = b ?? 0;
        this.z = c ?? 0;
    }

    // Methods //
    /**
     * Returns the negative of this vector.
     */
    negative() {
        return new Vector(-this.x, -this.y, -this.z);
    }
    /**
     * Add a vector or number to this vector.
     * @param {Vector | number} a: Vector or number to add
     * @returns {Vector} New vector
     */
    add(v: Vector | number) {
        if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
        else return new Vector(this.x + v, this.y + v, this.z + v);
    }
    /**
     * Substracts a vector or number from this vector.
     * @param {Vector | number} a: Vector or number to subtract
     * @returns {Vector} New vector
     */
    subtract(v: Vector | number) {
        if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
        else return new Vector(this.x - v, this.y - v, this.z - v);
    }
    /**
     * Multiplies a vector or a number to a vector.
     * @param {Vector | number} a: Vector or number to multiply
     * @param {Vector} b: Vector to multiply
     */
    multiply(v: Vector | number) {
        if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
        else return new Vector(this.x * v, this.y * v, this.z * v);
    }
    /**
     * Divide this vector by a vector or a number.
     * @param {Vector | number} a: Vector or number to divide
     * @returns {Vector} New vector
     */
    divide(v: Vector | number) {
        if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
        else return new Vector(this.x / v, this.y / v, this.z / v);
    }
    /**
     * Check if the given vector is equal to this vector.
     * @param {Vector} v: Vector to compare
     * @returns {boolean} True if equal
     */
    equals(v: Vector) {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }
    /**
     * Returns the dot product of this vector and another vector.
     * @param {Vector} v: Vector to dot
     * @returns {number} Dot product
     */
    dot(v: Vector) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    /**
     * Cross product of two vectors.
     * @param {Vector} a: Vector to cross
     * @param {Vector} b: Vector to cross
     */
    cross(v: Vector) {
        return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }
    /**
     * Get the length of the Vector
     * @returns {number} Length
     */
    length() {
        return Math.sqrt(this.dot(this));
    }
    /**
     * Find the distance between this and another vector.
     * @param {Vector} v: Vector to find distance to
     * @param {2 | 3} d: 2D or 3D distance
     * @returns {number} Distance
     */
    distance(v: Vector, d: 2 | 3 = 3) {
        //2D distance
        if (d === 2) return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
        //3D distance
        else return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2) + Math.pow(this.z - v.z, 2));
    }
    /**
     * Lerp between this vector and another vector.
     * @param {Vector} v: Vector to lerp to
     * @param {number} fraction: Fraction to lerp
     * @returns {Vector}
     */
    lerp(v: Vector, fraction: number) {
        return v.subtract(this).multiply(fraction).add(this);
    }
    /**
     * Returns the unit vector of this vector.
     * @returns {Vector} Unit vector
     */
    unit() {
        return this.divide(this.length());
    }
    min() {
        return Math.min(Math.min(this.x, this.y), this.z);
    }
    max() {
        return Math.max(Math.max(this.x, this.y), this.z);
    }
    /**
     * To Angles
     * @param {AxisMap} [axisMap = {x: "x", y: "y", z: "z"}]
     * @returns {{ theta: number, phi: number }}
     */
    toSphericalCoords(axisMap: AxisMap = { x: "x", y: "y", z: "z" }) {
        return {
            theta: Math.atan2(this[axisMap.y], this[axisMap.x]),
            phi: Math.acos(this[axisMap.z] / this.length()),
        };
    }
    /**
     * Returns the angle between this vector and vector a in radians.
     * @param {Vector} a: Vector
     * @returns {number}
     */
    angleTo(a: Vector) {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    }
    /**
     * Array representation of the vector.
     * @param {number} n: Array length
     * @returns {number[]} Array
     * @example
     * new Vector(1, 2, 3).toArray(); // [1, 2, 3]
     */
    toArray(n: number) {
        return [this.x, this.y, this.z].slice(0, n || 3);
    }
    /**
     * Clone the vector.
     * @returns {Vector} New vector
     */
    clone() {
        return new Vector(this.x, this.y, this.z);
    }
    /**
     * Init this Vector with explicit values
     * @param {number} x: X value
     * @param {number} y: Y value
     * @param {number} z: Z value
     */
    init(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    // static methods //
    static negative(a: Vector, b: Vector = new Vector()) {
        b.x = -a.x;
        b.y = -a.y;
        b.z = -a.z;
        return b;
    }
    static add(a: Vector, b: Vector | number, c: Vector = new Vector()) {
        if (b instanceof Vector) {
            c.x = a.x + b.x;
            c.y = a.y + b.y;
            c.z = a.z + b.z;
        } else {
            c.x = a.x + b;
            c.y = a.y + b;
            c.z = a.z + b;
        }
        return c;
    }
    static subtract(a: Vector, b: Vector | number, c: Vector = new Vector()) {
        if (b instanceof Vector) {
            c.x = a.x - b.x;
            c.y = a.y - b.y;
            c.z = a.z - b.z;
        } else {
            c.x = a.x - b;
            c.y = a.y - b;
            c.z = a.z - b;
        }
        return c;
    }
    static multiply(a: Vector, b: Vector | number, c: Vector = new Vector()) {
        if (b instanceof Vector) {
            c.x = a.x * b.x;
            c.y = a.y * b.y;
            c.z = a.z * b.z;
        } else {
            c.x = a.x * b;
            c.y = a.y * b;
            c.z = a.z * b;
        }
        return c;
    }
    static divide(a: Vector, b: Vector | number, c: Vector = new Vector()) {
        if (b instanceof Vector) {
            c.x = a.x / b.x;
            c.y = a.y / b.y;
            c.z = a.z / b.z;
        } else {
            c.x = a.x / b;
            c.y = a.y / b;
            c.z = a.z / b;
        }
        return c;
    }
    static cross(a: Vector, b: Vector, c: Vector = new Vector()) {
        c.x = a.y * b.z - a.z * b.y;
        c.y = a.z * b.x - a.x * b.z;
        c.z = a.x * b.y - a.y * b.x;
        return c;
    }
    static unit(a: Vector, b: Vector) {
        const length = a.length();
        b.x = a.x / length;
        b.y = a.y / length;
        b.z = a.z / length;
        return b;
    }
    /**
     * Create new vector from angles
     * @param {number} theta: Theta angle
     * @param {number} phi: Phi angle
     * @returns {Vector} New vector
     */
    static fromAngles(theta: number, phi: number) {
        return new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
    }
    static randomDirection() {
        return Vector.fromAngles(Math.random() * TWO_PI, Math.asin(Math.random() * 2 - 1));
    }
    static min(a: Vector, b: Vector) {
        return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
    }
    static max(a: Vector, b: Vector) {
        return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
    }
    /**
     * Lerp between two vectors
     * @param {Vector} a: Vector a
     * @param {Vector} b: Vector b
     * @param {number} fraction: Fraction
     */
    static lerp<T extends number | Vector>(a: T, b: T, fraction: number): T {
        if (b instanceof Vector) {
            return b.subtract(a).multiply(fraction).add(a) as unknown as T;
        } else {
            return (((b as number) - (a as number)) * fraction + (a as unknown as number)) as unknown as T;
        }
    }
    /**
     * Create a new vector from an Array
     * @param {number[]} array: Array
     * @returns {Vector} New vector
     */
    static fromArray(a: Array<number> | XYZ) {
        if (Array.isArray(a)) {
            return new Vector(a[0], a[1], a[2]);
        }
        return new Vector(a.x, a.y, a.z);
    }
    /**
     * Angle between two vectors
     * @param {Vector} a: Vector a
     * @param {Vector} b: Vector b
     * @returns
     */
    static angleBetween(a: Vector, b: Vector) {
        return a.angleTo(b);
    }
    static distance(a: Vector, b: Vector, d: number) {
        if (d === 2) return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        else return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
    }
    static toDegrees(a: number) {
        return a * (180 / PI);
    }
    static normalizeAngle(radians: number) {
        let angle = radians % TWO_PI;
        angle = angle > PI ? angle - TWO_PI : angle < -PI ? TWO_PI + angle : angle;
        //returns normalized values to -1,1
        return angle / PI;
    }
    static normalizeRadians(radians: number) {
        if (radians >= PI / 2) {
            radians -= TWO_PI;
        }
        if (radians <= -PI / 2) {
            radians += TWO_PI;
            radians = PI - radians;
        }
        //returns normalized values to -1,1
        return radians / PI;
    }
    static find2DAngle(cx: number, cy: number, ex: number, ey: number) {
        const dy = ey - cy;
        const dx = ex - cx;
        const theta = Math.atan2(dy, dx);
        return theta;
    }
    /**
     * Find 3D rotation between two vectors
     * @param {Vector} a: First vector
     * @param {Vector} b: Second vector
     * @param {boolean} normalize: Normalize the result
     */
    static findRotation(a: Vector | XYZ, b: Vector | XYZ, normalize = true) {
        if (normalize) {
            return new Vector(
                Vector.normalizeRadians(Vector.find2DAngle(a.z, a.x, b.z, b.x)),
                Vector.normalizeRadians(Vector.find2DAngle(a.z, a.y, b.z, b.y)),
                Vector.normalizeRadians(Vector.find2DAngle(a.x, a.y, b.x, b.y))
            );
        } else {
            return new Vector(
                Vector.find2DAngle(a.z, a.x, b.z, b.x),
                Vector.find2DAngle(a.z, a.y, b.z, b.y),
                Vector.find2DAngle(a.x, a.y, b.x, b.y)
            );
        }
    }
    /**
     * Find roll pitch yaw of plane formed by 3 points
     * @param {Vector} a: Vector
     * @param {Vector} b: Vector
     * @param {Vector} c: Vector
     */
    static rollPitchYaw(a: Vector | XYZ, b: Vector | XYZ, c?: Vector) {
        if (!c) {
            return new Vector(
                Vector.normalizeAngle(Vector.find2DAngle(a.z, a.y, b.z, b.y)),
                Vector.normalizeAngle(Vector.find2DAngle(a.z, a.x, b.z, b.x)),
                Vector.normalizeAngle(Vector.find2DAngle(a.x, a.y, b.x, b.y))
            );
        }
        const qb = (b as Vector).subtract(a as Vector);
        const qc = c.subtract(a as Vector);
        const n = qb.cross(qc);

        const unitZ = n.unit();
        const unitX = qb.unit();
        const unitY = unitZ.cross(unitX);

        const beta = Math.asin(unitZ.x) || 0;
        const alpha = Math.atan2(-unitZ.y, unitZ.z) || 0;
        const gamma = Math.atan2(-unitY.x, unitX.x) || 0;

        return new Vector(Vector.normalizeAngle(alpha), Vector.normalizeAngle(beta), Vector.normalizeAngle(gamma));
    }
    /**
     * Find angle between 3D Coordinates
     * @param {Vector | number} a: Vector or Number
     * @param {Vector | number} b: Vector or Number
     * @param {Vector | number} c: Vector or Number
     */
    static angleBetween3DCoords(a: Vector | XYZ, b: Vector | XYZ, c: Vector | XYZ) {
        if (!(a instanceof Vector)) {
            a = new Vector(a);
            b = new Vector(b);
            c = new Vector(c);
        }
        // Calculate vector between points 1 and 2
        const v1 = (a as Vector).subtract(b as Vector);

        // Calculate vector between points 2 and 3
        const v2 = (c as Vector).subtract(b as Vector);

        // The dot product of vectors v1 & v2 is a function of the cosine of the
        // angle between them (it's scaled by the product of their magnitudes).
        const v1norm = v1.unit();
        const v2norm = v2.unit();

        // Calculate the dot products of vectors v1 and v2
        const dotProducts = v1norm.dot(v2norm);

        // Extract the angle from the dot products
        const angle = Math.acos(dotProducts);

        // return single angle Normalized to 1
        return Vector.normalizeRadians(angle);
    }
    /**
     * Get normalized, spherical coordinates for the vector bc, relative to vector ab
     * @param {Vector | number} a: Vector or Number
     * @param {Vector | number} b: Vector or Number
     * @param {Vector | number} c: Vector or Number
     * @param {AxisMap} axisMap: Mapped axis to get the right spherical coords
     */
    static getRelativeSphericalCoords(a: Vector | XYZ, b: Vector | XYZ, c: Vector | XYZ, axisMap: AxisMap) {
        if (!(a instanceof Vector)) {
            a = new Vector(a);
            b = new Vector(b);
            c = new Vector(c);
        }

        // Calculate vector between points 1 and 2
        const v1 = (b as Vector).subtract(a as Vector);

        // Calculate vector between points 2 and 3
        const v2 = (c as Vector).subtract(b as Vector);

        const v1norm = v1.unit();
        const v2norm = v2.unit();

        const { theta: theta1, phi: phi1 } = v1norm.toSphericalCoords(axisMap);
        const { theta: theta2, phi: phi2 } = v2norm.toSphericalCoords(axisMap);

        const theta = theta1 - theta2;
        const phi = phi1 - phi2;

        return {
            theta: Vector.normalizeAngle(theta),
            phi: Vector.normalizeAngle(phi),
        };
    }
    /**
     * Get normalized, spherical coordinates for the vector bc
     * @param {Vector | number} a: Vector or Number
     * @param {Vector | number} b: Vector or Number
     * @param {AxisMap} axisMap: Mapped axis to get the right spherical coords
     */
    static getSphericalCoords(a: Vector | XYZ, b: Vector | XYZ, axisMap: AxisMap = { x: "x", y: "y", z: "z" }) {
        if (!(a instanceof Vector)) {
            a = new Vector(a);
            b = new Vector(b);
        }

        // Calculate vector between points 1 and 2
        const v1 = (b as Vector).subtract(a as Vector);

        const v1norm = v1.unit();
        const { theta, phi } = v1norm.toSphericalCoords(axisMap);

        return {
            theta: Vector.normalizeAngle(-theta),
            phi: Vector.normalizeAngle(PI / 2 - phi),
        };
    }
}
