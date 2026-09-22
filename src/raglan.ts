export type Gauge = {
  stitchesPer10Cm: number;
  rowsPer10Cm: number;
};

export type ClassicRaglanInput = {
  gauge: Gauge;
  castOnStitches: number;
  increaseEvents: number;
  heldSleeveStitches: number;
  underarmStitches: number;
  yokeRounds: number;
};

export type RaglanIncreaseEvents = {
  joint: number;
  bodyOnly: number;
  sleeveOnly: number;
};

export type CompoundRaglanInput = {
  gauge: Gauge;
  yokeStartStitches: number;
  increaseEvents: RaglanIncreaseEvents;
  heldSleeveStitches: number;
  underarmStitches: number;
  yokeRounds: number;
};

export type ClassicRaglanResult = {
  yokeStitches: number;
  bodyStitches: number;
  sleeveStartStitches: number;
  bodyCircumferenceCm: number;
  sleeveCircumferenceCm: number;
  yokeDepthCm: number;
};

export type ClassicRaglanTarget = {
  bodyCircumferenceCm: number;
  sleeveCircumferenceCm: number;
  yokeDepthCm: number;
  toleranceCm: number;
};

export type RaglanBodyMeasurements = {
  bustOrChestCircumferenceCm: number;
  bicepCircumferenceCm: number;
  armholeDepthCm: number;
};

export type RaglanEase = {
  bustOrChestCm: number;
  bicepCm: number;
  armholeDepthCm: number;
};

export type ClassicRaglanProposalInput = {
  gauge: Gauge;
  castOnStitches: number;
  initialSleeveStitches: number;
  underarmRange: { minimum: number; maximum: number };
  target: ClassicRaglanTarget;
};

export type ClassicRaglanProposal = {
  increaseEvents: number;
  increaseEveryRounds: number;
  underarmStitches: number;
  result: ClassicRaglanResult;
};

export type ClassicRaglanDesignInput = {
  gauge: Gauge;
  finishedNeckCircumferenceCm: number;
  castOnMultiple: number;
  raglanLineStitchesEach: number;
  underarmRange: { minimum: number; maximum: number };
  target: ClassicRaglanTarget;
};

export type ClassicRaglanDesignProposal = ClassicRaglanProposal & {
  castOnStitches: number;
  initialFrontStitches: number;
  initialBackStitches: number;
  initialSleeveStitchesEach: number;
  raglanLineStitchesEach: number;
  neckCircumferenceCm: number;
};

function positiveInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
}

function nonNegativeInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative integer`);
  }
}

function positiveNumber(value: number, name: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive number`);
  }
}

function nonNegativeNumber(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a non-negative number`);
  }
}

function finiteNumber(value: number, name: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${name} must be a finite number`);
  }
}

function stitchesToCm(stitches: number, gauge: number): number {
  return (stitches * 10) / gauge;
}

export function createClassicRaglanTarget(
  body: RaglanBodyMeasurements,
  ease: RaglanEase,
  toleranceCm: number,
): ClassicRaglanTarget {
  positiveNumber(body.bustOrChestCircumferenceCm, "body.bustOrChestCircumferenceCm");
  positiveNumber(body.bicepCircumferenceCm, "body.bicepCircumferenceCm");
  positiveNumber(body.armholeDepthCm, "body.armholeDepthCm");
  finiteNumber(ease.bustOrChestCm, "ease.bustOrChestCm");
  finiteNumber(ease.bicepCm, "ease.bicepCm");
  finiteNumber(ease.armholeDepthCm, "ease.armholeDepthCm");
  nonNegativeNumber(toleranceCm, "toleranceCm");

  return {
    bodyCircumferenceCm: body.bustOrChestCircumferenceCm + ease.bustOrChestCm,
    sleeveCircumferenceCm: body.bicepCircumferenceCm + ease.bicepCm,
    yokeDepthCm: body.armholeDepthCm + ease.armholeDepthCm,
    toleranceCm,
  };
}

export function calculateClassicRaglan(
  input: ClassicRaglanInput,
): ClassicRaglanResult {
  positiveInteger(input.increaseEvents, "increaseEvents");

  return calculateCompoundRaglan({
    gauge: input.gauge,
    yokeStartStitches: input.castOnStitches,
    increaseEvents: {
      joint: input.increaseEvents,
      bodyOnly: 0,
      sleeveOnly: 0,
    },
    heldSleeveStitches: input.heldSleeveStitches,
    underarmStitches: input.underarmStitches,
    yokeRounds: input.yokeRounds,
  });
}

