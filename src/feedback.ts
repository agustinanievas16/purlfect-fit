import type { SizingAttempt, SizingFeedback } from "./sizing.ts";

const feedbackStatuses = ["accepted", "needs-adjustment", "rejected"] as const;
const feedbackFocuses = ["body", "sleeve", "yoke", "underarm", "increases"] as const;

type FeedbackStoreConfig = {
  supabaseUrl: string | undefined;
  supabaseSecretKey: string | undefined;
};

export function parseSizingFeedback(value: unknown): SizingFeedback {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("feedback must be an object");
  }

  const { status, focus = [], comment = "" } = value as Record<string, unknown>;
  if (!feedbackStatuses.includes(status as SizingFeedback["status"])) {
    throw new Error("feedback status is invalid");
  }
  if (
    !Array.isArray(focus) ||
    focus.some((item) => !feedbackFocuses.includes(item))
  ) {
    throw new Error("feedback focus is invalid");
  }
  if (typeof comment !== "string" || comment.length > 5_000) {
    throw new Error("feedback comment must contain at most 5000 characters");
  }

  return {
    status: status as SizingFeedback["status"],
    focus: [...new Set(focus)] as SizingFeedback["focus"],
    comment: comment.trim(),
  };
}

export async function saveSizingFeedback(
  attempt: SizingAttempt,
  feedback: SizingFeedback,
  config: FeedbackStoreConfig = {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
  },
  request: typeof fetch = fetch,
): Promise<void> {
  if (!config.supabaseUrl || !config.supabaseSecretKey) {
    throw new Error("Feedback storage is not configured");
  }

  const response = await request(
    `${config.supabaseUrl.replace(/\/$/, "")}/rest/v1/sizing_feedback`,
    {
      method: "POST",
      headers: {
        apikey: config.supabaseSecretKey,
        "content-type": "application/json",
        prefer: "return=minimal",
      },
      body: JSON.stringify({
        model_version: "classic-raglan-v1",
        size_label: attempt.input.sizeLabel,
        input: attempt.input,
        target: attempt.target,
        proposal: attempt.proposal ?? null,
        deviations: attempt.deviations ?? null,
        feedback_status: feedback.status,
        feedback_focus: feedback.focus ?? [],
        feedback_comment: feedback.comment || null,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Feedback storage returned HTTP ${response.status}`);
  }
}
