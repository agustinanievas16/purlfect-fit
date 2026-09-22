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
      finishedNeckCircumferenceCm: 40,
      castOnMultiple: 4,
      raglanLineStitchesEach: 1,
      increaseEveryRounds: 2,
      underarmRange: { minimum: 0, maximum: 10 },
    },
  });

  assert.equal(attempt.input.sizeLabel, "M");
  assert.equal(attempt.target.bodyCircumferenceCm, 76);
  assert.equal(attempt.proposal?.castOnStitches, 80);
  assert.equal(attempt.proposal?.initialSleeveStitchesEach, 10);
  assert.equal(attempt.proposal?.increaseEvents, 20);
  assert.equal(attempt.proposal?.underarmStitches, 6);
  assert.deepEqual(attempt.deviations, {
    neckCircumferenceCm: 0,
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
      finishedNeckCircumferenceCm: 40.2,
      castOnMultiple: 4,
      raglanLineStitchesEach: 1,
      increaseEveryRounds: 2,
      underarmRange: { minimum: 0, maximum: 10 },
    },
  });

  assert.deepEqual(attempt.deviations, {
    neckCircumferenceCm: -0.2,
    bodyCircumferenceCm: -0.2,
    sleeveCircumferenceCm: -0.2,
    yokeDepthCm: -0.2,
  });
});
