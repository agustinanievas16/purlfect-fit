import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";

import {
  parseSizingFeedback,
  saveSizingAttempt,
  updateSizingFeedback,
} from "./feedback.ts";
import {
  createSizingAttempt,
  type ClassicRaglanSizeInput,
} from "./sizing.ts";

const publicFiles = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/app.js", ["app.js", "text/javascript; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
]);

function sendJson(response: ServerResponse, status: number, value: unknown): void {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(value));
}

async function readJson<T>(request: IncomingMessage): Promise<T> {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 100_000) throw new Error("Request body is too large");
  }
  return JSON.parse(body) as T;
}

const server = createServer(async (request, response) => {
  try {
    if (request.method === "POST" && request.url === "/api/sizing-attempt") {
      const attempt = createSizingAttempt(
        await readJson<ClassicRaglanSizeInput>(request),
      );
      let attemptId: string | null = null;
      try {
        attemptId = await saveSizingAttempt(attempt);
      } catch (error) {
        console.error(
          "Could not save sizing attempt:",
          error instanceof Error ? error.message : "Unknown storage error",
        );
      }
      sendJson(response, 200, {
        ...attempt,
        proposal: attempt.proposal ?? null,
        deviations: attempt.deviations ?? null,
        attemptId,
        saved: attemptId !== null,
      });
      return;
    }

    if (request.method === "POST" && request.url === "/api/feedback") {
      const submission = await readJson<{
        attemptId?: unknown;
        input: ClassicRaglanSizeInput;
        feedback: unknown;
      }>(request);
      const feedback = parseSizingFeedback(submission.feedback);

      try {
        if (typeof submission.attemptId === "string") {
          await updateSizingFeedback(submission.attemptId, feedback);
        } else {
          await saveSizingAttempt(
            createSizingAttempt(submission.input),
            feedback,
          );
        }
      } catch (error) {
        console.error(
          "Could not save feedback:",
          error instanceof Error ? error.message : "Unknown storage error",
        );
        sendJson(response, 503, {
          error: "No pudimos guardar el feedback. Probá nuevamente.",
        });
        return;
      }

      sendJson(response, 201, { saved: true });
      return;
    }

    const publicPath = request.url?.split("?")[0] ?? "";
    if (request.method === "GET" && publicFiles.has(publicPath)) {
      const [fileName, contentType] = publicFiles.get(publicPath)!;
      const content = await readFile(new URL(`../public/${fileName}`, import.meta.url));
      response.writeHead(200, {
        "content-type": contentType,
        "cache-control": "no-store",
      });
      response.end(content);
      return;
    }

    sendJson(response, 404, { error: "Not found" });
  } catch (error) {
    sendJson(response, 400, {
      error: error instanceof Error ? error.message : "Invalid request",
    });
  }
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => console.log(`Purlfect Fit: http://localhost:${port}`));
