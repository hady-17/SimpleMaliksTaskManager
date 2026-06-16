// Translates task text to English using the free MyMemory API (no key, no backend).
// If the text is already plain Latin/English, it's returned unchanged so we don't
// waste a network round-trip. On any failure the original text is returned, so a
// task is never lost just because translation was unavailable.

// Matches Arabic script (and Arabic Supplement / Extended-A ranges).
const NON_LATIN = /[؀-ۿݐ-ݿࢠ-ࣿ]/;

export async function translateToEnglish(text) {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;

  // Nothing to translate if it's already Latin script.
  if (!NON_LATIN.test(trimmed)) return trimmed;

  try {
    const url =
      'https://api.mymemory.translated.net/get?q=' +
      encodeURIComponent(trimmed) +
      '&langpair=ar|en';

    const res = await fetch(url);
    if (!res.ok) return trimmed;

    const data = await res.json();
    const translated = data?.responseData?.translatedText;

    return translated && translated.trim() ? translated.trim() : trimmed;
  } catch {
    return trimmed;
  }
}
