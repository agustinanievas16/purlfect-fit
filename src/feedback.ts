import type { SizingAttempt, SizingFeedback } from "./sizing.ts";

const feedbackStatuses = ["accepted", "needs-adjustment", "rejected"] as const;
const feedbackFocuses = ["body", "sleeve", "yoke", "underarm", "increases"] as const;

type SizingStoreConfig = {
  supabaseUrl: string | undefined;
  supabaseSecretKey: string | undefined;
};

const defaultConfig = (): SizingStoreConfig => ({
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
});

function storageEndpoint(config: SizingStoreConfig): string {
  if (!config.supabaseUrl || !config.supabaseSecretKey) {
    throw new Error("Sizing storage is not configured");
  }
  return `${config.supabaseUrl.replace(/\/$/, "")}/rest/v1/sizing_feedback`;
}

function storageHeaders(config: SizingStoreConfig): Record<string, string> {
  return {
    apikey: config.supabaseSecretKey!,
    "content-type": "application/json",
    prefer: "return=representation",
  };
}

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

export async function saveSizingAttempt(
  attempt: SizingAttempt,
  feedback?: SizingFeedback,
  config: SizingStoreConfig = defaultConfig(),
  request: typeof fetch = fetch,
): Promise<string> {
  const response = await request(
    `${storageEndpoint(config)}?select=id`,
    {
      method: "POST",
      headers: storageHeaders(config),
      body: JSON.stringify({
        model_version: "classic-raglan-v1",
        size_label: attempt.input.sizeLabel,
        input: attempt.input,
        target: attempt.target,
        proposal: attempt.proposal ?? null,
        deviations: attempt.deviations ?? null,
        feedback_status: feedback?.status ?? null,
        feedback_focus: feedback?.focus ?? [],
        feedback_comment: feedback?.comment || null,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Sizing storage returned HTTP ${response.status}`);
  }

  const rows = await response.json() as Array<{ id?: unknown }>;
  if (typeof rows[0]?.id !== "string") {
    throw new Error("Sizing storage did not return an attempt id");
  }
  return rows[0].id;
}

export async function updateSizingFeedback(
  attemptId: string,
  feedback: SizingFeedback,
  config: SizingStoreConfig = defaultConfig(),
  request: typeof fetch = fetch,
): Promise<void> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(attemptId)) {
    throw new Error("attemptId is invalid");
  }

  const response = await request(
    `${storageEndpoint(config)}?id=eq.${attemptId}&select=id`,
    {
      method: "PATCH",
      headers: storageHeaders(config),
      body: JSON.stringify({
        feedback_status: feedback.status,
        feedback_focus: feedback.focus ?? [],
        feedback_comment: feedback.comment || null,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Sizing storage returned HTTP ${response.status}`);
  }

  const rows = await response.json() as Array<{ id?: unknown }>;
  if (rows[0]?.id !== attemptId) {
    throw new Error("Saved sizing attempt was not found");
  }
}
