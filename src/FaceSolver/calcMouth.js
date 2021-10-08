import Vector from "../utils/vector.js";
import { remap } from "../utils/helpers.js";

export const mouthShape = (lm, rotX, runtime = "mediapipe") => {
    // eye keypoints
    const eyeInnerCornerL = new Vector(lm[133]);
    const eyeInnerCornerR = new Vector(lm[362]);
    const eyeOuterCornerL = new Vector(lm[130]);
    const eyeOuterCornerR = new Vector(lm[263]);

    // eye keypoint distances
    const eyeInnerDistance = eyeInnerCornerL.distance(eyeInnerCornerR);
    const eyeOuterDistance = eyeOuterCornerL.distance(eyeOuterCornerR);

    // mouth keypoints
    const upperInnerLip = new Vector(lm[13]);
    const lowerInnerLip = new Vector(lm[14]);
    const mouthCornerLeft = new Vector(lm[61]);
    const mouthCornerRight = new Vector(lm[291]);

    // mouth keypoint distances
    const mouthOpen = upperInnerLip.distance(lowerInnerLip);
    const mouthWidth = mouthCornerLeft.distance(mouthCornerRight);

    // mouth open and mouth shape ratios
    let ratioXY = mouthWidth / mouthOpen;
    let ratioY = mouthOpen / eyeInnerDistance;
    let ratioX = mouthWidth / eyeOuterDistance;

    // normalize and scale mouth open
    ratioY = remap(ratioY, 0.17, 0.5);

    // normalize and scale mouth shape
    ratioX = remap(ratioX, 0.45, 0.9);
    ratioX = (ratioX - 0.3) * 2;

    const mouthX = remap(ratioX - 0.4, 0, 0.5);
    const mouthY = ratioY;

    //Change sensitivity due to facemesh and holistic have different point outputs.
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
            U: ratioU,
        },
    };
};

export const calcMouth = (lm, headX, type) => {
    return mouthShape(lm, headX, type);
};
