const cloneDeep = require("lodash.clonedeep")
import { calcLegs } from "../src/PoseSolver/calcLegs"
import poseWorldLandmarks from "./poseWorlLandmarks"
import { Results } from "../src/Types"
import { offsets } from "../src/PoseSolver/calcLegs"

let worldLandmarks: Results
const PI = Math.PI

describe("should resolve the correct upper leg rotation for", () => {
    beforeEach(() => {
        worldLandmarks = cloneDeep(poseWorldLandmarks)
      })

    test("upper left leg, 90 degree forward, up", () => {
        worldLandmarks[23] = { x: -0.2, y: 0, z: 0 }
        worldLandmarks[24] = { x: 0, y: 0, z: 0 }
        worldLandmarks[26] = { x: 0, y: 0, z: -0.4 }

        const result = calcLegs(worldLandmarks)
         
        expect(result.UpperLeg.l.x).toBeCloseTo(PI / 2)
        expect(result.Unscaled.UpperLeg.l.x).toBeCloseTo(0.5)
        
        expect(result.UpperLeg.l.z).toBeCloseTo((0 - offsets.upperLeg.z))
        expect(result.Unscaled.UpperLeg.l.z).toBeCloseTo(0)
    })

    test("upper left leg, straight down", () => {
        worldLandmarks[23] = { x: -0.2, y: 0, z: 0 }
        worldLandmarks[24] = { x: 0, y: 0, z: 0 }
        worldLandmarks[26] = { x: 0, y: 0.4, z: 0 }

        const result = calcLegs(worldLandmarks)
          
        expect(result.UpperLeg.l.x).toBeCloseTo(0)
        expect(result.Unscaled.UpperLeg.l.z).toBeCloseTo(0)

        expect(result.UpperLeg.l.z).toBeCloseTo((0 - offsets.upperLeg.z))
        expect(result.Unscaled.UpperLeg.l.x).toBeCloseTo(-0)
    })

    test("upper left leg, 90 degree forward, up, 45 degree left", () => {
        worldLandmarks[23] = { x: -0.2, y: 0, z: 0 }
        worldLandmarks[24] = { x: 0, y: 0, z: 0 }
        worldLandmarks[26] = { x: -0.4, y: 0, z: -0.4 }

        const result = calcLegs(worldLandmarks)
          
        expect(result.UpperLeg.l.x).toBeCloseTo(PI / 2)
        expect(result.Unscaled.UpperLeg.l.x).toBeCloseTo(0.5)

        expect(result.UpperLeg.l.z).toBeCloseTo((-PI / 4 - offsets.upperLeg.z))
        expect(result.Unscaled.UpperLeg.l.z).toBeCloseTo(-0.25)
    })

    test("upper right leg, 90 degree forward, up", () => {
        worldLandmarks[23] = { x: 0, y: 0, z: 0 }
        worldLandmarks[24] = { x: 0.2, y: 0, z: 0 }
        worldLandmarks[25] = { x: 0, y: 0, z: -0.4 }

        const result = calcLegs(worldLandmarks)
  
        expect(result.UpperLeg.r.x).toBeCloseTo(PI / 2)        
        expect(result.Unscaled.UpperLeg.r.x).toBeCloseTo(0.5)

        expect(result.UpperLeg.r.z).toBeCloseTo(0 + offsets.upperLeg.z)
        expect(result.Unscaled.UpperLeg.r.z).toBeCloseTo(0)
    })

    test("upper right leg, straight down", () => {
        worldLandmarks[23] = { x: 0, y: 0, z: 0 }
        worldLandmarks[24] = { x: 0.2, y: 0, z: 0 }
        worldLandmarks[25] = { x: 0, y: 0.4, z: 0 }

        const result = calcLegs(worldLandmarks)
          
        expect(result.UpperLeg.r.x).toBeCloseTo(0)
        expect(result.Unscaled.UpperLeg.r.z).toBeCloseTo(0)

        expect(result.UpperLeg.r.z).toBeCloseTo((0 + offsets.upperLeg.z))
        expect(result.Unscaled.UpperLeg.r.x).toBeCloseTo(0)
    })

    test("upper right leg, 90 degree forward, up, 45 degree left", () => {
        worldLandmarks[23] = { x: 0, y: 0, z: 0 }
        worldLandmarks[24] = { x: 0.2, y: 0, z: 0 }
        worldLandmarks[25] = { x: 0.4, y: 0, z: -0.4 }

        const result = calcLegs(worldLandmarks)
          
        expect(result.UpperLeg.r.x).toBeCloseTo(PI / 2)
        expect(result.Unscaled.UpperLeg.r.x).toBeCloseTo(0.5)

        expect(result.UpperLeg.r.z).toBeCloseTo((PI / 4 + offsets.upperLeg.z))
        expect(result.Unscaled.UpperLeg.r.z).toBeCloseTo(0.25)
    })
})

describe("should resolve the correct lower leg rotation for", () => {
    beforeEach(() => {
        worldLandmarks = cloneDeep(poseWorldLandmarks)
      })

    test("lower left leg, 90 degree", () => {
        worldLandmarks[24] = { x: 0, y: 0, z: 0 }
        worldLandmarks[26] = { x: 0, y: 0, z: -0.4 }
        worldLandmarks[28] = { x: 0, y: 0.4, z: -0.4 }

        const result = calcLegs(worldLandmarks)
  
        expect(result.LowerLeg.l.x).toBeCloseTo(-PI / 2)
        expect(result.Unscaled.LowerLeg.l.x).toBeCloseTo(-0.5)
    })

    test("lower left leg, 45 degree", () => {
        worldLandmarks[24] = { x: 0, y: 0, z: 0 }
        worldLandmarks[26] = { x: 0, y: 0, z: -0.4 }
        worldLandmarks[28] = { x: 0, y: 0.4, z: -0.8 }

        const result = calcLegs(worldLandmarks)
  
        expect(result.LowerLeg.l.x).toBeCloseTo(-PI / 4)
        expect(result.Unscaled.LowerLeg.l.x).toBeCloseTo(-0.25)
    })

    test("lower right leg, 90 degree", () => {
        worldLandmarks[23] = { x: -0.2, y: 0, z: 0 }
        worldLandmarks[25] = { x: 0, y: 0, z: -0.4 }
        worldLandmarks[27] = { x: 0, y: 0.4, z: -0.4 }

        const result = calcLegs(worldLandmarks)
  
        expect(result.LowerLeg.r.x).toBeCloseTo(-PI / 2)
        expect(result.Unscaled.LowerLeg.r.x).toBeCloseTo(-0.5)
    })

    test("lower right leg, 45 degree", () => {
        worldLandmarks[23] = { x: 0, y: 0, z: 0 }
        worldLandmarks[25] = { x: 0, y: 0, z: -0.4 }
        worldLandmarks[27] = { x: 0, y: 0.4, z: -0.8 }

        const result = calcLegs(worldLandmarks)
  
        expect(result.LowerLeg.r.x).toBeCloseTo(-PI / 4)
        expect(result.Unscaled.LowerLeg.r.x).toBeCloseTo(-0.25)
    })
})
