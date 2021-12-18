<img src="https://github.com/yeemachine/kalidokit/blob/main/docs/kalidokit-logo.png?raw=true" alt="Kalidokit Template" width="200ps" style="margin-bottom:10px"/>

[![NPM Package][npm]][npm-url]
[![NPM Bundle Size][minimized-size]][npm-url]
[![NPM Downloads][npm-downloads]][npmtrends-url]
[![jsDelivr hits (npm)][js-delivr]][js-delivr-url]
[![Website][website]][website-url]

## Face, Pose, and Hand Tracking Calculator

Kalidokit is a blendshape and kinematics solver for Mediapipe/Tensorflow.js face, eyes, pose, and hand tracking models, compatible with [Facemesh](https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection), [Blazepose](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection), [Handpose](https://google.github.io/mediapipe/solutions/hands.html), and [Holistic](https://google.github.io/mediapipe/solutions/holistic.html). It takes predicted 3D landmarks and calculates simple euler rotations and blendshape face values.

As the core to Vtuber web apps, [Kalidoface](https://kalidoface.com) and [Kalidoface 3D](https://3d.kalidoface.com), KalidoKit is designed specifically for rigging 3D VRM models and Live2D avatars!

<a href="https://glitch.com/edit/#!/kalidokit"><img src="https://github.com/yeemachine/kalidokit/blob/main/docs/kalidokit_glitch.gif?raw=true" alt="Kalidokit Template" width="48%"/></a>
<a href="https://glitch.com/edit/#!/kalidokit-live2d"><img src="https://github.com/yeemachine/kalidokit/blob/main/docs/kalidokit-live2d_glitch.gif?raw=true" alt="Kalidokit Template" width="48%"/></a>

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/B0B75DIY1)

## Install

#### Via NPM

```
npm install kalidokit
```

```js
import * as Kalidokit from "kalidokit";

// or only import the class you need

import { Face, Pose, Hand } from "kalidokit";
```

#### Via CDN

```js
<script src="https://cdn.jsdelivr.net/npm/kalidokit@1.1/dist/kalidokit.umd.js"></script>
```

## Methods

Kalidokit is composed of 3 classes for Face, Pose, and Hand calculations. They accept landmark outputs from models like Facemesh, Blazepose, Handpose, and Holistic.

```js
// Accepts an array(468 or 478 with iris tracking) of vectors
Kalidokit.Face.solve(facelandmarkArray, {
    runtime: "tfjs", // `mediapipe` or `tfjs`
    video: HTMLVideoElement,
    imageSize: { height: 0, width: 0 },
    smoothBlink: false, // smooth left and right eye blink delays
    blinkSettings: [0.25, 0.75], // adjust upper and lower bound blink sensitivity
});

// Accepts arrays(33) of Pose keypoints and 3D Pose keypoints
Kalidokit.Pose.solve(poseWorld3DArray, poseLandmarkArray, {
    runtime: "tfjs", // `mediapipe` or `tfjs`
    video: HTMLVideoElement,
    imageSize: { height: 0, width: 0 },
    enableLegs: true,
});

// Accepts array(21) of hand landmark vectors; specify 'Right' or 'Left' side
Kalidokit.Hand.solve(handLandmarkArray, "Right");

// Using exported classes directly
Face.solve(facelandmarkArray);
Pose.solve(poseWorld3DArray, poseLandmarkArray);
Hand.solve(handLandmarkArray, "Right");
```

Additional Utils

```js
// Stabilizes left/right blink delays + wink by providing blenshapes and head rotation
Kalidokit.Face.stabilizeBlink(
    { r: 0, l: 1 }, // left and right eye blendshape values
    headRotationY, // head rotation in radians
    {
        noWink = false, // disables winking
        maxRot = 0.5 // max head rotation in radians before interpolating obscured eyes
    });

// The internal vector math class
Kalidokit.Vector();
```

## VRM and Live2D Sample Code

Quick-start your Vtuber app with these simple remixable examples.

### VRM Glitch Template

Face, full-body, and hand tracking in under 350 lines of javascript. This demo uses Mediapipe Holistic for body tracking, Three.js + Three-VRM for rendering models, and KalidoKit for the kinematic calculations. This [demo](https://glitch.com/edit/#!/kalidokit) uses a minimal amount of easing to smooth animations, but feel free to make it your own! VRM model from [Vroid Hub](https://hub.vroid.com/en/characters/6617701103638326208/models/8892157442595230149).

<a href="https://glitch.com/edit/#!/kalidokit"><img alt="Remix on Glitch" src="https://cdn.gomix.com/f3620a78-0ad3-4f81-a271-c8a4faa20f86%2Fremix-button.svg"></a>

### Live2D Glitch Template

This demo uses Mediapipe FaceMesh for face tracking, Pixi.js + pixi-live2d-display for rendering models, and KalidoKit for the kinematic calculations. This [demo](https://glitch.com/edit/#!/kalidokit-live2d) uses an official sample Live2D model, [Hiyori](https://www.live2d.com/en/download/sample-data/).

<a href="https://glitch.com/edit/#!/kalidokit-live2d"><img alt="Remix on Glitch" src="https://cdn.gomix.com/f3620a78-0ad3-4f81-a271-c8a4faa20f86%2Fremix-button.svg"></a>

### Local VRM and Live2D Examples

Interested in contributing? If you clone this project, the `docs` folder includes both VRM and Live2D KalidoKit templates. Run the `test` script to build the library and start up the dev server. The VRM demo will be hosted on `localhost:3000` and Live2D on `localhost:3000/live2d/`.

```
npm run test
```

## Basic Usage

<img src="https://github.com/yeemachine/kalidokit/blob/main/docs/kalidokit-pipeline.png?raw=true" alt="Kalidokit Template" width="100%"/>

The implementation may vary depending on what pose and face detection model you choose to use, but the principle is still the same. This example uses Mediapipe Holistic which concisely combines them together.

```js
import * as Kalidokit from 'kalidokit'
import '@mediapipe/holistic/holistic';
import '@mediapipe/camera_utils/camera_utils';

let holistic = new Holistic({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.4.1633559476/${file}`;
}});

