import {
  createClassicRaglanTarget,
  proposeClassicRaglan,
  type ClassicRaglanProposal,
  type ClassicRaglanProposalInput,
  type ClassicRaglanTarget,
  type RaglanBodyMeasurements,
  type RaglanEase,
} from "./raglan.ts";

export type ClassicRaglanSizeInput = {
  sizeLabel: string;
  body: RaglanBodyMeasurements;
  ease: RaglanEase;
  toleranceCm: number;
  construction: Omit<ClassicRaglanProposalInput, "target">;
};

export type FeedbackStatus = "accepted" | "needs-adjustment" | "rejected";

export type SizingFeedback = {
  status: FeedbackStatus;
  focus?: Array<"body" | "sleeve" | "yoke" | "underarm" | "increases">;
  comment?: string;
};

export type SizingDeviations = {
  bodyCircumferenceCm: number;
  sleeveCircumferenceCm: number;
  yokeDepthCm: number;
};

export type SizingAttempt = {
  input: ClassicRaglanSizeInput;
  target: ClassicRaglanTarget;
  proposal: ClassicRaglanProposal | undefined;
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

  const target = createClassicRaglanTarget(
    input.body,
    input.ease,
    input.toleranceCm,
  );
  const proposal = proposeClassicRaglan({ ...input.construction, target });

  return {
    input,
    target,
    proposal,
    deviations: proposal
      ? {
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
