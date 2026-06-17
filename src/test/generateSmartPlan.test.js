import { describe, it, expect, vi, afterEach } from 'vitest';
import { generateSmartPlan } from '../utils/generateSmartPlan';

afterEach(() => {
  vi.restoreAllMocks();
});

const sampleTasks = [{ title: 'Write report', priority: 'High', done: false }];

describe('generateSmartPlan', () => {
  it('POSTs the tasks to /api/smart-plan', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ plan: [], tips: [] }),
    });

    await generateSmartPlan(sampleTasks);

    expect(fetchSpy).toHaveBeenCalledWith('/api/smart-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks: sampleTasks }),
    });
  });

  it('returns the plan, tips, and raw fields from a successful response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        plan: [{ time: '9:00 AM', task: 'Write report', note: 'Tackle it while fresh' }],
        tips: ['Take a 5-minute break every hour'],
      }),
    });

    const result = await generateSmartPlan(sampleTasks);

    expect(result).toEqual({
      plan: [{ time: '9:00 AM', task: 'Write report', note: 'Tackle it while fresh' }],
      tips: ['Take a 5-minute break every hour'],
      raw: null,
    });
  });

  it('defaults plan/tips to empty arrays and raw to null when absent from the response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    expect(await generateSmartPlan(sampleTasks)).toEqual({ plan: [], tips: [], raw: null });
  });

  it('throws with the server-provided error message on a failed response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: 'No tasks provided.' }),
    });

    await expect(generateSmartPlan([])).rejects.toThrow('No tasks provided.');
  });

  it('falls back to a generic message when a failed response has no error field', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(generateSmartPlan(sampleTasks)).rejects.toThrow('Request failed (500).');
  });

  it('falls back to a generic message when the response body is not valid JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => {
        throw new SyntaxError('Unexpected token');
      },
    });

    await expect(generateSmartPlan(sampleTasks)).rejects.toThrow('Request failed (502).');
  });
});
