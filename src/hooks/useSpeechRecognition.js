import { useEffect, useRef, useState } from 'react';

// Wraps the browser Web Speech API (SpeechRecognition) for single-utterance
// dictation: it captures one phrase, then stops automatically when you stop
// talking. Live interim results are exposed for feedback, and the
// highest-confidence alternative is kept.
// Returns { supported, listening, interim, start, stop }. `onResult` fires once
// per finalized phrase with the recognized text. No backend or dependencies.
export function useSpeechRecognition({ onResult, lang = 'en-US' } = {}) {
  const SpeechRecognition =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);
  const supported = Boolean(SpeechRecognition);

  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const recognitionRef = useRef(null);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  useEffect(() => {
    if (!supported) return;

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    // Non-continuous: the engine finalizes and ends once you stop speaking.
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    recognition.onresult = (event) => {
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        // Pick the highest-confidence alternative, not just the first.
        let best = result[0];
        for (let j = 1; j < result.length; j++) {
          if (result[j].confidence > best.confidence) best = result[j];
        }
        if (result.isFinal) {
          const text = best.transcript.trim();
          if (text) onResultRef.current?.(text);
        } else {
          interimText += best.transcript;
        }
      }
      setInterim(interimText.trim());
    };

    // The session ends on its own once you stop talking — just reset state.
    recognition.onend = () => {
      setListening(false);
      setInterim('');
    };

    recognition.onerror = () => {
      setListening(false);
      setInterim('');
    };

    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, [supported, SpeechRecognition, lang]);

  function start() {
    if (!recognitionRef.current || listening) return;
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }

  function stop() {
    recognitionRef.current?.stop();
    setListening(false);
    setInterim('');
  }

  return { supported, listening, interim, start, stop };
}
