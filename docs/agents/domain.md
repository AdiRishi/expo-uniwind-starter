# Domain Docs

This repo uses a single context model.

## Before Exploring

Read these first when a task touches architecture, harness setup, validation, or app behavior:

- `CONTEXT.md` for project language.
- `docs/adr/` for accepted decisions.
- `docs/agents/local-validation.md` before starting or validating the app through Codex.

If a file is missing, proceed silently. Create new context or ADR entries only when a durable term or decision has actually been resolved.

## File Structure

```text
/
├── CONTEXT.md
├── docs/
│   ├── adr/
│   └── agents/
└── src/
```

## Vocabulary Rule

Use the terms from `CONTEXT.md` when naming issues, plans, tests, and validation notes. If a needed concept is not defined yet, either avoid inventing a new term or add the term when the user resolves it.

## ADR Rule

If a proposed change contradicts an ADR, call that out before editing. Do not silently replace an accepted decision.
