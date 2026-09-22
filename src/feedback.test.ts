import assert from "node:assert/strict";
import test from "node:test";

import {
  parseSizingFeedback,
  saveSizingAttempt,
  updateSizingFeedback,
} from "./feedback.ts";
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
    finishedNeckCircumferenceCm: 40,
    castOnMultiple: 4,
    raglanLineStitchesEach: 1,
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
    () => parseSizingFeedback({ status: "accepted", focus: ["waist"] }),
    /focus is invalid/,
  );
});

test("stores the server-computed sizing attempt and returns its id", async () => {
  const attempt = createSizingAttempt(input);
  let requestUrl = "";
  let requestOptions: RequestInit | undefined;
  const attemptId = "2bb6f08a-8571-4a86-9a3f-86dc5f2c1772";

  const savedId = await saveSizingAttempt(
    attempt,
    undefined,
    {
      supabaseUrl: "https://example.supabase.co/",
      supabaseSecretKey: "secret-value",
    },
    async (url, options) => {
      requestUrl = String(url);
      requestOptions = options;
      return Response.json([{ id: attemptId }], { status: 201 });
    },
  );

  assert.equal(
    requestUrl,
    "https://example.supabase.co/rest/v1/sizing_feedback?select=id",
  );
  assert.equal(savedId, attemptId);
  assert.equal(
    new Headers(requestOptions?.headers).get("apikey"),
    "secret-value",
  );
  const body = JSON.parse(String(requestOptions?.body));
  assert.equal(body.model_version, "classic-raglan-v1");
  assert.equal(body.feedback_status, null);
});

test("updates the saved attempt instead of creating a duplicate", async () => {
  const attemptId = "2bb6f08a-8571-4a86-9a3f-86dc5f2c1772";
  let requestUrl = "";
  let requestOptions: RequestInit | undefined;

  await updateSizingFeedback(
    attemptId,
    { status: "accepted", focus: ["body"], comment: "Funciona." },
    {
      supabaseUrl: "https://example.supabase.co",
      supabaseSecretKey: "secret-value",
    },
    async (url, options) => {
      requestUrl = String(url);
      requestOptions = options;
      return Response.json([{ id: attemptId }]);
    },
  );

  assert.equal(
    requestUrl,
    `https://example.supabase.co/rest/v1/sizing_feedback?id=eq.${attemptId}&select=id`,
  );
  assert.equal(requestOptions?.method, "PATCH");
  assert.deepEqual(JSON.parse(String(requestOptions?.body)), {
    feedback_status: "accepted",
    feedback_focus: ["body"],
    feedback_comment: "Funciona.",
  });
});
