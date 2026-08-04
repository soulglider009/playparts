# Playparts

**The hard parts, already solved.**

Playparts is an open-source experiment in useful AI game-making skills. Each skill should capture a solved-but-difficult web-game component and prove that it improves reliability, cost, or taste compared with asking a capable coding agent to solve the same problem without the skill.

The first experiment is [`good-water`](skills/good-water): a live one-shot-versus-skilled comparison featuring a controllable boat.

## Principles

- One skill adds one recognizable capability.
- Every result is instantly playable in the browser.
- “Verified” means measurable lift over the no-skill baseline, not merely that the output built once.
- Skills should adapt to existing games instead of imposing a shared engine.
- A skill may package instructions, references, scripts, templates, or component patterns—whatever compresses the hard-won work responsibly.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Repository shape

```text
app/                    comparison website
skills/<name>/          portable Agent Skills
  SKILL.md
  README.md
  references/
  evals/
```

## Current status

Prototype. `good-water` has a reference implementation and an evaluation contract, but it does not claim a formal cross-model “Verified Useful” result yet.

## License

MIT
