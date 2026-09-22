import assert from "node:assert/strict";
import test from "node:test";

import { calculateClassicRaglan, proposeClassicRaglan } from "./raglan.ts";

test("calculates the measurements of a classic raglan construction", () => {
  const result = calculateClassicRaglan({
    gauge: { stitchesPer10Cm: 20, rowsPer10Cm: 25 },
    castOnStitches: 80,
    increaseEvents: 20,
    heldSleeveStitches: 50,
    underarmStitches: 6,
    yokeRounds: 40,
  });

  assert.deepEqual(result, {
    yokeStitches: 240,
    bodyStitches: 152,
    sleeveStartStitches: 56,
    bodyCircumferenceCm: 76,
    sleeveCircumferenceCm: 28,
    yokeDepthCm: 16,
  });
});

test("rejects a gauge that cannot describe a real swatch", () => {
  assert.throws(
    () =>
      calculateClassicRaglan({
        gauge: { stitchesPer10Cm: 0, rowsPer10Cm: 25 },
        castOnStitches: 80,
        increaseEvents: 20,
        heldSleeveStitches: 50,
        underarmStitches: 6,
        yokeRounds: 40,
      }),
    /stitchesPer10Cm must be a positive integer/,
  );
});

test("allows a design with no underarm cast-on stitches", () => {
  const result = calculateClassicRaglan({
    gauge: { stitchesPer10Cm: 20, rowsPer10Cm: 25 },
    castOnStitches: 80,
    increaseEvents: 20,
    heldSleeveStitches: 50,
    underarmStitches: 0,
    yokeRounds: 40,
  });

  assert.equal(result.bodyStitches, 140);
  assert.equal(result.sleeveStartStitches, 50);
});

test("proposes the construction that meets body, sleeve, and yoke targets", () => {
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

  assert.deepEqual(proposal, {
    increaseEvents: 20,
    underarmStitches: 6,
    result: {
      yokeStitches: 240,
      bodyStitches: 152,
      sleeveStartStitches: 56,
      bodyCircumferenceCm: 76,
      sleeveCircumferenceCm: 28,
      yokeDepthCm: 16,
    },
  });
});

test("returns no proposal when the permitted underarm range cannot meet the target", () => {
  const proposal = proposeClassicRaglan({
    gauge: { stitchesPer10Cm: 20, rowsPer10Cm: 25 },
    castOnStitches: 80,
    initialSleeveStitches: 10,
    increaseEveryRounds: 2,
    underarmRange: { minimum: 0, maximum: 2 },
    target: {
      bodyCircumferenceCm: 76,
      sleeveCircumferenceCm: 28,
      yokeDepthCm: 16,
      toleranceCm: 0.1,
    },
  });

  assert.equal(proposal, undefined);
});
