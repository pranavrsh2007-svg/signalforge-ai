import type { IncomingMessage, ServerResponse } from 'http';

const MODEL_NAME = 'gemini-2.5-flash';
const TIMEOUT_MS = 15000;

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || '';

  if (req.method === 'GET') {
    const isConfigured = Boolean(apiKey && apiKey.trim().length > 5);
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        configured: isConfigured,
        provider: 'Google Gemini',
        model: MODEL_NAME,
        message: isConfigured
          ? 'Server Gemini API key configured and active on Vercel deployment.'
          : 'GEMINI_API_KEY is not set in server environment. Transparent deterministic fallback enabled.',
      })
    );
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  // Parse body safely
  let payload = req.body;
  if (!payload || typeof payload !== 'object') {
    try {
      if (typeof payload === 'string') {
        payload = JSON.parse(payload);
      } else {
        const buffers: Buffer[] = [];
        for await (const chunk of req) {
          buffers.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
        }
        const rawBody = Buffer.concat(buffers).toString('utf-8');
        payload = JSON.parse(rawBody);
      }
    } catch {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      return;
    }
  }

  // Check if Gemini is configured
  if (!apiKey || apiKey.trim().length < 5) {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        fallback: true,
        configured: false,
        message: 'GEMINI_API_KEY is not configured in Vercel environment variables. Using deterministic fallback.',
      })
    );
    return;
  }

  const findingId = payload.findingId || 'UNKNOWN';
  const evidenceList = Array.isArray(payload.evidence)
    ? payload.evidence.map((e: any) => `- ${e.key}: ${e.value} (${e.explanation})`).join('\n')
    : 'None provided';

  const systemPrompt = `You are SignalForge AI, an expert business intelligence advisor.
Explain the following statistically verified anomaly finding strictly based on the provided metrics and evidence.
DO NOT fabricate metrics, pretend external databases were modified, or make up numbers outside of the provided evidence.
You MUST output valid JSON matching this exact structure:
{
  "findingId": "${findingId}",
  "summary": "Concise 1-2 sentence executive summary of what happened.",
  "whyItMatters": "Clear explanation of business impact (revenue risk, customer friction, margin leakage, etc.).",
  "underlyingDrivers": ["Driver 1", "Driver 2"],
  "uncertaintyNotes": "Honest assessment of sample size and variables not captured in raw CSV.",
  "recommendedActions": [
    {
      "actionId": "ACT-1",
      "title": "Action title",
      "description": "Specific operational action proposal.",
      "expectedImpact": "Realistic direction of impact.",
      "actionType": "restock",
      "targetEntity": "Name of SKU, Category, or Metric"
    }
  ]
}`;

  const userPrompt = `Finding Title: ${payload.title}
Metric: ${payload.metric}
Observed Value: ${payload.observedValue}
Baseline Value: ${payload.baselineValue}
Delta: ${payload.delta}
Time Window: ${payload.timeWindow}
Description: ${payload.description}

Deterministic Evidence:
${evidenceList}

Provide your grounded analysis and 2 realistic recommended actions as JSON.`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!geminiResponse.ok) {
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          fallback: true,
          configured: true,
          message: `Gemini API returned status ${geminiResponse.status}. Reverting to deterministic fallback.`,
        })
      );
      return;
    }

    const geminiData = await geminiResponse.json();
    const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          fallback: true,
          configured: true,
          message: 'Empty response candidate from Gemini model. Using deterministic fallback.',
        })
      );
      return;
    }

    const parsedJson = JSON.parse(candidateText);
    res.statusCode = 200;
    res.end(JSON.stringify({ success: true, data: parsedJson }));
  } catch (err: any) {
    const isTimeout = err.name === 'AbortError' || err.name === 'TimeoutError';
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        fallback: true,
        configured: true,
        message: isTimeout
          ? 'Gemini request timed out after 15s. Engaged deterministic fallback.'
          : `Model request failed: ${err.message}`,
      })
    );
  }
}
