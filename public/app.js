const sizingForm = document.querySelector("#sizing-form");
const feedbackForm = document.querySelector("#feedback-form");
const result = document.querySelector("#result");
const formError = document.querySelector("#form-error");
const feedbackMessage = document.querySelector("#feedback-message");
let currentAttempt;

const number = (data, name) => Number(data.get(name));
const format = (value) => new Intl.NumberFormat("es-AR", { maximumFractionDigits: 3 }).format(value);
const escapeHtml = (value) => String(value).replace(
  /[&<>"']/g,
  (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character],
);

function buildInput(data) {
  return {
    sizeLabel: data.get("sizeLabel"),
    body: {
      bustOrChestCircumferenceCm: number(data, "bust"),
      bicepCircumferenceCm: number(data, "bicep"),
      armholeDepthCm: number(data, "armhole"),
    },
    ease: {
      bustOrChestCm: number(data, "bustEase"),
      bicepCm: number(data, "bicepEase"),
      armholeDepthCm: number(data, "armholeEase"),
    },
    toleranceCm: number(data, "tolerance"),
    construction: {
      gauge: {
        stitchesPer10Cm: number(data, "stitchGauge"),
        rowsPer10Cm: number(data, "rowGauge"),
      },
      castOnStitches: number(data, "castOn"),
      initialSleeveStitches: number(data, "initialSleeve"),
      increaseEveryRounds: number(data, "increaseEvery"),
      underarmRange: {
        minimum: number(data, "underarmMin"),
        maximum: number(data, "underarmMax"),
      },
    },
  };
}

function metric(label, target, actual, deviation) {
  return `<div class="metric"><span>${label}</span><strong>${format(actual)} cm</strong><span>Objetivo: ${format(target)} · Desvío: ${deviation > 0 ? "+" : ""}${format(deviation)} cm</span></div>`;
}

function renderAttempt(attempt) {
  if (!attempt.proposal) {
    result.innerHTML = "<h2>Sin propuesta compatible</h2><p>Probá ampliar la tolerancia o revisar las restricciones de construcción.</p>";
  } else {
    const { proposal, target, deviations } = attempt;
    result.innerHTML = `<h2>Propuesta para el talle ${escapeHtml(attempt.input.sizeLabel)}</h2>
      <div class="metrics">
        ${metric("Cuerpo", target.bodyCircumferenceCm, proposal.result.bodyCircumferenceCm, deviations.bodyCircumferenceCm)}
        ${metric("Manga", target.sleeveCircumferenceCm, proposal.result.sleeveCircumferenceCm, deviations.sleeveCircumferenceCm)}
        ${metric("Canesú", target.yokeDepthCm, proposal.result.yokeDepthCm, deviations.yokeDepthCm)}
        <div class="metric"><span>Eventos de aumento</span><strong>${proposal.increaseEvents}</strong></div>
        <div class="metric"><span>Puntos bajo cada axila</span><strong>${proposal.underarmStitches}</strong></div>
      </div>`;
  }
  result.hidden = false;
  feedbackForm.hidden = false;
  feedbackMessage.textContent = "";
}

sizingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.textContent = "";
  try {
    const response = await fetch("/api/sizing-attempt", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(buildInput(new FormData(sizingForm))),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    currentAttempt = data;
    renderAttempt(data);
    if (!data.saved) {
      formError.textContent = "La propuesta se calculó, pero este intento no pudo guardarse.";
    }
  } catch (error) {
    formError.textContent = error.message ?? "No se pudo calcular la propuesta.";
  }
});

feedbackForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!currentAttempt) return;

  const data = new FormData(feedbackForm);
  feedbackMessage.className = "";
  feedbackMessage.textContent = "Guardando…";

  try {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        attemptId: currentAttempt.attemptId,
        input: currentAttempt.input,
        feedback: {
          status: data.get("status"),
          focus: data.getAll("focus"),
          comment: data.get("comment"),
        },
      }),
    });
    const saved = await response.json();
    if (!response.ok) throw new Error(saved.error);

    feedbackMessage.className = "success";
    feedbackMessage.textContent = "Comentarios enviados!";
    feedbackForm.reset();
  } catch (error) {
    feedbackMessage.className = "error";
    feedbackMessage.textContent = error.message ?? "No se pudo guardar el feedback.";
  }
});
