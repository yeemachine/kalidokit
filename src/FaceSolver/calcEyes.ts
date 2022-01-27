import Vector from "../utils/vector";
import { clamp, remap } from "../utils/helpers";
import { Results, XYZ, Side } from "../Types";
import { RIGHT, LEFT } from "./../constants";

/**
 * Landmark points labeled for eye, brow, and pupils
 */
const points = {
    eye: {
        [LEFT]: [130, 133, 160, 159, 158, 144, 145, 153],
        [RIGHT]: [263, 362, 387, 386, 385, 373, 374, 380],
    },
    brow: {
        [LEFT]: [35, 244, 63, 105, 66, 229, 230, 231],
        [RIGHT]: [265, 464, 293, 334, 296, 449, 450, 451],
    },
    pupil: {
        [LEFT]: [468, 469, 470, 471, 472],
        [RIGHT]: [473, 474, 475, 476, 477],
    },
};

/**
 * Calculate eye open ratios and remap to 0-1
 * @param {Array} lm : array of results from tfjs or mediapipe
 * @param {Side} side : designate left or right
 * @param {Number} high : ratio at which eye is considered open
 * @param {Number} low : ratio at which eye is comsidered closed
 */
export const getEyeOpen = (lm: Results, side: Side = LEFT, { high = 0.85, low = 0.55 } = {}) => {
    const eyePoints = points.eye[side];
    const eyeDistance = eyeLidRatio(
        lm[eyePoints[0]],
        lm[eyePoints[1]],
        lm[eyePoints[2]],
        lm[eyePoints[3]],
        lm[eyePoints[4]],
        lm[eyePoints[5]],
        lm[eyePoints[6]],
        lm[eyePoints[7]]
    );
    // human eye width to height ratio is roughly .3
    const maxRatio = 0.285;
    // compare ratio against max ratio
    const ratio = clamp(eyeDistance / maxRatio, 0, 2);
    // remap eye open and close ratios to increase sensitivity
    const eyeOpenRatio = remap(ratio, low, high);
    return {
        // remapped ratio
        norm: eyeOpenRatio,
        // ummapped ratio
        raw: ratio,
    };
};

/**
 * Calculate eyelid distance ratios based on landmarks on the face
 */
export const eyeLidRatio = (
    eyeOuterCorner: XYZ | Vector | number[],
    eyeInnerCorner: XYZ | Vector | number[],
    eyeOuterUpperLid: XYZ | Vector | number[],
    eyeMidUpperLid: XYZ | Vector | number[],
    eyeInnerUpperLid: XYZ | Vector | number[],
    eyeOuterLowerLid: XYZ | Vector | number[],
    eyeMidLowerLid: XYZ | Vector | number[],
    eyeInnerLowerLid: XYZ | Vector | number[]
) => {
    eyeOuterCorner = new Vector(eyeOuterCorner);
    eyeInnerCorner = new Vector(eyeInnerCorner);

    eyeOuterUpperLid = new Vector(eyeOuterUpperLid);
    eyeMidUpperLid = new Vector(eyeMidUpperLid);
    eyeInnerUpperLid = new Vector(eyeInnerUpperLid);

    eyeOuterLowerLid = new Vector(eyeOuterLowerLid);
    eyeMidLowerLid = new Vector(eyeMidLowerLid);
    eyeInnerLowerLid = new Vector(eyeInnerLowerLid);

    //use 2D Distances instead of 3D for less jitter
    const eyeWidth = (eyeOuterCorner as Vector).distance(eyeInnerCorner as Vector, 2);
    const eyeOuterLidDistance = (eyeOuterUpperLid as Vector).distance(eyeOuterLowerLid as Vector, 2);
    const eyeMidLidDistance = (eyeMidUpperLid as Vector).distance(eyeMidLowerLid as Vector, 2);
    const eyeInnerLidDistance = (eyeInnerUpperLid as Vector).distance(eyeInnerLowerLid as Vector, 2);
    const eyeLidAvg = (eyeOuterLidDistance + eyeMidLidDistance + eyeInnerLidDistance) / 3;
    const ratio = eyeLidAvg / eyeWidth;

    return ratio;
};

/**
 * Calculate pupil position [-1,1]
 * @param {Results} lm : array of results from tfjs or mediapipe
 * @param {Side} side : left or right
 */
export const pupilPos = (lm: Results, side: Side = LEFT) => {
    const eyeOuterCorner = new Vector(lm[points.eye[side][0]]);
    const eyeInnerCorner = new Vector(lm[points.eye[side][1]]);
    const eyeWidth = eyeOuterCorner.distance(eyeInnerCorner, 2);
    const midPoint = eyeOuterCorner.lerp(eyeInnerCorner, 0.5);
    const pupil = new Vector(lm[points.pupil[side][0]]);
    const dx = midPoint.x - pupil.x;
    //eye center y is slightly above midpoint
    const dy = midPoint.y - eyeWidth * 0.075 - pupil.y;
    let ratioX = dx / (eyeWidth / 2);
    let ratioY = dy / (eyeWidth / 4);

    ratioX *= 4;
    ratioY *= 4;

    return { x: ratioX, y: ratioY };
};

