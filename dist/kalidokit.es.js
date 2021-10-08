var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const clamp = (value, min, max) => {
  return Math.max(Math.min(value, max), min);
};
const remap = (val, a, b) => {
  return (clamp(val, a, b) - a) / (b - a);
};
const RestingDefault = {
  Face: {
    eye: {
      l: 1,
      r: 1
    },
    mouth: {
      x: 0,
      y: 0,
      shape: {
        A: 0,
        E: 0,
        I: 0,
        O: 0,
        U: 0
      }
    },
    head: {
      x: 0,
      y: 0,
      z: 0,
      width: 0.3,
      height: 0.6,
      position: {
        x: 0.5,
        y: 0.5,
        z: 0
      }
    },
    brow: 0,
    pupil: {
      x: 0,
      y: 0
    }
  },
  Pose: {
    RightUpperArm: {
      x: 0,
      y: 0,
      z: -1.25
    },
    LeftUpperArm: {
      x: 0,
      y: 0,
      z: 1.25
    },
    RightLowerArm: {
      x: 0,
      y: 0,
      z: 0
    },
    LeftLowerArm: {
      x: 0,
      y: 0,
      z: 0
    },
    LeftUpperLeg: {
      x: 0,
      y: 0,
      z: 0
    },
    RightUpperLeg: {
      x: 0,
      y: 0,
      z: 0
    },
    RightLowerLeg: {
      x: 0,
      y: 0,
      z: 0
    },
    LeftLowerLeg: {
      x: 0,
      y: 0,
      z: 0
    },
    LeftHand: {
      x: 0,
      y: 0,
      z: 0
    },
    RightHand: {
      x: 0,
      y: 0,
      z: 0
    },
    Spine: {
      x: 0,
      y: 0,
      z: 0
    },
    Hips: {
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      }
    }
  },
  RightHand: {
    RightWrist: {
      x: -0.1315541586772754,
      y: -0.07882867526197412,
      z: -1.0417476769631682
    },
    RightRingProximal: {
      x: 0,
      y: 0,
      z: -0.13224515812536933
    },
    RightRingIntermediate: {
      x: 0,
      y: 0,
      z: -0.4068258603832122
    },
    RightRingDistal: {
      x: 0,
      y: 0,
      z: -0.04950943047275125
    },
    RightIndexProximal: {
      x: 0,
      y: 0,
      z: -0.24443519921597368
    },
    RightIndexIntermediate: {
      x: 0,
      y: 0,
      z: -0.25695509972035424
    },
    RightIndexDistal: {
      x: 0,
      y: 0,
      z: -0.06699515077992313
    },
    RightMiddleProximal: {
      x: 0,
      y: 0,
      z: -0.09663436414575077
    },
    RightMiddleIntermediate: {
      x: 0,
      y: 0,
      z: -0.44945038168605306
    },
    RightMiddleDistal: {
      x: 0,
      y: 0,
      z: -0.06660398263230727
    },
    RightThumbProximal: {
      x: -0.2349819227955754,
      y: -0.33498192279557526,
      z: -0.12613225518081256
    },
    RightThumbIntermediate: {
      x: -0.2,
      y: -0.19959491036565571,
      z: -0.013996364546896928
    },
    RightThumbDistal: {
      x: -0.2,
      y: 0.002005509674788991,
      z: 0.1510027548373945
    },
    RightLittleProximal: {
      x: 0,
      y: 0,
      z: -0.09045147788376662
    },
    RightLittleIntermediate: {
      x: 0,
      y: 0,
      z: -0.22559206415066682
    },
    RightLittleDistal: {
      x: 0,
      y: 0,
      z: -0.10080630460393536
    }
  },
  LeftHand: {
    LeftWrist: {
      x: -0.1315541586772754,
      y: -0.07882867526197412,
      z: -1.0417476769631682
    },
    LeftRingProximal: {
      x: 0,
      y: 0,
      z: 0.13224515812536933
    },
    LeftRingIntermediate: {
      x: 0,
      y: 0,
      z: 0.4068258603832122
    },
    LeftRingDistal: {
      x: 0,
      y: 0,
      z: 0.04950943047275125
    },
    LeftIndexProximal: {
      x: 0,
      y: 0,
      z: 0.24443519921597368
    },
    LeftIndexIntermediate: {
      x: 0,
      y: 0,
      z: 0.25695509972035424
    },
    LeftIndexDistal: {
      x: 0,
      y: 0,
      z: 0.06699515077992313
    },
    LeftMiddleProximal: {
      x: 0,
      y: 0,
      z: 0.09663436414575077
    },
    LeftMiddleIntermediate: {
      x: 0,
      y: 0,
      z: 0.44945038168605306
    },
    LeftMiddleDistal: {
      x: 0,
      y: 0,
      z: 0.06660398263230727
    },
    LeftThumbProximal: {
      x: -0.2349819227955754,
      y: 0.33498192279557526,
      z: 0.12613225518081256
    },
    LeftThumbIntermediate: {
      x: -0.2,
      y: 0.2506506391005022,
      z: 0.05046474221464442
    },
    LeftThumbDistal: {
      x: -0.2,
      y: 0.17880674636490754,
      z: -0.06059662681754624
    },
    LeftLittleProximal: {
      x: 0,
      y: 0,
      z: 0.1748998529912705
    },
    LeftLittleIntermediate: {
      x: 0,
      y: 0,
      z: 0.4065799037713114
    },
    LeftLittleDistal: {
      x: 0,
      y: 0,
      z: 0.10080630460393536
    }
  }
};
var helpers = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  clamp,
  remap,
  RestingDefault
});
class Vector {
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
  negative() {
    return new Vector(-this.x, -this.y, -this.z);
  }
  add(v) {
    if (v instanceof Vector)
      return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    else
      return new Vector(this.x + v, this.y + v, this.z + v);
  }
  subtract(v) {
    if (v instanceof Vector)
      return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
    else
      return new Vector(this.x - v, this.y - v, this.z - v);
  }
  multiply(v) {
    if (v instanceof Vector)
      return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
    else
      return new Vector(this.x * v, this.y * v, this.z * v);
  }
  divide(v) {
    if (v instanceof Vector)
      return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
    else
      return new Vector(this.x / v, this.y / v, this.z / v);
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
    if (d === 2)
      return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
    else
      return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2) + Math.pow(this.z - v.z, 2));
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
      phi: Math.asin(this.y / this.length())
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
    a.subtract(b);
    c.subtract(b);
  }
  static distance(a, b, d) {
    if (d === 2)
      return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    else
      return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2));
  }
  static toDegrees(a) {
    return a * (180 / Math.PI);
  }
  static normalizeAngle(radians) {
    let TWO_PI = Math.PI * 2;
    let angle = radians % TWO_PI;
    angle = angle > Math.PI ? angle - TWO_PI : angle < -Math.PI ? TWO_PI + angle : angle;
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
    return radians / Math.PI;
  }
  static find2DAngle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx);
    return theta;
  }
  static findRotation(a, b, normalize = true) {
    if (normalize) {
      return new Vector(Vector.normalizeRadians(Vector.find2DAngle(a.z, a.x, b.z, b.x)), Vector.normalizeRadians(Vector.find2DAngle(a.z, a.y, b.z, b.y)), Vector.normalizeRadians(Vector.find2DAngle(a.x, a.y, b.x, b.y)));
    } else {
      return new Vector(Vector.find2DAngle(a.z, a.x, b.z, b.x), Vector.find2DAngle(a.z, a.y, b.z, b.y), Vector.find2DAngle(a.x, a.y, b.x, b.y));
    }
  }
  static rollPitchYaw(a, b, c) {
    if (!c) {
      return new Vector(Vector.normalizeAngle(Vector.find2DAngle(a.z, a.y, b.z, b.y)), Vector.normalizeAngle(Vector.find2DAngle(a.z, a.x, b.z, b.x)), Vector.normalizeAngle(Vector.find2DAngle(a.x, a.y, b.x, b.y)));
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
  static angleBetween3DCoords(a, b, c) {
    if (a instanceof Vector === false) {
      a = new Vector(a);
      b = new Vector(b);
      c = new Vector(c);
    }
    const v1 = a.subtract(b);
    const v2 = c.subtract(b);
    const v1norm = v1.unit();
    const v2norm = v2.unit();
    const dotProducts = v1norm.dot(v2norm);
    const angle = Math.acos(dotProducts);
    return Vector.normalizeRadians(angle);
  }
}
const calcArms = (lm) => {
  let UpperArm = {
    r: Vector.findRotation(lm[11], lm[13]),
    l: Vector.findRotation(lm[12], lm[14])
  };
  UpperArm.r.y = Vector.angleBetween3DCoords(lm[12], lm[11], lm[13]);
  UpperArm.l.y = Vector.angleBetween3DCoords(lm[11], lm[12], lm[14]);
  let LowerArm = {
    r: Vector.findRotation(lm[13], lm[15]),
    l: Vector.findRotation(lm[14], lm[16])
  };
  LowerArm.r.y = Vector.angleBetween3DCoords(lm[11], lm[13], lm[15]);
  LowerArm.l.y = Vector.angleBetween3DCoords(lm[12], lm[14], lm[16]);
  LowerArm.r.z = clamp(LowerArm.r.z, -2.14, 0);
  LowerArm.l.z = clamp(LowerArm.l.z, -2.14, 0);
  let Hand = {
    r: Vector.findRotation(Vector.fromArray(lm[15]), Vector.lerp(Vector.fromArray(lm[17]), Vector.fromArray(lm[19]), 0.5)),
    l: Vector.findRotation(Vector.fromArray(lm[16]), Vector.lerp(Vector.fromArray(lm[18]), Vector.fromArray(lm[20]), 0.5))
  };
  let rightArmRig = rigArm(UpperArm.r, LowerArm.r, Hand.r, "Right");
  let leftArmRig = rigArm(UpperArm.l, LowerArm.l, Hand.l, "Left");
  return {
    UpperArm: {
      r: rightArmRig.UpperArm,
      l: leftArmRig.UpperArm
    },
    LowerArm: {
      r: rightArmRig.LowerArm,
      l: leftArmRig.LowerArm
    },
    Hand: {
      r: rightArmRig.Hand,
      l: leftArmRig.Hand
    },
    Unscaled: {
      UpperArm,
      LowerArm,
      Hand
    }
  };
};
const rigArm = (UpperArm, LowerArm, Hand, side = "right") => {
  const invert = side === "Right" ? 1 : -1;
  UpperArm.z *= -2.3 * invert;
  UpperArm.y *= Math.PI * invert;
  UpperArm.y -= Math.max(LowerArm.x);
  UpperArm.y -= -invert * Math.max(LowerArm.z, 0);
  UpperArm.x -= 0.3 * invert;
  LowerArm.z *= -2.14 * invert;
  LowerArm.y *= 2.14 * invert;
  LowerArm.x *= 2.14 * invert;
  UpperArm.x = clamp(UpperArm.x, -0.5, Math.PI);
  LowerArm.x = clamp(LowerArm.x, -0.3, 0.3);
  Hand.y = clamp(Hand.z * 2, -0.6, 0.6);
  Hand.z = Hand.z * -2.3 * invert;
  return {
    UpperArm,
    LowerArm,
    Hand
  };
};
const calcHips = (lm, lm2d) => {
  let hipLeft2d = Vector.fromArray(lm2d[23]);
  let hipRight2d = Vector.fromArray(lm2d[24]);
  let shoulderLeft2d = Vector.fromArray(lm2d[11]);
  let shoulderRight2d = Vector.fromArray(lm2d[12]);
  let hipCenter2d = hipLeft2d.lerp(hipRight2d);
  let shoulderCenter2d = shoulderLeft2d.lerp(shoulderRight2d);
  let spineLength = hipCenter2d.distance(shoulderCenter2d);
  let hips = {
    position: {
      x: clamp(-1 * (hipCenter2d.x - 0.65), -1, 1),
      y: 0,
      z: clamp(spineLength - 1, -2, 0)
    },
    rotation: null
  };
  hips.rotation = Vector.rollPitchYaw(lm[23], lm[24]);
  if (hips.rotation.y > 0.5) {
    hips.rotation.y -= 2;
  }
  hips.rotation.y += 0.5;
  if (hips.rotation.z > 0) {
    hips.rotation.z = 1 - hips.rotation.z;
  }
  if (hips.rotation.z < 0) {
    hips.rotation.z = -1 - hips.rotation.z;
  }
  let turnAroundAmountHips = remap(Math.abs(hips.rotation.y), 0.2, 0.4);
  hips.rotation.z *= 1 - turnAroundAmountHips;
  hips.rotation.x = 0;
  let spine = Vector.rollPitchYaw(lm[11], lm[12]);
  if (spine.y > 0.5) {
    spine.y -= 2;
  }
  spine.y += 0.5;
  if (spine.z > 0) {
    spine.z = 1 - spine.z;
  }
  if (spine.z < 0) {
    spine.z = -1 - spine.z;
  }
  let turnAroundAmount = remap(Math.abs(spine.y), 0.2, 0.4);
  spine.z *= 1 - turnAroundAmount;
  spine.x = 0;
  return rigHips(hips, spine);
};
const rigHips = (hips, spine) => {
  hips.rotation.x *= Math.PI;
  hips.rotation.y *= Math.PI;
  hips.rotation.z *= Math.PI;
  hips.worldPosition = {
    x: hips.position.x * (0.5 + 1.8 * -hips.position.z),
    y: 0,
    z: hips.position.z * (0.1 + hips.position.z * -2)
  };
  spine.x *= Math.PI;
  spine.y *= Math.PI;
  spine.z *= Math.PI;
  return {
    Hips: hips,
    Spine: spine
  };
};
const calcLegs = (lm) => {
  let UpperLeg = {
    r: Vector.findRotation(lm[23], lm[25]),
    l: Vector.findRotation(lm[24], lm[26])
  };
  UpperLeg.r.z = clamp(UpperLeg.r.z - 0.5, -0.5, 0);
  UpperLeg.r.y = 0;
  UpperLeg.l.z = clamp(UpperLeg.l.z - 0.5, -0.5, 0);
  UpperLeg.l.y = 0;
  let LowerLeg = {
    r: Vector.findRotation(lm[25], lm[27]),
    l: Vector.findRotation(lm[26], lm[28])
  };
  LowerLeg.r.x = Vector.angleBetween3DCoords(lm[23], lm[25], lm[27]);
  LowerLeg.r.y = 0;
  LowerLeg.r.z = 0;
  LowerLeg.l.x = Vector.angleBetween3DCoords(lm[24], lm[26], lm[28]);
  LowerLeg.l.y = 0;
  LowerLeg.l.z = 0;
  let rightLegRig = rigLeg(UpperLeg.r, LowerLeg.r, "Right");
  let leftLegRig = rigLeg(UpperLeg.l, LowerLeg.l, "Left");
  return {
    UpperLeg: {
      r: rightLegRig.UpperLeg,
      l: leftLegRig.UpperLeg
    },
    LowerLeg: {
      r: rightLegRig.LowerLeg,
      l: leftLegRig.LowerLeg
    },
    Unscaled: {
      UpperArm: UpperLeg,
      LowerLeg
    }
  };
};
const rigLeg = (upperLeg, lowerLeg, side = "right") => {
  let invert = side === "Right" ? 1 : -1;
  upperLeg.z = upperLeg.z * -2.3 * invert;
  upperLeg.x = clamp(upperLeg.z * 0.1 * invert, -0.5, Math.PI);
  lowerLeg.x = lowerLeg.x * -2.14 * 1.3;
  return {
    UpperLeg: upperLeg,
    LowerLeg: lowerLeg
  };
};
class PoseSolver {
  constructor() {
  }
  static solve(lm3d, lm2d, { runtime = "mediapipe", video = null, imageSize = null, enableLegs = true } = {}) {
    if (!lm3d && !lm2d) {
      console.error("Need both World Pose and Pose Landmarks");
      return;
    }
    if (video) {
      let videoEl = video;
      if (typeof video === "string") {
        videoEl = document.querySelector(video);
      }
      imageSize = {
        width: videoEl.videoWidth,
        height: videoEl.videoHeight
      };
    }
    if (runtime === "tfjs" && imageSize) {
      lm3d.forEach((e, i) => {
        e.visibility = e.score;
      });
      lm2d.forEach((e, i) => {
        e.x /= imageSize.width;
        e.y /= imageSize.height;
        e.z = 0;
        e.visibility = e.score;
      });
    }
    let Arms = calcArms(lm3d);
    let Hips = calcHips(lm3d, lm2d);
    let Legs = calcLegs(lm3d);
    let rightHandOffscreen = lm3d[15].y > -0.1 || lm3d[15].visibility < 0.23 || 0.995 < lm2d[15].y;
    let leftHandOffscreen = lm3d[16].y > -0.1 || lm3d[16].visibility < 0.23 || 0.995 < lm2d[16].y;
    let leftFootOffscreen = lm3d[23].visibility < 0.63 || Hips.Hips.position.z > -0.4;
    let rightFootOffscreen = lm3d[24].visibility < 0.63 || Hips.Hips.position.z > -0.4;
    Arms.UpperArm.l = Arms.UpperArm.l.multiply(leftHandOffscreen ? 0 : 1);
    Arms.UpperArm.l.z = leftHandOffscreen ? RestingDefault.Pose.LeftUpperArm.z : Arms.UpperArm.l.z;
    Arms.UpperArm.r = Arms.UpperArm.r.multiply(rightHandOffscreen ? 0 : 1);
    Arms.UpperArm.r.z = rightHandOffscreen ? RestingDefault.Pose.RightUpperArm.z : Arms.UpperArm.r.z;
    Arms.LowerArm.l = Arms.LowerArm.l.multiply(leftHandOffscreen ? 0 : 1);
    Arms.LowerArm.r = Arms.LowerArm.r.multiply(rightHandOffscreen ? 0 : 1);
    Arms.Hand.l = Arms.Hand.l.multiply(leftHandOffscreen ? 0 : 1);
    Arms.Hand.r = Arms.Hand.r.multiply(rightHandOffscreen ? 0 : 1);
    Legs.UpperLeg.l = Legs.UpperLeg.l.multiply(rightFootOffscreen ? 0 : 1);
    Legs.UpperLeg.r = Legs.UpperLeg.r.multiply(leftFootOffscreen ? 0 : 1);
    Legs.LowerLeg.l = Legs.LowerLeg.l.multiply(rightFootOffscreen ? 0 : 1);
    Legs.LowerLeg.r = Legs.LowerLeg.r.multiply(leftFootOffscreen ? 0 : 1);
    return {
      RightUpperArm: Arms.UpperArm.r,
      RightLowerArm: Arms.LowerArm.r,
      LeftUpperArm: Arms.UpperArm.l,
      LeftLowerArm: Arms.LowerArm.l,
      RightHand: Arms.Hand.r,
      LeftHand: Arms.Hand.l,
      RightUpperLeg: Legs.UpperLeg.r,
      RightLowerLeg: Legs.LowerLeg.r,
      LeftUpperLeg: Legs.UpperLeg.l,
      LeftLowerLeg: Legs.LowerLeg.l,
      Hips: Hips.Hips,
      Spine: Hips.Spine
    };
  }
}
__publicField(PoseSolver, "calcArms", calcArms);
__publicField(PoseSolver, "calcHips", calcHips);
__publicField(PoseSolver, "calcLegs", calcLegs);
class HandSolver {
  constructor() {
  }
  static solve(lm, side = "Right") {
    if (!lm) {
      console.error("Need Hand Landmarks");
      return;
    }
    let palm = [
      new Vector(lm[0]),
      new Vector(lm[side === "Right" ? 17 : 5]),
      new Vector(lm[side === "Right" ? 5 : 17])
    ];
    let handRotation = Vector.rollPitchYaw(palm[0], palm[1], palm[2]);
    handRotation.y = handRotation.z;
    handRotation.y -= side === "Left" ? 0.3 : 0.5;
    let hand = {};
    hand[side + "Wrist"] = { x: handRotation.x, y: handRotation.y, z: handRotation.z };
    hand[side + "RingProximal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[13], lm[14]) };
    hand[side + "RingIntermediate"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[13], lm[14], lm[15]) };
    hand[side + "RingDistal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[14], lm[15], lm[16]) };
    hand[side + "IndexProximal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[5], lm[6]) };
    hand[side + "IndexIntermediate"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[5], lm[6], lm[7]) };
    hand[side + "IndexDistal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[6], lm[7], lm[8]) };
    hand[side + "MiddleProximal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[9], lm[10]) };
    hand[side + "MiddleIntermediate"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[9], lm[10], lm[11]) };
    hand[side + "MiddleDistal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[10], lm[11], lm[12]) };
    hand[side + "ThumbProximal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[1], lm[2]) };
    hand[side + "ThumbIntermediate"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[1], lm[2], lm[3]) };
    hand[side + "ThumbDistal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[2], lm[3], lm[4]) };
    hand[side + "LittleProximal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[17], lm[18]) };
    hand[side + "LittleIntermediate"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[17], lm[18], lm[19]) };
    hand[side + "LittleDistal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[18], lm[19], lm[20]) };
    hand = rigFingers(hand, side);
    return hand;
  }
}
const rigFingers = (hand, side = "Right") => {
  const invert = side === "Right" ? 1 : -1;
  let digits = ["Ring", "Index", "Little", "Thumb", "Middle"];
  let segments = ["Proximal", "Intermediate", "Distal"];
  hand[side + "Wrist"].x = clamp(hand[side + "Wrist"].x * 2 * invert, -0.3, 0.3);
  hand[side + "Wrist"].y = clamp(hand[side + "Wrist"].y * 2.3, side === "Right" ? -1 : -0.6, side === "Right" ? 0.6 : 1);
  hand[side + "Wrist"].z = clamp(hand[side + "Wrist"].z * -2.3 * invert);
  digits.forEach((e) => {
    segments.forEach((j) => {
      let trackedFinger = hand[side + e + j];
      if (e === "Thumb") {
        let dampener = {
          x: j === "Proximal" ? 2.2 : j === "Intermediate" ? 0 : 0,
          y: j === "Proximal" ? 2.2 : j === "Intermediate" ? 0.7 : 1,
          z: j === "Proximal" ? 0.5 : j === "Intermediate" ? 0.5 : 0.5
        };
        let startPos = {
          x: j === "Proximal" ? 1.2 : j === "Distal" ? -0.2 : -0.2,
          y: j === "Proximal" ? 1.1 * invert : j === "Distal" ? 0.1 * invert : 0.1 * invert,
          z: j === "Proximal" ? 0.2 * invert : j === "Distal" ? 0.2 * invert : 0.2 * invert
        };
        let newThumb = { x: 0, y: 0, z: 0 };
        if (j === "Proximal") {
          newThumb.z = clamp(startPos.z + trackedFinger.z * -Math.PI * dampener.z * invert, side === "Right" ? -0.6 : -0.1, side === "Right" ? 0.1 : 0.6);
          newThumb.x = clamp(startPos.x + trackedFinger.z * -Math.PI * dampener.x, -0.6, 0.1);
          newThumb.y = clamp(startPos.y + trackedFinger.z * -Math.PI * dampener.y * invert, side === "Right" ? -1.6 : -0.1, side === "Right" ? 0.1 : 1.6);
        } else {
          newThumb.z = clamp(startPos.z + trackedFinger.z * -Math.PI * dampener.z * invert, -2, 2);
          newThumb.x = clamp(startPos.x + trackedFinger.z * -Math.PI * dampener.x, -2, 2);
          newThumb.y = clamp(startPos.y + trackedFinger.z * -Math.PI * dampener.y * invert, -2, 2);
        }
        trackedFinger.x = newThumb.x;
        trackedFinger.y = newThumb.y;
        trackedFinger.z = newThumb.z;
      } else {
        trackedFinger.z = clamp(trackedFinger.z * -Math.PI * invert, side === "Right" ? -2.3 : 0, side === "Right" ? 0 : 2.3);
      }
    });
  });
  return hand;
};
const createEulerPlane = (landmarks) => {
  let p1 = new Vector(landmarks[21]);
  let p2 = new Vector(landmarks[251]);
  let p3 = new Vector(landmarks[397]);
  let p4 = new Vector(landmarks[172]);
  let p3mid = p3.lerp(p4, 0.5);
  return {
    vector: [p1, p2, p3mid],
    points: [p1, p2, p3, p4]
  };
};
const headRotation = (plane) => {
  let rotate = Vector.rollPitchYaw(plane[0], plane[1], plane[2]);
  let midPoint = plane[0].lerp(plane[1], 0.5);
  let width = plane[0].distance(plane[1]);
  let height = midPoint.distance(plane[2]);
  rotate.x *= -1;
  rotate.z *= -1;
  return {
    y: rotate.y * Math.PI,
    x: rotate.x * Math.PI,
    z: rotate.z * Math.PI,
    width,
    height,
    position: midPoint.lerp(plane[2], 0.5),
    normalized: {
      y: rotate.y,
      x: rotate.x,
      z: rotate.z
    },
    degrees: {
      y: rotate.y * 180,
      x: rotate.x * 180,
      z: rotate.z * 180
    }
  };
};
const calcHead = (lm) => {
  const plane = createEulerPlane(lm);
  return headRotation(plane.vector);
};
const points = {
  eye: {
    left: [130, 133, 160, 159, 158, 144, 145, 153],
    right: [263, 362, 387, 386, 385, 373, 374, 380]
  },
  brow: {
    left: [35, 244, 63, 105, 66, 229, 230, 231],
    right: [265, 464, 293, 334, 296, 449, 450, 451]
  },
  pupil: {
    right: [468, 469, 470, 471, 472],
    left: [473, 474, 475, 476, 477]
  }
};
const getBrowRaise = (lm, side = "left") => {
  let browPoints = points.brow[side];
  let browDistance = eyeLidDistance(lm[browPoints[0]], lm[browPoints[1]], lm[browPoints[2]], lm[browPoints[3]], lm[browPoints[4]], lm[browPoints[5]], lm[browPoints[6]], lm[browPoints[7]]);
  let maxBrowRatio = 1.15;
  let browHigh = 0.125;
  let browLow = 0.07;
  let browRatio = browDistance / maxBrowRatio - 1;
  let browRaiseRatio = (clamp(browRatio, browLow, browHigh) - browLow) / (browHigh - browLow);
  return browRaiseRatio;
};
const getEyeOpen = (lm, side = "left") => {
  let eyePoints = points.eye[side];
  let eyeDistance = eyeLidDistance(lm[eyePoints[0]], lm[eyePoints[1]], lm[eyePoints[2]], lm[eyePoints[3]], lm[eyePoints[4]], lm[eyePoints[5]], lm[eyePoints[6]], lm[eyePoints[7]]);
  let maxRatio = 0.285;
  let high = 0.85;
  let low = 0.55;
  let ratio = clamp(eyeDistance / maxRatio, 0, 2);
  let eyeOpenRatio = remap(ratio, low, high);
  return { norm: eyeOpenRatio, raw: ratio };
};
const eyeLidDistance = (eyeOuterCorner, eyeInnerCorner, eyeOuterUpperLid, eyeMidUpperLid, eyeInnerUpperLid, eyeOuterLowerLid, eyeMidLowerLid, eyeInnerLowerLid) => {
  eyeOuterCorner = new Vector(eyeOuterCorner);
  eyeInnerCorner = new Vector(eyeInnerCorner);
  eyeOuterUpperLid = new Vector(eyeOuterUpperLid);
  eyeMidUpperLid = new Vector(eyeMidUpperLid);
  eyeInnerUpperLid = new Vector(eyeInnerUpperLid);
  eyeOuterLowerLid = new Vector(eyeOuterLowerLid);
  eyeMidLowerLid = new Vector(eyeMidLowerLid);
  eyeInnerLowerLid = new Vector(eyeInnerLowerLid);
  const eyeWidth = eyeOuterCorner.distance(eyeInnerCorner, 2);
  const eyeOuterLidDistance = eyeOuterUpperLid.distance(eyeOuterLowerLid, 2);
  const eyeMidLidDistance = eyeMidUpperLid.distance(eyeMidLowerLid, 2);
  const eyeInnerLidDistance = eyeInnerUpperLid.distance(eyeInnerLowerLid, 2);
  const eyeLidAvg = (eyeOuterLidDistance + eyeMidLidDistance + eyeInnerLidDistance) / 3;
  const ratio = eyeLidAvg / eyeWidth;
  return ratio;
};
const pupilPos = (lm, side = "left") => {
  const eyeOuterCorner = new Vector(lm[points.eye[side][0]]);
  const eyeInnerCorner = new Vector(lm[points.eye[side][1]]);
  const eyeWidth = eyeOuterCorner.distance(eyeInnerCorner, 2);
  const midPoint = eyeOuterCorner.lerp(eyeInnerCorner, 0.5);
  const pupil = new Vector(lm[points.pupil[side][0]]);
  const dx = midPoint.x - pupil.x;
  const dy = midPoint.y - eyeWidth * 0.075 - pupil.y;
  let ratioX = dx / (eyeWidth / 2);
  let ratioY = dy / (eyeWidth / 4);
  ratioX *= 4;
  ratioY *= 4;
  return { x: ratioX, y: ratioY };
};
const stabilizeBlink = (eye, headX, noWink = false, maxRot = 12) => {
  eye.r = clamp(eye.r, 0, 1);
  eye.l = clamp(eye.l, 0, 1);
  const blinkDiff = Math.abs(eye.l - eye.r);
  const blinkThresh = noWink ? 1.1 : 0.8;
  const isClosing = eye.l < 0.3 && eye.r < 0.3;
  const isOpen = eye.l > 0.6 && eye.r > 0.6;
  if (headX > maxRot) {
    return { l: eye.r, r: eye.r };
  }
  if (headX < -1 * maxRot) {
    return { l: eye.l, r: eye.l };
  }
  return {
    l: blinkDiff >= blinkThresh && !isClosing && !isOpen ? eye.l : eye.r > eye.l ? Vector.lerp(eye.r, eye.l, 0.95) : Vector.lerp(eye.r, eye.l, 0.05),
    r: blinkDiff >= blinkThresh && !isClosing && !isOpen ? eye.r : eye.r > eye.l ? Vector.lerp(eye.r, eye.l, 0.95) : Vector.lerp(eye.r, eye.l, 0.05)
  };
};
const calcEyes = (lm) => {
  if (lm.length <= 468) {
    return {
      l: 1,
      r: 1
    };
  }
  const leftEyeLid = getEyeOpen(lm, "left");
  const rightEyeLid = getEyeOpen(lm, "right");
  return {
    l: leftEyeLid.norm,
    r: rightEyeLid.norm
  };
};
const calcPupils = (lm) => {
  if (lm.length <= 468) {
    return { x: 0, y: 0 };
  } else {
    const pupilL = pupilPos(lm, "left");
    const pupilR = pupilPos(lm, "right");
    return {
      x: (pupilL.x + pupilR.x) * 0.5,
      y: (pupilL.y + pupilR.y) * 0.5
    };
  }
};
const calcBrow = (lm) => {
  if (lm.length <= 468) {
    return 0;
  } else {
    const leftBrow = getBrowRaise(lm, "left");
    const rightBrow = getBrowRaise(lm, "right");
    return (leftBrow + rightBrow) / 2;
  }
};
const mouthShape = (lm, rotX, runtime = "mediapipe") => {
  const eyeInnerCornerL = new Vector(lm[133]);
  const eyeInnerCornerR = new Vector(lm[362]);
  const eyeOuterCornerL = new Vector(lm[130]);
  const eyeOuterCornerR = new Vector(lm[263]);
  const eyeInnerDistance = eyeInnerCornerL.distance(eyeInnerCornerR);
  const eyeOuterDistance = eyeOuterCornerL.distance(eyeOuterCornerR);
  const upperInnerLip = new Vector(lm[13]);
  const lowerInnerLip = new Vector(lm[14]);
  const mouthCornerLeft = new Vector(lm[61]);
  const mouthCornerRight = new Vector(lm[291]);
  const mouthOpen = upperInnerLip.distance(lowerInnerLip);
  const mouthWidth = mouthCornerLeft.distance(mouthCornerRight);
  let ratioXY = mouthWidth / mouthOpen;
  let ratioY = mouthOpen / eyeInnerDistance;
  let ratioX = mouthWidth / eyeOuterDistance;
  ratioY = remap(ratioY, 0.17, 0.5);
  ratioX = remap(ratioX, 0.45, 0.9);
  ratioX = (ratioX - 0.3) * 2;
  const mouthY = ratioY;
  const fixFacemesh = runtime === "facemesh" ? 1.3 : 0;
  let ratioI = remap(ratioXY, 1.3 + fixFacemesh * 0.8, 2.6 + fixFacemesh) * remap(mouthY, 0.7, 1);
  let ratioA = mouthY * 0.2 + mouthY * (1 - ratioI) * 0.8;
  let ratioU = mouthY * remap(1 - ratioI, 0, 0.3) * 0.1;
  let ratioE = remap(ratioU, 0.2, 1) * (1 - ratioI) * 0.3;
  let ratioO = (1 - ratioI) * remap(mouthY, 0.5, 1) * 0.2;
  return {
    x: ratioX,
    y: ratioY,
    shape: {
      A: ratioA,
      E: ratioE,
      I: ratioI,
      O: ratioO,
      U: ratioU
    }
  };
};
const calcMouth = (lm, headX, type) => {
  return mouthShape(lm, headX, type);
};
class FaceSolver {
  constructor() {
    this.head = { x: 0, y: 0, z: 0 };
    this.mouth = { x: 0, y: 0 };
    this.eye = {
      l: 1,
      r: 1,
      indep: {
        l: 1,
        r: 1
      }
    };
    this.brow = 0;
    this.pupil = { x: 0, y: 0 };
  }
  static solve(lm, { runtime = "mediapipe", smoothBlink = true } = {}) {
    if (!lm) {
      console.error("Need Face Landmarks");
      return;
    }
    let getHead = calcHead(lm);
    let getEye = calcEyes(lm);
    if (smoothBlink) {
      getEye = stabilizeBlink(getEye, getHead.x);
    }
    let getPupils = calcPupils(lm);
    let getMouth = calcMouth(lm, getHead.x, runtime);
    let getBrow = calcBrow(lm, getHead.x);
    return {
      head: getHead,
      eye: getEye,
      brow: getBrow,
      pupil: getPupils,
      mouth: getMouth
    };
  }
}
__publicField(FaceSolver, "stabilizeBlink", stabilizeBlink);
export { FaceSolver as Face, HandSolver as Hand, PoseSolver as Pose, helpers as Utils, Vector };