holistic.onResults(results=>{
    // do something with prediction results
    // landmark names may change depending on TFJS/Mediapipe model version
    let facelm = results.faceLandmarks;
    let poselm = results.poseLandmarks;
    let poselm3D = results.ea;
    let rightHandlm = results.rightHandLandmarks;
    let leftHandlm = results.leftHandLandmarks;

    let faceRig = Kalidokit.Face.solve(facelm,{runtime:'mediapipe',video:HTMLVideoElement})
    let poseRig = Kalidokit.Pose.solve(poselm3d,poselm,{runtime:'mediapipe',video:HTMLVideoElement})
    let rightHandRig = Kalidokit.Hand.solve(rightHandlm,"Right")
    let leftHandRig = Kalidokit.Hand.solve(leftHandlm,"Left")

    };
});

// use Mediapipe's webcam utils to send video to holistic every frame
const camera = new Camera(HTMLVideoElement, {
  onFrame: async () => {
    await holistic.send({image: HTMLVideoElement});
  },
  width: 640,
  height: 480
});
camera.start();
```

## Slight differences with Mediapipe and Tensorflow.js

Due to slight differences in the results from Mediapipe and Tensorflow.js, it is recommended to specify which runtime version you are using as well as the video input/image size as a reference.

```js
Kalidokit.Pose.solve(poselm3D,poselm,{
    runtime:'tfjs', // default is 'mediapipe'
    video: HTMLVideoElement,// specify an html video or manually set image size
    imageSize:{
        width: 640,
        height: 480,
    };
})

