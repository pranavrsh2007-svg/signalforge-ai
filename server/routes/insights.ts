import type { IncomingMessage, ServerResponse } from 'http';
import dotenv from 'dotenv';
import { validateAIExplanation } from '../../src/lib/ai/schema';

// Load server-side .env
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const TIMEOUT_MS = parseInt(process.env.AI_REQUEST_TIMEOUT_MS || '15000', 10);
const MODEL_NAME = 'gemini-2.5-flash';

export function getProviderStatus() {
  const isConfigured = Boolean(GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 5);
  return {
    configured: isConfigured,
    provider: 'Google Gemini',
    model: MODEL_NAME,
    message: isConfigured
      ? 'Server Gemini API key configured and active.'
      : 'GEMINI_API_KEY is not set in server environment. Transparent deterministic fallback enabled.',
  };
}

export async function handleInsightsRequest(req: IncomingMessage, res: ServerResponse) {
  // CORS / Content-Type headers
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify(getProviderStatus()));
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  // Read request body with bounded size (max 50KB to prevent abuse)
  let body = '';
  const MAX_PAYLOAD_BYTES = 50 * 1024;

  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > MAX_PAYLOAD_BYTES) {
      res.statusCode = 413;
      res.end(JSON.stringify({ error: 'Payload Too Large' }));
      req.destroy();
    }
  });

  req.on('end', async () => {
    try {
      let parsedPayload: any;
      try {
        parsedPayload = JSON.parse(body);
      } catch {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        return;
      }

      const findingId = parsedPayload.findingId || 'UNKNOWN';

      // Check if server has Gemini configured
      if (!GEMINI_API_KEY || GEMINI_API_KEY.trim().length < 5) {
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            fallback: true,
            configured: false,
            message: 'GEMINI_API_KEY is not set in server environment. Using deterministic fallback.',
          })
        );
        return;
      }

      // Build structured prompt grounded in deterministic evidence only
      const evidenceList = Array.isArray(parsedPayload.evidence)
        ? parsedPayload.evidence.map((e: any) => `- ${e.key}: ${e.value} (${e.explanation})`).join('\n')
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
      "actionType": "restock" | "price_adjust" | "promotion" | "investigation",
      "targetEntity": "Name of SKU, Category, or Metric"
    }
  ]
}`;

      const userPrompt = `Finding Title: ${parsedPayload.title}
Metric: ${parsedPayload.metric}
Observed Value: ${parsedPayload.observedValue}
Baseline Value: ${parsedPayload.baselineValue}
Delta: ${parsedPayload.delta}
Time Window: ${parsedPayload.timeWindow}
Description: ${parsedPayload.description}

Deterministic Evidence:
${evidenceList}

Provide your grounded analysis and 2 realistic recommended actions as JSON.`;

      // Call Gemini 2.5 Flash with AbortController timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

      const geminiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        const errorText = await geminiResponse.text();
        console.error('Gemini API Error:', geminiResponse.status, errorText);
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
      const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            fallback: true,
            configured: true,
            message: 'No response content returned from Gemini model. Using fallback.',
          })
        );
        return;
      }

      let parsedJson: any;
      try {
        parsedJson = JSON.parse(rawText);
      } catch (jsonErr) {
        console.error('Failed to parse Gemini JSON output:', rawText);
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            fallback: true,
            configured: true,
            message: 'Gemini output was not valid JSON. Using deterministic fallback.',
          })
        );
        return;
      }

      const validated = validateAIExplanation(parsedJson, findingId);
      if (!validated) {
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            fallback: true,
            configured: true,
            message: 'Gemini response did not satisfy safety schema requirements. Using fallback.',
          })
        );
        return;
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true, data: validated }));
    } catch (err: any) {
      console.error('Error handling AI insights request:', err);
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          fallback: true,
          configured: Boolean(GEMINI_API_KEY),
          message: err.name === 'AbortError' ? 'AI request timed out after 15s. Using fallback.' : err.message,
        })
      );
    }
  });
}
