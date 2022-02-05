import Vector from "./utils/vector";
import Euler from "./utils/euler";
import { RIGHT, LEFT } from "./constants";
export interface ISolveOptions {
    /**
     * Runtime for the solver.
     * @default "mediapipe"
     * @type {"tfjs" | "mediapipe"}
     */
    runtime: "tfjs" | "mediapipe";
    /**
     * HTML Video element or selector for the video element.
     * @type {HTMLElement | string}
     */
    video: null | HTMLVideoElement | string;
    /**
     * Set Manual Size
     * @type {{ width: number, height: number }}
     * @default null
     */
    imageSize: null | { width: number; height: number };
}

export interface IFaceSolveOptions extends ISolveOptions {
    /**
     * Smooth Blink Toggle
     * @type {boolean}
     * @default false
     */
    smoothBlink: boolean;
    /**
     * Blink settings
     */
    blinkSettings: Array<number>;
}

export interface IPoseSolveOptions extends ISolveOptions {
    /**
     * Toggle Calculation of legs
     * @type {boolean}
     * @default true
     */
    enableLegs: boolean;
}

/**
 * The left or the right side
 */
export type Side = typeof RIGHT | typeof LEFT;

export type XYZ = Record<"x" | "y" | "z", number>;

export type LR<T = Vector> = Record<"l" | "r", T>;
export type RotationOrder = "XYZ" | "YZX" | "ZXY" | "XZY" | "YXZ" | "ZYX";

export type EulerRotation = XYZ & { rotationOrder?: RotationOrder };

export type AxisMap = Record<"x" | "y" | "z", "x" | "y" | "z">;

export interface IHips {
    position: XYZ;
    rotation?: Vector;
    worldPosition?: XYZ;
}

export type TPose = {
    RightUpperArm: Euler;
    RightLowerArm: Euler;
    LeftUpperArm: Euler;
    LeftLowerArm: Euler;
    RightHand: Vector;
    LeftHand: Vector;
    RightUpperLeg: Euler | XYZ;
    RightLowerLeg: Euler | XYZ;
    LeftUpperLeg: Euler | XYZ;
    LeftLowerLeg: Euler | XYZ;
    Hips: IHips;
    Spine: Vector | XYZ;
};

export type HandKeys<S extends Side> = `${S}${
    | "Wrist"
    | "RingProximal"
    | "RingIntermediate"
    | "RingDistal"
    | "IndexProximal"
    | "IndexIntermediate"
    | "IndexDistal"
    | "MiddleProximal"
    | "MiddleIntermediate"
    | "MiddleDistal"
    | "ThumbProximal"
    | "ThumbIntermediate"
    | "ThumbDistal"
    | "LittleProximal"
    | "LittleIntermediate"
    | "LittleDistal"}`;
export type THand<S extends Side> = Record<HandKeys<S>, XYZ>;
export type THandUnsafe<S extends Side> = Record<HandKeys<S> | string, XYZ>;

export type TFace = {
    head: {
        x: number;
        y: number;
        z: number;
        width: number;
        height: number;
        position: Vector | XYZ;
        normalized: Vector | XYZ;
        degrees: Vector | XYZ;
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
            I: number;
            O: number;
            U: number;
        };
    };
};

/**
 * TFJS 3D Pose Vector Type
 */
export type TFVectorPose = Array<{
    x: number;
    y: number;
    z: number;
    score?: number;
    visibility?: number;
}>;

/**
 * Array of results from TFJS or MediaPipe
 */
export type Results = Array<XYZ>;
