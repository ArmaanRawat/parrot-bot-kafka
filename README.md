# Parrot Bot

Parrot Bot is a learning project for building an event-driven meeting transcript summarizer.

The goal is not only to finish the app, but to practice how real projects are planned, built, reviewed, debugged, and improved in phases.

## Start Here

- [Project plan](docs/PROJECT_PLAN.md): phases, checkpoints, learning goals, and definitions of done.
- [Development log](docs/DEVELOPMENT_LOG.md): running notes for what was built, learned, and fixed.

## Current Repo Shape

```text
parrot-bot/
  apps/
    web/      React + TypeScript frontend
    api/      FastAPI backend
    worker/   Python worker service
  docs/       Planning and learning notes
```

## Development Style

We build this project in small vertical slices:

1. Make one useful thing work.
2. Verify it locally.
3. Write down what changed and what we learned.
4. Move to the next slice.

That habit matters more than speed.
