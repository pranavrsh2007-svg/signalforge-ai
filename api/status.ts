import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || '';
  const isConfigured = Boolean(apiKey && apiKey.trim().length > 5);

  res.statusCode = 200;
  res.end(
    JSON.stringify({
      configured: isConfigured,
      provider: 'Google Gemini',
      model: 'gemini-2.5-flash',
      message: isConfigured
        ? 'Server Gemini API key configured and active on Vercel deployment.'
        : 'GEMINI_API_KEY is not set in server environment. Transparent deterministic fallback enabled.',
    })
  );
}
