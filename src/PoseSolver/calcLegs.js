import Vector from "../utils/vector.js";
import { clamp } from "../utils/helpers.js";

//WIP, only usable at a specific angle
//Design Pattern: Find pure rotation calculations first, then modify rotations based on the 2 arm segments

export const calcLegs = (lm) => {
    // LEGS WIP //
    let UpperLeg = {
        r: Vector.findRotation(lm[23], lm[25]),
        l: Vector.findRotation(lm[24], lm[26]),
    };
    //recenter
    UpperLeg.r.z = clamp(UpperLeg.r.z - 0.5, -0.5, 0);
    UpperLeg.r.y = 0; //Y Axis is not correct
    UpperLeg.l.z = clamp(UpperLeg.l.z - 0.5, -0.5, 0);
    UpperLeg.l.y = 0; //Y Axis is not correct

    let LowerLeg = {
        r: Vector.findRotation(lm[25], lm[27]),
        l: Vector.findRotation(lm[26], lm[28]),
    };
    LowerLeg.r.x = Vector.angleBetween3DCoords(lm[23], lm[25], lm[27]);
    LowerLeg.r.y = 0; // Y Axis not correct
    LowerLeg.r.z = 0; // Z Axis not correct
    LowerLeg.l.x = Vector.angleBetween3DCoords(lm[24], lm[26], lm[28]);
    LowerLeg.l.y = 0; // Y Axis not correct
    LowerLeg.l.z = 0; // Z Axis not correct

    //Modify Rotations slightly for more natural movement
    let rightLegRig = rigLeg(UpperLeg.r, LowerLeg.r, "Right");
    let leftLegRig = rigLeg(UpperLeg.l, LowerLeg.l, "Left");

    return {
        //Scaled
        UpperLeg: {
            r: rightLegRig.UpperLeg,
            l: leftLegRig.UpperLeg,
        },
        LowerLeg: {
            r: rightLegRig.LowerLeg,
            l: leftLegRig.LowerLeg,
        },
        //Unscaled
        Unscaled: {
            UpperArm: UpperLeg,
            LowerLeg: LowerLeg,
        },
    };
};

export const rigLeg = (upperLeg, lowerLeg, side = "right") => {
    let invert = side === "Right" ? 1 : -1;
    upperLeg.z = upperLeg.z * -2.3 * invert;
    upperLeg.x = clamp(upperLeg.z * 0.1 * invert, -0.5, Math.PI);
    lowerLeg.x = lowerLeg.x * -2.14 * 1.3;
    return {
        UpperLeg: upperLeg,
        LowerLeg: lowerLeg,
    };
};
