export const clamp = (value, min, max) => {
    return Math.max(Math.min(value, max), min);
};

export const remap = (val, a, b) => {
    //returns a to b -> 0 to 1
    return (clamp(val, a, b) - a) / (b - a);
};

//A set of default pose values to serve as "default" values -->
export const RestingDefault = {
    Face: {
        eye: {
            l: 1,
            r: 1,
        },
        mouth: {
            x: 0,
            y: 0,
            shape: {
                A: 0,
                E: 0,
                I: 0,
                O: 0,
                U: 0,
            },
        },
        head: {
            x: 0,
            y: 0,
            z: 0,
            width: 0.3,
            height: 0.6,
            position: {
                x: 0.5,
                y: 0.5,
                z: 0,
            },
        },
        brow: 0,
        pupil: {
            x: 0,
            y: 0,
        },
    },
    Pose: {
        RightUpperArm: {
            x: 0,
            y: 0,
            z: -1.25,
        },
        LeftUpperArm: {
            x: 0,
            y: 0,
            z: 1.25,
        }, //y: 0 > -.5 // z: -.5>.5
        RightLowerArm: {
            x: 0,
            y: 0,
            z: 0,
        },
        LeftLowerArm: {
            x: 0,
            y: 0,
            z: 0,
        }, //x: 0 > -4, z: 0 to -.9
        LeftUpperLeg: {
            x: 0,
            y: 0,
            z: 0,
        },
        RightUpperLeg: {
            x: 0,
            y: 0,
            z: 0,
        },
        RightLowerLeg: {
            x: 0,
            y: 0,
            z: 0,
        },
        LeftLowerLeg: {
            x: 0,
            y: 0,
            z: 0,
        },
        LeftHand: {
            x: 0,
            y: 0,
            z: 0,
        },
        RightHand: {
            x: 0,
            y: 0,
            z: 0,
        },
        Spine: {
            x: 0,
            y: 0,
            z: 0,
        },
        Hips: {
            position: {
                x: 0,
                y: 0,
                z: 0,
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
    },
    RightHand: {
        RightWrist: {
            x: -0.13,
            y: -0.07,
            z: -1.04,
        },
        RightRingProximal: {
            x: 0,
            y: 0,
            z: -0.13,
        },
        RightRingIntermediate: {
            x: 0,
            y: 0,
            z: -0.4,
        },
        RightRingDistal: {
            x: 0,
            y: 0,
            z: -0.04,
        },
        RightIndexProximal: {
            x: 0,
            y: 0,
            z: -0.24,
        },
        RightIndexIntermediate: {
            x: 0,
            y: 0,
            z: -0.25,
        },
        RightIndexDistal: {
            x: 0,
            y: 0,
            z: -0.06,
        },
        RightMiddleProximal: {
            x: 0,
            y: 0,
            z: -0.09,
        },
        RightMiddleIntermediate: {
            x: 0,
            y: 0,
            z: -0.44,
        },
        RightMiddleDistal: {
            x: 0,
            y: 0,
            z: -0.06,
        },
        RightThumbProximal: {
            x: -0.23,
            y: -0.33,
            z: -0.12,
        },
        RightThumbIntermediate: {
            x: -0.2,
            y: -0.199,
            z: -0.0139,
        },
        RightThumbDistal: {
            x: -0.2,
            y: 0.002,
            z: 0.15,
        },
        RightLittleProximal: {
            x: 0,
            y: 0,
            z: -0.09,
        },
        RightLittleIntermediate: {
            x: 0,
            y: 0,
            z: -0.225,
        },
        RightLittleDistal: {
            x: 0,
            y: 0,
            z: -0.1,
        },
    },
    LeftHand: {
        LeftWrist: {
            x: -0.13,
            y: -0.07,
            z: -1.04,
        },
        LeftRingProximal: {
            x: 0,
            y: 0,
            z: 0.13,
        },
        LeftRingIntermediate: {
            x: 0,
            y: 0,
            z: 0.4,
        },
        LeftRingDistal: {
            x: 0,
            y: 0,
            z: 0.049,
        },
        LeftIndexProximal: {
            x: 0,
            y: 0,
            z: 0.24,
        },
        LeftIndexIntermediate: {
            x: 0,
            y: 0,
            z: 0.25,
        },
        LeftIndexDistal: {
            x: 0,
            y: 0,
            z: 0.06,
        },
        LeftMiddleProximal: {
            x: 0,
            y: 0,
            z: 0.09,
        },
        LeftMiddleIntermediate: {
            x: 0,
            y: 0,
            z: 0.44,
        },
        LeftMiddleDistal: {
            x: 0,
            y: 0,
            z: 0.066,
        },
        LeftThumbProximal: {
            x: -0.23,
            y: 0.33,
            z: 0.12,
        },
        LeftThumbIntermediate: {
            x: -0.2,
            y: 0.25,
            z: 0.05,
        },
        LeftThumbDistal: {
            x: -0.2,
            y: 0.17,
            z: -0.06,
        },
        LeftLittleProximal: {
            x: 0,
            y: 0,
            z: 0.17,
        },
        LeftLittleIntermediate: {
            x: 0,
            y: 0,
            z: 0.4,
        },
        LeftLittleDistal: {
            x: 0,
            y: 0,
            z: 0.1,
        },
    },
};
