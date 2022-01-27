import Vector from "../utils/vector";
import { clamp, remap } from "../utils/helpers";
import { IHips, XYZ, TFVectorPose } from "../Types";
import { PI } from "./../constants";

/**
 * Calculates Hip rotation and world position
 * @param {Array} lm3d : array of 3D pose vectors from tfjs or mediapipe
 * @param {Array} lm2d : array of 2D pose vectors from tfjs or mediapipe
 */
export const calcHips = (lm3d: TFVectorPose, lm2d: Omit<TFVectorPose, "z">) => {
    //Find 2D normalized Hip and Shoulder Joint Positions/Distances
    const hipLeft2d = Vector.fromArray(lm2d[23]);
    const hipRight2d = Vector.fromArray(lm2d[24]);
    const shoulderLeft2d = Vector.fromArray(lm2d[11]);
    const shoulderRight2d = Vector.fromArray(lm2d[12]);
    const hipCenter2d = hipLeft2d.lerp(hipRight2d, 1);
    const shoulderCenter2d = shoulderLeft2d.lerp(shoulderRight2d, 1);
    const spineLength = hipCenter2d.distance(shoulderCenter2d);

    const hips: IHips = {
        position: {
            x: clamp(-1 * (hipCenter2d.x - 0.65), -1, 1), //subtract .65 to bring closer to 0,0 center
            y: 0,
            z: clamp(spineLength - 1, -2, 0),
        },
    };
    hips.rotation = Vector.rollPitchYaw(lm3d[23], lm3d[24]);
    //fix -PI, PI jumping
    if (hips.rotation.y > 0.5) {
        hips.rotation.y -= 2;
    }
    hips.rotation.y += 0.5;
    //Stop jumping between left and right shoulder tilt
    if (hips.rotation.z > 0) {
        hips.rotation.z = 1 - hips.rotation.z;
    }
    if (hips.rotation.z < 0) {
        hips.rotation.z = -1 - hips.rotation.z;
    }
    const turnAroundAmountHips = remap(Math.abs(hips.rotation.y), 0.2, 0.4);
    hips.rotation.z *= 1 - turnAroundAmountHips;
    hips.rotation.x = 0; //temp fix for inaccurate X axis

    const spine = Vector.rollPitchYaw(lm3d[11], lm3d[12]);
    //fix -PI, PI jumping
    if (spine.y > 0.5) {
        spine.y -= 2;
    }
    spine.y += 0.5;
    //Stop jumping between left and right shoulder tilt
    if (spine.z > 0) {
        spine.z = 1 - spine.z;
    }
    if (spine.z < 0) {
        spine.z = -1 - spine.z;
    }
    //fix weird large numbers when 2 shoulder points get too close
    const turnAroundAmount = remap(Math.abs(spine.y), 0.2, 0.4);
    spine.z *= 1 - turnAroundAmount;
    spine.x = 0; //temp fix for inaccurate X axis

    return rigHips(hips, spine);
};

/**
 * Converts normalized rotations to radians and estimates world position of hips
 * @param {Object} hips : hip position and rotation values
 * @param {Object} spine : spine position and rotation values
 */
export const rigHips = (hips: IHips, spine: Vector | XYZ) => {
    //convert normalized values to radians
    if (hips.rotation) {
        hips.rotation.x *= Math.PI;
        hips.rotation.y *= Math.PI;
        hips.rotation.z *= Math.PI;
    }

    hips.worldPosition = {
        x: hips.position.x * (0.5 + 1.8 * -hips.position.z),
        y: 0,
        z: hips.position.z * (0.1 + hips.position.z * -2),
    };

    spine.x *= PI;
    spine.y *= PI;
    spine.z *= PI;

    return {
        Hips: hips,
        Spine: spine as XYZ,
    };
};
