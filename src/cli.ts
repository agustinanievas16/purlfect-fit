import {
  createSizingAttempt,
  type ClassicRaglanSizeInput,
} from "./sizing.ts";

try {
  let json = "";
  for await (const chunk of process.stdin) json += chunk;

  const input = JSON.parse(json) as ClassicRaglanSizeInput;
  const attempt = createSizingAttempt(input);

  console.log(
    JSON.stringify(
      {
        ...attempt,
        proposal: attempt.proposal ?? null,
        deviations: attempt.deviations ?? null,
      },
      null,
      2,
    ),
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : "Invalid input");
  process.exitCode = 1;
}
