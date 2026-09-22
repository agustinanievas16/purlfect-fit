import {
  createClassicRaglanTarget,
  proposeClassicRaglanDesign,
  type ClassicRaglanDesignInput,
  type ClassicRaglanDesignProposal,
  type ClassicRaglanTarget,
  type RaglanBodyMeasurements,
  type RaglanEase,
} from "./raglan.ts";

export type ClassicRaglanSizeInput = {
  sizeLabel: string;
  body: RaglanBodyMeasurements;
  ease: RaglanEase;
  toleranceCm: number;
  construction: Omit<ClassicRaglanDesignInput, "target">;
};

export type ClassicRaglanSizeTarget = ClassicRaglanTarget & {
  neckCircumferenceCm: number;
};

export type FeedbackStatus = "accepted" | "needs-adjustment" | "rejected";

export type SizingFeedback = {
  status: FeedbackStatus;
  focus?: Array<"neck" | "body" | "sleeve" | "yoke" | "underarm" | "increases">;
  comment?: string;
};

export type SizingDeviations = {
  neckCircumferenceCm: number;
  bodyCircumferenceCm: number;
  sleeveCircumferenceCm: number;
  yokeDepthCm: number;
};

export type SizingAttempt = {
  input: ClassicRaglanSizeInput;
  target: ClassicRaglanSizeTarget;
  proposal: ClassicRaglanDesignProposal | undefined;
  deviations: SizingDeviations | undefined;
  feedback?: SizingFeedback;
};

function cmDifference(actual: number, target: number): number {
  return Number((actual - target).toFixed(3));
}

export function createSizingAttempt(
  input: ClassicRaglanSizeInput,
): SizingAttempt {
  if (!input.sizeLabel.trim()) {
    throw new Error("sizeLabel must not be empty");
  }

  const target = {
    ...createClassicRaglanTarget(input.body, input.ease, input.toleranceCm),
    neckCircumferenceCm: input.construction.finishedNeckCircumferenceCm,
  };
  const proposal = proposeClassicRaglanDesign({
    ...input.construction,
    target,
  });

  return {
    input,
    target,
    proposal,
    deviations: proposal
      ? {
          neckCircumferenceCm: cmDifference(
            proposal.neckCircumferenceCm,
            target.neckCircumferenceCm,
          ),
          bodyCircumferenceCm: cmDifference(
            proposal.result.bodyCircumferenceCm,
            target.bodyCircumferenceCm,
          ),
          sleeveCircumferenceCm: cmDifference(
            proposal.result.sleeveCircumferenceCm,
            target.sleeveCircumferenceCm,
          ),
          yokeDepthCm: cmDifference(
            proposal.result.yokeDepthCm,
            target.yokeDepthCm,
          ),
        }
      : undefined,
  };
}
