import { describe, it, expect, vi, afterEach } from 'vitest';
import { translateToEnglish } from '../utils/translateToEnglish';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('translateToEnglish', () => {
  it('returns Latin/English text unchanged without calling the API', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const result = await translateToEnglish('Buy groceries');
    expect(result).toBe('Buy groceries');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('returns an empty string for blank input', async () => {
    expect(await translateToEnglish('   ')).toBe('');
  });

  it('translates Arabic text via the API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ responseData: { translatedText: 'Go home' } }),
    });
    const result = await translateToEnglish('روح عالبيت');
    expect(result).toBe('Go home');
  });

  it('falls back to the original text when the API fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false });
    const arabic = 'مهمة';
    expect(await translateToEnglish(arabic)).toBe(arabic);
  });

  it('falls back to the original text when fetch throws', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    const arabic = 'مهمة';
    expect(await translateToEnglish(arabic)).toBe(arabic);
  });
});