Kalidokit.Face.solve(facelm,{
    runtime:'mediapipe', // default is 'tfjs'
    video: HTMLVideoElement,// specify an html video or manually set image size
    imageSize:{
        width: 640,
        height: 480,
    };
})
```

## Outputs

Below are the expected results from KalidoKit solvers.

```js
// Kalidokit.Face.solve()
// Head rotations in radians
// Degrees and normalized rotations also available
{
    eye: {l: 1,r: 1},
    mouth: {
        x: 0,
        y: 0,
        shape: {A:0, E:0, I:0, O:0, U:0}
    },
    head: {
        x: 0,
        y: 0,
        z: 0,
        width: 0.3,
        height: 0.6,
        position: {x: 0.5, y: 0.5, z: 0}
    },
    brow: 0,
    pupil: {x: 0, y: 0}
}
```

```js
// Kalidokit.Pose.solve()
// Joint rotations in radians, leg calculators are a WIP
{
    RightUpperArm: {x: 0, y: 0, z: -1.25},
    LeftUpperArm: {x: 0, y: 0, z: 1.25},
    RightLowerArm: {x: 0, y: 0, z: 0},
    LeftLowerArm: {x: 0, y: 0, z: 0},
    LeftUpperLeg: {x: 0, y: 0, z: 0},
    RightUpperLeg: {x: 0, y: 0, z: 0},
    RightLowerLeg: {x: 0, y: 0, z: 0},
    LeftLowerLeg: {x: 0, y: 0, z: 0},
    LeftHand: {x: 0, y: 0, z: 0},
    RightHand: {x: 0, y: 0, z: 0},
    Spine: {x: 0, y: 0, z: 0},
    Hips: {
        worldPosition: {x: 0, y: 0, z: 0},
        position: {x: 0, y: 0, z: 0},
        rotation: {x: 0, y: 0, z: 0},
    }
}
```

```js
// Kalidokit.Hand.solve()
// Joint rotations in radians
// only wrist and thumb have 3 degrees of freedom
// all other finger joints move in the Z axis only
{
    RightWrist: {x: -0.13, y: -0.07, z: -1.04},
    RightRingProximal: {x: 0, y: 0, z: -0.13},
    RightRingIntermediate: {x: 0, y: 0, z: -0.4},
    RightRingDistal: {x: 0, y: 0, z: -0.04},
    RightIndexProximal: {x: 0, y: 0, z: -0.24},
    RightIndexIntermediate: {x: 0, y: 0, z: -0.25},
    RightIndexDistal: {x: 0, y: 0, z: -0.06},
    RightMiddleProximal: {x: 0, y: 0, z: -0.09},
    RightMiddleIntermediate: {x: 0, y: 0, z: -0.44},
    RightMiddleDistal: {x: 0, y: 0, z: -0.06},
    RightThumbProximal: {x: -0.23, y: -0.33, z: -0.12},
    RightThumbIntermediate: {x: -0.2, y: -0.19, z: -0.01},
    RightThumbDistal: {x: -0.2, y: 0.002, z: 0.15},
    RightLittleProximal: {x: 0, y: 0, z: -0.09},
    RightLittleIntermediate: {x: 0, y: 0, z: -0.22},
    RightLittleDistal: {x: 0, y: 0, z: -0.1}
}
```

## Community Showcase

If you'd like to share a creative use of KalidoKit, please reach out or send a pull request! Feel free to also use our Twitter hashtag, [#kalidokit](https://twitter.com/search?q=%23kalidokit).

[![Kalidoface virtual webcam](https://raw.githubusercontent.com/yeemachine/kalidoface-live2d-models/main/promo/TW-Promo-short.gif)](https://kalidoface.com) [![Kalidoface Pose Demo](https://cdn.glitch.me/29e07830-2317-4b15-a044-135e73c7f840%2Fkalidoface-pose-dance.gif?v=1633453098775)](https://3d.kalidoface.com)

## Contributing

The current library is a work in progress and contributions to improve it are very welcome! Some plans include: better facial blendshapes, full leg tracking, and improved efficiency.

[npm]: https://img.shields.io/npm/v/kalidokit
[npm-url]: https://www.npmjs.com/package/kalidokit
[minimized-size]: https://img.shields.io/bundlephobia/min/kalidokit
[js-delivr]: https://img.shields.io/jsdelivr/npm/hw/kalidokit
[js-delivr-url]: https://www.jsdelivr.com/package/npm/kalidokit
[website]: https://img.shields.io/website?down_color=lightgrey&down_message=offline&up_color=brightgreen&up_message=online&url=https%3A%2F%2Fkalidoface.com
[website-url]: https://kalidoface.com
[npm-downloads]: https://img.shields.io/npm/dw/kalidokit
[npmtrends-url]: https://www.npmtrends.com/kalidokit
