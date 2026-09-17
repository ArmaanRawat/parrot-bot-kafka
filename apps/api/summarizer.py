
def create_fake_summary(title: str, transcript: str) -> dict:
    # This is a placeholder for the actual summarization logic.
    # In a real implementation, you would call your summarization model here.
    cleaned_transcript = " ".join(transcript.split())
    preview = cleaned_transcript[:200]

    if len(cleaned_transcript) > 200:
        preview += "..."

    return {
        "summary": f"{title}: {preview}",
        "decisions": [],
        "action_items": [],
        "open_questions": [],
    }