/** Vector Math class. */
export default class Vector {
    constructor(a, b, c) {
        if (!!a && a.constructor === Array) {
            this.x = a[0] || 0;
            this.y = a[1] || 0;
            this.z = a[2] || 0;
            return;
        }

        if (!!a && a.constructor === Object) {
            this.x = a.x || 0;
            this.y = a.y || 0;
            this.z = a.z || 0;
            return;
        }

        this.x = a || 0;
        this.y = b || 0;
        this.z = c || 0;
    }

    // Methods //
    negative() {
        return new Vector(-this.x, -this.y, -this.z);
    }
    add(v) {
        if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
        else return new Vector(this.x + v, this.y + v, this.z + v);
    }
    subtract(v) {
        if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
        else return new Vector(this.x - v, this.y - v, this.z - v);
    }
    multiply(v) {
        if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
        else return new Vector(this.x * v, this.y * v, this.z * v);
    }
    divide(v) {
        if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
        else return new Vector(this.x / v, this.y / v, this.z / v);
    }
    equals(v) {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    cross(v) {
        return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }
    length() {
        return Math.sqrt(this.dot(this));
    }
    distance(v, d = 3) {
        //2D distance
        if (d === 2) return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
        //3D distance
        else return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2) + Math.pow(this.z - v.z, 2));
    }
    lerp(v, fraction) {
        return v.subtract(this).multiply(fraction).add(this);
    }
    unit() {
        return this.divide(this.length());
    }
    min() {
        return Math.min(Math.min(this.x, this.y), this.z);
    }
    max() {
        return Math.max(Math.max(this.x, this.y), this.z);
    }
    toAngles() {
        return {
            theta: Math.atan2(this.z, this.x),
            phi: Math.asin(this.y / this.length()),
        };
    }
    angleTo(a) {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    }
    toArray(n) {
        return [this.x, this.y, this.z].slice(0, n || 3);
    }
    clone() {
        return new Vector(this.x, this.y, this.z);
    }
    init(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    // static methods //
    static negative(a, b) {
        b.x = -a.x;
        b.y = -a.y;
        b.z = -a.z;
        return b;
    }
    static add(a, b, c) {
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
    static subtract(a, b, c) {
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
    static multiply(a, b, c) {
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
    static divide(a, b, c) {
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
    static cross(a, b, c) {
        c.x = a.y * b.z - a.z * b.y;
        c.y = a.z * b.x - a.x * b.z;
        c.z = a.x * b.y - a.y * b.x;
        return c;
    }
    static unit(a, b) {
        let length = a.length();
        b.x = a.x / length;
        b.y = a.y / length;
        b.z = a.z / length;
        return b;
    }
    static fromAngles(theta, phi) {
        return new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
    }
    static randomDirection() {
        return Vector.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
    }
    static min(a, b) {
        return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
    }
    static max(a, b) {
        return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
    }
    static lerp(a, b, fraction) {
        if (b instanceof Vector) {
            return b.subtract(a).multiply(fraction).add(a);
        } else {
            return (b - a) * fraction + a;
        }
    }
    static fromArray(a) {
        if (!!a && a.constructor === Array) {
            return new Vector(a[0], a[1], a[2]);
        }
        return new Vector(a.x, a.y, a.z);
    }
    static angleBetween(a, b) {
        return a.angleTo(b);
    }
    static angleBetweenVertices(a, b, c) {
        let ab = a.subtract(b);
        let bc = c.subtract(b);
    }
    static distance(a, b, d) {
        if (d === 2) return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        else return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
    }
    static toDegrees(a) {
        return a * (180 / Math.PI);
    }
    static normalizeAngle(radians) {
        let TWO_PI = Math.PI * 2;
        let angle = radians % TWO_PI;
        angle = angle > Math.PI ? angle - TWO_PI : angle < -Math.PI ? TWO_PI + angle : angle;
        //returns normalized values to -1,1
        return angle / Math.PI;
    }
    static normalizeRadians(radians) {
        if (radians >= Math.PI / 2) {
            radians -= 2 * Math.PI;
        }
        if (radians <= -Math.PI / 2) {
            radians += 2 * Math.PI;
            radians = Math.PI - radians;
        }
        //returns normalized values to -1,1
        return radians / Math.PI;
    }
    static find2DAngle(cx, cy, ex, ey) {
        var dy = ey - cy;
        var dx = ex - cx;
        var theta = Math.atan2(dy, dx);
        return theta;
    }
    //find 3D rotation of 2 points
    static findRotation(a, b, normalize = true) {
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
    //find roll pitch yaw of plane formed by 3 points
    static rollPitchYaw(a, b, c) {
        if (!c) {
            return new Vector(
                Vector.normalizeAngle(Vector.find2DAngle(a.z, a.y, b.z, b.y)),
                Vector.normalizeAngle(Vector.find2DAngle(a.z, a.x, b.z, b.x)),
                Vector.normalizeAngle(Vector.find2DAngle(a.x, a.y, b.x, b.y))
            );
        }
        let qb = b.subtract(a);
        let qc = c.subtract(a);
        let n = qb.cross(qc);

        let unitZ = n.unit();
        let unitX = qb.unit();
        let unitY = unitZ.cross(unitX);

        let beta = Math.asin(unitZ.x) || 0;
        let alpha = Math.atan2(-unitZ.y, unitZ.z) || 0;
        let gamma = Math.atan2(-unitY.x, unitX.x) || 0;

        return new Vector(Vector.normalizeAngle(alpha), Vector.normalizeAngle(beta), Vector.normalizeAngle(gamma));
    }
    //find 2D angle between 3 points in space
    static angleBetween3DCoords(a, b, c) {
        if (a instanceof Vector === false) {
            a = new Vector(a);
            b = new Vector(b);
            c = new Vector(c);
        }
        // Calculate vector between points 1 and 2
        const v1 = a.subtract(b);

        // Calculate vector between points 2 and 3

        const v2 = c.subtract(b);

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
}
