import assert from "node:assert/strict";
import test from "node:test";

import { parseSizingFeedback, saveSizingFeedback } from "./feedback.ts";
import { createSizingAttempt, type ClassicRaglanSizeInput } from "./sizing.ts";

const input: ClassicRaglanSizeInput = {
  sizeLabel: "M",
  body: {
    bustOrChestCircumferenceCm: 70,
    bicepCircumferenceCm: 26,
    armholeDepthCm: 15,
  },
  ease: { bustOrChestCm: 6, bicepCm: 2, armholeDepthCm: 1 },
  toleranceCm: 0.5,
  construction: {
    gauge: { stitchesPer10Cm: 20, rowsPer10Cm: 25 },
    castOnStitches: 80,
    initialSleeveStitches: 10,
    increaseEveryRounds: 2,
    underarmRange: { minimum: 0, maximum: 10 },
  },
};

test("validates and normalizes tester feedback", () => {
  assert.deepEqual(
    parseSizingFeedback({
      status: "needs-adjustment",
      focus: ["sleeve", "sleeve"],
      comment: "  Necesita más amplitud.  ",
    }),
    {
      status: "needs-adjustment",
      focus: ["sleeve"],
      comment: "Necesita más amplitud.",
    },
  );
});

test("rejects feedback values outside the supported vocabulary", () => {
  assert.throws(
    () => parseSizingFeedback({ status: "maybe", focus: [] }),
    /status is invalid/,
  );
  assert.throws(
    () => parseSizingFeedback({ status: "accepted", focus: ["neck"] }),
    /focus is invalid/,
  );
});

test("stores the server-computed sizing attempt without exposing the secret", async () => {
  const attempt = createSizingAttempt(input);
  let requestUrl = "";
  let requestOptions: RequestInit | undefined;

  await saveSizingFeedback(
    attempt,
    { status: "accepted", focus: [], comment: "Funciona." },
    {
      supabaseUrl: "https://example.supabase.co/",
      supabaseSecretKey: "secret-value",
    },
    async (url, options) => {
      requestUrl = String(url);
      requestOptions = options;
      return new Response(null, { status: 201 });
    },
  );

  assert.equal(
    requestUrl,
    "https://example.supabase.co/rest/v1/sizing_feedback",
  );
  assert.equal(
    new Headers(requestOptions?.headers).get("apikey"),
    "secret-value",
  );
  assert.equal(
    JSON.parse(String(requestOptions?.body)).model_version,
    "classic-raglan-v1",
  );
});
