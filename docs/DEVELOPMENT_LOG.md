# Development Log

Use this file as the project diary. Keep entries short. The habit is what matters.

## Entry Template

```md
## YYYY-MM-DD - Short title

### Goal

What are we trying to make work?

### Changed

- What files or behavior changed?

### Verified

- What command or manual check proved it worked?

### Learned

- What concept became clearer?

### Next

- What is the next smallest useful step?
```

## 2026-09-16 - Planning before building

### Goal

Create a simple project map before writing more feature code.

### Changed

- Added root project README.
- Added phased project plan.
- Added development log template.

### Verified

- Docs were added to the repo.

### Learned

- Good projects are easier to build when each phase has a clear goal, output, and verification step.

### Next

- Start Phase 1 by replacing the starter frontend screen with a transcript submission form.

## 2026-09-16 - Frontend transcript form

### Goal

Create the first usable frontend slice: a meeting title field, transcript field, submit button, and basic empty-field validation.

### Changed

- Added Tailwind CSS to the React app.
- Replaced the starter Vite screen with a Parrot Bot form UI.
- Added React state for meeting title, transcript, and validation error.
- Added a submit handler that prevents page reload and logs the form values.

### Verified

- `bun run lint`
- `bun run build`
- Manual check: empty submit shows validation; filled submit logs the form values.

### Learned

- Controlled inputs keep React state as the source of truth.
- `React.FormEvent<HTMLFormElement>` tells TypeScript the submit event came from a form.
- `className` is used for Tailwind styling; `id` is used when an element needs a unique reference.

### Next

- Start Phase 2 by creating a FastAPI backend with a `POST /meetings` endpoint.
