import { useState } from 'react'

type MeetingResponse = {
    meeting_id: string
    status: string
}

type ActionItem = {
  task: string
  owner: string | null
  due: string | null
}

type MeetingSummary = {
  summary: string
  decisions: string[]
  action_items: ActionItem[]
  open_questions: string[]
}

type Meeting = {
  id: string
  title: string
  transcript: string
  status: string
  summary: MeetingSummary | null
  error_message: string | null
  created_at: string
  updated_at: string
}

function App() {
  const [meetingTitle, setMeetingTitle] = useState('')
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState('') 
  const [meeting, setMeeting] = useState<Meeting | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // alert('Phase 1: UI only. No backend connection yet.')
    if (!meetingTitle.trim() || !transcript.trim()) {
      setError('Please fill in both the meeting title and transcript.')
      return
    }
    setError('') // Clear any previous error messages
    setMeeting(null)

    // Simulate an API call to the backend
    try {
      const response = await fetch('http://127.0.0.1:8000/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: meetingTitle, transcript }),
      })

      if (!response.ok) {
        throw new Error('Meeting submission failed')
      }
      const data: MeetingResponse = await response.json()
      // console.log('Meeting submitted successfully, here is the API response: ', data)
      setMeetingTitle('') 
      setTranscript('') 

      const meetingResponse = await fetch(`http://127.0.0.1:8000/meetings/${data.meeting_id}`)
      
      if(!meetingResponse.ok) {
        throw new Error('Failed to fetch meeting details')
      }
      const completedMeeting: Meeting = await meetingResponse.json()
      setMeeting(completedMeeting)

      console.log('Meeting details fetched successfully, here is the API response: ', completedMeeting)


    } catch (error) {
      console.error('Error submitting meeting:', error)
      setError('Failed to submit the meeting. Please try again.')
    }
    
  }

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-4xl flex-col justify-center">
        <div className="mb-8">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-emerald-700">
            Parrot Bot
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
            Turn messy meeting notes into something useful.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Paste a transcript, give it a title, and prepare it for the
            summarizer pipeline we will build phase by phase.
          </p>
        </div>

        <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-7" onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div>
              <label
                htmlFor="meeting-title"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Meeting title
              </label>
              <input
                type="text"
                name="meeting-title"
                id="meeting-title"
                placeholder="Sprint planning, customer call, design review..."
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
              />
            </div>

            <div>
              <div className="mb-2 flex items-end justify-between gap-4">
                <label
                  htmlFor="transcript"
                  className="block text-sm font-medium text-slate-800"
                >
                  Transcript
                </label>
                <span className="text-xs text-slate-500">Paste raw notes</span>
              </div>
              <textarea
                name="transcript"
                id="transcript"
                placeholder="Paste the meeting transcript here..."
                className="min-h-72 w-full resize-y rounded-md border border-slate-300 bg-white px-4 py-3 text-base leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
              ></textarea>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                Prepare transcript
              </button>
            </div>
          </div>
        </form>
       {meeting && (
  <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <header className="flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm font-medium text-emerald-700">
          {meeting.status}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">
          {meeting.title}
        </h2>
      </div>

      <p className="break-all text-xs text-slate-500">
        ID: {meeting.id}
      </p>
    </header>

    {meeting.summary ? (
      <div className="grid gap-6 pt-6">
        <section>
          <h3 className="text-sm font-semibold text-slate-950">Summary</h3>
          <p className="mt-2 leading-7 text-slate-700">
            {meeting.summary.summary}
          </p>
        </section>

        <section className="border-t border-slate-100 pt-5">
          <h3 className="text-sm font-semibold text-slate-950">Decisions</h3>
          {meeting.summary.decisions.length > 0 ? (
            <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700">
              {meeting.summary.decisions.map((decision, index) => (
                <li key={`${decision}-${index}`}>{decision}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No decisions found.</p>
          )}
        </section>

        <section className="border-t border-slate-100 pt-5">
          <h3 className="text-sm font-semibold text-slate-950">Action items</h3>
          {meeting.summary.action_items.length > 0 ? (
            <ul className="mt-2 space-y-3">
              {meeting.summary.action_items.map((item, index) => (
                <li key={`${item.task}-${index}`} className="text-slate-700">
                  {item.task}
                  {item.owner && ` — ${item.owner}`}
                  {item.due && ` — Due ${item.due}`}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No action items found.</p>
          )}
        </section>

        <section className="border-t border-slate-100 pt-5">
          <h3 className="text-sm font-semibold text-slate-950">
            Open questions
          </h3>
          {meeting.summary.open_questions.length > 0 ? (
            <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700">
              {meeting.summary.open_questions.map((question, index) => (
                <li key={`${question}-${index}`}>{question}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500">
              No open questions found.
            </p>
          )}
        </section>
      </div>
    ) : (
      <p className="pt-6 text-slate-500">Summary unavailable.</p>
    )}
  </section>
)}
      </section>
    </main>
  )
}

export default App