export function calculateCompoundRaglan(
  input: CompoundRaglanInput,
): ClassicRaglanResult {
  positiveInteger(input.gauge.stitchesPer10Cm, "stitchesPer10Cm");
  positiveInteger(input.gauge.rowsPer10Cm, "rowsPer10Cm");
  positiveInteger(input.yokeStartStitches, "yokeStartStitches");
  nonNegativeInteger(input.increaseEvents.joint, "increaseEvents.joint");
  nonNegativeInteger(input.increaseEvents.bodyOnly, "increaseEvents.bodyOnly");
  nonNegativeInteger(input.increaseEvents.sleeveOnly, "increaseEvents.sleeveOnly");
  positiveInteger(input.heldSleeveStitches, "heldSleeveStitches");
  nonNegativeInteger(input.underarmStitches, "underarmStitches");
  positiveInteger(input.yokeRounds, "yokeRounds");

  const yokeStitches =
    input.yokeStartStitches +
    input.increaseEvents.joint * 8 +
    input.increaseEvents.bodyOnly * 4 +
    input.increaseEvents.sleeveOnly * 4;
  const sleeveStartStitches = input.heldSleeveStitches + input.underarmStitches;
  const bodyStitches =
    yokeStitches - input.heldSleeveStitches * 2 + input.underarmStitches * 2;

  return {
    yokeStitches,
    bodyStitches,
    sleeveStartStitches,
    bodyCircumferenceCm: stitchesToCm(
      bodyStitches,
      input.gauge.stitchesPer10Cm,
    ),
    sleeveCircumferenceCm: stitchesToCm(
      sleeveStartStitches,
      input.gauge.stitchesPer10Cm,
    ),
    yokeDepthCm: (input.yokeRounds * 10) / input.gauge.rowsPer10Cm,
  };
}

export function proposeClassicRaglan(
  input: ClassicRaglanProposalInput,
): ClassicRaglanProposal | undefined {
  positiveInteger(input.gauge.stitchesPer10Cm, "stitchesPer10Cm");
  positiveInteger(input.gauge.rowsPer10Cm, "rowsPer10Cm");
  positiveInteger(input.castOnStitches, "castOnStitches");
  positiveInteger(input.initialSleeveStitches, "initialSleeveStitches");
  nonNegativeInteger(input.underarmRange.minimum, "underarmRange.minimum");
  nonNegativeInteger(input.underarmRange.maximum, "underarmRange.maximum");
  positiveNumber(input.target.bodyCircumferenceCm, "target.bodyCircumferenceCm");
  positiveNumber(input.target.sleeveCircumferenceCm, "target.sleeveCircumferenceCm");
  positiveNumber(input.target.yokeDepthCm, "target.yokeDepthCm");
  nonNegativeNumber(input.target.toleranceCm, "target.toleranceCm");

  if (input.underarmRange.minimum > input.underarmRange.maximum) {
    throw new Error("underarmRange.minimum must not exceed underarmRange.maximum");
  }

  const maxIncreaseEvents = Math.floor(
    ((input.target.yokeDepthCm + input.target.toleranceCm) *
      input.gauge.rowsPer10Cm) /
      10,
  );
  const targetYokeRounds =
    (input.target.yokeDepthCm * input.gauge.rowsPer10Cm) / 10;
  let best: ClassicRaglanProposal | undefined;
  let bestDeviation = Infinity;

  // ponytail: exhaustive search is enough for the small MVP range; optimize only if real inputs prove it slow.
  for (let increaseEvents = 1; increaseEvents <= maxIncreaseEvents; increaseEvents += 1) {
    const heldSleeveStitches = input.initialSleeveStitches + increaseEvents * 2;
    const increaseCadences = new Set([
      Math.floor(targetYokeRounds / increaseEvents),
      Math.ceil(targetYokeRounds / increaseEvents),
    ]);

    for (const increaseEveryRounds of increaseCadences) {
      if (increaseEveryRounds < 1) continue;

      for (
        let underarmStitches = input.underarmRange.minimum;
        underarmStitches <= input.underarmRange.maximum;
        underarmStitches += 1
      ) {
        const result = calculateClassicRaglan({
          gauge: input.gauge,
          castOnStitches: input.castOnStitches,
          increaseEvents,
          heldSleeveStitches,
          underarmStitches,
          yokeRounds: increaseEvents * increaseEveryRounds,
        });
        const bodyDeviation = Math.abs(
          result.bodyCircumferenceCm - input.target.bodyCircumferenceCm,
        );
        const sleeveDeviation = Math.abs(
          result.sleeveCircumferenceCm - input.target.sleeveCircumferenceCm,
        );
        const yokeDeviation = Math.abs(
          result.yokeDepthCm - input.target.yokeDepthCm,
        );
        const totalDeviation = bodyDeviation + sleeveDeviation + yokeDeviation;

        if (
          bodyDeviation <= input.target.toleranceCm &&
          sleeveDeviation <= input.target.toleranceCm &&
          yokeDeviation <= input.target.toleranceCm &&
          totalDeviation < bestDeviation
        ) {
          best = {
            increaseEvents,
            increaseEveryRounds,
            underarmStitches,
            result,
          };
          bestDeviation = totalDeviation;
        }
      }
    }
  }

  return best;
}

