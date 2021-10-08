export const clamp = (value, min, max) => {
  return Math.max(Math.min(value, max), min);
}

export const remap = (val,a,b) => {
 //returns a to b -> 0 to 1 
 return (clamp(val,a,b) - a)/(b-a)
}

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
            x: -0.1315541586772754,
            y: -0.07882867526197412,
            z: -1.0417476769631682,
        },
        RightRingProximal: {
            x: 0,
            y: 0,
            z: -0.13224515812536932,
        },
        RightRingIntermediate: {
            x: 0,
            y: 0,
            z: -0.4068258603832122,
        },
        RightRingDistal: {
            x: 0,
            y: 0,
            z: -0.04950943047275125,
        },
        RightIndexProximal: {
            x: 0,
            y: 0,
            z: -0.24443519921597368,
        },
        RightIndexIntermediate: {
            x: 0,
            y: 0,
            z: -0.25695509972035424,
        },
        RightIndexDistal: {
            x: 0,
            y: 0,
            z: -0.06699515077992313,
        },
        RightMiddleProximal: {
            x: 0,
            y: 0,
            z: -0.09663436414575077,
        },
        RightMiddleIntermediate: {
            x: 0,
            y: 0,
            z: -0.44945038168605306,
        },
        RightMiddleDistal: {
            x: 0,
            y: 0,
            z: -0.06660398263230727,
        },
        RightThumbProximal: {
            x: -0.2349819227955754,
            y: -0.33498192279557526,
            z: -0.12613225518081256,
        },
        RightThumbIntermediate: {
            x: -0.2,
            y: -0.19959491036565571,
            z: -0.013996364546896928,
        },
        RightThumbDistal: {
            x: -0.2,
            y: 0.002005509674788991,
            z: 0.1510027548373945,
        },
        RightLittleProximal: {
            x: 0,
            y: 0,
            z: -0.09045147788376662,
        },
        RightLittleIntermediate: {
            x: 0,
            y: 0,
            z: -0.22559206415066682,
        },
        RightLittleDistal: {
            x: 0,
            y: 0,
            z: -0.10080630460393536,
        },
    },
    LeftHand: {
        LeftWrist: {
            x: -0.1315541586772754,
            y: -0.07882867526197412,
            z: -1.0417476769631682,
        },
        LeftRingProximal: {
            x: 0,
            y: 0,
            z: 0.13224515812536932,
        },
        LeftRingIntermediate: {
            x: 0,
            y: 0,
            z: 0.4068258603832122,
        },
        LeftRingDistal: {
            x: 0,
            y: 0,
            z: 0.04950943047275125,
        },
        LeftIndexProximal: {
            x: 0,
            y: 0,
            z: 0.24443519921597368,
        },
        LeftIndexIntermediate: {
            x: 0,
            y: 0,
            z: 0.25695509972035424,
        },
        LeftIndexDistal: {
            x: 0,
            y: 0,
            z: 0.06699515077992313,
        },
        LeftMiddleProximal: {
            x: 0,
            y: 0,
            z: 0.09663436414575077,
        },
        LeftMiddleIntermediate: {
            x: 0,
            y: 0,
            z: 0.44945038168605306,
        },
        LeftMiddleDistal: {
            x: 0,
            y: 0,
            z: 0.06660398263230727,
        },
        LeftThumbProximal: {
            x: -0.2349819227955754,
            y: 0.33498192279557526,
            z: 0.12613225518081256,
        },
        LeftThumbIntermediate: {
            x: -0.2,
            y: 0.2506506391005022,
            z: 0.05046474221464442,
        },
        LeftThumbDistal: {
            x: -0.2,
            y: 0.17880674636490754,
            z: -0.06059662681754624,
        },
        LeftLittleProximal: {
            x: 0,
            y: 0,
            z: 0.1748998529912705,
        },
        LeftLittleIntermediate: {
            x: 0,
            y: 0,
            z: 0.4065799037713114,
        },
        LeftLittleDistal: {
            x: 0,
            y: 0,
            z: 0.10080630460393536,
        },
    },
};
