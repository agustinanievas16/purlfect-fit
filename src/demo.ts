import { createSizingAttempt } from "./sizing.ts";

const attempt = createSizingAttempt({
  sizeLabel: "Example",
  body: {
    bustOrChestCircumferenceCm: 70,
    bicepCircumferenceCm: 26,
    armholeDepthCm: 15,
  },
  ease: { bustOrChestCm: 6, bicepCm: 2, armholeDepthCm: 1 },
  toleranceCm: 0.1,
  construction: {
    gauge: { stitchesPer10Cm: 20, rowsPer10Cm: 25 },
    castOnStitches: 80,
    initialSleeveStitches: 10,
    increaseEveryRounds: 2,
    underarmRange: { minimum: 0, maximum: 10 },
  },
});

console.log(JSON.stringify(attempt, null, 2));
