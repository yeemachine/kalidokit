import Vector from "../utils/vector.js";
import { clamp, remap } from "../utils/helpers.js";

const points = {
    eye: {
        left: [130, 133, 160, 159, 158, 144, 145, 153],
        right: [263, 362, 387, 386, 385, 373, 374, 380],
    },
    brow: {
        left: [35, 244, 63, 105, 66, 229, 230, 231],
        right: [265, 464, 293, 334, 296, 449, 450, 451],
    },
    pupil: {
        right: [468, 469, 470, 471, 472],
        left: [473, 474, 475, 476, 477],
    },
};

export const getBrowRaise = (lm, side = "left") => {
    let browPoints = points.brow[side];
    let browDistance = eyeLidDistance(
        lm[browPoints[0]],
        lm[browPoints[1]],
        lm[browPoints[2]],
        lm[browPoints[3]],
        lm[browPoints[4]],
        lm[browPoints[5]],
        lm[browPoints[6]],
        lm[browPoints[7]]
    );

    let maxBrowRatio = 1.15;
    let browHigh = 0.125;
    let browLow = 0.07;
    let browRatio = browDistance / maxBrowRatio - 1;
    let browRaiseRatio = (clamp(browRatio, browLow, browHigh) - browLow) / (browHigh - browLow);
    // console.log(browDistance)
    return browRaiseRatio;
};

export const getEyeOpen = (lm, side = "left") => {
    let eyePoints = points.eye[side];
    let eyeDistance = eyeLidDistance(
        lm[eyePoints[0]],
        lm[eyePoints[1]],
        lm[eyePoints[2]],
        lm[eyePoints[3]],
        lm[eyePoints[4]],
        lm[eyePoints[5]],
        lm[eyePoints[6]],
        lm[eyePoints[7]]
    );

    let maxRatio = 0.285; //target .3
    let high = 0.85;
    let low = 0.55;
    let ratio = clamp(eyeDistance / maxRatio, 0, 2);
    // let eyeOpenRatio = (clamp(ratio, low, high) - low) / (high-low); //try to normalize for 0 to 1;
    let eyeOpenRatio = remap(ratio, low, high); //try to normalize for 0 to 1;

    return { norm: eyeOpenRatio, raw: ratio };
};

export const eyeLidDistance = (
    eyeOuterCorner,
    eyeInnerCorner,
    eyeOuterUpperLid,
    eyeMidUpperLid,
    eyeInnerUpperLid,
    eyeOuterLowerLid,
    eyeMidLowerLid,
    eyeInnerLowerLid
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
    const eyeWidth = eyeOuterCorner.distance(eyeInnerCorner, 2);
    const eyeOuterLidDistance = eyeOuterUpperLid.distance(eyeOuterLowerLid, 2);
    const eyeMidLidDistance = eyeMidUpperLid.distance(eyeMidLowerLid, 2);
    const eyeInnerLidDistance = eyeInnerUpperLid.distance(eyeInnerLowerLid, 2);
    const eyeLidAvg = (eyeOuterLidDistance + eyeMidLidDistance + eyeInnerLidDistance) / 3;
    const ratio = eyeLidAvg / eyeWidth;

    return ratio;
};

export const pupilPos = (lm, side = "left") => {
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

export const stabilizeBlink = (eye, headY, noWink = false, maxRot = 0.5) => {
    eye.r = clamp(eye.r, 0, 1);
    eye.l = clamp(eye.l, 0, 1);
    const blinkDiff = Math.abs(eye.l - eye.r);
    const blinkThresh = noWink ? 1.1 : 0.8;
    const isClosing = eye.l < 0.3 && eye.r < 0.3;
    const isOpen = eye.l > 0.6 && eye.r > 0.6;
    if (headY > maxRot) {
        return { l: eye.r, r: eye.r };
    }
    if (headY < -maxRot) {
        return { l: eye.l, r: eye.l };
    }
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

export const calcEyes = (lm) => {
    //return early if no iris tracking
    if (lm.length <= 468) {
        return {
            l: 1,
            r: 1,
        };
    }
    //open [0,1]
    const leftEyeLid = getEyeOpen(lm, "left");
    const rightEyeLid = getEyeOpen(lm, "right");

    //brow [0,1] Base brow from eye open amount
    // let brow = clamp(
    //   (Vector.lerp(leftEyeLid.raw, rightEyeLid.raw, 0.5) - 1.3) / 0.1,
    //   0,
    //   1
    // );

    return {
        l: leftEyeLid.norm,
        r: rightEyeLid.norm,
    };
};

export const calcPupils = (lm) => {
    //pupil x:[-1,1],y:[-1,1]
    if (lm.length <= 468) {
        return { x: 0, y: 0 };
    } else {
        //track pupils using left eye
        const pupilL = pupilPos(lm, "left");
        const pupilR = pupilPos(lm, "right");

        return {
            x: (pupilL.x + pupilR.x) * 0.5,
            y: (pupilL.y + pupilR.y) * 0.5,
        };
    }
};

export const calcBrow = (lm) => {
    //pupil x:[-1,1],y:[-1,1]
    if (lm.length <= 468) {
        return 0;
    } else {
        const leftBrow = getBrowRaise(lm, "left");
        const rightBrow = getBrowRaise(lm, "right");
        return (leftBrow + rightBrow) / 2;
    }
};
