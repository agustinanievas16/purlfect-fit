# Purlfect Fit

Purlfect Fit is an early-stage public learning project for building traceable sizing proposals for hand-knit garments.

It starts with a deliberately narrow and testable scope: classic seamless, top-down raglan sweaters.

> **Project status:** experimental. The calculation core and the tester-facing web interface are under domain validation; this is not yet a source of publishable knitting instructions.

## Why this exists

Grading a hand-knit pattern from a base size often means manually recalculating stitches, rows, increases, and finished measurements for every size. A garment cannot be scaled uniformly: body, sleeves, yoke depth, ease, gauge, and construction constraints all interact.

The goal is to make those decisions explicit, reproducible, and inspectable before building a user interface around them.

## Current capabilities

- Calculates stitch counts and finished measurements for a classic top-down raglan construction.
- Verifies known compound raglan constructions with joint, body-only, and sleeve-only increase events.
- Groups a labelled size input, its body measurements, ease, gauge, and construction constraints.
- Builds garment targets from body measurements and ease.
- Searches for a compatible number of joint raglan increase events and underarm cast-on stitches.
- Reports signed centimetre deviations between the proposal and each target measurement.
- Returns `null` when the defined construction constraints cannot meet the target.
- Saves every sizing attempt and attaches structured tester feedback to the same Supabase row.
- Uses Node's built-in test runner and no external runtime dependencies.

## Domain model

A joint classic raglan increase event adds eight stitches:

```text
4 body stitches + 2 stitches per sleeve
```

At sleeve separation, the same underarm cast-on value (`U`) contributes to both garment sections:

```text
body: 2 × U
each sleeve: U
```

The solver returns integer stitch counts together with their centimetre equivalents, so the deviation from the intended finished measurements remains visible.

## Requirements

- Node.js 22 or later

## Quick start

Clone the repository, then start the local web interface:

```bash
npm start
```

Open `http://localhost:3000`. No dependency installation is currently required. The calculator works without environment variables; saving feedback requires the database configuration described below.

Run the test suite with:

```bash
npm test
```

## Run a sizing proposal

`npm run cli` reads one JSON object from standard input and prints the proposal as JSON. Save an input file such as `case.json`:

```json
{
  "body": {
    "bustOrChestCircumferenceCm": 70,
    "bicepCircumferenceCm": 26,
    "armholeDepthCm": 15
  },
  "ease": {
    "bustOrChestCm": 6,
    "bicepCm": 2,
    "armholeDepthCm": 1
  },
  "toleranceCm": 0.1,
  "sizeLabel": "M",
  "construction": {
    "gauge": { "stitchesPer10Cm": 20, "rowsPer10Cm": 25 },
    "castOnStitches": 80,
    "initialSleeveStitches": 10,
    "increaseEveryRounds": 2,
    "underarmRange": { "minimum": 0, "maximum": 10 }
  }
}
```

Then run:

```bash
npm run cli < case.json
```

The CLI emits a sizing attempt: its input, computed target, proposal, and signed measurement deviations. Positive deviations are larger or longer than the target; negative deviations are smaller or shorter. The proposal and deviations are `null` when no valid construction is found within the selected tolerance and underarm range. Invalid inputs exit with an error.

`npm run demo` remains available as a small executable example with hard-coded values.

## Project structure

```text
src/raglan.ts       classic raglan calculations and proposal search
src/sizing.ts       size-input and sizing-attempt model
src/feedback.ts     feedback validation and database persistence
src/server.ts       web server and API endpoints
src/cli.ts          JSON command-line interface
public/             browser interface and tester feedback form
supabase/           database schema
src/*.test.ts       calculation-core tests
src/demo.ts         hard-coded executable example
docs/               domain research and specifications
CONTEXT.md          project glossary
```

The books, spreadsheets, and patterns used for domain research are intentionally local under `data/` and excluded from Git for privacy and copyright reasons.

## Deployment and feedback storage

The current deployment target is a Render web service backed by Supabase Postgres. The browser talks only to this application's server; the Supabase secret key must never be included in browser code or committed to Git.

1. Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) in its SQL editor.
2. Copy `.env.example` to `.env` for local development and replace its placeholder values. `.env` is ignored by Git.
3. In Render, create a Blueprint from this repository. [`render.yaml`](render.yaml) defines the web service and prompts for the two Supabase environment variables.
4. Open the deployed URL, calculate a proposal, and save one test response. Its row should appear in the `sizing_feedback` table in Supabase.

Each saved row records the algorithm version, original sizing input, server-computed target and proposal, deviations, and tester feedback. The server recomputes the attempt before saving it instead of trusting calculated output from the browser.

Existing deployments created before attempts were saved automatically must run [`supabase/migrations/001-save-attempts-before-feedback.sql`](supabase/migrations/001-save-attempts-before-feedback.sql) once in the Supabase SQL editor. This allows an attempt to exist before optional feedback is submitted.

## Roadmap

1. Deploy the private tester build and collect structured feedback.
2. Validate the core against Sofi's sizing guide and further real raglan constructions.
3. Model a complete designer-facing size definition.
4. Add body-only and sleeve-only increase phases when pattern evidence supports them.

## Documentation

- [Sizing and grading research](docs/research/2026-09-18-knitwear-sizing-and-grading-sources.md)
- [Web evidence for hand-knit grading](docs/research/2026-09-18-web-evidence-hand-knitwear-grading-raglan.md)
- [Top-down raglan solver specification](docs/specs/raglan-top-down-solver.md)

## Contributing

Contributions and domain feedback are welcome once the project has a public contribution guide. For now, please open an issue describing the construction, measurements, gauge, and expected behaviour you want to discuss.

## License

No license has been selected yet. Until one is added, the repository code is not offered for reuse.
