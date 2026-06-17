// Sends the day's tasks to the /api/smart-plan serverless function (which
// talks to DeepSeek server-side) and returns a time-blocked plan + tips.
// The DeepSeek key never reaches the browser — see api/smart-plan.js.

export async function generateSmartPlan(tasks) {
  const res = await fetch('/api/smart-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tasks }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status}).`);
  }

  return {
    plan: data?.plan || [],
    tips: data?.tips || [],
    raw: data?.raw || null,
  };
}
