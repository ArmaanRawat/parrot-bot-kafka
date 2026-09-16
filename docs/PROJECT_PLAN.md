# Parrot Bot Project Plan

This plan breaks the project into small phases so we can track progress, learn the system layer by layer, and avoid trying to build everything at once.

## Product Goal

Users can paste a meeting transcript, submit it, wait while it is processed, and read a useful summary with decisions, action items, owners, and open questions.

## Learning Goal

Build the habit of approaching a real project in phases:

1. Understand the user story.
2. Identify the simplest working slice.
3. Build only that slice.
4. Verify it.
5. Document what changed and what was learned.
6. Repeat.

## Architecture Map

```text
React + TypeScript frontend
  -> FastAPI backend
  -> SQLite database
  -> Kafka topic: meeting.submitted
  -> Python worker
  -> summary saved back to database
  -> React polls backend for result
```

For the first phase, we intentionally skip Kafka and AI. A simple working path teaches more than a complex broken one.

## Core Data

### Meeting input

```json
{
  "title": "Sprint planning",
  "transcript": "..."
}
```

### Meeting status

```text
submitted
processing
completed
failed
```

### Summary output

```json
{
  "summary": "The meeting focused on...",
  "decisions": ["Use Kafka for background processing"],
  "action_items": [
    {
      "task": "Set up the React form",
      "owner": "Armaan",
      "due": null
    }
  ],
  "open_questions": ["Should audio upload be part of version two?"]
}
```

## Phase 0 - Project Setup and Planning

### Goal

Make the project understandable before building features.

### Output

- Repo shape exists.
- Frontend app exists.
- Planning docs exist.
- Development log exists.

### Skills practiced

- Reading a repo before coding.
- Writing phases.
- Defining checkpoints.
- Separating product goals from learning goals.

### Done when

- A new person can open the repo and know what we are building.
- The next coding step is obvious.

## Phase 1 - Frontend Form, No Backend

### Goal

Create the first user-facing screen: a form where a user enters a meeting title and transcript.

### Output

- React form with title input.
- Transcript textarea.
- Submit button.
- Submit handler that logs the form data.
- Basic validation for empty fields.

### Skills practiced

- React components.
- `useState`.
- Controlled inputs.
- Form submit events.
- TypeScript event types.

### Done when

- The app runs with `bun run dev`.
- Typing into both fields works.
- Submitting prints `{ title, transcript }` in the browser console.

## Phase 2 - FastAPI Receives Meetings

### Goal

Add the first backend endpoint and connect the frontend to it.

### Output

- FastAPI app in `apps/api`.
- `POST /meetings` route.
- Request body accepts `title` and `transcript`.
- Response returns `meeting_id` and `status`.
- Frontend sends form data to the backend.

### Skills practiced

- HTTP request and response flow.
- JSON.
- API contracts.
- CORS.
- Separating frontend and backend responsibilities.

### Done when

- Submitting the frontend form calls the backend.
- The backend returns a generated meeting ID.
- The frontend displays the submitted status.

## Phase 3 - Save Meetings in SQLite

### Goal

Persist submitted meetings instead of keeping data only in memory.

### Output

- SQLite database.
- `meetings` table.
- Backend saves new meetings with status `submitted`.
- `GET /meetings` returns meeting history.
- `GET /meetings/{meeting_id}` returns one meeting.

### Skills practiced

- Database tables.
- Basic persistence.
- IDs and timestamps.
- Simple read/write queries.

### Done when

- Restarting the backend does not erase submitted meetings.
- Meeting history can be loaded from the frontend or API.

## Phase 4 - Fake Summary Without Kafka

### Goal

Prove the summary shape before adding event-driven processing.

### Output

- Backend creates a fake structured summary.
- Meeting status becomes `completed`.
- Frontend displays summary, decisions, action items, and open questions.

### Skills practiced

- Structured data.
- UI states.
- Mapping API data into React views.
- Keeping the app useful while implementation is still simple.

### Done when

- Submit transcript.
- Get a completed meeting.
- See fake summary data on screen.

## Phase 5 - Kafka Event Pipeline

### Goal

Move summary work out of the request/response path.

### Output

- Kafka runs locally with Docker Compose.
- Backend publishes `meeting.submitted`.
- Worker consumes `meeting.submitted`.
- Worker creates fake summary.
- Worker updates meeting status to `completed`.
- Frontend polls the backend for status.

### Skills practiced

- Kafka topics.
- Producers.
- Consumers.
- Consumer groups.
- Background work.
- Polling from the frontend.

### Done when

- Backend returns quickly after submission.
- Worker handles the summary separately.
- UI shows `processing`, then `completed`.

## Phase 6 - Real AI Summary

### Goal

Replace fake summary logic with a real LLM call while keeping the same app flow.

### Output

- AI summarizer function.
- Environment variable for API key.
- `.env.example`.
- Error handling for failed summaries.
- Structured output still matches the summary shape.

### Skills practiced

- Calling external APIs.
- Keeping secrets out of code.
- Validating structured output.
- Handling slow or failed AI calls.

### Done when

- A real transcript produces a useful structured summary.
- Failures are visible instead of silent.
- The frontend can show completed and failed states.

## Phase 7 - Polish and Product Habits

### Goal

Make the app easier to use and easier to maintain.

### Output

- Meeting history view.
- Better loading and error states.
- Example transcript.
- README setup instructions.
- Basic tests where useful.

### Skills practiced

- Product polish.
- Documentation.
- Manual QA.
- Small refactors.
- Thinking like a maintainer.

### Done when

- A fresh user can follow the README and run the app.
- Common error states are understandable.
- The project feels like a complete MVP.

## Tracking Board

| Phase | Status | Current checkpoint |
| --- | --- | --- |
| Phase 0 - Planning | Done | Planning docs created |
| Phase 1 - Frontend form | Done | Controlled form with validation |
| Phase 2 - FastAPI endpoint | Next | Create `POST /meetings` |
| Phase 3 - SQLite persistence | Not started | Save submitted meetings |
| Phase 4 - Fake summary | Not started | Display structured result |
| Phase 5 - Kafka pipeline | Not started | Publish and consume event |
| Phase 6 - Real AI summary | Not started | Call LLM safely |
| Phase 7 - Polish | Not started | History, docs, errors |

## Working Rhythm

For every coding session:

1. Pick one phase.
2. Pick one checkpoint inside that phase.
3. Write or change the smallest useful code.
4. Run the app or a command to verify it.
5. Update `docs/DEVELOPMENT_LOG.md`.

This is the habit we are training.

## Next Step

Start Phase 1 by replacing the starter Vite screen with a controlled React form for `title` and `transcript`.
