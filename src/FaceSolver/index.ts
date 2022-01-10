import { calcHead } from "./calcHead";
import { calcEyes, stabilizeBlink, calcPupils, calcBrow } from "./calcEyes";
import { calcMouth } from "./calcMouth";
import { Results, IFaceSolveOptions, TFace } from "../Types";

/** Class representing face solver. */
export class FaceSolver {
    /** expose blink stabilizer as a static method */
    static stabilizeBlink = stabilizeBlink;

    /**
     * Combines head, eye, pupil, and eyebrow calcs into one method
     * @param {Results} lm : array of results from tfjs or mediapipe
     * @param {String} runtime: set as either "tfjs" or "mediapipe"
     * @param {IFaceSolveOptions} options: options for face solver
     */
    static solve(
        lm: Results,
        {
            runtime = "tfjs",
            video = null,
            imageSize = null,
            smoothBlink = false,
            blinkSettings = [],
        }: Partial<IFaceSolveOptions> = {}
    ): TFace | undefined {
        if (!lm) {
            console.error("Need Face Landmarks");
            return;
        }

        // set image size based on video
        if (video) {
            const videoEl = (typeof video === "string" ? document.querySelector(video) : video) as HTMLVideoElement;
            imageSize = {
                width: videoEl.videoWidth,
                height: videoEl.videoHeight,
            };
        }

        //if runtime is mediapipe, we need the image dimentions for accurate calculations
        if (runtime === "mediapipe" && imageSize) {
            for (const e of lm) {
                e.x *= imageSize.width;
                e.y *= imageSize.height;
                e.z *= imageSize.width;
            }
        }

        const getHead = calcHead(lm);
        const getMouth = calcMouth(lm);

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

        const getPupils = calcPupils(lm);
        const getBrow = calcBrow(lm);

        return {
            head: getHead,
            eye: getEye,
            brow: getBrow,
            pupil: getPupils,
            mouth: getMouth,
        };
    }
}
