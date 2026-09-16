from uuid import uuid4

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Parrot Bot API", version="0.1.0")


class MeetingCreate(BaseModel):
    title: str
    transcript: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/meetings")
def create_meeting(meeting: MeetingCreate):
    return {
        "meeting_id": str(uuid4()),
        "status": "submitted",
    }
