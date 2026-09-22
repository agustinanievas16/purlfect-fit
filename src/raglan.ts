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

export type ClassicRaglanResult = {
  yokeStitches: number;
  bodyStitches: number;
  sleeveStartStitches: number;
  bodyCircumferenceCm: number;
  sleeveCircumferenceCm: number;
  yokeDepthCm: number;
};

export type ClassicRaglanProposalInput = {
  gauge: Gauge;
  castOnStitches: number;
  initialSleeveStitches: number;
  increaseEveryRounds: number;
  underarmRange: { minimum: number; maximum: number };
  target: {
    bodyCircumferenceCm: number;
    sleeveCircumferenceCm: number;
    yokeDepthCm: number;
    toleranceCm: number;
  };
};

export type ClassicRaglanProposal = {
  increaseEvents: number;
  underarmStitches: number;
  result: ClassicRaglanResult;
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

function stitchesToCm(stitches: number, gauge: number): number {
  return (stitches * 10) / gauge;
}

export function calculateClassicRaglan(
  input: ClassicRaglanInput,
): ClassicRaglanResult {
  positiveInteger(input.gauge.stitchesPer10Cm, "stitchesPer10Cm");
  positiveInteger(input.gauge.rowsPer10Cm, "rowsPer10Cm");
  positiveInteger(input.castOnStitches, "castOnStitches");
  positiveInteger(input.increaseEvents, "increaseEvents");
  positiveInteger(input.heldSleeveStitches, "heldSleeveStitches");
  nonNegativeInteger(input.underarmStitches, "underarmStitches");
  positiveInteger(input.yokeRounds, "yokeRounds");

  // ponytail: joint increases only; add phase scheduling when a second pattern requires it.
  const yokeStitches = input.castOnStitches + input.increaseEvents * 8;
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
  positiveInteger(input.increaseEveryRounds, "increaseEveryRounds");
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
      (10 * input.increaseEveryRounds),
  );
  let best: ClassicRaglanProposal | undefined;
  let bestDeviation = Infinity;

  // ponytail: exhaustive search is enough for the small MVP range; optimize only if real inputs prove it slow.
  for (let increaseEvents = 1; increaseEvents <= maxIncreaseEvents; increaseEvents += 1) {
    const heldSleeveStitches = input.initialSleeveStitches + increaseEvents * 2;

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
        yokeRounds: increaseEvents * input.increaseEveryRounds,
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
        best = { increaseEvents, underarmStitches, result };
        bestDeviation = totalDeviation;
      }
    }
  }

  return best;
}
