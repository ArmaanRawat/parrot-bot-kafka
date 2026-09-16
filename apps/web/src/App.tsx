import { useState } from 'react'

function App() {
  const [meetingTitle, setMeetingTitle] = useState('')
  const [transcript, setTranscript] = useState('')
   const [error, setError] = useState('') 

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // alert('Phase 1: UI only. No backend connection yet.')
    if (!meetingTitle.trim() || !transcript.trim()) {
      setError('Please fill in both the meeting title and transcript.')
      return
    }
    setError('') // Clear any previous error messages
    console.log('Meeting title:', meetingTitle)
    console.log('Transcript:', transcript)
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
              <p className="text-sm text-slate-500">
                {error && <span className="text-red-500">{error} <br /></span>}
                Phase 1: UI only. No backend connection yet.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                Prepare transcript
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  )
}

export default App