/**
 * Method to stabilize blink speeds to fix inconsistent eye open/close timing
 * @param {Object} eye : object with left and right eye values
 * @param {Number} headY : head y axis rotation in radians
 * @param {Object} options: Options for blink stabilization
 */
export const stabilizeBlink = (
    eye: Record<"r" | "l", number>,
    headY: number,
    {
        enableWink = true,
        maxRot = 0.5,
    }: {
        /**
         * Enable wink detection
         * @default true
         * @type {Boolean}
         */
        enableWink?: boolean;
        /**
         * Maximum rotation of head to trigger wink
         * @default 0.5
         * @type {Number}
         */
        maxRot?: number;
    } = {}
) => {
    eye.r = clamp(eye.r, 0, 1);
    eye.l = clamp(eye.l, 0, 1);
    //difference between each eye
    const blinkDiff = Math.abs(eye.l - eye.r);
    //theshold to which difference is considered a wink
    const blinkThresh = enableWink ? 0.8 : 1.2;
    //detect when both eyes are closing
    const isClosing = eye.l < 0.3 && eye.r < 0.3;
    //detect when both eyes are opening
    const isOpen = eye.l > 0.6 && eye.r > 0.6;

    // sets obstructed eye to the opposite eye value
    if (headY > maxRot) {
        return { l: eye.r, r: eye.r };
    }
    if (headY < -maxRot) {
        return { l: eye.l, r: eye.l };
    }

    // returns either a wink or averaged blink values
    return {
        l:
            blinkDiff >= blinkThresh && !isClosing && !isOpen
                ? eye.l
                : eye.r > eye.l
                ? Vector.lerp(eye.r, eye.l, 0.95)
                : Vector.lerp(eye.r, eye.l, 0.05),
        r:
            blinkDiff >= blinkThresh && !isClosing && !isOpen
                ? eye.r
                : eye.r > eye.l
                ? Vector.lerp(eye.r, eye.l, 0.95)
                : Vector.lerp(eye.r, eye.l, 0.05),
    };
};

/**
 * Calculate Eyes
 * @param {Array} lm : array of results from tfjs or mediapipe
 */
export const calcEyes = (
    lm: Results,
    {
        high = 0.85,
        low = 0.55,
    }: {
        /**
         * Upper bound for eye open ratio
         * @default 0.85
         * @type {Number}
         */
        high?: number;
        /**
         * Lower bound for eye open ratio
         * @default 0.55
         * @type {Number}
         **/
        low?: number;
    } = {}
) => {
    //return early if no iris tracking
    if (lm.length !== 478) {
        return {
            l: 1,
            r: 1,
        };
    }
    //open [0,1]
    const leftEyeLid = getEyeOpen(lm, LEFT, { high: high, low: low });
    const rightEyeLid = getEyeOpen(lm, RIGHT, { high: high, low: low });

    return {
        l: leftEyeLid.norm || 0,
        r: rightEyeLid.norm || 0,
    };
};

/**
 * Calculate pupil location normalized to eye bounds
 * @param {Array} lm : array of results from tfjs or mediapipe
 */
export const calcPupils = (lm: Results) => {
    //pupil x:[-1,1],y:[-1,1]
    if (lm.length !== 478) {
        return { x: 0, y: 0 };
    } else {
        //track pupils using left eye
        const pupilL = pupilPos(lm, LEFT);
        const pupilR = pupilPos(lm, RIGHT);

        return {
            x: (pupilL.x + pupilR.x) * 0.5 || 0,
            y: (pupilL.y + pupilR.y) * 0.5 || 0,
        };
    }
};

/**
 * Calculate brow raise
 * @param {Results} lm : array of results from tfjs or mediapipe
 * @param {Side} side : designate left or right
 */
export const getBrowRaise = (lm: Results, side: Side = LEFT) => {
    const browPoints = points.brow[side];
    const browDistance = eyeLidRatio(
        lm[browPoints[0]],
        lm[browPoints[1]],
        lm[browPoints[2]],
        lm[browPoints[3]],
        lm[browPoints[4]],
        lm[browPoints[5]],
        lm[browPoints[6]],
        lm[browPoints[7]]
    );

    const maxBrowRatio = 1.15;
    const browHigh = 0.125;
    const browLow = 0.07;
    const browRatio = browDistance / maxBrowRatio - 1;
    const browRaiseRatio = (clamp(browRatio, browLow, browHigh) - browLow) / (browHigh - browLow);
    return browRaiseRatio;
};

/**
 * Take the average of left and right eyebrow raise values
 * @param {Array} lm : array of results from tfjs or mediapipe
 */
export const calcBrow = (lm: Results) => {
    if (lm.length !== 478) {
        return 0;
    } else {
        const leftBrow = getBrowRaise(lm, LEFT);
        const rightBrow = getBrowRaise(lm, RIGHT);
        return (leftBrow + rightBrow) / 2 || 0;
    }
};
