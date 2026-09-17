import sqlite3
import json
from pathlib import Path

DATABASE_PATH = Path(__file__).parent / "parrot_bot.db"

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def row_to_meeting(row: sqlite3.Row) -> dict:
    meeting = dict(row)
    summary_json = meeting.pop("summary_json")

    meeting["summary"] = (
        json.loads(summary_json)
        if summary_json
        else None
    )

    return meeting

def init_db() -> None:
    conn = get_connection()
    try:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS meetings (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                transcript TEXT NOT NULL,
                status TEXT NOT NULL,
                summary_json TEXT,
                error_message TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.commit()
    finally:
        conn.close()

def save_meeting(
        meeting_id: str,
        title: str,
        transcript: str,
) -> None:
    conn = get_connection()
    try:
        conn.execute(
            """
            INSERT INTO meetings (id, title, transcript, status)
            VALUES (?, ?, ?, ?)
            """,
            (meeting_id, title, transcript, "submitted"),
        )
        conn.commit()
    finally:
        conn.close()

def get_meeting(meeting_id: str) -> dict | None:
    conn = get_connection()
    try:
        cursor = conn.execute(
            """
            SELECT id, title, transcript, status, summary_json, error_message, created_at, updated_at
            FROM meetings
            WHERE id = ?
            """,
            (meeting_id,),
        )
        row = cursor.fetchone()
        if row is None:
            return None
        return row_to_meeting(row)
    finally:
        conn.close()

def get_meetings() -> list[dict]:
    conn = get_connection()
    try:
        cursor = conn.execute(
            """
            SELECT id, title, transcript, status, summary_json, error_message, created_at, updated_at
            FROM meetings
            ORDER BY created_at DESC
            """
        )
        meetings = [row_to_meeting(row) for row in cursor.fetchall()]
        return meetings
    finally:
        conn.close()


def complete_meeting(meeting_id: str, summary: dict) -> bool:
    conn = get_connection()
    try:
        cursor = conn.execute(
            """
            UPDATE meetings
            SET status = ?, 
            summary_json = ?,
            error_message = NULL,
            updated_at = CURRENT_TIMESTAMP
            
            WHERE id = ?
            """,
            (
                "completed",
                json.dumps(summary),
                meeting_id,
            ),
        )
        conn.commit()
        return cursor.rowcount == 1
    finally:
        conn.close()
        
