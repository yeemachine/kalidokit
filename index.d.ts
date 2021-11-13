declare module "kalidokit" {
    type XYZ = Record<"x" | "y" | "z", number>;
  
    /** Vector Math class. */
    export class Vector {
      static negative(a: Vector, b: Vector): Vector;
      static add(a: Vector, b: Vector | number, c: Vector): Vector;
      static subtract(a: Vector, b: Vector | number, c: Vector): Vector;
      static multiply(a: Vector, b: Vector | number, c: Vector): Vector;
      static divide(a: Vector, b: Vector | number, c: Vector): Vector;
      static cross(a: Vector, b: Vector | number, c: Vector): Vector;
      static unit(a: Vector, b: Vector): Vector;
      static fromAngles(theta: number, phi: number): Vector;
      static randomDirection(): Vector;
      static min(a: Vector | XYZ, b: Vector | XYZ): Vector;
      static max(a: Vector | XYZ, b: Vector | XYZ): Vector;
      static lerp(a: Vector, b: Vector, fraction: number): Vector;
      static lerp(a: number, b: number, fraction: number): number;
      static fromArray(a: XYZ | [number, number, number]): Vector;
      static angleBetween(a: Vector, b: Vector): number;
      static angleBetweenVertices(a: Vector, b: Vector | number, c: Vector): void;
      static distance(a: Vector, b: Vector, d: Vector): number;
      static toDegrees(a: number): number;
      static normalizeAngle(radians: number): number;
      static normalizeRadians(radians: number): number;
      static find2DAngle(cx: number, cy: number, ex: number, ey: number): number;
      static findRotation(a: Vector, b: Vector, normalize?: boolean): Vector;
      static rollPitchYaw(a: Vector, b: Vector, c: Vector): Vector;
      static angleBetween3DCoords(
        a: Vector | number,
        b: Vector | number,
        c: Vector | number
      ): number;
      constructor(a: Vector | number[] | XYZ | number, b: number, c: number);
      x: number;
      y: number;
      z: number;
      negative(): Vector;
      add(v: Vector | number): Vector;
      subtract(v: Vector | number): Vector;
      multiply(v: Vector | number): Vector;
      divide(v: Vector | number): Vector;
      equals(v: Vector): boolean;
      dot(v: Vector): number;
      cross(v: Vector): Vector;
      length(): number;
      distance(v: Vector, d?: number): number;
      lerp(v: Vector, fraction: number): Vector;
      unit(): Vector;
      min(): number;
      max(): number;
      toAngles(): {
        theta: number;
        phi: number;
      };
      angleTo(a: Vector): number;
      toArray(n: any): number[];
      clone(): Vector;
      init(x: number, y: number, z: number): Vector;
    }
  
    /** Class representing pose solver. */
    export class Pose {
      /** expose arm rotation calculator as a static method */
      static calcArms: (lm: any[]) => {
        UpperArm: {
          r: Vector;
          l: Vector;
        };
        LowerArm: {
          r: Vector;
          l: Vector;
        };
        Hand: {
          r: Vector;
          l: Vector;
        };
        Unscaled: {
          UpperArm: {
            r: Vector;
            l: Vector;
          };
          LowerArm: {
            r: Vector;
            l: Vector;
          };
          Hand: {
            r: Vector;
            l: Vector;
          };
        };
      };
      /** expose hips position and rotation calculator as a static method */
      static calcHips: (
        lm3d: any[],
        lm2d: any[]
      ) => {
        Hips: any;
        Spine: any;
      };
      /** expose leg rotation calculator as a static method */
      static calcLegs: (lm: any[]) => {
        UpperLeg: {
          r: Vector;
          l: Vector;
        };
        LowerLeg: {
          r: Vector;
          l: Vector;
        };
        Unscaled: {
          UpperArm: {
            r: Vector;
            l: Vector;
          };
          LowerLeg: {
            r: Vector;
            l: Vector;
          };
        };
      };
  
      /**
       * Combines arm, hips, and leg calcs into one method
       * @param {Array} lm3d : array of 3D pose vectors from tfjs or mediapipe
       * @param {Array} lm2d : array of 2D pose vectors from tfjs or mediapipe
       * @param {String} runtime: set as either "tfjs" or "mediapipe"
       * @param {HTMLVideoElement} video : video element or video selector string
       * @param {Object} imageSize: manually set hight and width of prediction
       * @param {Boolean} enableLegs: toggle calculation of legs
       */
      static solve(
        lm3d: any[],
        lm2d: any[],
        {
          runtime,
          video,
          imageSize,
          enableLegs,
        }?: {
          runtime?: string;
          video?: HTMLVideoElement | null;
          imageSize?: {
            width: number;
            height: number;
          };
          enableLegs?: boolean;
        }
      ): {
        RightUpperArm: Vector;
        RightLowerArm: Vector;
        LeftUpperArm: Vector;
        LeftLowerArm: Vector;
        RightHand: Vector;
        LeftHand: Vector;
        RightUpperLeg: Vector;
        RightLowerLeg: Vector;
        LeftUpperLeg: Vector;
        LeftLowerLeg: Vector;
        Hips: any;
        Spine: any;
      };
    }
  
    /** Class representing hand solver. */
    export class Hand {
      /**
       * Calculates finger and wrist as euler rotations
       * @param {Array} lm : array of 3D hand vectors from tfjs or mediapipe
       * @param {String} side: "Left" or "Right"
       */
      static solve(lm: any[], side?: string): {};
    }
  
    /** Class representing face solver. */
    export class Face {
      /** expose blink stabilizer as a static method */
      static stabilizeBlink: (
        eye: any,
        headY: number,
        {
          enableWink,
          maxRot,
        }?: {
          enableWink?: boolean;
          maxRot?: number;
        }
      ) => {
        l: any;
        r: any;
      };
      /**
       * Combines head, eye, pupil, and eyebrow calcs into one method
       * @param {Array} lm : array of results from tfjs or mediapipe
       * @param {String} runtime: set as either "tfjs" or "mediapipe"
       * @param {HTMLVideoElement} video : video element or video selector string
       * @param {Object} imageSize: manually set hight and width of prediction
       * @param {Boolean} smoothBlink: toggle smooth blink
       * @param {Array} blinkSettings: remaps high and low values to 0 to 1
       */
      static solve(
        lm: any[],
        {
          runtime,
          video,
          imageSize,
          smoothBlink,
          blinkSettings,
        }?: {
          runtime?: string;
          video?: HTMLVideoElement | null;
          imageSize?: {
            width: number;
            height: number;
          };
          smoothBlink?: boolean;
          blinkSettings?: number[];
        }
      ): {
        head: {
          y: number;
          x: number;
          z: number;
          width: any;
          height: any;
          position: any;
          normalized: XYZ;
          degrees: XYZ;
        };
        eye: {
          l: number;
          r: number;
        };
        brow: number;
        pupil: {
          x: number;
          y: number;
        };
        mouth: {
          x: number;
          y: number;
          shape: {
            A: number;
            E: number;
            I: any;
            O: number;
            U: number;
          };
        };
      };
    }
  
    export namespace Utils {
      export function clamp(val: number, min: number, max: number): number;
      export function remap(val: number, min: number, max: number): number;
  
      /** A set of default pose values to serve as "rest" values */
      export const RestingDefault: {
        Face: {
          eye: {
            l: number;
            r: number;
          };
          mouth: {
            x: number;
            y: number;
            shape: {
              A: number;
              E: number;
              I: number;
              O: number;
              U: number;
            };
          };
          head: {
            x: number;
            y: number;
            z: number;
            width: number;
            height: number;
            position: XYZ;
          };
          brow: number;
          pupil: {
            x: number;
            y: number;
          };
        };
        Pose: {
          RightUpperArm: XYZ;
          LeftUpperArm: XYZ; 
          RightLowerArm: XYZ;
          LeftLowerArm: XYZ; 
          LeftUpperLeg: XYZ;
          RightUpperLeg: XYZ;
          RightLowerLeg: XYZ;
          LeftLowerLeg: XYZ;
          LeftHand: XYZ;
          RightHand: XYZ;
          Spine: XYZ;
          Hips: {
            position: XYZ;
            rotation: XYZ;
          };
        };
        RightHand: {
          RightWrist: XYZ;
          RightRingProximal: XYZ;
          RightRingIntermediate: {
            x: number;
            y: number;
            z: number;
          };
          RightRingDistal: XYZ;
          RightIndexProximal: XYZ;
          RightIndexIntermediate: XYZ;
          RightIndexDistal: XYZ;
          RightMiddleProximal: XYZ;
          RightMiddleIntermediate: XYZ;
          RightMiddleDistal: XYZ;
          RightThumbProximal: XYZ;
          RightThumbIntermediate: XYZ;
          RightThumbDistal: XYZ;
          RightLittleProximal: XYZ;
          RightLittleIntermediate: XYZ;
          RightLittleDistal: XYZ;
        };
        LeftHand: {
          LeftWrist: XYZ;
          LeftRingProximal: XYZ;
          LeftRingIntermediate: XYZ;
          LeftRingDistal: XYZ;
          LeftIndexProximal: XYZ;
          LeftIndexIntermediate: XYZ;
          LeftIndexDistal: XYZ;
          LeftMiddleProximal: XYZ;
          LeftMiddleIntermediate: XYZ;
          LeftMiddleDistal: XYZ;
          LeftThumbProximal: XYZ;
          LeftThumbIntermediate: XYZ;
          LeftThumbDistal: XYZ;
          LeftLittleProximal: XYZ;
          LeftLittleIntermediate: XYZ;
          LeftLittleDistal: XYZ;
        };
      };
    }
  }
  