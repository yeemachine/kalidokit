import Vector from "../utils/vector.js";

export const createEulerPlane = (landmarks) => {
    //create face detection square bounds
    let p1 = new Vector(landmarks[21]); //top left
    let p2 = new Vector(landmarks[251]); //top right
    let p3 = new Vector(landmarks[397]); //bottom right
    let p4 = new Vector(landmarks[172]); //bottom left
    let p3mid = p3.lerp(p4, 0.5); // bottom midpoint
    return {
        vector: [p1, p2, p3mid],
        points: [p1, p2, p3, p4],
    };
};

export const headRotation = (plane) => {
    let rotate = Vector.rollPitchYaw(plane[0], plane[1], plane[2]);
    let midPoint = plane[0].lerp(plane[1], 0.5);
    let width = plane[0].distance(plane[1]);
    let height = midPoint.distance(plane[2]);
    //flip
    rotate.x *= -1;
    rotate.z *= -1;

    return {
        //defaults to radians for rotation around x,y,z axis
        y: rotate.y * Math.PI, //left right
        x: rotate.x * Math.PI, //up down
        z: rotate.z * Math.PI, //side twist
        width: width,
        height: height,
        position: midPoint.lerp(plane[2], 0.5), //center of face detection square
        normalized: {
            //returns euler angles normalized between -1 and 1
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

export const calcHead = (lm) => {
    // head xyz [-90,90]
    const plane = createEulerPlane(lm);
    return headRotation(plane.vector);
};
