const {
    Application,
    live2d: { Live2DModel },
} = PIXI;

// Kalidokit provides a simple easing function
// (linear interpolation) used for animation smoothness
// you can use a more advanced easing function if you want
const {
    Face,
    Vector: { lerp },
    Utils: { clamp },
} = Kalidokit;

// Url to Live2D
const modelUrl = "../models/hiyori/hiyori_pro_t10.model3.json";

let currentModel, facemesh;

const videoElement = document.querySelector(".input_video"),
    guideCanvas = document.querySelector("canvas.guides");

(async function main() {
    // create pixi application
    const app = new PIXI.Application({
        view: document.getElementById("live2d"),
        autoStart: true,
        backgroundAlpha: 0,
        backgroundColor: 0xffffff,
        resizeTo: window,
    });

    // load live2d model
    currentModel = await Live2DModel.from(modelUrl, { autoInteract: false });
    currentModel.scale.set(0.4);
    currentModel.interactive = true;
    currentModel.anchor.set(0.5, 0.5);
    currentModel.position.set(window.innerWidth * 0.5, window.innerHeight * 0.8);

    // Add events to drag model
    currentModel.on("pointerdown", (e) => {
        currentModel.offsetX = e.data.global.x - currentModel.position.x;
        currentModel.offsetY = e.data.global.y - currentModel.position.y;
        currentModel.dragging = true;
    });
    currentModel.on("pointerup", (e) => {
        currentModel.dragging = false;
    });
    currentModel.on("pointermove", (e) => {
        if (currentModel.dragging) {
            currentModel.position.set(e.data.global.x - currentModel.offsetX, e.data.global.y - currentModel.offsetY);
        }
    });

    // Add mousewheel events to scale model
    document.querySelector("#live2d").addEventListener("wheel", (e) => {
        e.preventDefault();
        currentModel.scale.set(clamp(currentModel.scale.x + event.deltaY * -0.001, -0.5, 10));
    });

    // add live2d model to stage
    app.stage.addChild(currentModel);

    // create media pipe facemesh instance
    facemesh = new FaceMesh({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        },
    });

    // set facemesh config
    facemesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
    });

    // pass facemesh callback function
    facemesh.onResults(onResults);

    startCamera();
})();

const onResults = (results) => {
    drawResults(results.multiFaceLandmarks[0]);
    animateLive2DModel(results.multiFaceLandmarks[0]);
};

// draw connectors and landmarks on output canvas
const drawResults = (points) => {
    if (!guideCanvas || !videoElement || !points) return;
    guideCanvas.width = videoElement.videoWidth;
    guideCanvas.height = videoElement.videoHeight;
    let canvasCtx = guideCanvas.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
    // Use `Mediapipe` drawing functions
    drawConnectors(canvasCtx, points, FACEMESH_TESSELATION, {
        color: "#C0C0C070",
        lineWidth: 1,
    });
    if (points && points.length === 478) {
        //draw pupils
        drawLandmarks(canvasCtx, [points[468], points[468 + 5]], {
            color: "#ffe603",
            lineWidth: 2,
        });
    }
};

const animateLive2DModel = (points) => {
    if (!currentModel || !points) return;

    let riggedFace;

    if (points) {
        // use kalidokit face solver
        riggedFace = Face.solve(points, {
            runtime: "mediapipe",
            video: videoElement,
        });
        rigFace(riggedFace, 0.5);
    }
};

// update live2d model internal state
const rigFace = (result, lerpAmount = 0.7) => {
    if (!currentModel || !result) return;
    const coreModel = currentModel.internalModel.coreModel;

    currentModel.internalModel.motionManager.update = (...args) => {
        // disable default blink animation
        currentModel.internalModel.eyeBlink = undefined;

        coreModel.setParameterValueById(
            "ParamEyeBallX",
            lerp(result.pupil.x, coreModel.getParameterValueById("ParamEyeBallX"), lerpAmount)
        );
        coreModel.setParameterValueById(
            "ParamEyeBallY",
            lerp(result.pupil.y, coreModel.getParameterValueById("ParamEyeBallY"), lerpAmount)
        );

        // X and Y axis rotations are swapped for Live2D parameters
        // because it is a 2D system and KalidoKit is a 3D system
        coreModel.setParameterValueById(
            "ParamAngleX",
            lerp(result.head.degrees.y, coreModel.getParameterValueById("ParamAngleX"), lerpAmount)
        );
        coreModel.setParameterValueById(
            "ParamAngleY",
            lerp(result.head.degrees.x, coreModel.getParameterValueById("ParamAngleY"), lerpAmount)
        );
        coreModel.setParameterValueById(
            "ParamAngleZ",
            lerp(result.head.degrees.z, coreModel.getParameterValueById("ParamAngleZ"), lerpAmount)
        );

        // update body params for models without head/body param sync
        const dampener = 0.3;
        coreModel.setParameterValueById(
            "ParamBodyAngleX",
            lerp(result.head.degrees.y * dampener, coreModel.getParameterValueById("ParamBodyAngleX"), lerpAmount)
        );
        coreModel.setParameterValueById(
            "ParamBodyAngleY",
            lerp(result.head.degrees.x * dampener, coreModel.getParameterValueById("ParamBodyAngleY"), lerpAmount)
        );
        coreModel.setParameterValueById(
            "ParamBodyAngleZ",
            lerp(result.head.degrees.z * dampener, coreModel.getParameterValueById("ParamBodyAngleZ"), lerpAmount)
        );

        // Simple example without winking.
        // Interpolate based on old blendshape, then stabilize blink with `Kalidokit` helper function.
        let stabilizedEyes = Kalidokit.Face.stabilizeBlink(
            {
                l: lerp(result.eye.l, coreModel.getParameterValueById("ParamEyeLOpen"), 0.7),
                r: lerp(result.eye.r, coreModel.getParameterValueById("ParamEyeROpen"), 0.7),
            },
            result.head.y
        );
        // eye blink
        coreModel.setParameterValueById("ParamEyeLOpen", stabilizedEyes.l);
        coreModel.setParameterValueById("ParamEyeROpen", stabilizedEyes.r);

        // mouth
        coreModel.setParameterValueById(
            "ParamMouthOpenY",
            lerp(result.mouth.y, coreModel.getParameterValueById("ParamMouthOpenY"), 0.3)
        );
        // Adding 0.3 to ParamMouthForm to make default more of a "smile"
        coreModel.setParameterValueById(
            "ParamMouthForm",
            0.3 + lerp(result.mouth.x, coreModel.getParameterValueById("ParamMouthForm"), 0.3)
        );
    };
};

// start camera using mediapipe camera utils
const startCamera = () => {
    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await facemesh.send({ image: videoElement });
        },
        width: 640,
        height: 480,
    });
    camera.start();
};
