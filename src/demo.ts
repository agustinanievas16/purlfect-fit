import { proposeClassicRaglan } from "./raglan.ts";

const proposal = proposeClassicRaglan({
  gauge: { stitchesPer10Cm: 20, rowsPer10Cm: 25 },
  castOnStitches: 80,
  initialSleeveStitches: 10,
  increaseEveryRounds: 2,
  underarmRange: { minimum: 0, maximum: 10 },
  target: {
    bodyCircumferenceCm: 76,
    sleeveCircumferenceCm: 28,
    yokeDepthCm: 16,
    toleranceCm: 0.1,
  },
});

console.log(JSON.stringify(proposal, null, 2));
