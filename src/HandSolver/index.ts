import Vector from "../utils/vector";
import { clamp } from "../utils/helpers";
import { Results, THand, THandUnsafe, Side } from "../Types";
import { RIGHT, LEFT } from "./../constants";
import { PI } from "./../constants";

/** Class representing hand solver. */
export class HandSolver {
    /**
     * Calculates finger and wrist as euler rotations
     * @param {Array} lm : array of 3D hand vectors from tfjs or mediapipe
     * @param {Side} side: left or right
     */
    static solve(lm: Results, side: Side = RIGHT): THand<typeof side> | undefined {
        if (!lm) {
            console.error("Need Hand Landmarks");
            return;
        }
        const palm = [
            new Vector(lm[0]),
            new Vector(lm[side === RIGHT ? 17 : 5]),
            new Vector(lm[side === RIGHT ? 5 : 17]),
        ];
        const handRotation = Vector.rollPitchYaw(palm[0], palm[1], palm[2]);
        handRotation.y = handRotation.z;
        handRotation.y -= side === LEFT ? 0.4 : 0.4;

        let hand: Record<string, unknown> = {};
        hand[side + "Wrist"] = { x: handRotation.x, y: handRotation.y, z: handRotation.z };
        hand[side + "RingProximal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[13], lm[14]) };
        hand[side + "RingIntermediate"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[13], lm[14], lm[15]) };
        hand[side + "RingDistal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[14], lm[15], lm[16]) };
        hand[side + "IndexProximal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[5], lm[6]) };
        hand[side + "IndexIntermediate"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[5], lm[6], lm[7]) };
        hand[side + "IndexDistal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[6], lm[7], lm[8]) };
        hand[side + "MiddleProximal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[9], lm[10]) };
        hand[side + "MiddleIntermediate"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[9], lm[10], lm[11]) };
        hand[side + "MiddleDistal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[10], lm[11], lm[12]) };
        hand[side + "ThumbProximal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[1], lm[2]) };
        hand[side + "ThumbIntermediate"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[1], lm[2], lm[3]) };
        hand[side + "ThumbDistal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[2], lm[3], lm[4]) };
        hand[side + "LittleProximal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[17], lm[18]) };
        hand[side + "LittleIntermediate"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[17], lm[18], lm[19]) };
        hand[side + "LittleDistal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[18], lm[19], lm[20]) };

        hand = rigFingers(hand as THand<typeof side>, side);

        return hand as THand<typeof side>;
    }
}

/**
 * Converts normalized rotation values into radians clamped by human limits
 * @param {Object} hand : object of labeled joint with normalized rotation values
 * @param {Side} side : left or right
 */
const rigFingers = (hand: THandUnsafe<typeof side>, side: Side = RIGHT): THand<typeof side> => {
    // Invert modifier based on left vs right side
    const invert = side === RIGHT ? 1 : -1;
    const digits = ["Ring", "Index", "Little", "Thumb", "Middle"];
    const segments = ["Proximal", "Intermediate", "Distal"];

    hand[side + "Wrist"].x = clamp(hand[side + "Wrist"].x * 2 * invert, -0.3, 0.3); // twist
    hand[side + "Wrist"].y = clamp(
        hand[side + "Wrist"].y * 2.3,
        side === RIGHT ? -1.2 : -0.6,
        side === RIGHT ? 0.6 : 1.6
    );
    hand[side + "Wrist"].z = hand[side + "Wrist"].z * -2.3 * invert; //left right

    digits.forEach((e) => {
        segments.forEach((j) => {
            const trackedFinger = hand[side + e + j];

            if (e === "Thumb") {
                //dampen thumb rotation depending on segment
                const dampener = {
                    x: j === "Proximal" ? 2.2 : j === "Intermediate" ? 0 : 0,
                    y: j === "Proximal" ? 2.2 : j === "Intermediate" ? 0.7 : 1,
                    z: j === "Proximal" ? 0.5 : j === "Intermediate" ? 0.5 : 0.5,
                };
                const startPos = {
                    x: j === "Proximal" ? 1.2 : j === "Distal" ? -0.2 : -0.2,
                    y: j === "Proximal" ? 1.1 * invert : j === "Distal" ? 0.1 * invert : 0.1 * invert,
                    z: j === "Proximal" ? 0.2 * invert : j === "Distal" ? 0.2 * invert : 0.2 * invert,
                };
                const newThumb = { x: 0, y: 0, z: 0 };
                if (j === "Proximal") {
                    newThumb.z = clamp(
                        startPos.z + trackedFinger.z * -PI * dampener.z * invert,
                        side === RIGHT ? -0.6 : -0.3,
                        side === RIGHT ? 0.3 : 0.6
                    );
                    newThumb.x = clamp(startPos.x + trackedFinger.z * -PI * dampener.x, -0.6, 0.3);
                    newThumb.y = clamp(
                        startPos.y + trackedFinger.z * -PI * dampener.y * invert,
                        side === RIGHT ? -1 : -0.3,
                        side === RIGHT ? 0.3 : 1
                    );
                } else {
                    newThumb.z = clamp(startPos.z + trackedFinger.z * -PI * dampener.z * invert, -2, 2);
                    newThumb.x = clamp(startPos.x + trackedFinger.z * -PI * dampener.x, -2, 2);
                    newThumb.y = clamp(startPos.y + trackedFinger.z * -PI * dampener.y * invert, -2, 2);
                }
                trackedFinger.x = newThumb.x;
                trackedFinger.y = newThumb.y;
                trackedFinger.z = newThumb.z;
            } else {
                //will document human limits later
                trackedFinger.z = clamp(
                    trackedFinger.z * -PI * invert,
                    side === RIGHT ? -PI : 0,
                    side === RIGHT ? 0 : PI
                );
            }
        });
    });
    return hand as THand<typeof side>;
};
