// Grammar correction via GitHub Models (OpenAI-compatible API), using gpt-4o-mini.
//
// The request runs from this backend, so GITHUB_TOKEN stays server-side and is
// never exposed to the browser. GitHub Models is a remote API call — no local
// model or ONNX runtime — which keeps the backend light for the Render free tier.
const OpenAI = require('openai');

const endpoint = 'https://models.github.ai/inference';
const modelName = 'openai/gpt-4o-mini';

// Build the client lazily so a missing GITHUB_TOKEN fails only the grammar
// request — not the whole server at startup.
let client = null;
function getClient() {
  if (!client) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GITHUB_TOKEN is not configured');
    }
    client = new OpenAI({ baseURL: endpoint, apiKey: token });
  }
  return client;
}

const SYSTEM_PROMPT =
  'You are a grammar and spelling correction tool. Correct spelling, grammar, ' +
  'punctuation, and capitalization (including proper nouns, names, and the ' +
  'pronoun "I"). Preserve the original meaning and wording — do not rephrase, ' +
  'add, or remove content. Return ONLY the corrected text, with no explanations, ' +
  'quotes, or extra formatting.';

// Correct the grammar of a piece of text and return the corrected string.
async function correctGrammar(text) {
  const response = await getClient().chat.completions.create({
    model: modelName,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: text },
    ],
    temperature: 0.2,
    top_p: 1.0,
    max_tokens: 1000,
  });

  return response.choices[0].message.content.trim();
}

// Translate text into the given target language (e.g. "Hindi", "Spanish").
async function translate(text, targetLanguage) {
  const response = await getClient().chat.completions.create({
    model: modelName,
    messages: [
      {
        role: 'system',
        content:
          `You are a professional translator. Translate the user's text into ${targetLanguage}. ` +
          'Preserve meaning, tone, and formatting. Return ONLY the translated text, ' +
          'with no explanations, quotes, or extra formatting.',
      },
      { role: 'user', content: text },
    ],
    temperature: 0.2,
    top_p: 1.0,
    max_tokens: 1000,
  });

  return response.choices[0].message.content.trim();
}

module.exports = { correctGrammar, translate };
