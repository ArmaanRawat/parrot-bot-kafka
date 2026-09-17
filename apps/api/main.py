from uuid import uuid4

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel ,Field, field_validator
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import complete_meeting, get_meeting, init_db, save_meeting, get_meetings
from summarizer import create_fake_summary


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="Parrot Bot API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class MeetingCreate(BaseModel):
    title: str = Field(min_length=1)
    transcript: str = Field(min_length=1)

    @field_validator("title", "transcript")
    @classmethod
    def not_empty(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Field cannot be empty")
        return value

class ActionItem(BaseModel):
    task: str
    owner: str | None = None
    due: str | None = None


class SummaryRead(BaseModel):
    summary: str
    decisions: list[str]
    action_items: list[ActionItem]
    open_questions: list[str]

class MeetingRead(BaseModel):
    id: str
    title: str
    transcript: str
    status: str
    summary: SummaryRead | None
    error_message: str | None
    created_at: str
    updated_at: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/meetings", response_model=list[MeetingRead])
def list_meetings():
    return get_meetings()

@app.get("/meetings/{meeting_id}", response_model=MeetingRead)
def get_meeting_with_id(meeting_id: str):
    meeting = get_meeting(meeting_id)
    if meeting is None:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting




@app.post("/meetings")
def create_meeting(meeting: MeetingCreate):
    meeting_id = str(uuid4())
    save_meeting(
        meeting_id=meeting_id,
        title=meeting.title,
        transcript=meeting.transcript,
    )

    summary = create_fake_summary(meeting.title, meeting.transcript)

    was_completed = complete_meeting(meeting_id, summary)
    if not was_completed:
        raise HTTPException(status_code=500, detail="Meeting could not be completed")
    
    return {
        "meeting_id": meeting_id,
        "status": "completed",
    }