export function proposeClassicRaglanDesign(
  input: ClassicRaglanDesignInput,
): ClassicRaglanDesignProposal | undefined {
  positiveInteger(input.gauge.stitchesPer10Cm, "stitchesPer10Cm");
  positiveInteger(input.gauge.rowsPer10Cm, "rowsPer10Cm");
  positiveNumber(
    input.finishedNeckCircumferenceCm,
    "finishedNeckCircumferenceCm",
  );
  positiveInteger(input.castOnMultiple, "castOnMultiple");
  nonNegativeInteger(
    input.raglanLineStitchesEach,
    "raglanLineStitchesEach",
  );
  nonNegativeInteger(input.underarmRange.minimum, "underarmRange.minimum");
  nonNegativeInteger(input.underarmRange.maximum, "underarmRange.maximum");
  positiveNumber(input.target.bodyCircumferenceCm, "target.bodyCircumferenceCm");
  positiveNumber(input.target.sleeveCircumferenceCm, "target.sleeveCircumferenceCm");
  positiveNumber(input.target.yokeDepthCm, "target.yokeDepthCm");
  nonNegativeNumber(input.target.toleranceCm, "target.toleranceCm");

  if (input.underarmRange.minimum > input.underarmRange.maximum) {
    throw new Error("underarmRange.minimum must not exceed underarmRange.maximum");
  }

  const minimumCastOn = Math.max(
    1,
    Math.ceil(
      ((input.finishedNeckCircumferenceCm - input.target.toleranceCm) *
        input.gauge.stitchesPer10Cm) /
        10 -
        Number.EPSILON,
    ),
  );
  const maximumCastOn = Math.floor(
    ((input.finishedNeckCircumferenceCm + input.target.toleranceCm) *
      input.gauge.stitchesPer10Cm) /
      10 +
      Number.EPSILON,
  );
  const raglanLineStitches = input.raglanLineStitchesEach * 4;
  let best: ClassicRaglanDesignProposal | undefined;
  let bestDeviation = Infinity;

  // ponytail: these MVP ranges are tiny; replace exhaustive search only if real inputs prove otherwise.
  for (
    let castOnStitches = minimumCastOn;
    castOnStitches <= maximumCastOn;
    castOnStitches += 1
  ) {
    if (castOnStitches % input.castOnMultiple !== 0) continue;

    const sectionStitches = castOnStitches - raglanLineStitches;
    for (
      let initialSleeveStitches = 1;
      initialSleeveStitches * 2 < sectionStitches;
      initialSleeveStitches += 1
    ) {
      const frontAndBackStitches =
        sectionStitches - initialSleeveStitches * 2;
      if (frontAndBackStitches < 2 || frontAndBackStitches % 2 !== 0) {
        continue;
      }

      const construction = proposeClassicRaglan({
        gauge: input.gauge,
        castOnStitches,
        initialSleeveStitches,
        underarmRange: input.underarmRange,
        target: input.target,
      });
      if (!construction) continue;

      const neckCircumferenceCm = stitchesToCm(
        castOnStitches,
        input.gauge.stitchesPer10Cm,
      );
      const totalDeviation =
        Math.abs(neckCircumferenceCm - input.finishedNeckCircumferenceCm) +
        Math.abs(
          construction.result.bodyCircumferenceCm -
            input.target.bodyCircumferenceCm,
        ) +
        Math.abs(
          construction.result.sleeveCircumferenceCm -
            input.target.sleeveCircumferenceCm,
        ) +
        Math.abs(construction.result.yokeDepthCm - input.target.yokeDepthCm);

      if (totalDeviation < bestDeviation) {
        best = {
          castOnStitches,
          initialFrontStitches: frontAndBackStitches / 2,
          initialBackStitches: frontAndBackStitches / 2,
          initialSleeveStitchesEach: initialSleeveStitches,
          raglanLineStitchesEach: input.raglanLineStitchesEach,
          neckCircumferenceCm,
          ...construction,
        };
        bestDeviation = totalDeviation;
      }
    }
  }

  return best;
}
