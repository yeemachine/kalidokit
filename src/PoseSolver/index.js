import { RestingDefault } from "../utils/helpers.js";
import { calcArms } from "./calcArms.js";
import { calcHips } from "./calcHips.js";
import { calcLegs } from "./calcLegs.js";

export class PoseSolver {
    constructor() {}

    static calcArms = calcArms;

    static calcHips = calcHips;

    static calcLegs = calcLegs;

    static solve(lm3d, lm2d, { runtime = "mediapipe", video = null, imageSize = null, enableLegs = true } = {}) {
        if (!lm3d && !lm2d) {
            console.error("Need both World Pose and Pose Landmarks");
            return;
        }

        // format and normalize values given by tfjs output
        if (video) {
            let videoEl = video;
            if (typeof video === "string") {
                videoEl = document.querySelector(video);
            }
            imageSize = {
                width: videoEl.videoWidth,
                height: videoEl.videoHeight,
            };
        }
        if (runtime === "tfjs" && imageSize) {
            lm3d.forEach((e, i) => {
                e.visibility = e.score;
            });
            lm2d.forEach((e, i) => {
                e.x /= imageSize.width;
                e.y /= imageSize.height;
                e.z = 0;
                e.visibility = e.score;
            });
        }

        let Arms = calcArms(lm3d);
        let Hips = calcHips(lm3d, lm2d);
        let Legs = calcLegs(lm3d);

        //DETECT OFFSCREEN AND RESET VALUES TO DEFAULTS
        let rightHandOffscreen = lm3d[15].y > -0.1 || lm3d[15].visibility < 0.23 || 0.995 < lm2d[15].y;
        let leftHandOffscreen = lm3d[16].y > -0.1 || lm3d[16].visibility < 0.23 || 0.995 < lm2d[16].y;

        let leftFootOffscreen = lm3d[23].visibility < 0.63 || Hips.Hips.position.z > -0.4;
        let rightFootOffscreen = lm3d[24].visibility < 0.63 || Hips.Hips.position.z > -0.4;

        Arms.UpperArm.l = Arms.UpperArm.l.multiply(leftHandOffscreen ? 0 : 1);
        Arms.UpperArm.l.z = leftHandOffscreen ? RestingDefault.Pose.LeftUpperArm.z : Arms.UpperArm.l.z; //.55 is Hands down Default position
        Arms.UpperArm.r = Arms.UpperArm.r.multiply(rightHandOffscreen ? 0 : 1);
        Arms.UpperArm.r.z = rightHandOffscreen ? RestingDefault.Pose.RightUpperArm.z : Arms.UpperArm.r.z;

        Arms.LowerArm.l = Arms.LowerArm.l.multiply(leftHandOffscreen ? 0 : 1);
        Arms.LowerArm.r = Arms.LowerArm.r.multiply(rightHandOffscreen ? 0 : 1);

        Arms.Hand.l = Arms.Hand.l.multiply(leftHandOffscreen ? 0 : 1);
        Arms.Hand.r = Arms.Hand.r.multiply(rightHandOffscreen ? 0 : 1);

        Legs.UpperLeg.l = Legs.UpperLeg.l.multiply(rightFootOffscreen ? 0 : 1);
        Legs.UpperLeg.r = Legs.UpperLeg.r.multiply(leftFootOffscreen ? 0 : 1);
        Legs.LowerLeg.l = Legs.LowerLeg.l.multiply(rightFootOffscreen ? 0 : 1);
        Legs.LowerLeg.r = Legs.LowerLeg.r.multiply(leftFootOffscreen ? 0 : 1);

        return {
            RightUpperArm: Arms.UpperArm.r,
            RightLowerArm: Arms.LowerArm.r,
            LeftUpperArm: Arms.UpperArm.l,
            LeftLowerArm: Arms.LowerArm.l,
            RightHand: Arms.Hand.r,
            LeftHand: Arms.Hand.l,
            RightUpperLeg: Legs.UpperLeg.r,
            RightLowerLeg: Legs.LowerLeg.r,
            LeftUpperLeg: Legs.UpperLeg.l,
            LeftLowerLeg: Legs.LowerLeg.l,
            Hips: Hips.Hips,
            Spine: Hips.Spine,
        };
    }
}
