import { Results } from "../Types";
import Vector from "../utils/vector";
import { PI } from "./../constants";

/**
 * Calculate stable plane (triangle) from 4 face landmarks
 * @param {Array} lm : array of results from tfjs or mediapipe
 */
export const createEulerPlane = (lm: Results) => {
    //create face detection square bounds
    const p1 = new Vector(lm[21]); //top left
    const p2 = new Vector(lm[251]); //top right
    const p3 = new Vector(lm[397]); //bottom right
    const p4 = new Vector(lm[172]); //bottom left
    const p3mid = p3.lerp(p4, 0.5); // bottom midpoint
    return {
        vector: [p1, p2, p3mid],
        points: [p1, p2, p3, p4],
    };
};

/**
 * Calculate roll, pitch, yaw, centerpoint, and rough dimentions of face plane
 * @param {Array} lm : array of results from tfjs or mediapipe
 */
export const calcHead = (lm: Results) => {
    // find 3 vectors that form a plane to represent the head
    const plane = createEulerPlane(lm).vector;
    // calculate roll pitch and yaw from vectors
    const rotate = Vector.rollPitchYaw(plane[0], plane[1], plane[2]);
    // find the center of the face detection box
    const midPoint = plane[0].lerp(plane[1], 0.5);
    // find the dimensions roughly of the face detection box
    const width = plane[0].distance(plane[1]);
    const height = midPoint.distance(plane[2]);
    //flip
    rotate.x *= -1;
    rotate.z *= -1;

    return {
        //defaults to radians for rotation around x,y,z axis
        y: rotate.y * PI, //left right
        x: rotate.x * PI, //up down
        z: rotate.z * PI, //side to side
        width: width,
        height: height,
        //center of face detection square
        position: midPoint.lerp(plane[2], 0.5),
        //returns euler angles normalized between -1 and 1
        normalized: {
            y: rotate.y,
            x: rotate.x,
            z: rotate.z,
        },
        degrees: {
            y: rotate.y * 180,
            x: rotate.x * 180,
            z: rotate.z * 180,
        },
    };
};
