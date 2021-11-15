import Vector from "./utils/vector";

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

export type XYZ = Record<"x" | "y" | "z", number>;

export type LR<T = Vector> = Record<"l" | "r", T>;

export interface IHips {
    position: Record<"x" | "y" | "z", number>;
    rotation?: Vector;
    worldPosition?: Record<"x" | "y" | "z", number>;
}

export type TPose = {
    RightUpperArm: Vector;
    RightLowerArm: Vector;
    LeftUpperArm: Vector;
    LeftLowerArm: Vector;
    RightHand: Vector;
    LeftHand: Vector;
    RightUpperLeg: Vector | XYZ;
    RightLowerLeg: Vector | XYZ;
    LeftUpperLeg: Vector | XYZ;
    LeftLowerLeg: Vector | XYZ;
    Hips: IHips;
    Spine: Vector | XYZ;
};

export type HandKeys<S extends "Right" | "Left"> = `${S}${
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
export type THand<S extends "Right" | "Left"> = Record<HandKeys<S>, XYZ>;
export type THandUnsafe<S extends "Right" | "Left"> = Record<HandKeys<S> | string, XYZ>;

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
