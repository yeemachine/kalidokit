import { calcHead } from "./calcHead.js";
import { calcEyes, stabilizeBlink, calcPupils, calcBrow } from "./calcEyes.js";
import { calcMouth } from "./calcMouth.js";

/** Class representing face solver. */
export class FaceSolver {
    constructor() {}

    /** expose blink stabilizer as a static method */
    static stabilizeBlink = stabilizeBlink;

    /**
     * Combines head, eye, pupil, and eyebrow calcs into one method
     * @param {Array} lm : array of results from tfjs or mediapipe
     * @param {String} runtime: set as either "tfjs" or "mediapipe"
     * @param {HTMLVideoElement} video : video element or video selector string
     * @param {Object} imageSize: manually set hight and width of prediction
     * @param {Boolean} smoothBlink: toggle smooth blink
     * @param {Array} blinkSettings: remaps high and low values to 0 to 1
     */
    static solve(
        lm,
        { runtime = "tfjs", video = null, imageSize = null, smoothBlink = false, blinkSettings = [] } = {}
    ) {
        if (!lm) {
            console.error("Need Face Landmarks");
            return;
        }

        // set image size based on video
        if (video) {
            let videoEl = video;
            // if video is string, find element via css selector
            if (typeof video === "string") {
                videoEl = document.querySelector(video);
            }
            imageSize = {
                width: videoEl.videoWidth,
                height: videoEl.videoHeight,
            };
        }

        //if runtime is mediapipe, we need the image dimentions for accurate calculations
        if (runtime === "mediapipe" && imageSize) {
            lm.forEach((e) => {
                e.x *= imageSize.width;
                e.y *= imageSize.height;
                e.z *= imageSize.width;
            });
        }

        let getHead = calcHead(lm);
        let getMouth = calcMouth(lm);

        //set high and low remapping values based on the runtime (tfjs vs mediapipe) of the results
        blinkSettings = blinkSettings.length > 0 ? blinkSettings : runtime === "tfjs" ? [0.55, 0.85] : [0.35, 0.5];

        let getEye = calcEyes(lm, {
            high: blinkSettings[1],
            low: blinkSettings[0],
        });

        // apply blink stabilizer if true
        if (smoothBlink) {
            getEye = stabilizeBlink(getEye, getHead.y);
        }

        let getPupils = calcPupils(lm);
        let getBrow = calcBrow(lm, getHead.y);

        return {
            head: getHead,
            eye: getEye,
            brow: getBrow,
            pupil: getPupils,
            mouth: getMouth,
        };
    }
}
