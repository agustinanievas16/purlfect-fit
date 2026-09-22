import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createSizingAttempt } from "./sizing.ts";

const formHtml = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");

function defaultFormValue(name: string): string {
  const match = formHtml.match(
    new RegExp(`<input name="${name}"[^>]* value="([^"]*)"`),
  );
  assert.ok(match, `missing default form value for ${name}`);
  return match[1];
}

const defaultFormNumber = (name: string): number => Number(defaultFormValue(name));

test("the form defaults reconstruct published size A from the reference pattern", () => {
  const attempt = createSizingAttempt({
    sizeLabel: defaultFormValue("sizeLabel"),
    body: {
      bustOrChestCircumferenceCm: defaultFormNumber("bust"),
      bicepCircumferenceCm: defaultFormNumber("bicep"),
      armholeDepthCm: defaultFormNumber("armhole"),
    },
    ease: {
      bustOrChestCm: defaultFormNumber("bustEase"),
      bicepCm: defaultFormNumber("bicepEase"),
      armholeDepthCm: defaultFormNumber("armholeEase"),
    },
    toleranceCm: defaultFormNumber("tolerance"),
    construction: {
      gauge: {
        stitchesPer10Cm: defaultFormNumber("stitchGauge"),
        rowsPer10Cm: defaultFormNumber("rowGauge"),
      },
      finishedNeckCircumferenceCm: defaultFormNumber("neckCircumference"),
      castOnMultiple: defaultFormNumber("castOnMultiple"),
      raglanLineStitchesEach: defaultFormNumber("raglanLineStitches"),
      increaseEveryRounds: defaultFormNumber("increaseEvery"),
      underarmRange: {
        minimum: defaultFormNumber("underarmMin"),
        maximum: defaultFormNumber("underarmMax"),
      },
    },
  });

  assert.equal(attempt.input.sizeLabel, "A");
  assert.equal(attempt.target.bodyCircumferenceCm, 90);
  assert.equal(attempt.proposal?.castOnStitches, 64);
  assert.equal(attempt.proposal?.initialFrontStitches, 22);
  assert.equal(attempt.proposal?.initialBackStitches, 22);
  assert.equal(attempt.proposal?.initialSleeveStitchesEach, 6);
  assert.equal(attempt.proposal?.increaseEvents, 21);
  assert.equal(attempt.proposal?.underarmStitches, 4);
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
