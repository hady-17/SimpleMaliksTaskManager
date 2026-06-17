// Vercel serverless function — keeps the OpenAI API key server-side only.
// The browser calls POST /api/smart-plan with the day's tasks; this function
// talks to OpenAI and returns a time-blocked plan + energy-saving tips.
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-5.4-mini';

const SYSTEM_PROMPT = `You are a productivity coach who builds realistic daily plans.
Given a list of tasks (each with a title, priority, optional description, and whether it's already done), produce:
1. A time-blocked plan that orders the *pending* tasks sensibly — harder/high-priority work earlier when energy is highest, lighter tasks later — with short breaks worked in. Skip tasks already marked done.
2. 3-5 short, practical tips for saving energy and working smart specifically for this set of tasks (not generic filler).

Respond with ONLY valid JSON, no markdown fences, in this exact shape:
{"plan":[{"time":"9:00 AM","task":"...","note":"..."}],"tips":["...","..."]}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'OPENAI_API_KEY is not configured on the server.',
    });
  }

  const { tasks } = req.body ?? {};
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({ error: 'No tasks provided.' });
  }

  const taskSummary = tasks.map((t) => ({
    title: t.title,
    priority: t.priority,
    description: t.description || undefined,
    done: !!t.done,
  }));

  try {
    const upstream = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.6,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: JSON.stringify(taskSummary) },
        ],
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '');
      return res.status(502).json({
        error: `OpenAI request failed (${upstream.status}).`,
        detail: detail.slice(0, 500),
      });
    }

    const data = await upstream.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      return res.status(502).json({ error: 'OpenAI returned an empty response.' });
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Model didn't return clean JSON — surface the raw text so the UI can
      // still show something instead of failing outright.
      return res.status(200).json({ plan: [], tips: [], raw: content });
    }

    return res.status(200).json({
      plan: Array.isArray(parsed.plan) ? parsed.plan : [],
      tips: Array.isArray(parsed.tips) ? parsed.tips : [],
    });
  } catch (err) {
    return res.status(502).json({ error: `Could not reach OpenAI: ${err.message}` });
  }
}
