import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportSmartPlanToDocx } from '../utils/exportSmartPlanToDocx';

describe('exportSmartPlanToDocx', () => {
  let createObjectURLSpy;
  let revokeObjectURLSpy;
  let clickSpy;
  let capturedAnchor;

  beforeEach(() => {
    capturedAnchor = null;
    createObjectURLSpy = vi.fn(() => 'blob:mock-url');
    revokeObjectURLSpy = vi.fn();
    globalThis.URL.createObjectURL = createObjectURLSpy;
    globalThis.URL.revokeObjectURL = revokeObjectURLSpy;

    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () {
      capturedAnchor = { download: this.download, href: this.href };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('builds a Blob and downloads it under a date-based filename', async () => {
    const data = {
      plan: [{ time: '9:00 AM', task: 'Write report', note: 'Do it while fresh' }],
      tips: ['Take a 5-minute break every hour'],
    };

    await exportSmartPlanToDocx(data, '2026-06-17');

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    expect(createObjectURLSpy.mock.calls[0][0]).toBeInstanceOf(Blob);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(capturedAnchor.download).toBe('smart-plan-2026-06-17.docx');
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
  });

  it('falls back to plain paragraphs when only raw text is available', async () => {
    const data = { raw: 'line one\nline two' };

    await expect(exportSmartPlanToDocx(data, '2026-06-17')).resolves.toBeUndefined();
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('still produces a downloadable file when plan and tips are both empty', async () => {
    await expect(exportSmartPlanToDocx({ plan: [], tips: [] }, '2026-06-17')).resolves.toBeUndefined();
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});
