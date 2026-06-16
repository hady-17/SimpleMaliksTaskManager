import { useState } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { translateToEnglish } from '../utils/translateToEnglish';

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState('en-US');

  const { supported, listening, interim, start, stop } = useSpeechRecognition({
    lang,
    onResult: (text) =>
      setTitle((prev) => (prev ? `${prev} ${text}` : text)),
  });

  function toggleLang() {
    if (listening) stop();
    setLang((l) => (l === 'en-US' ? 'ar-LB' : 'en-US'));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const englishTitle = await translateToEnglish(title);
    const englishDescription = description.trim()
      ? await translateToEnglish(description)
      : description;
    onAdd(englishTitle, priority, englishDescription);
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setOpen(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
    >
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={listening ? 'Listening…' : 'Add a new task…'}
            className="w-full px-3 py-2 pr-16 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {supported && (
            <button
              type="button"
              onClick={toggleLang}
              title={`Voice language: ${lang === 'en-US' ? 'English' : 'Arabic (Lebanese)'} — click to switch`}
              aria-label={`Voice language: ${lang === 'en-US' ? 'English' : 'Arabic (Lebanese)'}`}
              className="absolute right-9 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-semibold text-gray-400 hover:text-indigo-500 transition-colors"
            >
              {lang === 'en-US' ? 'EN' : 'AR'}
            </button>
          )}
          {supported && (
            <button
              type="button"
              onClick={listening ? stop : start}
              title={listening ? 'Stop recording' : 'Add task by voice'}
              aria-label={listening ? 'Stop recording' : 'Add task by voice'}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${
                listening
                  ? 'text-red-500 animate-pulse'
                  : 'text-gray-400 hover:text-indigo-500'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a3 3 0 003-3V5a3 3 0 10-6 0v4a3 3 0 003 3z" />
                <path d="M5 9a1 1 0 012 0 3 3 0 006 0 1 1 0 112 0 5 5 0 01-4 4.9V16h2a1 1 0 110 2H7a1 1 0 110-2h2v-2.1A5 5 0 015 9z" />
              </svg>
            </button>
          )}
        </div>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          title={open ? 'Hide description' : 'Add description'}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-gray-400 hover:text-indigo-500 hover:border-indigo-300 transition-colors text-sm whitespace-nowrap"
        >
          <span className="text-xs font-medium">Description</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Add Task
        </button>
      </div>

      {listening && (
        <p className="px-1 text-xs text-gray-400 italic">
          {interim ? `…${interim}` : 'Listening — speak now'}
        </p>
      )}

      {open && (
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)…"
          rows={2}
          autoFocus
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      )}
    </form>
  );
}
