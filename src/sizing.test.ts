import assert from "node:assert/strict";
import test from "node:test";

import { createSizingAttempt } from "./sizing.ts";

test("creates a traceable sizing attempt from a labelled size input", () => {
  const attempt = createSizingAttempt({
    sizeLabel: "M",
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

  assert.equal(attempt.input.sizeLabel, "M");
  assert.equal(attempt.target.bodyCircumferenceCm, 76);
  assert.equal(attempt.proposal?.increaseEvents, 20);
  assert.equal(attempt.proposal?.underarmStitches, 6);
  assert.deepEqual(attempt.deviations, {
    bodyCircumferenceCm: 0,
    sleeveCircumferenceCm: 0,
    yokeDepthCm: 0,
  });
});

test("reports signed measurement deviations in centimetres", () => {
  const attempt = createSizingAttempt({
    sizeLabel: "M",
    body: {
      bustOrChestCircumferenceCm: 70.2,
      bicepCircumferenceCm: 26.2,
      armholeDepthCm: 15.2,
    },
    ease: { bustOrChestCm: 6, bicepCm: 2, armholeDepthCm: 1 },
    toleranceCm: 0.3,
    construction: {
      gauge: { stitchesPer10Cm: 20, rowsPer10Cm: 25 },
      castOnStitches: 80,
      initialSleeveStitches: 10,
      increaseEveryRounds: 2,
      underarmRange: { minimum: 0, maximum: 10 },
    },
  });

  assert.deepEqual(attempt.deviations, {
    bodyCircumferenceCm: -0.2,
    sleeveCircumferenceCm: -0.2,
    yokeDepthCm: -0.2,
  });
});
