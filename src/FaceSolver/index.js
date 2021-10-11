import { calcHead } from "./calcHead.js";
import { calcEyes, stabilizeBlink, calcPupils, calcBrow } from "./calcEyes.js";
import { calcMouth } from "./calcMouth.js";

export class FaceSolver {
    constructor() {
        //store value defaults
        this.head = { x: 0, y: 0, z: 0 };
        this.mouth = { x: 0, y: 0 };
        this.eye = {
            l: 1,
            r: 1,
            indep: {
                l: 1,
                r: 1,
            },
        };
        this.brow = 0;
        this.pupil = { x: 0, y: 0 };
    }

    static stabilizeBlink = stabilizeBlink;

    static solve(lm, { runtime = "mediapipe", smoothBlink = false } = {}) {
        if (!lm) {
            console.error("Need Face Landmarks");
            return;
        }
        let getHead = calcHead(lm);
        let getEye = calcEyes(lm);
        if (smoothBlink) {
            getEye = stabilizeBlink(getEye, getHead.y);
        }
        let getPupils = calcPupils(lm);
        let getMouth = calcMouth(lm, getHead.x, runtime);
        let getBrow = calcBrow(lm, getHead.x);

        return {
            head: getHead,
            eye: getEye,
            brow: getBrow,
            pupil: getPupils,
            mouth: getMouth,
        };
    }
}
